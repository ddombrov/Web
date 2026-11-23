"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";

type BubbleKind = "css" | "photo1" | "photo2";

type Bubble = { top: string; side: "left" | "right"; offset: number; size: number; duration: number; delay: number; rise: number; sway: number; kind: BubbleKind };

const PHOTO_SRC: Record<BubbleKind, string> = {
  css: "/backgrounds/bubble-blue.webp",
  photo1: "/backgrounds/bubble-blue.webp",
  photo2: "/backgrounds/bubble-blue.webp",
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
            animation: `shellBubble_${b.id} ${b.duration}s ease-out ${b.delay}s forwards`,
            [`@keyframes shellBubble_${b.id}`]: {
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
  { n: 66, face: "left", size: 140, depth: "deep" },
  { n: 67, face: "left", size: 36, depth: "surface" },
  { n: 68, face: "left", size: 58, depth: "deep" },
  { n: 69, face: "left", size: 50, depth: "surface" },
  { n: 70, face: "left", size: 46, depth: "surface" },
  { n: 71, face: "left", size: 70, depth: "mid" },
  { n: 73, face: "left", size: 48, depth: "deep" },
  { n: 75, face: "left", size: 50, depth: "surface" },
];
// Some drawings have the body on a slant; these turn them level (degrees, clockwise), measured from each
// picture's outline, so every fish swims flat along the page.
const LEVEL: Record<number, number> = {
  4: 24.5, 14: -8.7, 17: -4, 24: 28.5, 27: -5.3, 28: 12, 29: 4.2, 34: 24.9, 48: 10, 53: -3.1, 57: 3.6, 61: 20.1, 62: 7.4, 66: 16.9, 67: 5, 71: 15.2,
};
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
// Shells (they blow bubbles when clicked) and coral decorate the edges.
const SHELLS: { n: number; size: number }[] = [{ n: 5, size: 44 }, { n: 16, size: 40 }, { n: 36, size: 44 }, { n: 42, size: 48 }];
const CORAL: { n: number; size: number }[] = [{ n: 9, size: 52 }, { n: 23, size: 54 }, { n: 72, size: 54 }];
const PEARL_SHELL = 58;
const seaSrc = (n: number) => `/sea/${String(n).padStart(2, "0")}.webp`;

const SWIMMER_COUNT = 24, DRIFTER_COUNT = 5, CRAWLER_COUNT = 6, SHELL_COUNT = 3, CORAL_COUNT = 3;

function pickSome<T>(list: T[], count: number): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

type Swimmer = { id: string; n: number; face: Face; size: number; depth: Depth; top: number; tilt: number; duration: number; delay: number; reverse: boolean; bob: number; bobDuration: number };
type StillKind = "drifter" | "crawler" | "shell" | "coral" | "pearl";
type Still = { id: string; kind: StillKind; n: number; size: number; tilt: number; duration: number; delay: number };
type Placed = Still & { x: number; y: number; side: "left" | "right" };

// A fresh mix every visit. Swimmers cross the section at their depth; everything else stays in one spot,
// which is chosen later from the real layout so it never sits on top of a card, a photo or the timeline.
function randomSea() {
  const swimmers: Swimmer[] = pickSome(SWIMMERS, SWIMMER_COUNT).map((s, i) => ({
    ...s,
    id: `s${i}`,
    top: DEPTH_BANDS[s.depth][0] + Math.random() * (DEPTH_BANDS[s.depth][1] - DEPTH_BANDS[s.depth][0]),
    // Finned animals swim level, straight across the page.
    tilt: 0,
    duration: 38 + Math.random() * 30 + s.size * 0.15,
    delay: -Math.random() * 60,
    reverse: Math.random() < 0.5,
    bob: 4 + Math.random() * 6,
    bobDuration: 3 + Math.random() * 3,
  }));
  const still = (kind: StillKind, list: { n: number; size: number }[], count: number): Still[] =>
    pickSome(list, count).map((c, i) => ({
      ...c,
      kind,
      id: `${kind}${i}`,
      tilt: 0,
      duration: 3.5 + Math.random() * 3,
      delay: -Math.random() * 6,
    }));
  return {
    swimmers,
    still: [
      ...still("drifter", DRIFTERS, DRIFTER_COUNT),
      ...still("crawler", CRAWLERS, CRAWLER_COUNT),
      ...still("shell", SHELLS, SHELL_COUNT),
      ...still("coral", CORAL, CORAL_COUNT),
      { id: "pearl", kind: "pearl" as const, n: PEARL_SHELL, size: 52, tilt: 0, duration: 5, delay: 0 },
    ],
  };
}

type Rect = { left: number; top: number; right: number; bottom: number };
const overlaps = (a: Rect, b: Rect) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
const GAP = 16;

// Finds a spot for each resting creature inside `layer` that is clear of the cards, photos and timeline
// text in the section, and of the other creatures. One that cannot find room is left out.
type Area = { width: number; height: number; blocked: Rect[] };

// The free area of the section: its size, and everything a resting creature must keep clear of.
function measureArea(layer: HTMLElement): Area | null {
  const box = layer.getBoundingClientRect();
  const width = box.width, height = box.height;
  const section = layer.parentElement;
  if (!section || width < 200 || height < 200) return null;
  const toLocal = (r: DOMRect): Rect => ({
    left: r.left - box.left - GAP, top: r.top - box.top - GAP, right: r.right - box.left + GAP, bottom: r.bottom - box.top + GAP,
  });
  // Anything that shows text or a picture: cards, quotes, headings, dates, chips, links and photos.
  const content = [...section.querySelectorAll("[data-ocean-avoid], img, svg, p, h1, h2, h3, h4, h5, h6, li, blockquote, span, a, button")]
    .filter((el) => (el.tagName === "IMG" ? !/\/sea\/|bubble/.test(el.getAttribute("src") ?? "") : el.tagName === "svg" || el.hasAttribute("data-ocean-avoid") || !!el.textContent?.trim()))
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width > 0 && r.height > 0);
  const blocked: Rect[] = [
    ...content.map(toLocal),
    // The timeline line, its dates and the term headings run down the middle.
    { left: width / 2 - 120, top: 0, right: width / 2 + 120, bottom: height },
  ];
  return { width, height, blocked };
}

