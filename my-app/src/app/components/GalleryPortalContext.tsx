"use client";

import { createContext, useContext, useRef, useState } from "react";

// Where flying skill chips / cards land once they detach from the timeline.
// Set by JourneyGalleryOverlay's own DOM nodes once it mounts; read by
// TimelineEntry and SkillChips so they know where to portal a matching
// chip/card to when a filter is active.
type GalleryPortalValue = {
  cardsTarget: HTMLDivElement | null;
  skillsTarget: HTMLDivElement | null;
  setCardsTarget: (el: HTMLDivElement | null) => void;
  setSkillsTarget: (el: HTMLDivElement | null) => void;
  // Each mounted card's SkillChips registers here so the same skill listed
  // on several cards is only flown into the skills cloud once.
  registerSkills: (entryId: string, el: HTMLElement, items: string[]) => () => void;
  isSkillOwner: (entryId: string, skill: string) => boolean;
  mountedSkills: () => Set<string>;
};

const Ctx = createContext<GalleryPortalValue | null>(null);

export function GalleryPortalProvider({ children }: { children: React.ReactNode }) {
  const [cardsTarget, setCardsTarget] = useState<HTMLDivElement | null>(null);
  const [skillsTarget, setSkillsTarget] = useState<HTMLDivElement | null>(null);
  const registry = useRef(new Map<string, { el: HTMLElement; items: string[] }>());

  const registerSkills = (entryId: string, el: HTMLElement, items: string[]) => {
    registry.current.set(entryId, { el, items });
    return () => {
      registry.current.delete(entryId);
    };
  };

  // The owner of a skill is the first mounted card (in page order) listing it.
  const isSkillOwner = (entryId: string, skill: string) => {
    let owner: { id: string; el: HTMLElement } | null = null;
    registry.current.forEach((v, id) => {
      if (!v.items.includes(skill)) return;
      if (!owner || owner.el.compareDocumentPosition(v.el) & Node.DOCUMENT_POSITION_PRECEDING) owner = { id, el: v.el };
    });
    return (owner as { id: string } | null)?.id === entryId;
  };

  const mountedSkills = () => {
    const all = new Set<string>();
    registry.current.forEach((v) => v.items.forEach((s) => all.add(s)));
    return all;
  };

  return (
    <Ctx.Provider
      value={{ cardsTarget, skillsTarget, setCardsTarget, setSkillsTarget, registerSkills, isSkillOwner, mountedSkills }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useGalleryPortal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGalleryPortal must be used within GalleryPortalProvider");
  return ctx;
}
