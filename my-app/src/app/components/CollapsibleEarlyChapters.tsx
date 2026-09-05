"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { textShadow } from "./styles";

// The timeline's earliest, pre-university chapters (high school, summer
// jobs) are real and should stay on the site, but a recruiter's first
// impression shouldn't be a decade-old day camp job. Collapsed by default;
// expands inline into the same alternating dot-and-line rail as every
// other entry. It's a section-level toggle rather than a dated point in
// the sequence, so it sits centered on the rail — the same middle grid
// column, and the same line-above/line-below shape, YearMarker uses —
// instead of off to one side like a normal entry.
export default function CollapsibleEarlyChapters({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  if (open) return <>{children}</>;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "70px 1fr", md: "1fr 130px 1fr" },
        columnGap: { xs: 2, md: 4 },
        mb: 6,
      }}
    >
      <Box sx={{ gridColumn: { xs: "1 / -1", md: "2" }, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box sx={{ width: "2px", height: 24, bgcolor: "rgba(255,255,255,0.18)" }} />
        <Box
          component="button"
          onClick={() => setOpen(true)}
          sx={{
            all: "unset",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            color: "rgba(255,255,255,0.75)",
            textShadow,
            fontStyle: "italic",
            fontSize: "1.1rem",
            whiteSpace: { xs: "normal", md: "nowrap" },
            textAlign: "center",
            my: 0.5,
            "&:hover": { color: "#fff" },
          }}
        >
          {label}
          <KeyboardArrowDownIcon fontSize="small" />
        </Box>
        <Box sx={{ flex: 1, width: "2px", bgcolor: "rgba(255,255,255,0.18)", minHeight: 24 }} />
      </Box>
    </Box>
  );
}
