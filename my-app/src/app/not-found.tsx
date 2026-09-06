"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { textShadow } from "./components/styles";

type FunFact = { text: string };

export default function NotFound() {
  const [fact, setFact] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("https://uselessfacts.jsph.pl/api/v2/facts/random")
      .then((res) => (res.ok ? (res.json() as Promise<FunFact>) : Promise.reject()))
      .then((data) => setFact(data.text))
      .catch(() => setFailed(true));
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        background: "linear-gradient(180deg, #123044 0%, #050D14 100%)",
      }}
    >
      <Typography sx={{ fontSize: { xs: "5rem", md: "7rem" }, fontWeight: 800, color: "#fff", textShadow, lineHeight: 1 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ color: "#fff", textShadow, mt: 2 }}>
        Looks like this page drifted out to sea.
      </Typography>
      <Button href="/" variant="contained" color="secondary" size="large" sx={{ mt: 4 }}>
        Return Home
      </Button>

      <Box sx={{ mt: 5, maxWidth: 480, minHeight: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {!fact && !failed && <CircularProgress size={20} sx={{ color: "rgba(255,255,255,0.5)" }} />}
        {fact && (
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", textShadow, fontStyle: "italic" }}>
            Fun fact while you&apos;re here:
            <br />
            {fact}
          </Typography>
        )}
        {failed && (
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", textShadow }}>
            (Couldn&apos;t fetch a fun fact right now — the page is still missing, though.)
          </Typography>
        )}
      </Box>
    </Box>
  );
}
