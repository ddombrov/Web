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
            animation: "heroTitleIn 1.1s cubic-bezier(0.16,1,0.3,1) both",
            "@keyframes heroTitleIn": {
              "0%": { opacity: 0, letterSpacing: "0.35em", transform: "scale(0.94)" },
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
            animation: "heroFadeUp 0.9s ease-out 0.55s both",
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
            animation: "heroFadeUp 0.9s ease-out 0.85s both",
            "@keyframes heroFadeUp": {
              "0%": { opacity: 0, transform: "translateY(14px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          <Button href="#contact" variant="contained" color="secondary" size="large">
            Contact Me
          </Button>
          <Button href="#about" variant="outlined" size="large" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.6)" }}>
            About Me
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
