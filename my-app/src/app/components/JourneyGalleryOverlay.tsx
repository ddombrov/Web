"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useJourneyFilter } from "./JourneyFilterContext";
import { useGalleryPortal } from "./GalleryPortalContext";
import { textShadow } from "./styles";

const heading: Record<string, string> = {
  skills: "Skills from across my journey",
  projects: "Projects",
  experience: "Experience",
};

// A fixed, full-viewport stage that sits in front of the (now-hidden)
// timeline. It doesn't render any chips or cards itself — TimelineEntry and
// SkillChips portal their own matching elements straight into the two
// target divs below, carrying a stable layoutId, so Framer Motion animates
// each one flying from its real position on the timeline to wherever it
// lands here, rather than fading in from nowhere.
export default function JourneyGalleryOverlay() {
  const { filter, prevFilter, setFilter } = useJourneyFilter();
  const { setCardsTarget, setSkillsTarget } = useGalleryPortal();
  const active = Boolean(filter);
  // Closing (an active filter clearing) should snap away quickly, matching
  // how fast the badges/cards themselves now hide — only the initial
  // reveal (off to on) uses the slow, traceable timing.
  const closing = Boolean(prevFilter) && !filter;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1090,
        pointerEvents: active ? "auto" : "none",
        opacity: active ? 1 : 0,
        transition: closing ? "opacity 0.5s ease" : "opacity 1.6s ease 0.2s",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: active ? "rgba(10,8,4,0.98)" : "rgba(10,8,4,0.65)",
          backdropFilter: active ? "blur(10px)" : "none",
          transition: closing
            ? "background-color 0.5s ease, backdrop-filter 0.5s ease"
            : "background-color 1.8s ease 0.2s, backdrop-filter 1.8s ease 0.2s",
        }}
      />
      {/* Clicking anywhere in the empty space of this wrapper closes the
          overlay; the two target divs below stop that click from bubbling
          up so interacting with an actual card/chip never closes it. */}
      <Box
        onClick={() => setFilter(null)}
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          pt: { xs: 11, md: 13 },
          pb: 6,
          px: { xs: 2, md: 6 },
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4, flexShrink: 0 }}>
          <Typography variant="h4" sx={{ color: "#fff", textShadow, fontWeight: 700 }}>
            {filter ? heading[filter] : ""}
          </Typography>
        </Box>

        <IconButton
          onClick={() => setFilter(null)}
          aria-label="Close"
          sx={{ position: "absolute", top: { xs: 78, md: 88 }, right: { xs: 16, md: 24 }, color: "#fff", bgcolor: "rgba(255,255,255,0.08)" }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box
            ref={(el: HTMLDivElement | null) => setSkillsTarget(el)}
            onClick={(e) => e.stopPropagation()}
            sx={{
              display: filter === "skills" ? "flex" : "none",
              flexWrap: "wrap",
              gap: 1.5,
              justifyContent: "center",
              alignContent: "flex-start",
              maxWidth: 900,
            }}
          />
          <Box
            ref={(el: HTMLDivElement | null) => setCardsTarget(el)}
            onClick={(e) => e.stopPropagation()}
            sx={{
              display: filter === "skills" ? "none" : "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
              alignContent: "flex-start",
              width: "100%",
              maxWidth: 1400,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
