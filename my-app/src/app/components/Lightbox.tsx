"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";

export type LightboxImage = { src: string; alt: string; width: number; height: number };
// `set` is the full group this image belongs to (e.g. every photo in a
// PhotoStack) — when given, the viewer shows prev/next arrows to step
// through it. Omit it (or pass a single-item list) for a standalone photo.
type LightboxCtx = { open: (img: LightboxImage, set?: LightboxImage[]) => void };

const Ctx = createContext<LightboxCtx | null>(null);

// A single shared full-screen viewer for every photo on the page — clicking
// any PhotoFrame opens its image here at a much larger size, in place, so
// nobody ever leaves the page just to see a photo clearly.
export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ set: LightboxImage[]; index: number } | null>(null);

  const open = useCallback((img: LightboxImage, set?: LightboxImage[]) => {
    const group = set && set.length > 0 ? set : [img];
    const index = Math.max(0, group.findIndex((i) => i.src === img.src));
    setState({ set: group, index });
  }, []);
  const close = useCallback(() => setState(null), []);
  const next = useCallback(() => {
    setState((s) => (s ? { ...s, index: (s.index + 1) % s.set.length } : s));
  }, []);
  const prev = useCallback(() => {
    setState((s) => (s ? { ...s, index: (s.index - 1 + s.set.length) % s.set.length } : s));
  }, []);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, close, next, prev]);

  const image = state?.set[state.index] ?? null;
  const hasMultiple = (state?.set.length ?? 0) > 1;

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {image && (
        <Box
          onClick={close}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            bgcolor: "rgba(0,0,0,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, md: 6 },
            cursor: "zoom-out",
            animation: "lightboxFadeIn 0.2s ease",
            "@keyframes lightboxFadeIn": { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
          }}
        >
          <IconButton
            onClick={close}
            aria-label="Close"
            sx={{ position: "absolute", top: 16, right: 16, color: "#fff", bgcolor: "rgba(255,255,255,0.08)" }}
          >
            <CloseIcon />
          </IconButton>

          {hasMultiple && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              sx={{
                position: "absolute",
                left: { xs: 8, md: 24 },
                top: "50%",
                transform: "translateY(-50%)",
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{ position: "relative", maxWidth: "92vw", maxHeight: "88vh", cursor: "default" }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "92vw",
                maxHeight: "88vh",
                objectFit: "contain",
                borderRadius: 8,
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            />
          </Box>

          {hasMultiple && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              sx={{
                position: "absolute",
                right: { xs: 8, md: 24 },
                top: "50%",
                transform: "translateY(-50%)",
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>
      )}
    </Ctx.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
}
