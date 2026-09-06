"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";

type Bubble = { top: string; side: "left" | "right"; offset: number; size: number; duration: number; delay: number; rise: number; sway: number };

// Bubble clusters scattered down the Journey timeline. Opacity is constant
// for a bubble's entire life — no fade-out — and the loop-reset jump is
// hidden by distance instead: each bubble rises 1400-2200px (comfortably
// more than any real viewport height) before jumping back to its start,
// so the jump only ever happens somewhere far outside whatever the
// visitor is currently scrolled to. A negative animation-delay starts
// each bubble already mid-flight on page load. Every bubble in a group
// shares the same duration/delay/rise so the cluster rises and resets
// together — giving them individually varying timing instead let members
// drift apart until only one was left visible near any given scroll spot,
// which read as "just a single bubble" rather than a group.
const GROUP_COUNT = 22;

function randomBubbles(): Bubble[] {
  const slotSpacing = 100 / (GROUP_COUNT - 1);
  return Array.from({ length: GROUP_COUNT }, (_, gi) => {
    const idealTop = gi * slotSpacing;
    const jitter = (Math.random() - 0.5) * slotSpacing * 0.7;
    const top = Math.min(100, Math.max(0, idealTop + jitter));
    const side: "left" | "right" = Math.random() > 0.5 ? "left" : "right";
    const inset = 3 + Math.random() * 7;
    const count = 2 + Math.floor(Math.random() * 7); // 2-8
    const duration = 45 + Math.random() * 25;
    const delay = -(Math.random() * duration);
    const rise = 1400 + Math.random() * 800;
    return { top, side, inset, count, duration, delay, rise };
  }).flatMap((group) =>
    Array.from({ length: group.count }, (_, i) => ({
      // Independent jitter per bubble on top of the group's shared height
      // — without enough of it, bubbles in a cluster still read as sitting
      // at basically the same height rather than a loose, natural cluster.
      top: `${Math.min(100, Math.max(0, group.top + (Math.random() - 0.5) * 9)).toFixed(1)}%`,
      side: group.side,
      offset: group.inset + i * (3 + Math.random() * 2),
      size: Math.round(9 + Math.random() * 15),
      duration: group.duration,
      delay: group.delay,
      rise: group.rise,
      sway: 5 + Math.random() * 7,
    }))
  );
}

let burstIdCounter = 0;

