"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { textShadow } from "../components/styles";

const GAME_URL = "https://splendor-duel.danieldombrovsky9.workers.dev";

export default function SplendorDuelPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 1.5, md: 4 },
        pt: { xs: 10, md: 12 },
        pb: 4,
        background: "linear-gradient(180deg, #123044 0%, #050D14 100%)",
      }}
    >
      <Typography variant="h3" sx={{ color: "#fff", textShadow, fontWeight: 800, textAlign: "center" }}>
        Splendor Duel
      </Typography>
      <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 1.5, maxWidth: 720, textAlign: "center" }}>
        A web version of the two-player board game, with the Counterfeiters expansion. Play on one device, against the
        computer, or online with a friend or a stranger.
      </Typography>
      <Box sx={{ display: "flex", gap: 1.5, mt: 2.5, flexWrap: "wrap", justifyContent: "center" }}>
        <Button href={GAME_URL} target="_blank" rel="noopener noreferrer" variant="contained" color="secondary">
          Open full screen
        </Button>
        <Button href="https://github.com/ddombrov/splendor" target="_blank" rel="noopener noreferrer" variant="outlined" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>
          View on GitHub
        </Button>
      </Box>
      <Box
        sx={{
          mt: 3,
          width: "100%",
          maxWidth: 1500,
          height: { xs: "78vh", md: "calc(100vh - 220px)" },
          minHeight: 520,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <iframe
          src={GAME_URL}
          title="Splendor Duel"
          allow="fullscreen; clipboard-write"
          style={{ width: "100%", height: "100%", border: 0, display: "block" }}
        />
      </Box>
    </Box>
  );
}
