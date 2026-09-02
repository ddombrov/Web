import { useId } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { textShadow } from "./styles";

// A small, stable-per-instance jag so the two columns don't form a rigid
// aligned grid — content nudges up or down a little (dot and rail stay put)
// for a looser, more collage-like rhythm. Hashing React's own useId keeps
// it deterministic across server/client instead of reaching for Math.random.
function jagOffset(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const pattern = [-18, 22, -8, 30, 0, -26, 14];
  return pattern[h % pattern.length];
}

const dateSx = {
  color: "rgba(255,255,255,0.65)",
  textShadow,
  textAlign: "center" as const,
  fontSize: "0.7rem",
  lineHeight: 1.35,
  px: 0.5,
};

// Dot column shared by every row (real entries and the collapsed-chapters
// toggle) so they all land on the same center line regardless of what's
// rendered beside them. Only a single month/year sits above the dot; if the
// entry spans a range, the end date sits lower on the connector, right
// where that stretch of the line finishes — so the line itself carries the
// range instead of a cramped "Mon YYYY – Mon YYYY" label. Each row draws
// its own short connector segment (rather than one giant absolutely-
// positioned line for the whole, very tall section) so the "flowing line"
// reads as continuous without ever becoming a single oversized composited
// layer.
export function TimelineDot({
  startDate,
  endDate,
  isLast = false,
}: {
  startDate?: string;
  endDate?: string;
  isLast?: boolean;
}) {
  return (
    <Box sx={{ gridColumn: { xs: "1", md: "2" }, gridRow: "1 / -1", display: "flex", flexDirection: "column", alignItems: "center", pt: 0.75 }}>
      {startDate && (
        <Typography variant="caption" sx={{ ...dateSx, mb: 1 }}>
          {startDate}
        </Typography>
      )}
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          flexShrink: 0,
          bgcolor: "secondary.main",
          boxShadow: "0 0 0 4px rgba(255,255,255,0.08)",
        }}
      />
      {!isLast && (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <Box sx={{ flex: 1, width: "2px", bgcolor: "rgba(255,255,255,0.18)", mt: 1 }} />
          {endDate && (
            <Typography variant="caption" sx={{ ...dateSx, mt: 1, color: "rgba(255,255,255,0.45)" }}>
              {endDate}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

// A big year number standing in for a dot at each year boundary — a
// visual anchor you can orient by while scrolling past a long run of
// same-year entries, much louder than the small month/year captions on
// ordinary entries.
export function YearMarker({ year }: { year: string }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "70px 1fr", md: "1fr 130px 1fr" },
        columnGap: { xs: 2, md: 4 },
        mb: 3,
      }}
    >
      <Box sx={{ gridColumn: { xs: "1", md: "2" }, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box sx={{ width: "2px", height: 24, bgcolor: "rgba(255,255,255,0.18)" }} />
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.6rem", md: "2.1rem" },
            lineHeight: 1,
            color: "#fff",
            textShadow,
            my: 0.5,
          }}
        >
          {year}
        </Typography>
        <Box sx={{ flex: 1, width: "2px", bgcolor: "rgba(255,255,255,0.18)", minHeight: 24 }} />
      </Box>
    </Box>
  );
}

// Row grid shared by every timeline entry: a dot (and date) centered on a
// continuous background line, with content alternating left/right of it on
// desktop and collapsing to a single left column on mobile. An optional
// `aside` renders in the opposite column at the same row (below the main
// card on mobile) without a dot of its own — used for content that belongs
// beside a specific entry rather than as its own point in the sequence
// (recommendations tied to a role, a photo slot).
export default function TimelineRow({
  side = "left",
  startDate,
  endDate,
  isLast = false,
  aside,
  wide = false,
  children,
}: {
  side?: "left" | "right";
  startDate?: string;
  endDate?: string;
  isLast?: boolean;
  aside?: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const isLeft = side === "left";
  const contentJag = jagOffset(useId());
  const asideJag = jagOffset(useId());
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "70px 1fr", md: "1fr 130px 1fr" },
        columnGap: { xs: 2, md: 4 },
        rowGap: { xs: 3, md: 0 },
        mb: isLast ? 0 : 6,
      }}
    >
      <TimelineDot startDate={startDate} endDate={endDate} isLast={isLast} />
      <Box
        sx={{
          gridColumn: { xs: "2", md: wide ? "1 / -1" : isLeft ? "1" : "3" },
          gridRow: "1",
          position: wide ? "relative" : "static",
          zIndex: wide ? 2 : "auto",
          justifySelf: { xs: "stretch", md: wide ? "stretch" : isLeft ? "end" : "start" },
          width: "100%",
          maxWidth: { md: wide ? "100%" : 620 },
          minWidth: 0,
          mt: { md: wide ? 0 : `${contentJag}px` },
          transition: "max-width 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {children}
      </Box>
      {aside && (
        <Box
          sx={{
            gridColumn: { xs: "2", md: isLeft ? "3" : "1" },
            gridRow: { xs: "2", md: "1" },
            justifySelf: { xs: "stretch", md: isLeft ? "start" : "end" },
            width: "100%",
            maxWidth: { md: 620 },
            minWidth: 0,
            mt: { md: `${asideJag}px` },
          }}
        >
          {aside}
        </Box>
      )}
    </Box>
  );
}
