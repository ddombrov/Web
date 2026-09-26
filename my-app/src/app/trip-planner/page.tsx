"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const GITHUB_URL = "https://github.com/ddombrov/MapsProject";

// The running app is hosted separately on Vercel: it needs server-side API
// keys (Google, Gemini, OpenAI), so it can't be part of this static export.
const APP_URL = "https://maps-project-ten.vercel.app/";

const features = [
  {
    title: "Real places, not made-up ones",
    body: "Candidates come from Google Places, and every spot the AI picks is checked against that real pool. Duplicates and fabricated places are swapped for real ones.",
  },
  {
    title: "Map, calendar, or table",
    body: "One trip, three views. Pins are colored by day, road routes show travel time between stops, and a warning appears when a place is closed at the time you scheduled it.",
  },
  {
    title: "Edit by hand or by chat",
    body: "Drag and drop to reorder, tap to move on phones, drop a pin to add a spot, or just tell the assistant to add, remove, or swap places in plain language.",
  },
  {
    title: "Share with a link",
    body: "There is no database. The whole trip is compressed into the URL, so the link you copy always reflects what you are looking at. Export to Google My Maps or a calendar file too.",
  },
];

const steps = [
  "Enter a destination and a trip length of 1 to 7 days, then set food and attraction counts per day, budget, pace, and preferences.",
  "Two Google Places searches (restaurants and attractions) build a pool of real candidates, optionally blended with Reddit opinions and Ticketmaster events.",
  "Gemini writes the day-by-day plan, with OpenAI as a fallback. A repair pass then validates every stop against the real candidate pool.",
  "Optionally cluster each day's stops geographically to cut travel time, then edit, export, or share the result.",
];

const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Google Maps",
  "Google Places",
  "Gemini",
  "OpenAI",
];

export default function TripPlannerPage() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", bgcolor: "#F4F6FA", color: "#111827", pt: { xs: 12, md: 14 }, pb: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" sx={{ fontWeight: 800, fontSize: { xs: 36, md: 52 } }}>
          Itinerary Planner
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 400, color: "rgba(17,24,39,0.75)" }}>
          Enter a destination and a trip length and get a day-by-day plan of food and attractions built from real
          Google Places data, then edit it on a map, calendar, or table and share it with a link.
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 4 }}>
          {APP_URL ? (
            <Button
              variant="contained"
              color="secondary"
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNewIcon />}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Launch app
            </Button>
          ) : (
            <Button variant="contained" disabled sx={{ borderRadius: 2, fontWeight: 700 }}>
              Live demo coming soon
            </Button>
          )}
          <Button
            variant="outlined"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<GitHubIcon />}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            View source
          </Button>
        </Box>

        {APP_URL && (
          <Box
            component="iframe"
            src={APP_URL}
            title="Itinerary Planner"
            loading="lazy"
            sx={{ width: "100%", height: { xs: 520, md: 680 }, mt: 5, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 3, bgcolor: "#fff" }}
          />
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5, mt: 8 }}>
          {features.map((f) => (
            <Box key={f.title} sx={{ p: 3, bgcolor: "#fff", borderRadius: 3, border: "1px solid rgba(0,0,0,0.08)" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>
                {f.title}
              </Typography>
              <Typography sx={{ mt: 1, color: "rgba(17,24,39,0.75)" }}>{f.body}</Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mt: 8 }}>
          How it works
        </Typography>
        <Box component="ol" sx={{ mt: 2, pl: 3, display: "grid", gap: 1.5, color: "rgba(17,24,39,0.85)" }}>
          {steps.map((s) => (
            <li key={s}>
              <Typography>{s}</Typography>
            </li>
          ))}
        </Box>

        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mt: 8 }}>
          Built with
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {stack.map((s) => (
            <Chip key={s} label={s} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
