"use client";

import { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

type Props = { src: string; title: string; allow: string };

export default function EmbeddedApp({ src, title, allow }: Props) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setSupported(document.fullscreenEnabled);
    const onChange = () => setIsFullscreen(document.fullscreenElement === wrapper.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapper.current?.requestFullscreen();
  };

  const label = isFullscreen ? "Exit full screen" : "Full screen";

  return (
    <div
      ref={wrapper}
      style={{ position: "fixed", top: 64, left: 0, width: "100%", height: "calc(100% - 64px)", background: "#000" }}
    >
      <iframe src={src} title={title} allow={allow} style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
      {supported && (
        <IconButton
          onClick={toggle}
          aria-label={label}
          title={label}
          size="small"
          sx={{
            position: "absolute",
            right: 12,
            bottom: 12,
            color: "#fff",
            bgcolor: "rgba(0, 0, 0, 0.45)",
            opacity: 0.7,
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.65)", opacity: 1 },
          }}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      )}
    </div>
  );
}
