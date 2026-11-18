"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";

type BubbleKind = "css" | "photo1" | "photo2";

type Bubble = { top: string; side: "left" | "right"; offset: number; size: number; duration: number; delay: number; rise: number; sway: number; kind: BubbleKind };

const PHOTO_SRC: Record<BubbleKind, string> = {
  css: "/bubble-blue.webp",
  photo1: "/bubble-blue.webp",
  photo2: "/bubble-blue.webp",
};

// Every kind renders the same glossy blue bubble image; the kinds only
// differ in their size range and share of the mix.
// Size range (px) per bubble type: photo1 runs 25% larger than the base
// range, photo2 is deliberately smaller.
const BASE_SIZE = { min: 9, span: 15 };
const SIZE: Record<BubbleKind, { min: number; span: number }> = {
  css: BASE_SIZE,
  photo1: { min: BASE_SIZE.min * 1.25, span: BASE_SIZE.span * 1.25 },
  photo2: { min: 12, span: 8 },
};

const KINDS: BubbleKind[] = ["css", "photo1", "photo2"];

// Assigning kinds by dealing them out in rotation and then shuffling — rather
// than rolling each bubble's type independently — keeps the three types at
// equal counts (within one), so the mix doesn't drift lopsided by luck.
function balancedKinds(count: number): BubbleKind[] {
  const kinds = Array.from({ length: count }, (_, i) => KINDS[i % KINDS.length]);
  for (let i = kinds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kinds[i], kinds[j]] = [kinds[j], kinds[i]];
  }
  return kinds;
}

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
  const positioned = Array.from({ length: GROUP_COUNT }, (_, gi) => {
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
      duration: group.duration,
      delay: group.delay,
      rise: group.rise,
      sway: 5 + Math.random() * 7,
    }))
  );

  const kinds = balancedKinds(positioned.length);
  return positioned.map((bubble, i): Bubble => {
    const { min, span } = SIZE[kinds[i]];
    return { ...bubble, kind: kinds[i], size: Math.round(min + Math.random() * span) };
  });
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
            animation: `chestBubbleRise ${b.duration}s ease-out ${b.delay}s forwards`,
            "@keyframes chestBubbleRise": {
              "0%": { transform: "translate(0,0)", opacity: 0.9 },
              "100%": { transform: `translate(${b.dx}px, -120px)`, opacity: 0 },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative */}
          <img src={PHOTO_SRC.css} alt="" width={b.size} height={b.size} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
        </Box>
      ))}
    </>
  );
}

