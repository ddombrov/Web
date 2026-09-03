"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// The same scroll-linked scale-up + darken Hero uses on the mountain photo,
// generalized for a band that sits mid-page instead of at scrollY 0.
// Zoom/darken ramp up only once the band has started scrolling past the
// top of the viewport (mirroring Hero staying sharp until you scroll past
// it), but the overlay's own fade is driven separately by how close the
// overlay text itself is to being centered in view — measured off the
// overlay element directly (not the band as a whole), since the band can
// be much taller than the viewport and the text sits near one edge of it,
// not its geometric center.
// Fades both edges into the surrounding sections' colors — `fadeFrom` at
// the top, `fadeTo` at the bottom — so neither is a hard cut. The image is
// sized to the full width of the band and left at its natural aspect
// ratio (width: 100%, height: auto) rather than cropped/letterboxed into a
// fixed-height box, so the band's height simply grows to whatever the
// photo needs — no cropping, at the cost of a taller scroll for portrait
// source photos.
// `overlayAlign` pins the heading near whichever edge of the band sits
// next to the content it belongs to — "top" when the band follows the
// related section (heading reads as its closing title card), "bottom"
// when the band precedes it (heading reads as that section's opener).
export default function ParallaxBand({
  src,
  alt,
  naturalWidth,
  naturalHeight,
  fadeFrom,
  fadeTo,
  overlay,
  overlayAlign = "center",
}: {
  src: string;
  alt: string;
  // The source photo's real pixel dimensions — passed through as the
  // native <img> width/height attributes (not CSS) purely so the browser
  // can reserve the correct aspect ratio before the (large) file finishes
  // loading. Without this the band renders at 0 height until the image
  // loads, then jumps to full height, throwing off every scroll-linked
  // measurement taken in the meantime (zoom, overlay fade, scrollIntoView).
  naturalWidth: number;
  naturalHeight: number;
  fadeFrom: string;
  fadeTo: string;
  overlay?: { heading: string; tagline?: string };
  overlayAlign?: "top" | "center" | "bottom";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [zoomProgress, setZoomProgress] = useState(0);
  const [overlayFade, setOverlayFade] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        const el = ref.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight;

          const pastAmount = Math.max(0, -rect.top);
          setZoomProgress(Math.min(pastAmount / 800, 1));

          // 1 while the overlay text is comfortably centered in the
          // viewport, easing toward 0 as it approaches entering from the
          // bottom or leaving off the top — stays visible through the
          // whole natural "this is what's on my screen" window, not just
          // one instant.
          const overlayEl = overlayRef.current;
          if (overlayEl) {
            const overlayRect = overlayEl.getBoundingClientRect();
            const overlayCenter = overlayRect.top + overlayRect.height / 2;
            const distanceFromCenter = Math.abs(overlayCenter - vh / 2);
            setOverlayFade(Math.max(1 - distanceFromCenter / (vh * 0.85), 0));
          }
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

  const scale = 1 + zoomProgress * 0.3;
  const brightness = 1 - zoomProgress * 0.3;
  const justifyContent = overlayAlign === "top" ? "flex-start" : overlayAlign === "bottom" ? "flex-end" : "center";

  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
        background: `linear-gradient(180deg, ${fadeFrom} 0%, ${fadeTo} 100%)`,
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        width={naturalWidth}
        height={naturalHeight}
        sx={{
          display: "block",
          width: "100%",
          height: "auto",
          aspectRatio: `${naturalWidth} / ${naturalHeight}`,
          transform: `scale(${scale})`,
          transformOrigin: "center 50%",
          filter: `brightness(${brightness})`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "14vh",
          background: `linear-gradient(180deg, ${fadeFrom} 0%, rgba(0,0,0,0) 100%)`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "16vh",
          background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${fadeTo} 100%)`,
        }}
      />
      {overlay && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent,
            textAlign: "center",
            color: "#fff",
            px: 3,
            pt: overlayAlign === "top" ? { xs: "22vh", md: "26vh" } : 0,
            pb: overlayAlign === "bottom" ? { xs: "8vh", md: "10vh" } : 0,
            opacity: overlayFade,
            transition: "opacity 0.15s linear",
          }}
        >
          {/* Sized to the text itself (not stretched like its parent) so
              the scroll handler can measure where the heading actually
              renders, regardless of which edge of the band it's pinned to. */}
          <Box ref={overlayRef}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.25rem", sm: "3rem", md: "4rem" },
              fontWeight: 700,
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
              animation: "bandTitleIn 1.1s cubic-bezier(0.16,1,0.3,1) both",
              "@keyframes bandTitleIn": {
                "0%": { opacity: 0, letterSpacing: "0.35em", transform: "scale(0.94)" },
                "100%": { opacity: 1, letterSpacing: "normal", transform: "scale(1)" },
              },
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          >
            {overlay.heading}
          </Typography>
          {overlay.tagline && (
            <Typography
              variant="h6"
              component="p"
              sx={{
                mt: 2,
                fontWeight: 400,
                maxWidth: 560,
                textShadow: "0 2px 12px rgba(0,0,0,0.45)",
                animation: "bandFadeUp 0.9s ease-out 0.4s both",
                "@keyframes bandFadeUp": {
                  "0%": { opacity: 0, transform: "translateY(14px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              }}
            >
              {overlay.tagline}
            </Typography>
          )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