// A random clear spot anywhere in the section (any height), away from the content and the other creatures.
function findSpot(item: Still, area: Area, others: Placed[]): Placed | null {
  const { width, height, blocked } = area;
  for (let attempt = 0; attempt < 120; attempt++) {
    const x = 4 + Math.random() * (width - item.size - 8);
    const y = height * (0.03 + Math.random() * 0.94);
    const spot = { left: x, top: y, right: x + item.size, bottom: y + item.size };
    if (blocked.some((b) => overlaps(spot, b)) || others.some((o) => o.id !== item.id && overlaps(spot, { left: o.x - GAP, top: o.y - GAP, right: o.x + o.size + GAP, bottom: o.y + o.size + GAP }))) continue;
    return { ...item, x, y, side: x + item.size / 2 < width / 2 ? "left" : "right" };
  }
  return null;
}

function placeStill(items: Still[], layer: HTMLElement): Placed[] {
  const area = measureArea(layer);
  if (!area) return [];
  const placed: Placed[] = [];
  for (const item of items) {
    const spot = findSpot(item, area, placed);
    if (spot) placed.push(spot);
  }
  return placed;
}

function SeaImage({ n, size, level = 0 }: { n: number; size: number; level?: number }) {
  // eslint-disable-next-line @next/next/no-img-element -- decorative, randomly chosen background element; not worth next/image's overhead here
  return <img src={seaSrc(n)} alt="" width={size} height={size} draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", transform: level ? `rotate(${level}deg)` : undefined }} />;
}

// A crawler you can click: it freezes for a beat (startled), then scurries off toward its nearer edge and
// fades out, reappearing back at its spot a few seconds later. Every timing below is duplicated between
// the setTimeout schedule and the animation durations on purpose; they have to stay in lockstep.
const FREEZE_MS = 250;
const FLEE_MS = 650;
const HIDDEN_MS = 2200;
const RETURN_MS = 550;

