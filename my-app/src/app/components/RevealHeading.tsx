"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { textShadow } from "./styles";

// A heading where each word fades/slides in with a stagger once scrolled
// into view, instead of appearing all at once like every other heading.
export default function RevealHeading({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <Typography
      ref={ref}
      variant="h2"
      component="h2"
      sx={{
        textAlign: "center",
        mb: 5,
        fontSize: { xs: "2rem", md: "2.75rem" },
        color: "#fff",
        textShadow,
      }}
    >
      {words.map((word, i) => (
        <Box
          key={i}
          component="span"
          sx={{
            display: "inline-block",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
            mr: "0.28em",
            "@media (prefers-reduced-motion: reduce)": { opacity: 1, transform: "none", transition: "none" },
          }}
        >
          {word}
        </Box>
      ))}
    </Typography>
  );
}
