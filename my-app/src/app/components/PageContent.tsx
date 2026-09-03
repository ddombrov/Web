"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, LayoutGroup } from "framer-motion";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "./icons/GitHubIcon";
import Reveal from "./Reveal";
import Hi from "./Highlight";
import CollapsibleEarlyChapters from "./CollapsibleEarlyChapters";
import TimelineRow, { YearMarker } from "./TimelineRow";
import CourseList from "./CourseList";
import { terms } from "./courseData";
import { coopReports, type CoopReport, type ReportPhoto } from "./coopReports";
import { skillIcons } from "./skillIcons";
import ContactForm from "./ContactForm";
import { textShadow, dropShadow, chipSx, photoFrameSx } from "./styles";
import { useJourneyFilter, tagMatchesFilter } from "./JourneyFilterContext";
import { useLightbox } from "./Lightbox";
import { GalleryPortalProvider, useGalleryPortal } from "./GalleryPortalContext";
import JourneyGalleryOverlay from "./JourneyGalleryOverlay";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// The same scroll-linked scale-up + darken Hero uses on the mountain photo
// (and ParallaxBand used before it), for a section's own background image.
// Ramps from 0 (section just touching the bottom of the viewport) to 1
// (section's top has reached the top of the viewport) — tied to how far
// the section has scrolled INTO view, not how far it's scrolled past.
// That works the same whether there's a lot of page left below it (About)
// or none at all (Contact, the very last section) — a "past the top"
// trigger can mathematically never fire for Contact, since the page has
// no more room to scroll once Contact's short body is fully in view.
function useSectionZoom() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        const el = ref.current;
        if (el) {
          const vh = window.innerHeight;
          const raw = (vh - el.getBoundingClientRect().top) / vh;
          setProgress(Math.min(Math.max(raw, 0), 1));
        }
        rafId.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return { ref, scale: 1 + progress * 0.3, brightness: 1 - progress * 0.3 };
}

// Deterministically spreads each entry's flight start time across roughly
// a second, so cards/chips from different jobs visibly launch one after
// another instead of every matching element taking off in the same frame
// — the whole point of seeing a badge leave its specific origin card.
function launchDelay(id: string, spreadSeconds = 1.1) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000 * spreadSeconds;
}

// Each section continues the descent from the hero's dirt-brown fade
// (#332D14) down toward near-black at Contact, so sections read as distinct
// stops on one journey rather than one flat color for the whole page. The
// cave photo is About's own background (same pattern as Hero's mountain
// photo), and the ocean photo is Contact's own background — each photo is
// shown in full (no fade tinting its own top/bottom edges); the color
// transitions live in dedicated Boxes strictly before/after the photo.
const dirtColorEnd = "#332D14";
// A stone-gray beat between the hero's dirt brown and the cave photo.
const cadetGrey = "#91A3B0";
// The journey's own background trades the dirt brown for an ocean feel,
// deepening from a lighter ocean blue to a darker one across the whole
// (very long) timeline.
const oceanStart = "#123044";
const oceanEnd = "#0A1F2E";
const experienceBg = `linear-gradient(180deg, ${oceanStart} 0%, ${oceanEnd} 100%)`;
// A darker blue beat between the journey's navy end and the ocean photo.
const deepBlue = "#050D14";

// A plain multi-stop linear-gradient is piecewise-linear: the rate of
// color change jumps abruptly at every stop, and the eye reads that slope
// discontinuity as a visible seam (a Mach band) even where the color
// itself is perfectly continuous — which is exactly what made the "held
// color -> linear ramp -> held color" transitions still look like they
// had a hard edge at each joint. Smoothstep's derivative is zero at both
// t=0 and t=1, so sampling it into enough stops to approximate a curve
// (rather than relying on CSS's own linear interpolation between just a
// few stops) gives a transition that's flat-feeling at both ends and
// smooth throughout, with no perceptible joint anywhere.
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

// An eased linear-gradient's stop list (no "linear-gradient(...)" wrapper)
// smoothly ramping from one solid color to another. startPct/endPct place
// the whole curve within a sub-range of the gradient (e.g. 0-70% instead of
// 0-100%), so it can be followed or preceded by other stops in the same
// gradient — used to fit a color-ease and an alpha-fade into one Box.
function easedColorStops(fromHex: string, toHex: string, steps = 16, startPct = 0, endPct = 100) {
  const a = hexToRgb(fromHex);
  const b = hexToRgb(toHex);
  const stops: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const e = smoothstep(t);
    const r = Math.round(a.r + (b.r - a.r) * e);
    const g = Math.round(a.g + (b.g - a.g) * e);
    const bl = Math.round(a.b + (b.b - a.b) * e);
    const pct = startPct + (endPct - startPct) * t;
    stops.push(`rgb(${r}, ${g}, ${bl}) ${pct.toFixed(1)}%`);
  }
  return stops.join(", ");
}

// Same easing, but ramping a single color's opacity (transparent <-> solid)
// instead of blending between two colors — used to fade a photo's own edge
// into (or out of) the color that sits next to it.
function easedAlphaStops(hex: string, fromAlpha: number, toAlpha: number, steps = 16, startPct = 0, endPct = 100) {
  const { r, g, b } = hexToRgb(hex);
  const stops: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const e = smoothstep(t);
    const alpha = fromAlpha + (toAlpha - fromAlpha) * e;
    const pct = startPct + (endPct - startPct) * t;
    stops.push(`rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)}) ${pct.toFixed(1)}%`);
  }
  return stops.join(", ");
}

// A transition Box's gradient, with its trailing `fadeOutPct` of height
// fading the arrived color down to fully transparent instead of staying
// solid — paired with a negative margin pulling the next section's photo
// up to overlap that fading tail, so the box's own fade-out and the
// photo's own fade-in blend together instead of meeting at a hard edge.
function transitionGradient(fromHex: string, toHex: string, fadeOutPct = 0) {
  const colorEnd = 100 - fadeOutPct;
  const parts = [easedColorStops(fromHex, toHex, 16, 0, colorEnd)];
  if (fadeOutPct > 0) parts.push(easedAlphaStops(toHex, 1, 0, 16, colorEnd, 100));
  return parts.join(", ");
}

// The mirror of transitionGradient: the leading `fadeInPct` of height
// fades UP from transparent into the starting color, paired with a
// negative margin pulling this box up to overlap the PREVIOUS section's
// photo's own fade-out tail.
function transitionGradientFadeIn(fromHex: string, toHex: string, fadeInPct = 0) {
  const colorStart = fadeInPct;
  const parts: string[] = [];
  if (fadeInPct > 0) parts.push(easedAlphaStops(fromHex, 0, 1, 16, 0, fadeInPct));
  parts.push(easedColorStops(fromHex, toHex, 16, colorStart, 100));
  return parts.join(", ");
}

function skillIcon(label: string) {
  const Icon = skillIcons[label];
  return Icon ? <Icon size={14} /> : undefined;
}

// Each chip is individually flight-tracked (its own layoutId) so that when
// the Skills filter is active, it can detach from this card and portal
// straight into the gallery overlay's skills cloud — Framer Motion animates
// the move automatically since it's the same tracked element, just
// re-parented. Outside of that filter it just renders in place as before.
function SkillChips({ items, entryId }: { items: string[]; entryId: string }) {
  const { filter, prevFilter } = useJourneyFilter();
  const { skillsTarget } = useGalleryPortal();
  const flying = filter === "skills";
  const wasFlying = prevFilter === "skills";
  const returning = wasFlying && !flying;
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
      {items.map((s, i) => {
        const chipId = `chip-${entryId}-${i}-${slug(s)}`;
        const chipEl = (
          <motion.div
            key={chipId}
            layoutId={chipId}
            transition={
              returning
                ? { duration: 0.4, ease: [0.4, 0, 1, 1] }
                : { duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: launchDelay(entryId) + i * 0.12 }
            }
          >
            <Chip label={s} size="small" variant="outlined" icon={skillIcon(s)} sx={chipSx} />
          </motion.div>
        );
        if (flying) {
          return skillsTarget ? createPortal(chipEl, skillsTarget, chipId) : null;
        }
        return chipEl;
      })}
    </Box>
  );
}

