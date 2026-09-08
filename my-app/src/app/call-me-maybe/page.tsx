"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { textShadow } from "../components/styles";

const TONES: { value: string; label: string }[] = [
  { value: "Flirty", label: "Flirty 🥰" },
  { value: "Funny", label: "Funny 😂" },
  { value: "Mean", label: "Mean 😡" },
  { value: "Serious", label: "Serious 🧐" },
  { value: "Normal", label: "Normal 😐" },
];
const LENGTHS: { value: string; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];
const VOICES: { value: string; label: string }[] = [
  { value: "pqHfZKP75CvOlQylNhV4", label: "Bill" },
  { value: "jsCqWAovK2LkecY7zXl4", label: "Freya" },
  { value: "bIHbv24MWmeRgasZH58o", label: "Will" },
  { value: "ThT5KcBeYPX3keUQqHPh", label: "Dorothy" },
];

type Status = "idle" | "sending" | "success" | "error" | "limitReached" | "unavailable";

const fieldSx = {
  "& .MuiInputBase-root": { color: "#fff" },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.7)" },
};

// A small demo: type a message, and an AI-generated voice actually calls a
// real phone number and delivers it. Talks to the /api/call-me-maybe/*
// Cloudflare Pages Functions, which hold the OpenAI/ElevenLabs/Twilio keys
// and a global daily/weekly call cap server-side.
export default function CallMeMaybePage() {
  const [prompt, setPrompt] = useState("");
  const [purpose, setPurpose] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tone, setTone] = useState("");
  const [lengthOfCall, setLengthOfCall] = useState("");
  const [voice, setVoice] = useState("");
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.75);
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const canSubmit =
    prompt.trim() &&
    purpose.trim() &&
    phoneNumber.replace(/\D/g, "").length >= 10 &&
    tone &&
    lengthOfCall &&
    voice &&
    status !== "sending";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("sending");
    setShowError(false);

    try {
      const res = await fetch("/api/call-me-maybe/start-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tone, phoneNumber, purpose, voice, lengthOfCall, stability, similarity }),
      });

      // Same as the chat widget: plain `next dev` has no Pages Functions
      // behind this route at all, so it 404s as an HTML page rather than
      // JSON — worth its own message instead of the generic error.
      if (res.status === 404) {
        setStatus("unavailable");
        return;
      }
      if (res.status === 429) {
        setStatus("limitReached");
        return;
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setErrorMessage(data.error ?? "Something went wrong placing the call.");
        setStatus("error");
        setShowError(true);
        return;
      }

      setStatus("success");
      setPrompt("");
      setPurpose("");
      setPhoneNumber("");
    } catch {
      setErrorMessage("Something went wrong placing the call.");
      setStatus("error");
      setShowError(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0B1730",
        display: "flex",
        justifyContent: "center",
        px: 2,
        py: { xs: 10, md: 14 },
      }}
    >
      <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ width: "100%", maxWidth: 520 }}>
        <Typography variant="h3" sx={{ color: "#fff", textShadow, fontWeight: 700, mb: 1, textAlign: "center" }}>
          Call Me, Maybe? 📞
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", textShadow, mb: 4, textAlign: "center" }}>
          Try it out and make a call 🚀 — type a message and an AI voice will actually call the number below and say it out loud.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Call subject (ex. Reminder for dad)"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            fullWidth
            size="small"
            sx={fieldSx}
          />

          <TextField
            label="Call details (ex. Tell dad to pick up the milk)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            multiline
            rows={4}
            size="small"
            sx={fieldSx}
          />

          <TextField
            label="Recipient phone number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            size="small"
            sx={fieldSx}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth size="small" sx={fieldSx}>
              <InputLabel>Call length</InputLabel>
              <Select value={lengthOfCall} label="Call length" onChange={(e) => setLengthOfCall(e.target.value)}>
                {LENGTHS.map((l) => (
                  <MenuItem key={l.value} value={l.value}>
                    {l.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={fieldSx}>
              <InputLabel>Tone</InputLabel>
              <Select value={tone} label="Tone" onChange={(e) => setTone(e.target.value)}>
                {TONES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth size="small" sx={fieldSx}>
            <InputLabel>Voice</InputLabel>
            <Select value={voice} label="Voice" onChange={(e) => setVoice(e.target.value)}>
              {VOICES.map((v) => (
                <MenuItem key={v.value} value={v.value}>
                  {v.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer", width: "fit-content" }}
              onClick={() => setOpenAdvanced(!openAdvanced)}
            >
              <Typography sx={{ fontWeight: 600, fontSize: 13, color: "rgba(255,255,255,0.6)", textShadow, mr: 0.5 }}>
                Advanced settings
              </Typography>
              {openAdvanced ? (
                <ExpandLessIcon sx={{ color: "rgba(255,255,255,0.5)" }} fontSize="small" />
              ) : (
                <ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.5)" }} fontSize="small" />
              )}
            </Box>
          </Box>

          {openAdvanced && (
            <>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.7)", textShadow }}>Stability</Typography>
                  <Tooltip
                    title="Adjusts the voice consistency. Lower values produce a more emotive and varied performance while higher values lead to a more stable and consistent voice."
                    placement="top"
                    arrow
                  >
                    <IconButton size="small">
                      <HelpOutlineOutlinedIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Slider
                  value={stability}
                  onChange={(_, v) => setStability(v as number)}
                  step={0.01}
                  min={0}
                  max={1}
                  valueLabelDisplay="auto"
                  sx={{ color: "secondary.main" }}
                />
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.7)", textShadow }}>Similarity</Typography>
                  <Tooltip
                    title="Controls how closely the AI replicates the original voice. Higher values ensure the generated voice closely matches the original. Lower values allow for more flexibility and creativity."
                    placement="top"
                    arrow
                  >
                    <IconButton size="small">
                      <HelpOutlineOutlinedIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Slider
                  value={similarity}
                  onChange={(_, v) => setSimilarity(v as number)}
                  step={0.01}
                  min={0}
                  max={1}
                  valueLabelDisplay="auto"
                  sx={{ color: "secondary.main" }}
                />
              </Box>
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            disabled={!canSubmit}
            sx={{ borderRadius: 2, py: 1.2, fontWeight: 700 }}
          >
            {status === "sending" ? <CircularProgress size={22} sx={{ color: "#111" }} /> : "Make call"}
          </Button>

          {status === "success" && <Alert severity="success">Call placed — the phone should be ringing now.</Alert>}
          {status === "limitReached" && (
            <Alert severity="warning">
              This feature is limited to a small number of calls per day/week, and that limit&apos;s been reached for now — try again later.
            </Alert>
          )}
          {status === "unavailable" && (
            <Alert severity="info">This only works on the deployed site, not in local dev.</Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
}
