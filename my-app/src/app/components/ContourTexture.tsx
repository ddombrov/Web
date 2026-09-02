"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";

// A sticky (viewport-pinned once reached), low-opacity contour-line texture
// that drifts as you scroll — continuous parallax motion for the whole page
// below the hero, without repeating the hero's own mountain photo (which is
// what caused the duplicate-background bug earlier).
export default function ContourTexture() {
  const [scrollY, setScrollY] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafId.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        marginBottom: "-100vh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 800 1600"
        preserveAspectRatio="xMidYMid slice"
        sx={{
          position: "absolute",
          left: 0,
          width: "100%",
          height: "160%",
          top: `${-(scrollY * 0.06) % 480}px`,
          opacity: 0.07,
        }}
      >
        <defs>
          <pattern id="contours" width="800" height="480" patternUnits="userSpaceOnUse">
            <path
              d="M-50,60 C150,20 250,100 400,60 S650,20 850,60"
              stroke="#F5F0E6"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M-50,140 C150,180 250,110 400,150 S650,190 850,150"
              stroke="#F5F0E6"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M-50,230 C150,190 250,260 400,225 S650,180 850,225"
              stroke="#F5F0E6"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M-50,320 C150,360 250,300 400,335 S650,370 850,335"
              stroke="#F5F0E6"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M-50,410 C150,375 250,440 400,405 S650,365 850,405"
              stroke="#F5F0E6"
              strokeWidth="2"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="800" height="1600" fill="url(#contours)" />
      </Box>
    </Box>
  );
}