// A real photo, wrapped so hovering it (not the card around it) triggers a
// gentle zoom — used for every actual photograph/certificate on the page.
// Clicking opens it full-size in the shared Lightbox instead of navigating
// anywhere.
function PhotoFrame({
  src,
  alt,
  width,
  height,
  round = false,
  crop = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  round?: boolean;
  // Forces the image to fill the exact width/height given (cropping via
  // object-fit instead of respecting its own aspect ratio) — used where
  // several differently-shaped photos need to sit in one identically
  // sized slot, like the layers of a PhotoStack.
  crop?: boolean;
}) {
  const { open } = useLightbox();
  return (
    <Box
      component="button"
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        open({ src, alt, width, height });
      }}
      aria-label={`View larger image: ${alt}`}
      sx={{ all: "unset", cursor: "zoom-in", ...photoFrameSx, ...(round && { borderRadius: "50%" }), ...(crop && { display: "block" }) }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={
          crop
            ? { display: "block", objectFit: "cover", width: "100%", height: "100%" }
            : { display: "block", objectFit: "cover", maxWidth: "100%", height: "auto" }
        }
      />
    </Box>
  );
}

// The billiards project's four table diagrams sit in one 2x2 grid image —
// each one is still individually clickable through the same Lightbox.
function GridImageButton({ src, alt }: { src: string; alt: string }) {
  const { open } = useLightbox();
  return (
    <Box
      component="button"
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        open({ src, alt, width: 600, height: 600 });
      }}
      aria-label={`View larger image: ${alt}`}
      sx={{ all: "unset", cursor: "zoom-in", display: "block" }}
    >
      <Image src={src} alt={alt} width={150} height={150} style={{ width: "100%", height: "auto", display: "block" }} />
    </Box>
  );
}

// Every kind of milestone (education, club, co-op, award, certification,
// volunteer role, recommendation) renders through this same entry so the
// whole university journey reads as one continuous, chronologically
// ordered, alternating line. Each entry lives in its own hoverable card,
// slides in from the side it sits on as it scrolls into view and slides
// back out on the way past (once={false}), and its date is shown on the
// rail rather than inside the card — the card itself carries only what
// happened, not when.
function TimelineEntry({
  logo,
  logoAlt,
  logoOnWhite = false,
  tag,
  title,
  org,
  location,
  startDate,
  endDate,
  companyUrl,
  githubUrl,
  skills = [],
  side = "left",
  isLast = false,
  aside,
  reportKey,
  onCardClick,
  forceWide = false,
  hideStartDate = false,
  children,
}: {
  logo?: string;
  logoAlt?: string;
  // Wraps the logo in a white chip — for logos that are transparent PNGs
  // and otherwise disappear against the card's dark background.
  logoOnWhite?: boolean;
  tag?: string;
  title: string;
  org?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  companyUrl?: string;
  githubUrl?: string;
  skills?: string[];
  side?: "left" | "right";
  isLast?: boolean;
  aside?: React.ReactNode;
  reportKey?: string;
  onCardClick?: () => void;
  // For entries whose click handler is managed by the caller (a course
  // term, a bio card) rather than the internal report toggle — pass the
  // caller's own expanded state through so the row still widens instead of
  // growing tall in a narrow column and visually bleeding into the entry
  // below it.
  forceWide?: boolean;
  // The rail's date caption is skipped when the entry right before it
  // already shows the same month/year — startDate itself is left alone
  // (still used to key this entry's animations), only the rail label hides.
  hideStartDate?: boolean;
  children?: React.ReactNode;
}) {
  const { filter, prevFilter } = useJourneyFilter();
  const { cardsTarget } = useGalleryPortal();
  const [expanded, setExpanded] = useState(false);
  const matches = tagMatchesFilter(tag, skills.length > 0, filter);
  const matchedPrev = tagMatchesFilter(tag, skills.length > 0, prevFilter);
  const entryId = slug(`${title}-${org ?? ""}-${startDate}`);
  const cardFlies = Boolean(filter) && (filter === "projects" || filter === "experience") && matches;
  const cardFlewPrev = Boolean(prevFilter) && (prevFilter === "projects" || prevFilter === "experience") && matchedPrev;
  const cardReturning = cardFlewPrev && !cardFlies;
  const report = reportKey ? coopReports[reportKey] : undefined;
  const cardClickable = Boolean(githubUrl) || Boolean(report) || Boolean(onCardClick);

  const handleCardClick = () => {
    if (githubUrl) {
      window.open(githubUrl, "_blank", "noopener,noreferrer");
    } else if (report) {
      setExpanded((e) => !e);
    } else if (onCardClick) {
      onCardClick();
    }
  };
  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const cardBody = (
    <motion.div
      layoutId={`card-${entryId}`}
      layout
      transition={
        cardReturning
          ? { duration: 0.45, ease: [0.4, 0, 1, 1] }
          : { duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: launchDelay(entryId, 0.6) }
      }
    >
      <Box
        onClick={cardClickable ? handleCardClick : undefined}
        onKeyDown={cardClickable ? handleCardKeyDown : undefined}
        role={cardClickable ? "button" : undefined}
        tabIndex={cardClickable ? 0 : undefined}
        aria-label={
          githubUrl
            ? `${title}: view on GitHub`
            : report
            ? `${title}: ${expanded ? "hide" : "read"} full work term report`
            : undefined
        }
        sx={{
          bgcolor: "rgba(255,255,255,0.045)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 3,
          p: { xs: 2.5, md: 3 },
          width: { md: cardFlies ? 420 : "auto" },
          maxWidth: cardFlies ? "88vw" : "none",
          cursor: cardClickable ? "pointer" : "default",
          transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            borderColor: "rgba(255,255,255,0.22)",
            bgcolor: "rgba(255,255,255,0.07)",
            boxShadow: "0 20px 40px -20px rgba(0,0,0,0.6)",
          },
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexWrap: "wrap" }}>
          {logo && (
            logoOnWhite ? (
              <Box sx={{ width: 56, height: 56, borderRadius: 1.5, bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, p: 0.75, filter: dropShadow }}>
                <Image src={logo} alt={logoAlt ?? ""} width={44} height={44} style={{ objectFit: "contain" }} />
              </Box>
            ) : (
              <Image src={logo} alt={logoAlt ?? ""} width={56} height={56} style={{ objectFit: "contain", filter: dropShadow, flexShrink: 0 }} />
            )
          )}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            {tag && (
              <Typography variant="overline" sx={{ color: "secondary.main", textShadow, letterSpacing: 1.5, display: "block", lineHeight: 1.4 }}>
                {tag}
              </Typography>
            )}
            <Typography variant="h5" component="h3" sx={{ color: "#fff", textShadow }}>
              {title}
            </Typography>
            {org && (
              <Typography variant="body2" fontStyle="italic" sx={{ color: "rgba(255,255,255,0.8)", textShadow }}>
                {org}
                {companyUrl && (
                  <Box
                    component="a"
                    href={companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Company LinkedIn page"
                    onClick={(e) => e.stopPropagation()}
                    sx={{ color: "secondary.main", ml: 0.75, verticalAlign: "middle", display: "inline-flex" }}
                  >
                    <LinkedInIcon fontSize="small" />
                  </Box>
                )}
              </Typography>
            )}
            {location && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, mt: 0.5 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.55)" }} />
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", textShadow }}>
                  {location}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {skills.length > 0 && <SkillChips items={skills} entryId={entryId} />}

        {children}

        {report && (
          <Collapse in={expanded} unmountOnExit>
            <WorkTermReport report={report} />
          </Collapse>
        )}
      </Box>
    </motion.div>
  );

  if (cardFlies) {
    return (
      <TimelineRow side={side} startDate={hideStartDate ? undefined : startDate} endDate={endDate} isLast={isLast}>
        <Box sx={{ visibility: "hidden" }} aria-hidden />
        {cardsTarget && createPortal(cardBody, cardsTarget, `card-${entryId}`)}
      </TimelineRow>
    );
  }

  const revealedAside =
    aside && !(expanded || forceWide) ? (
      <Reveal direction={side === "left" ? "right" : "left"} once={false}>
        {aside}
      </Reveal>
    ) : undefined;

  return (
    <TimelineRow
      side={side}
      startDate={hideStartDate ? undefined : startDate}
      endDate={endDate}
      isLast={isLast}
      aside={revealedAside}
      wide={expanded || forceWide}
    >
      <Reveal direction={side} once={false}>
        {cardBody}
      </Reveal>
    </TimelineRow>
  );
}