function BubbleBurst({ originSide, originOffset }: { originSide: "left" | "right"; originOffset: number }) {
  const [burst] = useState(() =>
    Array.from({ length: 2 + Math.floor(Math.random() * 2) }, () => ({
      id: burstIdCounter++,
      dx: (Math.random() - 0.5) * 40,
      size: Math.round(8 + Math.random() * 10),
      duration: 2.5 + Math.random() * 1.5,
      delay: Math.random() * 0.4,
    }))
  );
  return (
    <>
      {burst.map((b) => (
        <Box
          key={b.id}
          sx={{
            position: "absolute",
            bottom: 6,
            [originSide]: `calc(${originOffset}% - 8px)`,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0.15) 70%)",
            border: "1px solid rgba(255,255,255,0.35)",
            animation: `chestBubbleRise ${b.duration}s ease-out ${b.delay}s forwards`,
            "@keyframes chestBubbleRise": {
              "0%": { transform: "translate(0,0)", opacity: 0.9 },
              "100%": { transform: `translate(${b.dx}px, -120px)`, opacity: 0 },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />
      ))}
    </>
  );
}

// A crab you can click: it freezes for a beat (startled), then scurries
// off past its edge and fades out, reappearing back at its spot a few
// seconds later. Every timing below is duplicated between the setTimeout
// schedule and the animation-duration values on purpose — they have to
// stay in lockstep, there's no single source of truth to derive both from
// without a lot more machinery for a decorative easter egg.
const FREEZE_MS = 250;
const FLEE_MS = 650;
const HIDDEN_MS = 2200;
const RETURN_MS = 550;

function Crab({
  id,
  top,
  side,
  edge,
  baseTransform,
  fleeDx,
  fleeDy,
}: {
  id: string;
  top: string;
  side: "left" | "right";
  edge: number;
  baseTransform: string;
  fleeDx: number;
  fleeDy: number;
}) {
  const [phase, setPhase] = useState<"idle" | "frozen" | "fleeing" | "returning">("idle");

  useEffect(() => {
    if (phase === "frozen") {
      const t = setTimeout(() => setPhase("fleeing"), FREEZE_MS);
      return () => clearTimeout(t);
    }
    if (phase === "fleeing") {
      const t = setTimeout(() => setPhase("returning"), FLEE_MS + HIDDEN_MS);
      return () => clearTimeout(t);
    }
    if (phase === "returning") {
      const t = setTimeout(() => setPhase("idle"), RETURN_MS);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const wiggleName = `crabWiggle_${id}`;
  const startleName = `crabStartle_${id}`;
  const fleeName = `crabFlee_${id}`;
  const returnName = `crabReturn_${id}`;

  const animation =
    phase === "idle"
      ? `${wiggleName} 1.6s ease-in-out infinite`
      : phase === "frozen"
      ? `${startleName} ${FREEZE_MS}ms ease-out forwards`
      : phase === "fleeing"
      ? `${fleeName} ${FLEE_MS}ms ease-in forwards`
      : `${returnName} ${RETURN_MS}ms ease-out forwards`;

  return (
    <Box
      onClick={() => phase === "idle" && setPhase("frozen")}
      role="button"
      aria-label="A crab — click it"
      sx={{
        position: "absolute",
        top,
        [side]: edge,
        fontSize: "2.5rem",
        lineHeight: 1,
        cursor: "pointer",
        pointerEvents: "auto",
        zIndex: 1,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
        animation,
        [`@keyframes ${wiggleName}`]: {
          "0%, 100%": { transform: `${baseTransform} translate(0, 0)` },
          "50%": { transform: `${baseTransform} translate(18px, -4px)` },
        },
        [`@keyframes ${startleName}`]: {
          "0%": { transform: `${baseTransform} translate(0, 0) scale(1)` },
          "100%": { transform: `${baseTransform} translate(0, 0) scale(1.2)` },
        },
        [`@keyframes ${fleeName}`]: {
          "0%": { transform: `${baseTransform} translate(0, 0) scale(1.2)`, opacity: 1 },
          "100%": { transform: `${baseTransform} translate(${fleeDx}px, ${fleeDy}px) scale(0.7)`, opacity: 0 },
        },
        [`@keyframes ${returnName}`]: {
          "0%": { transform: `${baseTransform} translate(${fleeDx}px, ${fleeDy}px) scale(0.7)`, opacity: 0 },
          "100%": { transform: `${baseTransform} translate(0, 0) scale(1)`, opacity: 1 },
        },
        "@media (prefers-reduced-motion: reduce)": { animation: phase === "idle" ? "none" : animation },
      }}
    >
      🦀
    </Box>
  );
}

function TreasureChest() {
  const [open, setOpen] = useState(false);

  return (
    <Box
      onClick={() => setOpen(true)}
      role="button"
      aria-label="A treasure chest — click it"
      sx={{
        position: "absolute",
        top: "92%",
        left: -10,
        width: 46,
        height: 40,
        cursor: open ? "default" : "pointer",
        pointerEvents: "auto",
        zIndex: 1,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
        animation: open ? "chestPop 0.4s ease-out" : "none",
        "@keyframes chestPop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
      }}
    >
      <Box component="svg" viewBox="0 0 46 40" sx={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}>
        <rect x="2" y="20" width="42" height="18" rx="3" fill="#7A4A22" stroke="#4E2E14" strokeWidth="1.5" />
        {open ? (
          <>
            <ellipse cx="16" cy="20" rx="5" ry="3" fill="#D9A441" stroke="#4E2E14" strokeWidth="0.75" />
            <ellipse cx="24" cy="18" rx="5" ry="3" fill="#F0C464" stroke="#4E2E14" strokeWidth="0.75" />
            <ellipse cx="31" cy="20.5" rx="5" ry="3" fill="#D9A441" stroke="#4E2E14" strokeWidth="0.75" />
            <path d="M2 20 Q10 2 20 3" fill="#8B5A2B" stroke="#4E2E14" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M44 20 Q36 2 26 3" fill="#8B5A2B" stroke="#4E2E14" strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : (
          <path d="M2 20 Q23 4 44 20 L44 24 Q23 12 2 24 Z" fill="#8B5A2B" stroke="#4E2E14" strokeWidth="1.5" />
        )}
        <rect x="19" y="18" width="8" height="10" rx="1.5" fill="#D9A441" stroke="#4E2E14" strokeWidth="1" />
        <circle cx="23" cy="23" r="1.4" fill="#4E2E14" />
      </Box>
      {open ? (
        <>
          <Box
            sx={{
              position: "absolute",
              top: -10,
              left: 14,
              fontSize: "0.9rem",
              animation: "chestSparkle 2.4s ease-in-out infinite",
              "@keyframes chestSparkle": {
                "0%, 100%": { opacity: 0.3, transform: "scale(0.85)" },
                "50%": { opacity: 1, transform: "scale(1.1)" },
              },
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          >
            ✨
          </Box>
          <BubbleBurst originSide="left" originOffset={50} />
        </>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: -10,
            right: -6,
            fontSize: "0.9rem",
            animation: "chestSparkleIdle 2.4s ease-in-out infinite",
            "@keyframes chestSparkleIdle": {
              "0%, 100%": { opacity: 0.3, transform: "scale(0.85)" },
              "50%": { opacity: 1, transform: "scale(1.1)" },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          ✨
        </Box>
      )}
    </Box>
  );
}

type Fish = {
  id: string;
  top: number;
  width: number;
  duration: number;
  delay: number;
  reverse: boolean;
  bodyColor: string;
  tailColor: string;
  lure?: boolean;
  bob: number;
};

// Three size tiers at three depths — small guppies near the top, mid-size
// fish through the middle, and anglerfish patrolling the bottom. Hand-built
// as SVG rather than emoji: no emoji set draws a fish asymmetrically enough
// that flipping it for the opposite swim direction reads as "turned
// around" instead of "generic blob facing nowhere in particular" (the
// shark emoji was the clearest example — near side-on but not enough to
// read as changing direction when mirrored). This shape faces right by
// construction (head/eye on the right, tail on the left), so a rightward
// swim needs no flip and a leftward one just mirrors the whole thing.
const FISH: Fish[] = [
  { id: "f1", top: 8, width: 20, duration: 38, delay: -6, reverse: false, bodyColor: "#8FD3E8", tailColor: "#4FA8C9", bob: 2 },
  { id: "f2", top: 18, width: 17, duration: 44, delay: -22, reverse: true, bodyColor: "#A8E0C9", tailColor: "#5BB894", bob: 2.6 },
  { id: "f3", top: 45, width: 34, duration: 50, delay: -12, reverse: false, bodyColor: "#FF8A3D", tailColor: "#E85D2B", bob: 1.8 },
  { id: "f4", top: 58, width: 30, duration: 46, delay: -30, reverse: true, bodyColor: "#FFC24D", tailColor: "#E89A2B", bob: 2.4 },
  { id: "f5", top: 82, width: 50, duration: 66, delay: -18, reverse: false, bodyColor: "#1B2430", tailColor: "#0D1219", lure: true, bob: 1.6 },
  { id: "f6", top: 97, width: 44, duration: 60, delay: -42, reverse: true, bodyColor: "#232E3D", tailColor: "#0D1219", lure: true, bob: 2.2 },
];

// The original emoji fish, kept alongside the hand-built SVG ones above —
// 🐟/🐠 have enough of a side profile that flipping them for direction
// reads fine (unlike the shark emoji, which is why the bottom tier stayed
// SVG-only).
type EmojiFish = { id: string; top: number; emoji: string; size: string; duration: number; delay: number; reverse: boolean };

const EMOJI_FISH: EmojiFish[] = [
  { id: "ef1", top: 28, emoji: "🐟", size: "1.2rem", duration: 40, delay: -14, reverse: false },
  { id: "ef2", top: 65, emoji: "🐠", size: "1.5rem", duration: 48, delay: -26, reverse: true },
  { id: "ef3", top: 90, emoji: "🐟", size: "1.1rem", duration: 42, delay: -8, reverse: false },
];

function SwimmingEmojiFish({ f }: { f: EmojiFish }) {
  const animName = `emojiFishSwim_${f.id}`;
  const flip = !f.reverse;
  return (
    <Box
      sx={{
        position: "absolute",
        top: `${f.top}%`,
        fontSize: f.size,
        lineHeight: 1,
        filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.35))",
        transform: flip ? "scaleX(-1)" : "none",
        animation: `${animName} ${f.duration}s linear ${f.delay}s infinite`,
        [`@keyframes ${animName}`]: f.reverse
          ? { "0%": { left: "104%" }, "100%": { left: "-10%" } }
          : { "0%": { left: "-10%" }, "100%": { left: "104%" } },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    >
      {f.emoji}
    </Box>
  );
}

function FishSVG({ id, bodyColor, tailColor, lure }: { id: string; bodyColor: string; tailColor: string; lure?: boolean }) {
  const gradId = `fishBodyGrad_${id}`;
  return (
    <Box
      component="svg"
      viewBox="-6 -16 50 38"
      sx={{
        width: "100%",
        height: "100%",
        display: "block",
        overflow: "visible",
        "& .fishTail": { transformOrigin: "7px 12px", animation: "fishTailFlap 0.7s ease-in-out infinite" },
        "@keyframes fishTailFlap": {
          "0%, 100%": { transform: "rotate(-16deg)" },
          "50%": { transform: "rotate(16deg)" },
        },
        "& .lureGlow": { animation: "lureGlowPulse 1.8s ease-in-out infinite" },
        "@keyframes lureGlowPulse": {
          "0%, 100%": { opacity: 0.75 },
          "50%": { opacity: 1 },
        },
        "& .lureHalo": { animation: "lureHaloPulse 1.8s ease-in-out infinite" },
        "@keyframes lureHaloPulse": {
          "0%, 100%": { opacity: 0.3, r: 4 },
          "50%": { opacity: 0.6, r: 6 },
        },
        "@media (prefers-reduced-motion: reduce)": { "& .fishTail, & .lureGlow, & .lureHalo": { animation: "none" } },
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {lure && (
        <>
          <circle className="lureHalo" cx="41" cy="-13" r="4" fill="#E8FFA0" />
          <path d="M30 0 Q37 -8 41 -13" fill="none" stroke={tailColor} strokeWidth="1.2" />
          <circle className="lureGlow" cx="41" cy="-13" r="2.6" fill="#F2FFC2" />
          <circle cx="41" cy="-13" r="1.1" fill="#fff" />
        </>
      )}

      {/* tail fin, two overlapping lobes for a bit of depth */}
      <g className="fishTail">
        <path d="M12 12 L0 3 L0 21 Z" fill={tailColor} />
        <path d="M11 12 L3 8 L3 16 Z" fill={tailColor} opacity="0.55" />
      </g>

      {/* dorsal fin */}
      <path d="M17 4.5 Q21 -7 28 3.5 Q22 2 17 4.5 Z" fill={tailColor} />
      {/* pectoral fin */}
      <path d="M25 17 Q29 24 34 19 Q29 17.5 25 17 Z" fill={tailColor} opacity="0.85" />

      {/* body, with a gradient overlay for a rounded, shaded look */}
      <ellipse cx="24" cy="12" rx="16" ry="8.5" fill={bodyColor} />
      <ellipse cx="24" cy="12" rx="16" ry="8.5" fill={`url(#${gradId})`} />
      {/* belly highlight */}
      <ellipse cx="22" cy="16.5" rx="11" ry="2.6" fill="#fff" opacity="0.16" />
      {/* gill mark */}
      <path d="M31 6.5 Q29 12 31 17.5" fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="1" strokeLinecap="round" />

      <circle cx="35" cy="9" r="1.7" fill="#fff" />
      <circle cx="35" cy="9" r="0.85" fill="#111" />
    </Box>
  );
}

function SwimmingFish({ f }: { f: Fish }) {
  const animName = `fishSwim_${f.id}`;
  const height = f.width * (34 / 50);
  const bob = f.bob;
  return (
    <Box
      sx={{
        position: "absolute",
        top: `${f.top}%`,
        width: f.width,
        height,
        filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.35))",
        // Base shape faces right; a leftward swim mirrors the whole fish
        // (tail flap and all) so it visibly turns to face where it's going.
        transform: f.reverse ? "scaleX(-1)" : "none",
        animation: `${animName} ${f.duration}s ease-in-out ${f.delay}s infinite`,
        [`@keyframes ${animName}`]: f.reverse
          ? {
              "0%": { left: "104%", top: `${f.top}%` },
              "25%": { top: `${f.top - bob}%` },
              "50%": { left: "50%", top: `${f.top + bob}%` },
              "75%": { top: `${f.top - bob}%` },
              "100%": { left: "-10%", top: `${f.top}%` },
            }
          : {
              "0%": { left: "-10%", top: `${f.top}%` },
              "25%": { top: `${f.top - bob}%` },
              "50%": { left: "50%", top: `${f.top + bob}%` },
              "75%": { top: `${f.top - bob}%` },
              "100%": { left: "104%", top: `${f.top}%` },
            },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    >
      <FishSVG id={f.id} bodyColor={f.bodyColor} tailColor={f.tailColor} lure={f.lure} />
    </Box>
  );
}

export default function OceanDecorations() {
  const [bubbles, setBubbles] = useState<Bubble[] | null>(null);

  useEffect(() => {
    setBubbles(randomBubbles());
  }, []);

  return (
    <>
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: -1 }}>
      {bubbles?.map((b, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: b.top,
            [b.side]: `${b.offset}%`,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.65), rgba(255,255,255,0.1) 70%)",
            border: "1px solid rgba(255,255,255,0.3)",
            // A gentle side-to-side sway layered on top of the steady rise
            // (rather than one straight vertical line) is what actually
            // reads as "floating" instead of "sliding on a rail" — real
            // bubbles wobble a little as they rise.
            animation: `oceanBubbleRise_${i} ${b.duration}s linear ${b.delay}s infinite`,
            [`@keyframes oceanBubbleRise_${i}`]: {
              "0%": { transform: "translate(0, 0)", opacity: 0.78 },
              "20%": { transform: `translate(${-b.sway}px, -${(b.rise * 0.2).toFixed(0)}px)` },
              "40%": { transform: `translate(${b.sway}px, -${(b.rise * 0.4).toFixed(0)}px)` },
              "60%": { transform: `translate(${-b.sway}px, -${(b.rise * 0.6).toFixed(0)}px)` },
              "80%": { transform: `translate(${b.sway}px, -${(b.rise * 0.8).toFixed(0)}px)` },
              "100%": { transform: `translate(0, -${b.rise}px)`, opacity: 0.78 },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />
      ))}

      {FISH.map((f) => (
        <SwimmingFish key={f.id} f={f} />
      ))}
      {EMOJI_FISH.map((f) => (
        <SwimmingEmojiFish key={f.id} f={f} />
      ))}
      </Box>

      {/* Crab and chest render as siblings of the bubble/fish layer above,
          not nested inside it: that layer's zIndex:-1 establishes its own
          stacking context, which traps every descendant at "-1" no matter
          what z-index they're individually given — clicks on the crab or
          chest were being swallowed by ordinary (invisible but still
          hit-testable) layout spacers from the card grid painting above
          them. Living outside that context, a modest positive zIndex here
          is enough to win hit-testing normally. */}
      <Crab id="1" top="35%" side="left" edge={-8} baseTransform="scaleX(-1) rotate(-8deg)" fleeDx={-70} fleeDy={30} />
      <Crab id="2" top="60%" side="right" edge={-8} baseTransform="rotate(10deg)" fleeDx={70} fleeDy={30} />

      <TreasureChest />
    </>
  );
}
