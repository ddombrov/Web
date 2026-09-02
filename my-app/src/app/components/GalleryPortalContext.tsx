"use client";

import { createContext, useContext, useState } from "react";

// Where flying skill chips / cards land once they detach from the timeline.
// Set by JourneyGalleryOverlay's own DOM nodes once it mounts; read by
// TimelineEntry and SkillChips so they know where to portal a matching
// chip/card to when a filter is active.
type GalleryPortalValue = {
  cardsTarget: HTMLDivElement | null;
  skillsTarget: HTMLDivElement | null;
  setCardsTarget: (el: HTMLDivElement | null) => void;
  setSkillsTarget: (el: HTMLDivElement | null) => void;
};

const Ctx = createContext<GalleryPortalValue | null>(null);

export function GalleryPortalProvider({ children }: { children: React.ReactNode }) {
  const [cardsTarget, setCardsTarget] = useState<HTMLDivElement | null>(null);
  const [skillsTarget, setSkillsTarget] = useState<HTMLDivElement | null>(null);
  return (
    <Ctx.Provider value={{ cardsTarget, skillsTarget, setCardsTarget, setSkillsTarget }}>
      {children}
    </Ctx.Provider>
  );
}

export function useGalleryPortal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGalleryPortal must be used within GalleryPortalProvider");
  return ctx;
}