// The full Introduction / Duties / Goals / Conclusion text of a real
// University of Guelph co-op work term report, expanded in place under its
// timeline entry rather than linking out to a separate page.
// Caps a real photo's display size to fit neatly in the report while
// keeping its actual aspect ratio, rather than stretching or cropping it.
function scaledSize(w: number, h: number, maxW = 420, maxH = 520) {
  const scale = Math.min(maxW / w, maxH / h, 1);
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

// How far each photo behind the front one sits, at rest and fanned out on
// hover — reused across every stack rather than randomized per instance.
const stackOffsets = [
  { x: 32, y: 24, r: 5, hx: 72, hy: 36, hr: 9 },
  { x: 58, y: 44, r: 9, hx: 130, hy: 66, hr: 16 },
  { x: 84, y: 64, r: 13, hx: 188, hy: 96, hr: 23 },
];

// The report's photos as a stack — every layer forced to the same size
// (shaped like the first photo, cropping the rest to match) so none of
// them look undersized next to the front one. Sitting behind the front
// photo at a slight fan that spreads further apart on hover so the ones
// behind become reachable, and hovering any one of them brings it to the
// front instead. Each layer is its own PhotoFrame, so clicking any visible
// corner opens that specific photo.
function PhotoStack({ photos }: { photos: ReportPhoto[] }) {
  const shown = photos.slice(0, 4);
  const [frontSrc, setFrontSrc] = useState(shown[0].src);
  const back = shown.filter((p) => p.src !== frontSrc);
  const { width, height } = scaledSize(shown[0].width, shown[0].height, 400, 340);

  // A brief hold before a hovered photo takes over the front spot — without
  // it, the moment one comes forward it's sitting right under a cursor that
  // hasn't moved, which immediately re-triggers hover on whichever photo is
  // now underneath and the two keep trading places.
  const swapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (swapTimeout.current) clearTimeout(swapTimeout.current);
  }, []);
  const scheduleSwap = (src: string) => {
    if (swapTimeout.current) clearTimeout(swapTimeout.current);
    swapTimeout.current = setTimeout(() => setFrontSrc(src), 400);
  };
  const cancelSwap = () => {
    if (swapTimeout.current) {
      clearTimeout(swapTimeout.current);
      swapTimeout.current = null;
    }
  };

  return (
    <Box className="photo-stack" sx={{ position: "relative", width, height: height + 28 }}>
      {shown.map((photo) => {
        const isFront = photo.src === frontSrc;
        const backIndex = back.findIndex((p) => p.src === photo.src);
        const o = stackOffsets[backIndex % stackOffsets.length];
        return (
          <Box
            key={photo.src}
            onMouseEnter={() => !isFront && scheduleSwap(photo.src)}
            onMouseLeave={cancelSwap}
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: isFront ? shown.length : back.length - backIndex,
              cursor: isFront ? "default" : "pointer",
              transform: isFront ? "none" : `translate(${o.x}px, ${o.y}px) rotate(${o.r}deg)`,
              transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
              ...(!isFront && {
                ".photo-stack:hover &": {
                  transform: `translate(${o.hx}px, ${o.hy}px) rotate(${o.hr}deg)`,
                },
              }),
            }}
          >
            <PhotoFrame src={photo.src} alt={photo.alt} width={width} height={height} crop />
          </Box>
        );
      })}
    </Box>
  );
}

