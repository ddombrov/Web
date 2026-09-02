"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

type LightboxImage = { src: string; alt: string; width: number; height: number };
type LightboxCtx = { open: (img: LightboxImage) => void };

const Ctx = createContext<LightboxCtx | null>(null);

// A single shared full-screen viewer for every photo on the page — clicking
// any PhotoFrame opens its image here at a much larger size, in place, so
// nobody ever leaves the page just to see a photo clearly.
export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const open = useCallback((img: LightboxImage) => setImage(img), []);
  const close = useCallback(() => setImage(null), []);

  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [image, close]);

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
