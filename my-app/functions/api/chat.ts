/// <reference types="@cloudflare/workers-types" />
import { SITE_CONTEXT } from "./_siteContext";

// Cloudflare Pages Function — the site itself is a static export with no
// Next.js server, so this is the only piece of the chatbot that runs
// somewhere other than the visitor's browser. Deployed automatically
// alongside the static build by Cloudflare Pages; needs two bindings set
// in the Pages project's dashboard (Settings > Functions):
//   - OPENAI_API_KEY: secret, the real key
//   - CHAT_USAGE: a KV namespace binding, used to track per-visitor spend
interface Env {
  OPENAI_API_KEY: string;
  CHAT_USAGE: KVNamespace;
}

// gpt-4o-mini is OpenAI's cheapest general-purpose chat model at the time
// this was written. If a cheaper model ships later, swap it here.
const MODEL = "gpt-4o-mini";
const PRICE_PER_INPUT_TOKEN = 0.15 / 1_000_000;
const PRICE_PER_OUTPUT_TOKEN = 0.6 / 1_000_000;
const SPEND_LIMIT_USD = 0.5;
const USAGE_TTL_SECONDS = 60 * 60 * 24 * 30;
const MAX_HISTORY_MESSAGES = 16;
const MAX_MESSAGE_LENGTH = 2000;

// Groundwork for a "email me when a conversation goes quiet" digest: every
// exchange gets appended to a per-visitor transcript in KV, stamped with
// when it last moved and whether it's already been emailed. A separate
// scheduled job (not built yet — needs an email-sending API key first)
// periodically scans for transcripts idle more than an hour and not yet
// reported, emails a summary, and marks them reported — so a visitor gets
// at most one email per conversation, not one per message.
const LOG_TTL_SECONDS = 60 * 60 * 24 * 7;

// Set when OpenAI itself reports the account is out of quota/credits (not a
// visitor hitting their own $0.50 cap). Cached briefly in KV so every other
// visitor short-circuits without burning another failing OpenAI call, and
// re-checked after the TTL so the site recovers on its own once the account
// is topped up, without needing a redeploy.
const ACCOUNT_EXHAUSTED_KEY = "status:account_exhausted";
const ACCOUNT_EXHAUSTED_TTL_SECONDS = 60 * 10;

// A visitor asking to ignore/override these instructions, reveal them, or
// take on a different role is caught here before spending any tokens on it
// — a hard backstop underneath the system prompt's own refusal, not a
// replacement for it (a determined visitor may still find other phrasings
// the model itself has to catch).
const INJECTION_PATTERNS = [
  /(ignore|disregard|forget)\b.{0,40}\b(instructions|prompt|rules|guidelines|directives)\b/i,
  /reveal\b.{0,20}\b(system prompt|instructions)\b/i,
  /you are now/i,
  /new instructions[:\s]/i,
  /pretend (you are|to be)/i,
  /roleplay as/i,
  /jailbreak/i,
];

type ChatMessage = { role: "user" | "assistant"; content: string };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// A cheap status check the widget calls on page load, before the visitor
// has typed anything — lets a brand-new visitor never see the chat button
// at all while the account is out of credits, instead of opening it and
// hitting a wall.
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const exhausted = await env.CHAT_USAGE.get(ACCOUNT_EXHAUSTED_KEY);
  return json({ accountExhausted: Boolean(exhausted) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { clientId?: string; messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const clientId = typeof body.clientId === "string" ? body.clientId.slice(0, 64) : "";
  if (!clientId) return json({ error: "Missing clientId" }, 400);

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages: ChatMessage[] = incoming
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }));

  if (messages.length === 0) return json({ error: "No messages" }, 400);

  const accountExhausted = await env.CHAT_USAGE.get(ACCOUNT_EXHAUSTED_KEY);
  if (accountExhausted) {
    return json({ reply: null, accountExhausted: true });
  }

  const usageKey = `spend:${clientId}`;
  const spentRaw = await env.CHAT_USAGE.get(usageKey);
  const spent = spentRaw ? parseFloat(spentRaw) : 0;

  if (spent >= SPEND_LIMIT_USD) {
    return json({ reply: null, limitReached: true, spentUsd: spent });
  }

  const latestUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  if (INJECTION_PATTERNS.some((p) => p.test(latestUserMessage))) {
    return json({
      reply: "I can only help with questions about Daniel's background and portfolio, and I can't take on a different role or ignore my instructions. Ask me something about Daniel!",
      limitReached: false,
    });
  }

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: SITE_CONTEXT }, ...messages],
      max_tokens: 400,
    }),
  });

  if (!openaiRes.ok) {
    const detail = await openaiRes.text();
    console.error("OpenAI upstream error", openaiRes.status, detail);

    // Distinguish "the OpenAI account itself is out of quota/billing" from
    // a transient upstream error — only the former should hide the widget
    // for every other visitor and show a "we're out of credits" message
    // instead of a generic failure.
    const isAccountIssue =
      openaiRes.status === 429 && /insufficient_quota|billing/i.test(detail);
    if (isAccountIssue) {
      await env.CHAT_USAGE.put(ACCOUNT_EXHAUSTED_KEY, "1", { expirationTtl: ACCOUNT_EXHAUSTED_TTL_SECONDS });
      return json({ reply: null, accountExhausted: true });
    }

    return json({ error: "Upstream error" }, 502);
  }

  const data = (await openaiRes.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't come up with a reply to that.";
  const usage = data.usage ?? {};
  const cost =
    (usage.prompt_tokens ?? 0) * PRICE_PER_INPUT_TOKEN + (usage.completion_tokens ?? 0) * PRICE_PER_OUTPUT_TOKEN;
  const newSpent = spent + cost;
  await env.CHAT_USAGE.put(usageKey, newSpent.toString(), { expirationTtl: USAGE_TTL_SECONDS });

  await appendToLog(env, clientId, messages[messages.length - 1], { role: "assistant", content: reply });

  return json({ reply, limitReached: newSpent >= SPEND_LIMIT_USD, spentUsd: newSpent });
};

type LogEntry = { role: "user" | "assistant"; content: string; ts: number };
type ConversationLog = { messages: LogEntry[]; lastActivity: number; reported: boolean };

async function appendToLog(env: Env, clientId: string, userMessage: ChatMessage, assistantMessage: ChatMessage) {
  const logKey = `log:${clientId}`;
  const existingRaw = await env.CHAT_USAGE.get(logKey);
  const existing: ConversationLog = existingRaw
    ? (JSON.parse(existingRaw) as ConversationLog)
    : { messages: [], lastActivity: 0, reported: false };

  const now = Date.now();
  existing.messages.push({ ...userMessage, ts: now }, { ...assistantMessage, ts: now });
  existing.lastActivity = now;
  existing.reported = false; // new activity means it needs reporting again once it goes quiet

  await env.CHAT_USAGE.put(logKey, JSON.stringify(existing), { expirationTtl: LOG_TTL_SECONDS });
}