function WorkTermReport({ report }: { report: CoopReport }) {
  const sections: { heading: string; paragraphs: string[]; photo: ReportPhoto }[] = [
    { heading: "Introduction", paragraphs: report.intro, photo: report.photos[0] },
    { heading: "Duties", paragraphs: report.duties, photo: report.photos[1] },
    { heading: "Goals", paragraphs: report.goals, photo: report.photos[2] },
    { heading: "Conclusion", paragraphs: report.conclusion, photo: report.photos[3] },
  ];
  return (
    <Stack spacing={4} sx={{ mt: 3, pt: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      {sections.map((s) => {
        const { width, height } = scaledSize(s.photo.width, s.photo.height);
        return (
          <Box key={s.heading}>
            <Box sx={{ mb: 2 }}>
              <PhotoFrame src={s.photo.src} alt={s.photo.alt} width={width} height={height} />
            </Box>
            <Typography variant="overline" sx={{ color: "secondary.main", textShadow, letterSpacing: 1.5, display: "block" }}>
              {s.heading}
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 0.5 }}>
              {s.paragraphs.map((p, i) => (
                <Typography key={i} variant="body2" sx={{ color: "#EDEFF3", textShadow, lineHeight: 1.7 }}>
                  {p}
                </Typography>
              ))}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}

// A plain "[Season] [Year]" marker sitting on the rail right above that
// term's coursework card — just a label, no card of its own, so it reads
// as a section header rather than another entry competing for space.
function TermHeader({ label }: { label: string }) {
  const term = terms.find((t) => t.label === label);
  if (!term || term.courses.length === 0) return null;
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "70px 1fr", md: "1fr 130px 1fr" }, columnGap: { xs: 2, md: 4 }, mb: 1.5 }}>
      <Box sx={{ gridColumn: { xs: "1", md: "2" }, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "2px", height: 22, bgcolor: "rgba(255,255,255,0.18)" }} />
      </Box>
      <Box sx={{ gridColumn: { xs: "2", md: "1 / -1" }, textAlign: "center" }}>
        <Typography variant="subtitle1" sx={{ color: "rgba(255,255,255,0.6)", textShadow, fontWeight: 700, letterSpacing: 1 }}>
          {term.label}
        </Typography>
      </Box>
    </Box>
  );
}

// A term's coursework, treated exactly like a job entry — "Student" as the
// title, University of Guelph as the place of "employment" — so it reads
// as a real card in the alternating timeline rather than a different kind
// of thing. Co-op terms with nothing left to list here (their job already
// has its own full entry) render nothing at all.
function TermCourseworkEntry({
  label,
  side,
  isLast = false,
  hideStartDate = false,
}: {
  label: string;
  side: "left" | "right";
  isLast?: boolean;
  hideStartDate?: boolean;
}) {
  const term = terms.find((t) => t.label === label);
  const [expanded, setExpanded] = useState(false);
  if (!term || term.courses.length === 0) return null;
  return (
    <TimelineEntry
      side={side}
      tag={term.upcoming ? "Upcoming" : "Education"}
      title="Student"
      org="University of Guelph"
      location="Guelph, Ontario"
      startDate={term.date}
      onCardClick={() => setExpanded((e) => !e)}
      forceWide={expanded}
      isLast={isLast}
      hideStartDate={hideStartDate}
    >
      <CourseList courses={term.courses} expanded={expanded} />
    </TimelineEntry>
  );
}

// The SOCIS President entry — the day-to-day bullets stay visible, but the
// longer reflection on taking over the club and its most successful events
// only shows once the card itself is clicked.
function SocisPresidentEntry() {
  const [expanded, setExpanded] = useState(false);
  return (
    <TimelineEntry
      logo="/socisLogo.png"
      logoAlt="SOCIS logo"
      logoOnWhite
      side="left"
      tag="Extracurriculars"
      title="SOCIS President"
      location="Guelph, Ontario"
      startDate="Dec 2023"
      endDate="May 2024"
      skills={["Time Management", "Public Speaking", "Leadership", "Budgeting", "Event Planning"]}
      aside={
        <PhotoStack
          photos={[
            { src: "/group.jpg", alt: "Image of computing community", width: 4032, height: 1444 },
            { src: "/socis_president_a.jpg", alt: "SOCIS members with pizza at an election event", width: 4080, height: 3072 },
            { src: "/socis_president_b.png", alt: "SOCIS President photo", width: 895, height: 895 },
            { src: "/socis_president_c.png", alt: "SOCIS President photo", width: 889, height: 886 },
          ]}
        />
      }
      onCardClick={() => setExpanded((e) => !e)}
      forceWide={expanded}
    >
      <BulletList
        items={[
          <>Ran <Hi>16</Hi> different events throughout one semester, including coding competitions and circuitry events</>,
          <>Attended faculty meetings to advocate for computing students on curriculum changes</>,
          <>Led the organization&apos;s executives and staff, managing <Hi>30</Hi> members across <Hi>5</Hi> committees</>,
          <>Spearheaded a new initiative to create websites for other university clubs to generate revenue</>,
        ]}
      />

      <Collapse in={expanded} unmountOnExit>
        <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
          I took over as president during a chaotic time for the club and
          began rebuilding it, meticulously planning out the budget and
          launching brand new computing merch to represent Guelph
          Computing, which was very popular with students.
        </Typography>

        <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
          Some of our most successful events for the club were:
        </Typography>
        <BulletList
          items={[
            <>Study Night (<Hi>50</Hi> people)</>,
            <>Games Night (<Hi>60</Hi> people)</>,
            <>Coding Competition (<Hi>75</Hi> people)</>,
          ]}
        />
      </Collapse>
    </TimelineEntry>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <List dense sx={{ mt: 1 }}>
      {items.map((item, i) => (
        <ListItem key={i} sx={{ py: 0.25 }}>
          <ListItemText primary={<Box sx={{ color: "#EDEFF3", textShadow }}>{item}</Box>} />
        </ListItem>
      ))}
    </List>
  );
}

// Testimonial card: a quote mark + left accent bar instead of yet another
// bordered rectangle, so recommendations read distinctly from timeline entries.
function RecommendationCard({
  name,
  title,
  relationship,
  quote,
  photo,
}: {
  name: string;
  title: string;
  relationship: string;
  quote: string;
  photo?: string;
}) {
  return (
    <Box sx={{ borderLeft: "3px solid", borderColor: "secondary.main", pl: 3, py: 0.5 }}>
      <Typography
        aria-hidden
        sx={{ color: "secondary.main", fontSize: "3rem", lineHeight: 0.6, fontFamily: "Georgia, serif" }}
      >
        &ldquo;
      </Typography>
      <Stack spacing={1.5} sx={{ mt: -2 }}>
        {quote.split("\n\n").map((para, i) => (
          <Typography key={i} variant="body1" fontStyle="italic" sx={{ color: "#EDEFF3", textShadow }}>
            {para}
          </Typography>
        ))}
      </Stack>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 2 }}>
        {photo && <PhotoFrame src={photo} alt={name} width={44} height={44} round />}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "#fff", textShadow }}>
            {name}
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: "rgba(255,255,255,0.7)", textShadow }}>
            {title}
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: "rgba(255,255,255,0.55)", textShadow }}>
            {relationship}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

const recommendations = [
  {
    name: "Purvi Patel",
    photo: "/purvi_patel.jpg",
    title: "Regional Manager (Canada), University of Guelph",
    relationship: "Managed Daniel directly · December 5, 2025",
    quote:
      "Daniel participated in a prospective student information event and shared his valuable experiences with future computing students. He was a pleasure to work with as he was professional, dependable and enthusiastic. He is an excellent public speaker. I recommend Daniel for any future endeavors.",
  },
  {
    name: "Monica Cojocaru",
    photo: "/monica_cojocaru.jpg",
    title: "Associate Dean, Research and Graduate Studies, University of Guelph",
    relationship: "Senior to Daniel, did not manage him directly · October 24, 2024",
    quote:
      "I had the pleasure of working with Daniel Dombrovsky during his time as a Research Web Developer Co-op student at the College of Engineering and Physical Sciences. Daniel exceeded expectations by taking full ownership of designing and developing the AI4CastingHub website, a key initiative advancing research collaboration in disease forecasting. His technical expertise, attention to detail, and ability to create a user-friendly, professional site were praised by faculty, staff, and external partners alike. Daniel's collaboration skills and eagerness to continuously improve made him an invaluable asset to my team.",
  },
  {
    name: "Dr. Bethany Davidson-Eng",
    photo: "/bethany_davidson-eng.jpg",
    title: "College Research Manager, College of Engineering and Physical Sciences, University of Guelph",
    relationship: "Managed Daniel directly · September 4, 2024",
    quote:
      "Daniel Dombrovsky was the Research Web Developer and Communications Assistant Co-op student with the College of Engineering and Physical Sciences Dean's Office. Daniel's performance during his four-month term was exceptional, exceeded our expectations and set a new standard for co-op students in our office.\n\nDaniel's innovative approach was evident from the outset. Tasked with gathering data for our annual research output report—a process that typically consumes two weeks of staff time—Daniel chose to tackle the challenge with a creative solution. Rather than completing the task manually, he developed a sophisticated web scraper tool that streamlined data collection. This tool drastically reduced the time required to compile the report from days to mere minutes, saving our office dozens of hours of labor and significantly increasing efficiency. This proactive and inventive solution not only resolved the immediate task but will continue to benefit our office well beyond Daniel's term.\n\nOne of Daniel's notable accomplishments was his work on the website for one of our new initiatives. Initially, the expectation was for Daniel to lay the groundwork for the new manager to develop the site further in Fall 2024. However, Daniel exceeded these expectations by completing the website himself. His dedication and expertise ensured that the site will be launched at the Initiative Launch event this September 2024, a testament to his exceptional work ethic and commitment. His ability to work confidently and effectively with faculty, staff, industry, and government representatives to achieve this goal is a clear indication of his professional integrity and skill.\n\nIn addition to his technical achievements, Daniel has had a remarkable impact on staff morale and the quality of work within our team. His friendly, engaging demeanor and willingness to assist wherever needed made him a pleasure to work with. His enthusiasm and positive attitude fostered a collaborative and supportive work environment, which was greatly appreciated by both colleagues and supervisors.",
  },
];

