"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { textShadow } from "./styles";
import TimelineRow from "./TimelineRow";

// The timeline's earliest, pre-university chapters (high school, summer
// jobs) are real and should stay on the site, but a recruiter's first
// impression shouldn't be a decade-old day camp job. Collapsed by default;
// expands inline into the same alternating dot-and-line rail as every
// other entry.
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
    <TimelineRow side="right">
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
          "&:hover": { color: "#fff" },
        }}
      >
        {label}
        <KeyboardArrowDownIcon fontSize="small" />
      </Box>
    </TimelineRow>
  );
}