// The sea life artwork in public/sea, by number. `face` is the way the head points, so a creature
// swimming the other way is mirrored instead of swimming backwards.
type Face = "left" | "right";
// Reef and freshwater fish swim near the top, sharks, rays and big fish through the middle, and deep-sea
// fish along the bottom. The numbers are the band of the section's height, in percent, each depth uses.
type Depth = "surface" | "mid" | "deep";
const DEPTH_BANDS: Record<Depth, [number, number]> = { surface: [3, 32], mid: [30, 72], deep: [72, 97] };
const SWIMMERS: { n: number; face: Face; size: number; depth: Depth }[] = [
  { n: 1, face: "left", size: 52, depth: "surface" },
  { n: 3, face: "left", size: 50, depth: "surface" },
  { n: 4, face: "left", size: 168, depth: "mid" },
  { n: 6, face: "left", size: 44, depth: "surface" },
  { n: 7, face: "left", size: 46, depth: "surface" },
  { n: 10, face: "left", size: 172, depth: "mid" },
  { n: 11, face: "right", size: 50, depth: "surface" },
  { n: 12, face: "left", size: 144, depth: "mid" },
  { n: 14, face: "right", size: 70, depth: "mid" },
  { n: 17, face: "right", size: 58, depth: "mid" },
  { n: 19, face: "right", size: 52, depth: "mid" },
  { n: 21, face: "left", size: 38, depth: "surface" },
  { n: 22, face: "left", size: 48, depth: "surface" },
  { n: 24, face: "left", size: 56, depth: "surface" },
  { n: 25, face: "left", size: 46, depth: "deep" },
  { n: 26, face: "left", size: 58, depth: "deep" },
  { n: 27, face: "right", size: 60, depth: "mid" },
  { n: 28, face: "left", size: 176, depth: "mid" },
  { n: 29, face: "left", size: 168, depth: "mid" },
  { n: 30, face: "right", size: 50, depth: "surface" },
  { n: 31, face: "right", size: 58, depth: "mid" },
  { n: 33, face: "left", size: 46, depth: "surface" },
  { n: 34, face: "left", size: 66, depth: "mid" },
  { n: 35, face: "left", size: 48, depth: "surface" },
  { n: 37, face: "left", size: 44, depth: "surface" },
  { n: 40, face: "left", size: 40, depth: "surface" },
  { n: 41, face: "left", size: 50, depth: "surface" },
  { n: 43, face: "left", size: 54, depth: "surface" },
  { n: 44, face: "right", size: 50, depth: "surface" },
  { n: 45, face: "left", size: 168, depth: "mid" },
  { n: 48, face: "left", size: 150, depth: "mid" },
  { n: 50, face: "left", size: 58, depth: "deep" },
  { n: 51, face: "left", size: 48, depth: "surface" },
  { n: 53, face: "left", size: 52, depth: "mid" },
  { n: 54, face: "left", size: 56, depth: "deep" },
  { n: 56, face: "left", size: 50, depth: "surface" },
  { n: 57, face: "left", size: 40, depth: "surface" },
  { n: 59, face: "left", size: 50, depth: "mid" },
  { n: 61, face: "left", size: 184, depth: "mid" },
  { n: 62, face: "left", size: 160, depth: "mid" },
  { n: 63, face: "left", size: 46, depth: "surface" },
  { n: 64, face: "left", size: 172, depth: "mid" },
  { n: 66, face: "left", size: 140, depth: "deep" },
  { n: 67, face: "left", size: 36, depth: "surface" },
  { n: 68, face: "left", size: 58, depth: "deep" },
  { n: 69, face: "left", size: 50, depth: "surface" },
  { n: 70, face: "left", size: 46, depth: "surface" },
  { n: 71, face: "left", size: 70, depth: "mid" },
  { n: 73, face: "left", size: 48, depth: "deep" },
  { n: 75, face: "left", size: 50, depth: "surface" },
];
// Animals without fins to swim with (jellyfish, octopus, cuttlefish, seahorses, the sea dragon) rest
// near the edges and bob in place instead of crossing the page.
const DRIFTERS: { n: number; size: number }[] = [
  { n: 0, size: 64 }, { n: 55, size: 56 }, { n: 2, size: 60 }, { n: 8, size: 48 }, { n: 20, size: 50 }, { n: 47, size: 62 }, { n: 49, size: 50 }, { n: 52, size: 58 },
];
// Crabs, lobsters, shrimp and isopods sit at the edges and scurry off when clicked.
const CRAWLERS: { n: number; size: number }[] = [
  { n: 13, size: 52 }, { n: 15, size: 54 }, { n: 18, size: 56 }, { n: 32, size: 50 }, { n: 38, size: 48 },
  { n: 39, size: 44 }, { n: 46, size: 52 }, { n: 60, size: 52 }, { n: 65, size: 50 }, { n: 74, size: 48 },
];
// Shells and coral decorate the edges.
const SEABED: { n: number; size: number }[] = [
  { n: 5, size: 44 }, { n: 9, size: 52 }, { n: 16, size: 40 }, { n: 23, size: 54 }, { n: 36, size: 44 }, { n: 42, size: 48 }, { n: 72, size: 54 },
];
const PEARL_SHELL = 58;
const seaSrc = (n: number) => `/sea/${String(n).padStart(2, "0")}.webp`;

