"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export type JourneyFilter = "skills" | "experience" | "projects" | null;

type JourneyFilterValue = {
  filter: JourneyFilter;
  prevFilter: JourneyFilter;
  setFilter: (f: JourneyFilter) => void;
};

const JourneyFilterCtx = createContext<JourneyFilterValue | null>(null);

// Skills, Experience, and Projects don't have their own page sections —
// they're every relevant stop on the Journey timeline instead. Clicking
// one of those nav items sets a filter here; TimelineEntry reads it to
// decide whether to glow into focus or fade back, and Nav reads it to
// scroll to the first match and to show which filter (if any) is active.
//
// prevFilter tracks the value filter held just before its latest change
// (via a ref updated after each commit, so it still reflects the old value
// during the render triggered by that change) — consumers use it to tell a
// slow "reveal" transition (filter went from off to on) apart from a fast
// "hide" one (an entry stopped matching, whether the filter switched or
// cleared), which need very different pacing.
export function JourneyFilterProvider({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<JourneyFilter>(null);
  const prevFilterRef = useRef<JourneyFilter>(null);
  useEffect(() => {
    prevFilterRef.current = filter;
  }, [filter]);
  const value = useMemo(() => ({ filter, prevFilter: prevFilterRef.current, setFilter }), [filter]);
  return <JourneyFilterCtx.Provider value={value}>{children}</JourneyFilterCtx.Provider>;
}

export function useJourneyFilter() {
  const ctx = useContext(JourneyFilterCtx);
  if (!ctx) throw new Error("useJourneyFilter must be used within JourneyFilterProvider");
  return ctx;
}

// Which nav category(s) a timeline entry's tag belongs to.
export function tagMatchesFilter(tag: string | undefined, hasSkills: boolean, filter: JourneyFilter): boolean {
  if (!filter) return true;
  if (filter === "skills") return hasSkills;
  if (filter === "projects") return tag === "Project";
  if (filter === "experience") return tag === "Co-op" || tag === "Part-time" || tag === "Volunteer" || tag === "Extracurriculars";
  return true;
}