function Crawler({ c, onHidden }: { c: Placed; onHidden: () => void }) {
  const [phase, setPhase] = useState<"idle" | "frozen" | "fleeing" | "returning">("idle");

  useEffect(() => {
    if (phase === "frozen") {
      const t = setTimeout(() => setPhase("fleeing"), FREEZE_MS);
      return () => clearTimeout(t);
    }
    if (phase === "fleeing") {
      const moved = setTimeout(onHidden, FLEE_MS + 50);
      const t = setTimeout(() => setPhase("returning"), FLEE_MS + HIDDEN_MS);
      return () => {
        clearTimeout(moved);
        clearTimeout(t);
      };
    }
    if (phase === "returning") {
      const t = setTimeout(() => setPhase("idle"), RETURN_MS);
      return () => clearTimeout(t);
    }
    // onHidden comes fresh from the parent on every render; only a change of phase should restart the timers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const base = `${c.side === "left" ? "scaleX(-1) " : ""}rotate(${c.tilt.toFixed(1)}deg)`;
  // Left-side crawlers are mirrored, so the same +x step carries every crawler toward its own edge.
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
        left: c.x,
        top: c.y,
        width: c.size,
        height: c.size,
        cursor: "pointer",
        pointerEvents: "auto",
        zIndex: 1,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
        animation,
        [`@keyframes ${names.wiggle}`]: {
          "0%, 100%": { transform: `${base} translate(0, 0)` },
          "50%": { transform: `${base} translate(8px, -2px)` },
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

// Jellyfish, seahorses, the octopus and coral hover gently in place (drifters more than coral), and slip
// out of sight when clicked, coming back a few seconds later.
const GONE_MS = 3000;
function Hovering({ d, onHidden }: { d: Placed; onHidden: () => void }) {
  const name = `hover_${d.id}`;
  const lift = d.kind === "drifter" ? 16 : 5;
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (!gone) return;
    const moved = setTimeout(onHidden, 500);
    const t = setTimeout(() => setGone(false), GONE_MS);
    return () => {
      clearTimeout(moved);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gone]);
  return (
    <Box
      onClick={() => setGone(true)}
      role="button"
      aria-label="A sea creature, click it"
      sx={{
        position: "absolute",
        left: d.x,
        top: d.y,
        width: d.size,
        height: d.size,
        cursor: "pointer",
        pointerEvents: gone ? "none" : "auto",
        zIndex: 1,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))",
        animation: `${name} ${d.duration.toFixed(1)}s ease-in-out ${d.delay.toFixed(1)}s infinite`,
        [`@keyframes ${name}`]: {
          "0%, 100%": { transform: `translateY(0) rotate(${(d.tilt / 2).toFixed(1)}deg)` },
          "50%": { transform: `translateY(-${lift}px) rotate(${(-d.tilt / 2).toFixed(1)}deg)` },
        },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    >
      <Box sx={{ width: "100%", height: "100%", transition: "opacity 0.45s ease, transform 0.45s ease", opacity: gone ? 0 : 1, transform: gone ? "scale(0.4) translateY(20px)" : "none" }}>
        <SeaImage n={d.n} size={d.size} />
      </Box>
    </Box>
  );
}

// A shell: click it and it lets out a burst of bubbles. Each burst rises on its own and is removed once it
// has finished, so clicking again never restarts bubbles that are already on their way up.
const BURST_MS = 5000;
let burstKey = 0;
function Shell({ p }: { p: Placed }) {
  const [bursts, setBursts] = useState<number[]>([]);
  const blow = () => {
    const key = burstKey++;
    setBursts((list) => [...list, key]);
    setTimeout(() => setBursts((list) => list.filter((k) => k !== key)), BURST_MS);
  };
  return (
    <Box
      onClick={blow}
      role="button"
      aria-label="A shell, click it"
      sx={{
        position: "absolute",
        left: p.x,
        top: p.y,
        width: p.size,
        height: p.size,
        cursor: "pointer",
        pointerEvents: "auto",
        zIndex: 1,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
        "&:active": { transform: "scale(1.12)" },
        transition: "transform 0.2s ease-out",
      }}
    >
      <SeaImage n={p.n} size={p.size} />
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

const randomTop = (depth: Depth) => DEPTH_BANDS[depth][0] + Math.random() * (DEPTH_BANDS[depth][1] - DEPTH_BANDS[depth][0]);

function SwimmingCreature({ f }: { f: Swimmer }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dashing, setDashing] = useState(false);
  const [dashLeft, setDashLeft] = useState<number | null>(null);
  // Each pass across the page; after a dash the next one starts fresh from an edge at a new height.
  const [route, setRoute] = useState({ top: f.top, reverse: f.reverse, pass: 0 });
  const animName = `seaSwim_${f.id}_${route.pass}`;
  const bobName = `seaBob_${f.id}`;
  // Mirror the picture when it would otherwise swim tail first.
  const heading: Face = route.reverse ? "left" : "right";
  const mirror = heading !== f.face;

  const handleClick = () => {
    const el = ref.current;
    const parent = el?.offsetParent as HTMLElement | null;
    if (!el || !parent || dashing) return;
    const elRect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const fromLeft = elRect.left - parentRect.left;
    const toLeft = route.reverse ? -250 : parentRect.width + 250;

    setDashing(true);
    setDashLeft(fromLeft);
    requestAnimationFrame(() => requestAnimationFrame(() => setDashLeft(toLeft)));
    setTimeout(() => {
      setDashing(false);
      setDashLeft(null);
      setRoute((r) => ({ top: randomTop(f.depth), reverse: Math.random() < 0.5, pass: r.pass + 1 }));
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
        top: `${route.top.toFixed(1)}%`,
        left: dashing ? dashLeft ?? undefined : undefined,
        width: f.size,
        height: f.size,
        cursor: "pointer",
        pointerEvents: "auto",
        zIndex: 1,
        filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.35))",
        transition: dashing ? `left ${DASH_TRANSITION_S}s cubic-bezier(0.3,0,0.7,1)` : "none",
        // Straight across at a constant height; only the small bob below moves it up and down.
        animation: dashing ? "none" : `${animName} ${f.duration.toFixed(1)}s linear ${(route.pass ? 0 : f.delay).toFixed(1)}s infinite`,
        [`@keyframes ${animName}`]: route.reverse
          ? { "0%": { left: "104%" }, "100%": { left: "-14%" } }
          : { "0%": { left: "-14%" }, "100%": { left: "104%" } },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          animation: `${bobName} ${f.bobDuration.toFixed(1)}s ease-in-out infinite`,
          [`@keyframes ${bobName}`]: {
            "0%, 100%": { transform: `translateY(0) ${mirror ? "scaleX(-1) " : ""}rotate(${f.tilt.toFixed(1)}deg)` },
            "50%": { transform: `translateY(${f.bob.toFixed(1)}px) ${mirror ? "scaleX(-1) " : ""}rotate(${f.tilt.toFixed(1)}deg)` },
          },
          "@media (prefers-reduced-motion: reduce)": { animation: "none", transform: `${mirror ? "scaleX(-1) " : ""}rotate(${f.tilt.toFixed(1)}deg)` },
        }}
      >
        <SeaImage n={f.n} size={f.size} level={LEVEL[f.n]} />
      </Box>
    </Box>
  );
}

export default function OceanDecorations() {
  const [bubbles, setBubbles] = useState<Bubble[] | null>(null);
  const [sea, setSea] = useState<ReturnType<typeof randomSea> | null>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBubbles(randomBubbles());
    setSea(randomSea());
  }, []);

  // Resting creatures are placed from the real layout, and placed again whenever the section changes
  // size (a window resize, or a year being opened or closed), so they stay clear of the cards.
  useEffect(() => {
    const layer = layerRef.current;
    if (!sea || !layer) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const place = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setPlaced(placeStill(sea.still, layer)), 400);
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(layer);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [sea]);

  // A creature that went out of sight comes back at a new random spot, clear of the content and the others.
  const respawn = (id: string) => {
    const layer = layerRef.current;
    const area = layer && measureArea(layer);
    if (!area) return;
    setPlaced((list) => list.map((p) => (p.id === id ? findSpot(p, area, list) ?? p : p)));
  };

  return (
    <>
      <Box ref={layerRef} aria-hidden sx={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
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
      {placed.map((p) =>
        p.kind === "crawler" ? <Crawler key={p.id} c={p} onHidden={() => respawn(p.id)} />
        : p.kind === "pearl" || p.kind === "shell" ? <Shell key={p.id} p={p} />
        : <Hovering key={p.id} d={p} onHidden={() => respawn(p.id)} />
      )}
    </>
  );
}
