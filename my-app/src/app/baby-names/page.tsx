"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { textShadow } from "../components/styles";

const REPO = "https://github.com/ddombrov/BabyNamesFrequencyProject";
const DOWNLOAD = `${REPO}/archive/refs/heads/main.zip`;

const screenshots = [
  { src: "/projects/baby-names/graph.jpg", alt: "Graph comparing how often two names were given over the years" },
  { src: "/projects/baby-names/top10.jpg", alt: "The ten most popular names for a chosen year" },
];

// Streamlit apps can't run on Cloudflare, so this page offers the app as a download with a one-click run script.
export default function BabyNamesPage() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        px: { xs: 2, md: 4 },
        background: "linear-gradient(180deg, #1B2A3A 0%, #0E1620 100%)",
      }}
    >
      <Typography variant="h3" sx={{ color: "#fff", textShadow, fontWeight: 800, textAlign: "center", fontSize: { xs: "2rem", md: "3rem" } }}>
        Baby Names Frequency Tracker
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5, width: "100%", maxWidth: 1200, minHeight: 0 }}>
        {screenshots.map(({ src, alt }, i) => (
          <Box
            key={src}
            sx={{
              display: { xs: i === 0 ? "block" : "none", md: "block" },
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export with unoptimized images; a plain img is simplest */}
            <img src={src} alt={alt} style={{ width: "100%", height: "auto", maxHeight: "52vh", objectFit: "cover", objectPosition: "top", display: "block" }} />
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center" }}>
        <Button href={DOWNLOAD} variant="contained" color="secondary" size="large">
          Download
        </Button>
        <Button href={REPO} target="_blank" rel="noopener noreferrer" variant="outlined" size="large" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>
          View on GitHub
        </Button>
      </Box>
      <Typography variant="body2" sx={{ color: "rgba(237,239,243,0.75)", textAlign: "center" }}>
        Unzip it, then double-click run-windows.bat, or run sh run-mac-linux.sh on a Mac or Linux. Needs Python 3.
      </Typography>
    </Box>
  );
}