const SWIMMER_COUNT = 24, DRIFTER_COUNT = 5, CRAWLER_COUNT = 6, SEABED_COUNT = 6;

function pickSome<T>(list: T[], count: number): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

type Swimmer = { id: string; n: number; face: Face; size: number; depth: Depth; top: number; tilt: number; duration: number; delay: number; reverse: boolean; bob: number };
type Placed = { id: string; n: number; size: number; top: number; side: "left" | "right"; edge: number; tilt: number; duration: number; delay: number };

// A fresh mix every visit: some creatures from each group, spread down the section.
function randomSea() {
  const slots = (count: number, from: number, to: number) =>
    Array.from({ length: count }, (_, i) => from + ((i + 0.2 + Math.random() * 0.6) * (to - from)) / count);
  const swimmers: Swimmer[] = pickSome(SWIMMERS, SWIMMER_COUNT).map((s, i) => ({
    ...s,
    id: `s${i}`,
    top: DEPTH_BANDS[s.depth][0] + Math.random() * (DEPTH_BANDS[s.depth][1] - DEPTH_BANDS[s.depth][0]),
    // Mostly level, with a slight tilt of up to 5 degrees either way.
    tilt: (Math.random() - 0.5) * 10,
    duration: 38 + Math.random() * 30 + s.size * 0.15,
    delay: -Math.random() * 60,
    reverse: Math.random() < 0.5,
    bob: 1.5 + Math.random() * 1.2,
  }));
  const edgeItems = (list: { n: number; size: number }[], count: number, from: number, to: number, prefix: string): Placed[] => {
    const tops = slots(count, from, to);
    return pickSome(list, count).map((c, i) => ({
      ...c,
      id: `${prefix}${i}`,
      top: tops[i],
      side: i % 2 === 0 ? "left" : "right",
      edge: -6 - Math.random() * 6,
      tilt: (Math.random() - 0.5) * 20,
      duration: 4 + Math.random() * 3,
      delay: -Math.random() * 6,
    }));
  };
  return {
    swimmers,
    drifters: edgeItems(DRIFTERS, DRIFTER_COUNT, 12, 80, "d").map((d) => ({ ...d, edge: 2 + Math.random() * 4 })),
    crawlers: edgeItems(CRAWLERS, CRAWLER_COUNT, 20, 85, "c"),
    seabed: edgeItems(SEABED, SEABED_COUNT, 10, 88, "b"),
  };
}

// A crawler you can click: it freezes for a beat (startled), then scurries off past its edge and fades
// out, reappearing back at its spot a few seconds later. Every timing below is duplicated between the
// setTimeout schedule and the animation durations on purpose; they have to stay in lockstep.
const FREEZE_MS = 250;
const FLEE_MS = 650;
const HIDDEN_MS = 2200;
const RETURN_MS = 550;

