"use client";

import { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

type Props = { src: string; title: string; allow: string };

// On a phone the project opens covering the whole window, the site's top bar included. Browsers only allow
// real full screen after a tap (and iPhone Safari not at all for page elements), so covering the window is
// the default there, and the button adds real full screen where the browser supports it.
export default function EmbeddedApp({ src, title, allow }: Props) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [covering, setCovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) setCovering(true);
    const onChange = () => setIsFullscreen(document.fullscreenElement === wrapper.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const expanded = covering || isFullscreen;

  const toggle = () => {
    if (expanded) {
      if (document.fullscreenElement) document.exitFullscreen();
      setCovering(false);
    } else if (document.fullscreenEnabled) {
      wrapper.current?.requestFullscreen();
    } else {
      setCovering(true);
    }
  };

  const label = expanded ? "Exit full screen" : "Full screen";

  return (
    <div
      ref={wrapper}
      style={{
        position: "fixed",
        top: covering ? 0 : 64,
        left: 0,
        width: "100%",
        height: covering ? "100%" : "calc(100% - 64px)",
        zIndex: covering ? 1300 : undefined,
        background: "#000",
      }}
    >
      <iframe src={src} title={title} allow={allow} style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
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
        {expanded ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </div>
  );
}
