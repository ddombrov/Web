"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { textShadow } from "./styles";

// Same rail-centered header as YearMarker, but clickable: lets a visitor
// collapse a whole year's worth of entries to skim the timeline faster,
// without losing the year itself as a scroll anchor. Open by default so
// the page reads exactly as before until someone chooses to collapse it.
export default function CollapsibleYear({
  year,
  children,
}: {
  year: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "70px 1fr", md: "1fr 130px 1fr" },
          columnGap: { xs: 2, md: 4 },
          mb: open ? 3 : 6,
        }}
      >
        <Box
          component="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={`${open ? "Collapse" : "Expand"} ${year}`}
          sx={{
            all: "unset",
            cursor: "pointer",
            gridColumn: { xs: "1", md: "2" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "2px", height: 24, bgcolor: "rgba(255,255,255,0.18)" }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, my: 0.5 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.6rem", md: "2.1rem" },
                lineHeight: 1,
                color: "#fff",
                textShadow,
              }}
            >
              {year}
            </Typography>
            {open ? (
              <KeyboardArrowUpIcon sx={{ color: "rgba(255,255,255,0.55)" }} />
            ) : (
              <KeyboardArrowDownIcon sx={{ color: "rgba(255,255,255,0.55)" }} />
            )}
          </Box>
          <Box sx={{ flex: 1, width: "2px", bgcolor: "rgba(255,255,255,0.18)", minHeight: 24 }} />
        </Box>
      </Box>
      {open && children}
    </>
  );
}