function Crawler({ c }: { c: Placed }) {
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

  const base = `${c.side === "left" ? "scaleX(-1) " : ""}rotate(${c.tilt.toFixed(1)}deg)`;
  // Left-edge crawlers are mirrored, so the same +x step carries every crawler off its own edge.
  const fleeDx = 70;
  const names = { wiggle: `crawlWiggle_${c.id}`, startle: `crawlStartle_${c.id}`, flee: `crawlFlee_${c.id}`, back: `crawlReturn_${c.id}` };
  const animation =
    phase === "idle" ? `${names.wiggle} 1.6s ease-in-out infinite`
    : phase === "frozen" ? `${names.startle} ${FREEZE_MS}ms ease-out forwards`
    : phase === "fleeing" ? `${names.flee} ${FLEE_MS}ms ease-in forwards`
    : `${names.back} ${RETURN_MS}ms ease-out forwards`;

  return (
    <Box
      onClick={() => phase === "idle" && setPhase("frozen")}
      role="button"
      aria-label="A sea creature, click it"
      sx={{
        position: "absolute",
        top: `${c.top}%`,
        [c.side]: c.edge,
        width: c.size,
        height: c.size,
        cursor: "pointer",
        pointerEvents: "auto",
        zIndex: 1,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
        animation,
        [`@keyframes ${names.wiggle}`]: {
          "0%, 100%": { transform: `${base} translate(0, 0)` },
          "50%": { transform: `${base} translate(14px, -3px)` },
        },
        [`@keyframes ${names.startle}`]: {
          "0%": { transform: `${base} scale(1)` },
          "100%": { transform: `${base} scale(1.2)` },
        },
        [`@keyframes ${names.flee}`]: {
          "0%": { transform: `${base} translate(0, 0) scale(1.2)`, opacity: 1 },
          "100%": { transform: `${base} translate(${fleeDx}px, 30px) scale(0.7)`, opacity: 0 },
        },
        [`@keyframes ${names.back}`]: {
          "0%": { transform: `${base} translate(${fleeDx}px, 30px) scale(0.7)`, opacity: 0 },
          "100%": { transform: `${base} translate(0, 0) scale(1)`, opacity: 1 },
        },
        "@media (prefers-reduced-motion: reduce)": { animation: phase === "idle" ? "none" : animation },
      }}
    >
      <SeaImage n={c.n} size={c.size} />
    </Box>
  );
}

function SeaImage({ n, size }: { n: number; size: number }) {
  // eslint-disable-next-line @next/next/no-img-element -- decorative, randomly chosen background element; not worth next/image's overhead here
  return <img src={seaSrc(n)} alt="" width={size} height={size} draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />;
}

// Jellyfish, seahorses and friends bob gently in place.
function Drifter({ d }: { d: Placed }) {
  const name = `drift_${d.id}`;
  return (
    <Box
      sx={{
        position: "absolute",
        top: `${d.top}%`,
        [d.side]: `${d.edge}%`,
        width: d.size,
        height: d.size,
        pointerEvents: "none",
        zIndex: 1,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))",
        animation: `${name} ${d.duration}s ease-in-out ${d.delay}s infinite`,
        [`@keyframes ${name}`]: {
          "0%, 100%": { transform: `translateY(0) rotate(${(d.tilt / 2).toFixed(1)}deg)` },
          "50%": { transform: `translateY(-18px) rotate(${(-d.tilt / 2).toFixed(1)}deg)` },
        },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    >
      <SeaImage n={d.n} size={d.size} />
    </Box>
  );
}

function SeabedItem({ b }: { b: Placed }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: `${b.top}%`,
        [b.side]: b.edge,
        width: b.size,
        height: b.size,
        pointerEvents: "none",
        zIndex: 1,
        transform: `rotate(${b.tilt.toFixed(1)}deg)`,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
      }}
    >
      <SeaImage n={b.n} size={b.size} />
    </Box>
  );
}

// The pearl shell at the bottom of the section: click it and it lets out a burst of bubbles.
function PearlShell() {
  const [bursts, setBursts] = useState<number[]>([]);
  return (
    <Box
      onClick={() => setBursts((list) => [...list.slice(-2), Date.now()])}
      role="button"
      aria-label="A pearl shell, click it"
      sx={{
        position: "absolute",
        top: "92%",
        left: -10,
        width: 52,
        height: 52,
        cursor: "pointer",
        pointerEvents: "auto",
        zIndex: 1,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
        "&:active": { transform: "scale(1.12)" },
        transition: "transform 0.2s ease-out",
      }}
    >
      <SeaImage n={PEARL_SHELL} size={52} />
      {bursts.map((key) => (
        <BubbleBurst key={key} originSide="left" originOffset={50} />
      ))}
    </Box>
  );
}

// A creature darts off toward the edge it's already heading when clicked, then resumes its usual
// cruising loop. Shrinking the keyframe animation's duration would jump it to an unrelated point in the
// cycle, so instead this captures its real on-screen position, freezes the keyframe animation, and
// drives a plain CSS transition from that exact point out to the edge.
const DASH_TRANSITION_S = 0.85;
const DASH_MS = 900;

