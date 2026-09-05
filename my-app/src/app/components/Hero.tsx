"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { dirtColor } from "./styles";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafId.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const progress = Math.min(scrollY / 800, 1);
  const scale = 1 + progress * 0.6;
  const fade = Math.max(1 - progress * 1.4, 0);

  return (
    <Box id="home" sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <Box
        component="img"
        src="/mountain3.jpg"
        alt="Snow-capped mountain"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          transformOrigin: "center 60%",
          filter: `brightness(${1 - progress * 0.3})`,
        }}
      />
      {/* fades the image's bottom edge into the solid dirt background below,
          so the hero doesn't cut off hard into the next section */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "30vh",
          background: `linear-gradient(180deg, rgba(51,45,20,0) 0%, ${dirtColor} 100%)`,
        }}
      />
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          px: 3,
          opacity: fade,
          transform: `translateY(${progress * -40}px)`,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2.75rem", sm: "4rem", md: "5.5rem" },
            textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            // A wide letterSpacing at the animation's start can push the
            // line just past its wrap point — the animation then visibly
            // reflows from two lines to one mid-transition. This isn't a
            // clean "narrow vs wide" split: measured directly (forcing the
            // start-of-animation spacing and reading the rendered line
            // count, since letting the animation actually play settles to
            // "normal" well before any check can catch the true starting
            // value), 0.1em still wraps at every width up to ~1400px, and
            // even the full 0.35em wraps again from ~1536-2100px before
            // finally clearing at ~2200px+. So: no letterSpacing at all
            // (opacity/scale still animate) below that point, and the full
            // original effect only past it, where it's been confirmed to
            // actually stay on one line.
            "--hero-letter-spacing": "0em",
            "@media (min-width:2200px)": { "--hero-letter-spacing": "0.35em" },
            animation: "heroTitleIn 0.8s cubic-bezier(0.16,1,0.3,1) both",
            "@keyframes heroTitleIn": {
              "0%": { opacity: 0, letterSpacing: "var(--hero-letter-spacing)", transform: "scale(0.94)" },
              "100%": { opacity: 1, letterSpacing: "normal", transform: "scale(1)" },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          Hi, I&apos;m Daniel Dombrovsky
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            mt: 3,
            fontWeight: 400,
            maxWidth: 640,
            textShadow: "0 2px 12px rgba(0,0,0,0.45)",
            animation: "heroFadeUp 0.6s ease-out 0.2s both",
            "@keyframes heroFadeUp": {
              "0%": { opacity: 0, transform: "translateY(14px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          Welcome to my portfolio. Take a look at my life and the beginning of my tech career.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            mt: 5,
            animation: "heroFadeUp 0.6s ease-out 0.4s both",
            "@keyframes heroFadeUp": {
              "0%": { opacity: 0, transform: "translateY(14px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          <Button href="#about" variant="contained" color="secondary" size="large">
            About Me
          </Button>
          <Button href="#contact" variant="outlined" size="large" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.6)" }}>
            Contact Me
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
