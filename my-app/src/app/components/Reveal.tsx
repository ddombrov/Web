"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";

const offsets = {
  up: "translateY(32px)",
  left: "translateX(-48px)",
  right: "translateX(48px)",
};

// Fades and slides content in the first time it scrolls into view, so the
// page has motion tied to scroll beyond just the hero. Direction defaults to
// a rise from below; "left"/"right" let callers (e.g. an alternating
// timeline) have entries arrive from the side they sit on. By default the
// reveal only plays once; pass once={false} to have it reverse when the
// element scrolls back out of view and replay on the way back in.
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  once = true,
}: {
  children: React.ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : offsets[direction],
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        "@media (prefers-reduced-motion: reduce)": { opacity: 1, transform: "none", transition: "none" },
      }}
    >
      {children}
    </Box>
  );
}
