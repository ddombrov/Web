"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SendIcon from "@mui/icons-material/Send";
import { textShadow } from "./styles";

type Message = { role: "user" | "assistant"; content: string };
type Status = "idle" | "sending" | "error" | "limitReached" | "accountExhausted" | "unavailable";

const CLIENT_ID_KEY = "chatClientId";

function getClientId() {
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

// A small "ask about Daniel" chatbot pinned to the bottom-right corner.
// Talks to the /api/chat Cloudflare Pages Function, which holds the real
// OpenAI key and a per-visitor spend cap server-side — this component only
// ever sees the reply text back, never the key or the running cost.
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  // null while the initial availability check is in flight; a brand-new
  // visitor never sees the button at all if it comes back exhausted.
  const [available, setAvailable] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/chat")
      .then((res) => (res.ok ? (res.json() as Promise<{ accountExhausted?: boolean }>) : Promise.resolve({ accountExhausted: false })))
      .then((data) => {
        if (!cancelled) setAvailable(!data.accountExhausted);
      })
      .catch(() => {
        if (!cancelled) setAvailable(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const inputLocked =
    status === "sending" || status === "limitReached" || status === "accountExhausted" || status === "unavailable";

  const handleSend = async () => {
    const text = input.trim();
    if (!text || inputLocked) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setStatus("sending");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: getClientId(), messages: nextMessages }),
      });

      // In plain `next dev` there's no Cloudflare Pages Function behind
      // this route at all, so it 404s (an HTML page, not JSON) — worth a
      // distinct message rather than the generic error, since it's not a
      // real failure, just a local-dev limitation of this static export.
      if (res.status === 404) {
        setStatus("unavailable");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data = (await res.json()) as { reply?: string; limitReached?: boolean; accountExhausted?: boolean };
      const reply = data.reply;
      if (data.accountExhausted) {
        setStatus("accountExhausted");
        return;
      }
      if (data.limitReached) {
        if (reply) setMessages((m) => [...m, { role: "assistant", content: reply }]);
        setStatus("limitReached");
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: reply ?? "" }]);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (available === false) return null;

  return (
    <Box sx={{ position: "fixed", bottom: { xs: 16, md: 24 }, right: { xs: 16, md: 24 }, zIndex: 1300 }}>
      {open && (
        <Paper
          elevation={8}
          sx={{
            width: { xs: "calc(100vw - 32px)", sm: 340 },
            maxWidth: 340,
            height: 440,
            mb: 1.5,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#0B1730",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle1" sx={{ color: "#fff", textShadow, fontWeight: 700 }}>
              Ask about Daniel
            </Typography>
            <IconButton
              onClick={() => setOpen(false)}
              size="small"
              aria-label="Collapse chat"
              sx={{ color: "rgba(255,255,255,0.6)", "&:hover": { color: "#fff" } }}
            >
              <KeyboardArrowDownIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", px: 2, py: 1.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
            {messages.length === 0 && (
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", textShadow }}>
                Ask me anything about Daniel&apos;s experience, skills, or projects.
              </Typography>
            )}
            {messages.map((m, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  bgcolor: m.role === "user" ? "secondary.main" : "rgba(255,255,255,0.08)",
                  color: m.role === "user" ? "#111" : "#EDEFF3",
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                  maxWidth: "85%",
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {m.content}
                </Typography>
              </Box>
            ))}
            {status === "sending" && (
              <Box sx={{ alignSelf: "flex-start", px: 1.5, py: 1 }}>
                <CircularProgress size={16} sx={{ color: "rgba(255,255,255,0.6)" }} />
              </Box>
            )}
            {status === "error" && (
              <Typography variant="body2" sx={{ color: "#E8968C", textShadow }}>
                Something went wrong — please try again in a moment.
              </Typography>
            )}
            {status === "limitReached" && (
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", textShadow }}>
                This chat has reached its usage limit for now — please use the contact form instead.
              </Typography>
            )}
            {status === "accountExhausted" && (
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", textShadow }}>
                This chat is out of credits for now — please use the contact form instead.
              </Typography>
            )}
            {status === "unavailable" && (
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", textShadow }}>
                Chat isn&apos;t available in local dev — it works once the site is deployed.
              </Typography>
            )}
          </Box>

          <Box sx={{ p: 1.5, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: 1 }}>
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              size="small"
              fullWidth
              multiline
              maxRows={3}
              disabled={inputLocked}
              sx={{
                "& .MuiInputBase-root": { color: "#fff" },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim() || inputLocked}
              sx={{ color: "secondary.main" }}
              aria-label="Send message"
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      <IconButton
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        sx={{
          width: 56,
          height: 56,
          bgcolor: "secondary.main",
          color: "#111",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          ml: "auto",
          display: "flex",
          "&:hover": { bgcolor: "secondary.main", opacity: 0.9 },
        }}
      >
        {open ? <CloseIcon /> : <ChatBubbleOutlineIcon />}
      </IconButton>
    </Box>
  );
}
