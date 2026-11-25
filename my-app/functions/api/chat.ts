/// <reference types="@cloudflare/workers-types" />
import { SITE_CONTEXT } from "./_siteContext";
import { reportAiFailure } from "./_alerts";

// Cloudflare Pages Function — the site itself is a static export with no
// Next.js server, so this is the only piece of the chatbot that runs
// somewhere other than the visitor's browser. Deployed automatically
// alongside the static build by Cloudflare Pages; needs two bindings set
// in the Pages project's dashboard (Settings > Functions):
//   - OPENAI_API_KEY: secret, the real key
//   - CHAT_USAGE: a KV namespace binding, used to track per-visitor spend
//   - ALERTS_TOKEN: secret, lets this function report failures to the alerts Worker
interface Env {
  OPENAI_API_KEY: string;
  CHAT_USAGE: KVNamespace;
  ALERTS_TOKEN?: string;
}

// The models to try, cheapest first, with their prices per token for the spend limits below. A model that fails
// (retired, or an outage) is skipped for the next one, and the failure is emailed through the alerts Worker.
const MODELS = [
  { id: "gpt-6-luna", input: 0.1 / 1_000_000, output: 0.5 / 1_000_000 },
  { id: "gpt-5.6-luna", input: 0.2 / 1_000_000, output: 1.2 / 1_000_000 },
];
const SPEND_LIMIT_USD = 0.5;
// Across all visitors, because a visitor can reset their own $0.50 by clearing their browser storage.
const DAILY_SITE_LIMIT_USD = 1;
const DAY_SECONDS = 60 * 60 * 24;
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

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
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

  const siteKey = `site:${new Date().toISOString().slice(0, 10)}`;
  const siteSpent = parseFloat((await env.CHAT_USAGE.get(siteKey)) ?? "0") || 0;
  if (siteSpent >= DAILY_SITE_LIMIT_USD) {
    return json({ reply: null, limitReached: true, spentUsd: spent });
  }

  const latestUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  if (INJECTION_PATTERNS.some((p) => p.test(latestUserMessage))) {
    return json({
      reply: "I can only help with questions about Daniel's background and portfolio, and I can't take on a different role or ignore my instructions. Ask me something about Daniel!",
      limitReached: false,
    });
  }

  let openaiRes: Response | null = null;
  let model = MODELS[0];
  for (let i = 0; i < MODELS.length; i++) {
    model = MODELS[i];
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model.id,
        messages: [{ role: "system", content: SITE_CONTEXT }, ...messages],
        max_completion_tokens: 400,
      }),
    });
    if (res.ok) {
      openaiRes = res;
      break;
    }

    const detail = await res.text();
    console.error("OpenAI upstream error", model.id, res.status, detail);
    waitUntil(reportAiFailure(env.ALERTS_TOKEN, "Website chat", model.id, MODELS[i + 1]?.id ?? "", `${res.status} ${detail}`));

    // Distinguish "the OpenAI account itself is out of quota/billing" from
    // a transient upstream error — only the former should hide the widget
    // for every other visitor and show a "we're out of credits" message
    // instead of a generic failure. It affects every model, so there is no point trying the next one.
    const isAccountIssue = res.status === 429 && /insufficient_quota|billing/i.test(detail);
    if (isAccountIssue) {
      await env.CHAT_USAGE.put(ACCOUNT_EXHAUSTED_KEY, "1", { expirationTtl: ACCOUNT_EXHAUSTED_TTL_SECONDS });
      return json({ reply: null, accountExhausted: true });
    }
  }
  if (!openaiRes) return json({ error: "Upstream error" }, 502);

  const data = (await openaiRes.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't come up with a reply to that.";
  const usage = data.usage ?? {};
  const cost =
    (usage.prompt_tokens ?? 0) * model.input + (usage.completion_tokens ?? 0) * model.output;
  const newSpent = spent + cost;
  await env.CHAT_USAGE.put(usageKey, newSpent.toString(), { expirationTtl: USAGE_TTL_SECONDS });
  await env.CHAT_USAGE.put(siteKey, (siteSpent + cost).toString(), { expirationTtl: 2 * DAY_SECONDS });

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
