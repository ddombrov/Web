"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";

type Bubble = { id: number; top: number; side: "left" | "right"; offset: number; size: number; duration: number; rise: number };

// Bubbles tying the Journey timeline into the site's cave -> ocean color
// story. Earlier version: a fixed set of elements each looping the same
// short rise-and-fade forever in the same spot — which reads as "it popped
// up, then vanished" every single cycle, since the same bubble keeps
// blinking in place rather than there ever being a sense of an ongoing
// supply. This version instead spawns a fresh bubble (or small 1-3 group)
// every so often at a new random spot, runs its rise-and-fade exactly
// once, and removes it from the DOM when that finishes — so what's on
// screen at any moment is always a mix of bubbles at different points in
// their journey, and a bubble fading out reads as "it reached the top and
// popped" rather than "the bubbles disappeared."
const MAX_CONCURRENT = 55;
const SPAWN_INTERVAL_MS = 380;
const GROUP_CHANCE = 0.5; // how often a spawn tick adds a 2-3 cluster instead of a single bubble

let nextId = 0;

function makeBubble(): Bubble {
  return {
    id: nextId++,
    top: Math.random() * 100,
    side: Math.random() > 0.5 ? "left" : "right",
    offset: 3 + Math.random() * 10,
    size: Math.round(9 + Math.random() * 15),
    duration: 8 + Math.random() * 8, // 8-16s, one-shot
    rise: 160 + Math.random() * 140, // 160-300px
  };
}

function makeGroup(): Bubble[] {
  const top = Math.random() * 100;
  const side: "left" | "right" = Math.random() > 0.5 ? "left" : "right";
  const baseInset = 3 + Math.random() * 7;
  const count = 2 + Math.floor(Math.random() * 2); // 2 or 3
  return Array.from({ length: count }, (_, i) => ({
    id: nextId++,
    top,
    side,
    offset: baseInset + i * (3 + Math.random() * 2),
    size: Math.round(9 + Math.random() * 15),
    duration: 8 + Math.random() * 8,
    rise: 160 + Math.random() * 140,
  }));
}

// Positions are genuinely randomized with Math.random(), which rules out
// generating them at module load (that runs once during the static build
// and would freeze the same layout into every visit) — instead this starts
// with zero bubbles (matching the static HTML) and only starts spawning
// inside a useEffect, once mounted in the browser. That keeps server and
// client in sync for hydration; purely decorative — inert to pointer
// events so nothing here can ever block a card underneath it.
export default function OceanDecorations() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const countRef = useRef(0);
  countRef.current = bubbles.length;

  useEffect(() => {
    const interval = setInterval(() => {
      if (countRef.current >= MAX_CONCURRENT) return;
      const spawned = Math.random() < GROUP_CHANCE ? makeGroup() : [makeBubble()];
      setBubbles((prev) => [...prev, ...spawned]);
    }, SPAWN_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const removeBubble = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: -1 }}>
      {bubbles.map((b) => (
        <Box
          key={b.id}
          onAnimationEnd={() => removeBubble(b.id)}
          sx={{
            position: "absolute",
            top: `${b.top}%`,
            [b.side]: `${b.offset}%`,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.65), rgba(255,255,255,0.1) 70%)",
            border: "1px solid rgba(255,255,255,0.3)",
            // A single run (no "infinite"): almost the entire duration
            // stays near-peak opacity, with the fade compressed into a
            // brief window right at the very end — reads as "it rose and
            // popped at the top", not "it faded out."
            animation: `oceanBubbleRise ${b.duration}s ease-in forwards`,
            "@keyframes oceanBubbleRise": {
              "0%": { transform: "translate(0, 0)", opacity: 0 },
              "8%": { opacity: 0.85 },
              "90%": { opacity: 0.75 },
              "100%": { transform: `translate(10px, -${b.rise}px)`, opacity: 0 },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />
      ))}

      {/* A crab peeking in from the edge partway down the timeline. */}
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          left: -8,
          fontSize: "2.5rem",
          lineHeight: 1,
          transform: "scaleX(-1) rotate(-8deg)",
          filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
          animation: "oceanCrabWiggle 1.6s ease-in-out infinite",
          "@keyframes oceanCrabWiggle": {
            "0%, 100%": { transform: "scaleX(-1) rotate(-14deg) translate(0, 0)" },
            "50%": { transform: "scaleX(-1) rotate(2deg) translate(18px, -4px)" },
          },
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        🦀
      </Box>
    </Box>
  );
}