function SwimmingCreature({ f }: { f: Swimmer }) {
  const animName = `seaSwim_${f.id}`;
  const ref = useRef<HTMLDivElement>(null);
  const [dashing, setDashing] = useState(false);
  const [dashPos, setDashPos] = useState<{ left: number; top: number } | null>(null);
  // Mirror the picture when it would otherwise swim tail first.
  const heading: Face = f.reverse ? "left" : "right";
  const mirror = heading !== f.face;

  const handleClick = () => {
    const el = ref.current;
    const parent = el?.offsetParent as HTMLElement | null;
    if (!el || !parent || dashing) return;
    const elRect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const fromLeft = elRect.left - parentRect.left;
    const fromTop = elRect.top - parentRect.top;
    const toLeft = f.reverse ? -150 : parentRect.width + 150;

    setDashing(true);
    setDashPos({ left: fromLeft, top: fromTop });
    requestAnimationFrame(() => requestAnimationFrame(() => setDashPos({ left: toLeft, top: fromTop })));
    setTimeout(() => {
      setDashing(false);
      setDashPos(null);
    }, DASH_MS);
  };

  return (
    <Box
      ref={ref}
      onClick={handleClick}
      role="button"
      aria-label="A fish, click it"
      sx={{
        position: "absolute",
        top: dashing ? dashPos?.top ?? `${f.top}%` : `${f.top}%`,
        left: dashing ? dashPos?.left ?? undefined : undefined,
        width: f.size,
        height: f.size,
        cursor: "pointer",
        pointerEvents: "auto",
        zIndex: 1,
        filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.35))",
        transform: `${mirror ? "scaleX(-1) " : ""}rotate(${f.tilt.toFixed(1)}deg)`,
        transition: dashing ? `left ${DASH_TRANSITION_S}s cubic-bezier(0.3,0,0.7,1)` : "none",
        animation: dashing ? "none" : `${animName} ${f.duration.toFixed(1)}s ease-in-out ${f.delay.toFixed(1)}s infinite`,
        [`@keyframes ${animName}`]: {
          "0%": { left: f.reverse ? "104%" : "-10%", top: `${f.top}%` },
          "25%": { top: `${(f.top - f.bob).toFixed(1)}%` },
          "50%": { left: "50%", top: `${(f.top + f.bob).toFixed(1)}%` },
          "75%": { top: `${(f.top - f.bob).toFixed(1)}%` },
          "100%": { left: f.reverse ? "-10%" : "104%", top: `${f.top}%` },
        },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    >
      <SeaImage n={f.n} size={f.size} />
    </Box>
  );
}

export default function OceanDecorations() {
  const [bubbles, setBubbles] = useState<Bubble[] | null>(null);
  const [sea, setSea] = useState<ReturnType<typeof randomSea> | null>(null);

  useEffect(() => {
    setBubbles(randomBubbles());
    setSea(randomSea());
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
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative, randomly-sized background element; not worth next/image's overhead here */}
          <img src={PHOTO_SRC[b.kind]} alt="" width={b.size} height={b.size} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
        </Box>
      ))}

      </Box>

      {/* The sea life renders as siblings of the bubble layer above, not nested inside it: that
          layer's zIndex:-1 establishes its own stacking context, which traps every descendant at
          "-1" no matter what z-index they're individually given, so clicks on them were swallowed by
          invisible layout spacers from the card grid painting above. */}
      {sea?.swimmers.map((f) => <SwimmingCreature key={f.id} f={f} />)}
      {sea?.drifters.map((d) => <Drifter key={d.id} d={d} />)}
      {sea?.seabed.map((b) => <SeabedItem key={b.id} b={b} />)}
      {sea?.crawlers.map((c) => <Crawler key={c.id} c={c} />)}
      <PearlShell />
    </>
  );
}