export default function PageContent() {
  const { filter, prevFilter } = useJourneyFilter();
  const journeyFilterActive = Boolean(filter);
  const journeyFilterClosing = Boolean(prevFilter) && !filter;
  const aboutZoom = useSectionZoom();
  const contactZoom = useSectionZoom();
  return (
    <GalleryPortalProvider>
    <LayoutGroup>
    <>
      {/* Hero fades into dirtColorEnd at its own bottom; a flat hold gives
          brown real presence (a plain color-stop pair has zero slope, so
          it joins the eased curve below with no seam), then a tall Box
          blends through a generous middle section into cadetGrey. The
          Box's own height is inflated beyond that blend's real span
          specifically to make room for a long fade-to-transparent tail
          (rather than a flat grey hold) — same visual "brown -> gray"
          duration as before, but far less of it sits flat, and the fade
          into the cave photo below is long instead of abrupt. The cave
          photo is pulled up underneath (negative marginTop, lower zIndex)
          to overlap that fade-out with its own fade-in. */}
      <Box sx={{ height: { xs: "14vh", md: "20vh" }, background: dirtColorEnd, position: "relative", zIndex: 1 }} />
      <Box
        sx={{
          height: { xs: "120vh", md: "160vh" },
          background: `linear-gradient(180deg, ${transitionGradient(dirtColorEnd, cadetGrey, 38)})`,
          position: "relative",
          zIndex: 2,
        }}
      />

      {/* About — the cave photo is this section's own background (same
          pattern as Hero's mountain photo), so the "About Me" title and
          bio text both sit inside it, title first. Shown in full — no
          cropping — but both edges fade the same way Hero's own mountain
          fades into its brown: cadetGrey fades in over the photo's own top
          (so the previous Box hands off into the image itself, not a hard
          cut), and the trailing edge fades into cadetGrey again (the color
          the next Box picks up from). */}
      <Box
        ref={aboutZoom.ref}
        sx={{ position: "relative", overflow: "hidden", zIndex: 1, background: cadetGrey, mt: { xs: "-45vh", md: "-60vh" } }}
      >
        <Box
          component="img"
          src="/cave2.webp"
          alt="Waterfall inside a cave"
          width={996}
          height={1024}
          sx={{
            display: "block",
            width: "100%",
            height: "auto",
            aspectRatio: "996 / 1024",
            filter: `brightness(${aboutZoom.brightness})`,
          }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "rgba(12,9,5,0.55)" }} />
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: { xs: "40vh", md: "55vh" },
            background: `linear-gradient(180deg, ${easedAlphaStops(cadetGrey, 1, 0)})`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: { xs: "32vh", md: "42vh" },
            background: `linear-gradient(180deg, ${easedAlphaStops(cadetGrey, 0, 1)})`,
          }}
        />

        <Box sx={{ position: "absolute", inset: 0, zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "center", py: { xs: 10, md: 16 } }}>
        <Reveal>
        <Box id="about" sx={{ width: "100%" }}>
          <Typography
            variant="h2"
            sx={{ color: "#fff", textAlign: "center", mb: 6, fontSize: { xs: "2rem", md: "2.75rem" }, textShadow }}
          >
            About Me
          </Typography>
          <Container maxWidth="md">
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 4, md: 6 }, alignItems: "flex-start" }}>
              <Box sx={{ flexShrink: 0, mx: { xs: "auto", md: 0 } }}>
                <PhotoFrame src="/me.jpg" alt="Image of Me" width={260} height={260} round />
              </Box>

              <Stack spacing={3} sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow }}>
                  My name is Daniel Dombrovsky. I am currently a student at the
                  University of Guelph in the Bachelor of Computing program, majoring
                  in Software Engineering with Co-op, and working part-time as a
                  Software Engineer at Pepper this term. I love being involved in my
                  community by attending computing events, joining clubs, and
                  meeting new people. My courses have refined my back-end development
                  skills, which are complemented by the hands-on experience I gained
                  in front-end development through my extracurriculars. I thrive at
                  working in collaborative environments and creating innovative
                  solutions to intricate problems.
                </Typography>
                <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow }}>
                  Outside of university, I am interested in baking, I love trying new
                  recipes I come across online and cooking family recipes at home. I
                  love biking with my family and spending time outside during the
                  Summer. I currently live in Guelph, and I&apos;m actively looking
                  for full-time software engineering opportunities starting Summer
                  2027.
                </Typography>
                <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow }}>
                  A fun fact about me is that I can play the clarinet, and my
                  favorite movie is Back to the Future.
                </Typography>
              </Stack>
            </Box>
          </Container>
        </Box>
        </Reveal>
        </Box>
      </Box>

      {/* Fades UP from transparent into cadetGrey over a long leading
          stretch (same "inflate height, extend the fade, keep the color
          blend's own span" approach as the incoming transition), pulled
          up (negative marginTop, higher zIndex) to overlap the cave
          photo's own trailing fade-out instead of meeting it at a hard
          edge — the mirror of the incoming transition above. */}
      <Box
        sx={{
          height: { xs: "77vh", md: "102vh" },
          background: `linear-gradient(180deg, ${transitionGradientFadeIn(cadetGrey, oceanStart, 42)})`,
          position: "relative",
          zIndex: 2,
          mt: { xs: "-32vh", md: "-42vh" },
        }}
      />

      {/* Experience */}
      <Box id="experience" sx={{ py: { xs: 10, md: 16 }, background: experienceBg, position: "relative", zIndex: 1 }}>
        <JourneyGalleryOverlay />
        <Container maxWidth="xl">
          <Typography
            variant="h2"
            sx={{ color: "#fff", textAlign: "center", mb: 6, fontSize: { xs: "2rem", md: "2.75rem" }, textShadow }}
          >
            My Journey
          </Typography>
          <Box
            sx={{
              opacity: journeyFilterActive ? 0 : 1,
              filter: journeyFilterActive ? "blur(8px)" : "none",
              pointerEvents: journeyFilterActive ? "none" : "auto",
              transition: journeyFilterClosing ? "opacity 0.5s ease, filter 0.5s ease" : "opacity 1.8s ease 0.3s, filter 1.8s ease 0.3s",
            }}
          >
            <CollapsibleEarlyChapters label="2017 – 2022 · Before university (high school, summer jobs)">
              <YearMarker year="2017" />
              <TimelineEntry
                side="left"
                tag="Job"
                title="Day Camp Volunteer"
                org="YMCA Canada"
                location="Cambridge, Ontario"
                startDate="Jun 2017"
                endDate="Jul 2019"
              >
                <BulletList
                  items={[
                    <>Assisted counsellors with daily camp activities and helped campers who needed support at camp</>,
                    <>Kept children well-behaved while counsellors supervised children and ran different games and activities</>,
                    <>Brought counsellors required items for events including craft supplies, lifejackets, and game equipment</>,
                  ]}
                />
              </TimelineEntry>

              <YearMarker year="2018" />
              <TimelineEntry
                logo="/st_benedict_logo.jpg"
                logoAlt="St. Benedict Catholic Secondary School logo"
                side="right"
                tag="Education"
                title="High School Diploma, STEM"
                org="St. Benedict Catholic Secondary School"
                location="Cambridge, Ontario"
                startDate="Sep 2018"
                endDate="Jun 2022"
              >
                <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                  Member of Robotics Club, Coding Club, Math Club, Business Club,
                  and Debate Team. Co-founded Tech Summit, a club discussing
                  current tech news during COVID, and served on Student Council
                  editing promotional videos and updating the school&apos;s website.
                </Typography>
              </TimelineEntry>

              <YearMarker year="2019" />
              <TimelineEntry
                side="left"
                tag="Job"
                title="General Laborer"
                org="Bloomex Canada"
                location="Cambridge, Ontario"
                startDate="Oct 2019"
                endDate="Feb 2022"
              >
                <BulletList
                  items={[
                    <>Kept warehouse inventory organized by sorting boxes of chocolates, cookies, and teddy bears</>,
                    <>Offloaded new shipments of products from trucks and delivered them to different warehouse locations</>,
                    <>Built ten different versions of gift baskets with varieties of sweet treats, flowers, and neat packaging</>,
                  ]}
                />
              </TimelineEntry>

              <YearMarker year="2020" />
              <TimelineEntry
                side="right"
                tag="Job"
                title="Day Camp Counselor"
                org="YMCA Canada"
                location="Cambridge, Ontario"
                startDate="Jun 2020"
                endDate="Jul 2021"
              >
                <BulletList
                  items={[
                    <>Supervised campers and ensured the safety of children by explaining camp rules and expected behaviours</>,
                    <>Took groups hiking, fishing, kayaking, and reminded them about poison ivy and other outdoor dangers</>,
                    <>Created weekly schedules for counsellor groups, planned craft activities, and organized camp supplies</>,
                  ]}
                />
              </TimelineEntry>

            </CollapsibleEarlyChapters>

            {/* Runs into university (through Jul 2023), so it stays visible
                in the main timeline rather than collapsed with the
                strictly pre-university chapters above. */}
            <YearMarker year="2022" />
            <TimelineEntry
              side="left"
              tag="Job"
              title="Youth Mentor"
              org="YMCA Canada"
              location="Cambridge, Ontario"
              startDate="Jun 2022"
              endDate="Jul 2023"
            >
              <BulletList
                items={[
                  <>Taught leaders in training how to work with children, run games, lead activities, and bond with campers</>,
                  <>Lectured students on safety when working with children and the responsibility associated with their role</>,
                  <>Evaluated the leaders in training, providing daily feedback, and submitting results to hiring managers</>,
                ]}
              />
            </TimelineEntry>

            <TimelineEntry
              logo="/university_of_guelph_logo.jpg"
              logoAlt="University of Guelph logo"
              side="right"
              tag="Education"
              title="Bachelor of Computing, Software Engineering Co-op"
              org="University of Guelph"
              location="Guelph, Ontario"
              startDate="Sep 2022"
              endDate="Expected May 2027"
            >
              <BulletList
                items={[
                  <>Current cumulative GPA <Hi>3.84</Hi>; minoring in Culture and Technology Studies</>,
                  <>Entrance Scholarship (2022)</>,
                  <>Dean&apos;s Honour List (2022–2023)</>,
                ]}
              />
            </TimelineEntry>

            <TermHeader label="Fall 2022" />
            <TermCourseworkEntry label="Fall 2022" side="left" hideStartDate />

            <TimelineEntry
              logo="/socisLogo.png"
              logoAlt="SOCIS logo"
              logoOnWhite
              side="right"
              tag="Extracurriculars"
              title="Marketing Committee Member"
              org="SOCIS"
              location="Guelph, Ontario"
              startDate="Sep 2022"
              hideStartDate
              endDate="Apr 2023"
              skills={["Problem Solving"]}
              aside={
                <PhotoStack
                  photos={[
                    { src: "/socis_marketing_a.jpg", alt: "SOCIS marketing committee event photo", width: 4080, height: 3072 },
                    { src: "/socis_marketing_b.jpg", alt: "SOCIS marketing committee event photo", width: 4080, height: 3072 },
                    { src: "/socis_marketing_c.jpg", alt: "SOCIS marketing committee event photo", width: 4080, height: 3072 },
                    { src: "/socis_marketing_d.png", alt: "SOCIS marketing committee photo", width: 897, height: 889 },
                  ]}
                />
              }
            >
              <BulletList
                items={[
                  <>Ran the largest event of the year, with an attendance of <Hi>50+</Hi> people for a trivia night</>,
                  <>Independently planned a marketing campaign for events by creating videos, posts, and flyers</>,
                ]}
              />
            </TimelineEntry>

            <YearMarker year="2023" />

            <TermHeader label="Winter 2023" />
            <TermCourseworkEntry label="Winter 2023" side="left" />

            <TimelineEntry
              side="right"
              tag="Project"
              title="Baby Names Frequency Tracker"
              startDate="Jan 2023"
              endDate="Apr 2023"
              hideStartDate
              githubUrl="https://github.com/ddombrov/BabyNamesFrequencyProject"
              skills={["Python", "Pandas"]}
              aside={<PhotoFrame src="/babyNames.png" alt="Baby Names Frequency Tracker screenshot" width={520} height={293} />}
            >
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                In Software Design II, me and a group of four collaborated
                developed a user-friendly menu together, that allowed users to
                track names&apos; popularities across time and determine their
                ethnicities. This was implemented by normalizing CSV files to a
                standard format and converting them to Pandas data frames in
                Python.
              </Typography>
            </TimelineEntry>

            <TimelineEntry
              logo="/socisLogo.png"
              logoAlt="SOCIS logo"
              logoOnWhite
              side="left"
              tag="Extracurriculars"
              title="Vice President Communications"
              org="SOCIS"
              location="Guelph, Ontario"
              startDate="Apr 2023"
              endDate="Dec 2023"
              aside={
                <PhotoStack
                  photos={[
                    { src: "/socis_vp_a.jpg", alt: "SOCIS VP Communications event photo", width: 3024, height: 4032 },
                    { src: "/socis_vp_b.jpg", alt: "SOCIS VP Communications event photo", width: 3024, height: 4032 },
                    { src: "/socis_vp_c.png", alt: "SOCIS VP Communications photo", width: 895, height: 898 },
                    { src: "/socis_vp_d.png", alt: "SOCIS VP Communications photo", width: 897, height: 894 },
                  ]}
                />
              }
            >
              <BulletList
                items={[
                  <>Ran study nights, guest speaker talks, Makerspace technology workshops, and other fun events</>,
                  <>Successfully promoted the club in new ways, increasing attendance to <Hi>70+</Hi> people per event</>,
                  <>Managed the club&apos;s online presence through Instagram and Discord; revamped the outdated website</>,
                  <>Designed promotional Instagram posts and physical flyers to market upcoming events and initiatives</>,
                ]}
              />
            </TimelineEntry>

            <TermHeader label="Summer 2023" />
            <TermCourseworkEntry label="Summer 2023" side="right" />

            <TermHeader label="Fall 2023" />
            <TermCourseworkEntry label="Fall 2023" side="left" />

            <TimelineEntry
              logo="/gdscLogo.png"
              logoAlt="GDSC logo"
              side="right"
              tag="Extracurriculars"
              title="Marketing and Publicity Director"
              org="Google Developer Student Club"
              location="Guelph, Ontario"
              startDate="Sep 2023"
              endDate="May 2024"
              hideStartDate
              skills={["JavaScript", "HTML", "Firebase"]}
            >
              <BulletList
                items={[
                  <>Worked with other executives to plan various technical events averaging <Hi>100+</Hi> attendance</>,
                  <>Led workshops introducing APIs and front-end implementation with JavaScript and HTML</>,
                  <>Taught students how to use and incorporate Google&apos;s Firebase technology into their websites</>,
                  <>Volunteered at Google DevFest Waterloo 2023, a <Hi>300</Hi>-person event, alongside other community leaders</>,
                  <>Marketed all club activity on Instagram and Discord, and managed a team of designers</>,
                  <>Organized a <Hi>200+</Hi> participant hackathon, raising over <Hi>$25,000</Hi> in funding for <Hi>25+</Hi> events</>,
                ]}
              />
            </TimelineEntry>

            <SocisPresidentEntry />

            <YearMarker year="2024" />

            <TermHeader label="Winter 2024" />
            <TermCourseworkEntry label="Winter 2024" side="right" />

            <TimelineEntry
              logo="/care_ai_logo.jpg"
              logoAlt="CARE-AI logo"
              side="left"
              tag="Certification"
              title="Introducing Artificial Intelligence: Training for the Road Ahead"
              org="CARE-AI, University of Guelph"
              startDate="Jan 2024"
              hideStartDate
              aside={<PhotoFrame src="/care-ai-cert.png" alt="CARE-AI certificate of completion" width={210} height={273} />}
            >
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", textShadow, mt: 2 }}>
                Completed through the Centre for Advancing Responsible &amp;
                Ethical Artificial Intelligence at the University of Guelph.
              </Typography>
            </TimelineEntry>

            <TimelineEntry
              side="right"
              tag="Project"
              title="Billiards Pool Game Simulator"
              startDate="Jan 2024"
              endDate="Apr 2024"
              hideStartDate
              githubUrl="https://github.com/ddombrov/Billards-Game"
              skills={["C", "Python", "JavaScript", "jQuery", "SQL", "HTML", "CSS"]}
              aside={
                <Box sx={{ borderRadius: 2, overflow: "hidden", filter: dropShadow, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2px", p: "2px", bgcolor: "#fff", maxWidth: 220, mx: { xs: "auto", md: 0 } }}>
                  {["/table-0.svg", "/table-1.svg", "/table-2.svg", "/table-3.svg"].map((src) => (
                    <GridImageButton key={src} src={src} alt="Billiards table" />
                  ))}
                </Box>
              }
            >
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                In CIS*2750, Software Systems Development and Integration, I
                programmed a C physics library to simulate billiards ball
                collisions, and then I integrated the program with a
                Python-based web server to dynamically generate SVG images
                onto an HTML website.
              </Typography>
            </TimelineEntry>

            <TermHeader label="Summer 2024" />
            <TermCourseworkEntry label="Summer 2024" side="left" />

            <TimelineEntry
              logo="/ceps_uofg_logo.jpg"
              logoAlt="College of Engineering and Physical Sciences, University of Guelph logo"
              side="right"
              tag="Co-op"
              title="Software Engineer"
              org="College of Engineering and Physical Sciences, University of Guelph"
              location="Guelph, Ontario"
              startDate="May 2024"
              hideStartDate
              endDate="Aug 2024"
              companyUrl="https://www.linkedin.com/company/ccmps-uofg"
              skills={["Python", "R", "Plotly", "BeautifulSoup", "Selenium"]}
              reportKey="uofg-2024"
              aside={
                <Stack spacing={3}>
                  <Box>
                    <PhotoFrame src="/coop-nomination.jpg" alt="Co-op Employee of the Year Nomination certificate" width={210} height={273} />
                    <Typography variant="body2" sx={{ color: "#EDEFF3", textShadow, mt: 1 }}>
                      Nominated for Co-op Employee of the Year by University of
                      Guelph Experiential Learning, Aug 2024, on behalf of the
                      College of Engineering and Physical Sciences.
                    </Typography>
                  </Box>
                  <RecommendationCard {...recommendations[2]} />
                  <RecommendationCard {...recommendations[1]} />
                </Stack>
              }
            >
              <BulletList
                items={[
                  <>Launched an accessible platform for collaboration on disease research modeling used by <Hi>70+</Hi> faculty members</>,
                  <>Built interactive Plotly and R dashboards for hospitalization predictions, supporting <Hi>3</Hi> active research studies</>,
                  <>Accelerated faculty data collection by <Hi>99%</Hi> by engineering a web scraper, extracting data from <Hi>1,000+</Hi> Google Scholar pages in minutes instead of days of manual entry</>,
                ]}
              />
            </TimelineEntry>

            <TimelineEntry
              side="left"
              tag="Project"
              title="AI Voice Caller"
              startDate="Aug 2024"
              githubUrl="https://github.com/ddombrov/HackThe6ix2024"
              skills={["Next.js", "OpenAI", "ElevenLabs", "Python", "React", "Firebase", "Material UI"]}
            >
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                Produced an AI-driven app to automate voice calls to businesses
                and clients for booking appointments or meetings. Synthesized
                emotional dialogue through OpenAI and ElevenLabs APIs, using
                Twilio to deliver calls to users. Built at the Hack the 6ix
                2024 hackathon.
              </Typography>
            </TimelineEntry>

            <TermHeader label="Fall 2024" />
            <TermCourseworkEntry label="Fall 2024" side="right" />

            <TimelineEntry
              logo="/city_of_guelph_logo.jpg"
              logoAlt="City of Guelph logo"
              side="left"
              tag="Co-op"
              title="IT Support Technician"
              org="City of Guelph"
              location="Guelph, Ontario"
              startDate="Sep 2024"
              hideStartDate
              endDate="Dec 2024"
              skills={["Time Management", "Public Speaking", "Active Directory"]}
              reportKey="guelph-2024"
              aside={<PhotoStack photos={coopReports["guelph-2024"].photos} />}
            >
              <BulletList
                items={[
                  <>Provided IT support for <Hi>350+</Hi> City of Guelph staff across <Hi>10+</Hi> departments, ensuring smooth daily operations</>,
                  <>Answered calls to deliver remote assistance to users and addressed in-person inquiries regarding device repairs</>,
                  <>Facilitated the onboarding of <Hi>125+</Hi> new hires by setting them up on the city network, installing operating systems and software, and disabling accounts for terminated staff using Active Directory</>,
                ]}
              />
            </TimelineEntry>

            <YearMarker year="2025" />

            <TermHeader label="Winter 2025" />
            <TermCourseworkEntry label="Winter 2025" side="right" />

            <TimelineEntry
              logo="/uog_gcc_logo.jpg"
              logoAlt="Guelph Coding Community logo"
              side="left"
              tag="Volunteer"
              title="Marketing Team Member"
              org="Guelph Coding Community"
              location="Guelph, Ontario"
              startDate="Jan 2025"
              endDate="Apr 2025"
              hideStartDate
            >
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                Volunteered on the marketing team promoting the Guelph Coding
                Community&apos;s events and initiatives to local students.
              </Typography>
            </TimelineEntry>

            <TimelineEntry
              logo="/lapis_logo.jpg"
              logoAlt="Lapis logo"
              side="right"
              tag="Part-time"
              title="Head of Infrastructure: Full Stack Developer"
              org="Lapis"
              location="Guelph, Ontario"
              startDate="Feb 2025"
              endDate="Dec 2025"
              companyUrl="https://www.linkedin.com/company/lapis-research"
              skills={["Next.js", "TypeScript", "Supabase", "Google OAuth", "Microsoft OAuth", "CRON"]}
            >
              <BulletList
                items={[
                  <>Architected a high-performance company dashboard, cutting load times from <Hi>4.9s</Hi> to <Hi>200ms</Hi></>,
                  <>Integrated Notion and OneDrive APIs, allowing clients to import databases and files in a single click</>,
                  <>Implemented secure authentication with Google and Microsoft OAuth and custom role-based access control</>,
                  <>Automated nightly Supabase backups with CRON jobs, protecting <Hi>1.6 TB</Hi> of client data across <Hi>31</Hi> accounts</>,
                ]}
              />
            </TimelineEntry>

            <TimelineEntry
              side="left"
              tag="Project"
              title="Canadian-Origin Barcode Scanner"
              startDate="Mar 2025"
              endDate="Apr 2025"
              githubUrl="https://github.com/ddombrov/oh_scanada"
              skills={["Flutter", "Dart", "Firestore"]}
            >
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                In CIS*4030, Mobile Computing, developed a barcode scanning app
                that retrieves product and sustainability information for{" "}
                <Hi>1M+</Hi> products. Leveraged Firestore for data
                management, implementing social features, profile settings,
                and accessibility modes.
              </Typography>
            </TimelineEntry>

            <TermHeader label="Summer 2025" />
            <TermCourseworkEntry label="Summer 2025" side="right" />

            <TimelineEntry
              logo="/canadian_institute_for_health_information_logo.jpg"
              logoAlt="Canadian Institute for Health Information logo"
              side="left"
              tag="Co-op"
              title="Software Engineer"
              org="Canadian Institute for Health Information"
              location="North York, Ontario"
              startDate="May 2025"
              endDate="Aug 2025"
              hideStartDate
              companyUrl="https://www.linkedin.com/company/canadian-institute-for-health-information"
              skills={["Python", "Spring Boot", "UML"]}
              reportKey="cihi-2025"
              aside={<PhotoStack photos={coopReports["cihi-2025"].photos} />}
            >
              <BulletList
                items={[
                  <>Streamlined <Hi>80%</Hi> of manual data processing by developing Python scripts for healthcare data model conversions</>,
                  <>Designed AI workflows for healthcare data analysis, automating <Hi>19</Hi> weekly review tasks for the data team</>,
                  <>Contributed to national UML diagram standards adopted by <Hi>6,000+</Hi> healthcare facilities across Canada</>,
                  <>Migrated a legacy healthcare data reporting service to Spring Boot, reducing service maintenance costs by <Hi>30%</Hi></>,
                ]}
              />
            </TimelineEntry>

            <TermHeader label="Fall 2025" />
            <TermCourseworkEntry label="Fall 2025" side="right" />

            <TimelineEntry
              side="left"
              tag="Recommendation"
              title="Recommendation"
              org="From Purvi Patel, Regional Manager (Canada), University of Guelph"
              startDate="Dec 2025"
            >
              <Box sx={{ mt: 2 }}>
                <RecommendationCard {...recommendations[0]} />
              </Box>
            </TimelineEntry>

            <YearMarker year="2026" />

            <TermHeader label="Winter 2026" />
            <TermCourseworkEntry label="Winter 2026" side="right" />

            <TimelineEntry
              logo="/usepepper_logo.jpg"
              logoAlt="Pepper logo"
              side="left"
              tag="Co-op"
              title="Software Engineer"
              org="Pepper"
              location="Toronto, Ontario"
              startDate="Jan 2026"
              endDate="Apr 2026"
              hideStartDate
              companyUrl="https://www.linkedin.com/company/usepepper"
              skills={["React", "TypeScript", "AWS Lambda", "Terraform"]}
              reportKey="pepper-2026-winter"
              aside={<PhotoStack photos={coopReports["pepper-2026-winter"].photos} />}
            >
              <BulletList
                items={[
                  <>Built and shipped an internal EDI operations dashboard giving field engineers real-time visibility into <Hi>921</Hi> suppliers and <Hi>1,667</Hi> integration pipelines processing roughly <Hi>40,000</Hi> EDI runs a day across <Hi>30+</Hi> ERP systems</>,
                  <>Built a recurring-route planner that was a committed requirement in a <Hi>$99k ARR</Hi> / <Hi>~$297k TCV</Hi> distributor contract close, shipping a sales-rep task manager now covering <Hi>17</Hi> active routes across <Hi>178</Hi> accounts</>,
                ]}
              />
            </TimelineEntry>

            <TermHeader label="Summer 2026" />
            <TermCourseworkEntry label="Summer 2026" side="right" />

            <TimelineEntry
              logo="/usepepper_logo.jpg"
              logoAlt="Pepper logo"
              side="right"
              tag="Co-op"
              title="Software Engineer"
              org="Pepper"
              location="Toronto, Ontario"
              startDate="May 2026"
              endDate="Aug 2026"
              hideStartDate
              companyUrl="https://www.linkedin.com/company/usepepper"
              skills={["Python", "Django", "Postgres", "Hasura/GraphQL", "FastAPI", "Fastify"]}
              reportKey="pepper-2026-summer"
              aside={<PhotoStack photos={coopReports["pepper-2026-summer"].photos} />}
            >
              <BulletList
                items={[
                  <>Owned and shipped a multi-tenant credit-application and automated-underwriting platform end to end with FCRA-compliant decisioning, launching a self-serve form builder and reviewer dashboard to <Hi>8</Hi> pilot distributor tenants</>,
                  <>Designed and shipped the customer-facing successor to the EDI dashboard, moving failure alerting from internal-only visibility into the core product</>,
                ]}
              />
            </TimelineEntry>

            <TermHeader label="Fall 2026" />
            <TermCourseworkEntry label="Fall 2026" side="left" />

            <TimelineEntry
              logo="/usepepper_logo.jpg"
              logoAlt="Pepper logo"
              side="left"
              tag="Part-time"
              title="Software Engineer"
              org="Pepper"
              location="Toronto, Ontario"
              startDate="Sep 2026"
              endDate="Present"
              hideStartDate
              companyUrl="https://www.linkedin.com/company/usepepper"
            >
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                Continuing on with Pepper part-time this semester alongside
                coursework, after two co-op terms with the company and five
                co-op terms overall.
              </Typography>
            </TimelineEntry>

            <YearMarker year="2027" />

            <TermHeader label="Winter 2027" />
            <TermCourseworkEntry label="Winter 2027" side="right" isLast />
          </Box>
        </Container>
      </Box>

      {/* Experience ends at oceanEnd ("navy blue"); a tall single Box holds
          that navy as a clear stretch, blends through a generous middle
          section, then holds deepBlue as its own clear stretch before the
          ocean photo's own top fade takes over. */}
      <Box
        sx={{
          height: { xs: "50vh", md: "68vh" },
          background: `linear-gradient(180deg, ${easedColorStops(oceanEnd, deepBlue)})`,
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Contact — the ocean photo is this section's own background (same
          pattern as About/Hero), so "Contact Me" and the form both sit
          inside it, title first, right above the form. Unlike the cave,
          this one is cropped to a fixed section height (objectFit: cover,
          full width kept) rather than shown at its full — extremely tall —
          natural height. Both edges fade the same way Hero's own mountain
          fades into its brown: deepBlue fades in over the photo's own top
          (so the previous Box hands off into the image itself, not a hard
          cut), and the trailing edge fades into deepBlue again (the color
          the next Box picks up from). */}
      <Box
        ref={contactZoom.ref}
        sx={{ position: "relative", overflow: "hidden", zIndex: 1, textAlign: "center", background: deepBlue, height: { xs: "110vh", md: "165vh" } }}
      >
        <Box
          component="img"
          src="/ocean2.avif"
          alt="Deep blue ocean"
          width={3436}
          height={5164}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            filter: `brightness(${contactZoom.brightness})`,
          }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "rgba(4,9,16,0.6)" }} />
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "14vh",
            background: `linear-gradient(180deg, ${easedAlphaStops(deepBlue, 1, 0)})`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "12vh",
            background: `linear-gradient(180deg, ${easedAlphaStops(deepBlue, 0, 1)})`,
          }}
        />

        <Box sx={{ position: "absolute", inset: 0, zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "center", py: { xs: 10, md: 14 } }}>
        <Reveal>
        <Box id="contact" sx={{ width: "100%" }}>
          <Typography
            variant="h2"
            sx={{ color: "#fff", textAlign: "center", mb: 4, fontSize: { xs: "2rem", md: "2.75rem" }, textShadow }}
          >
            Contact Me
          </Typography>
          <Container maxWidth="sm">
            <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mb: 4 }}>
              Feel free to check out my GitHub, LinkedIn, or send me a message below.
            </Typography>
            <ContactForm />
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 5, mb: 4 }}>
              <IconButton component="a" href="https://github.com/ddombrov" aria-label="GitHub" sx={{ color: "#fff" }}>
                <GitHubIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.linkedin.com/in/daniel-dombrovsky-9d/"
                aria-label="LinkedIn"
                sx={{ color: "#fff" }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton component="a" href="mailto:ddombrov@uoguelph.ca" aria-label="Email" sx={{ color: "#fff" }}>
                <EmailIcon />
              </IconButton>
            </Stack>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", textShadow }}>
              © 2026 Daniel Dombrovsky
            </Typography>
          </Container>
        </Box>
        </Reveal>
        </Box>
      </Box>

      <Box
        sx={{
          height: { xs: "36vh", md: "48vh" },
          background: `linear-gradient(180deg, ${easedColorStops(deepBlue, "#0F0C07")})`,
          position: "relative",
          zIndex: 1,
        }}
      />
      <Box sx={{ height: { xs: "10vh", md: "14vh" }, background: "#0F0C07", position: "relative", zIndex: 1 }} />
    </>
    </LayoutGroup>
    </GalleryPortalProvider>
  );
}
