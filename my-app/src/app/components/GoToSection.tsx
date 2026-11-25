"use client";

import { useEffect } from "react";
import { useJourneyFilter } from "./JourneyFilterContext";
import { SECTION_PATHS } from "./sections";

/** Opens the home page at the section its address names, once the page has drawn. */
export default function GoToSection({ path }: { path: string }) {
  const { setFilter } = useJourneyFilter();
  useEffect(() => {
    const target = SECTION_PATHS[path];
    if (!target) return;
    // A filter opens in front of the Journey, so the page behind it sits at the Journey too.
    if ("filter" in target) setFilter(target.filter);
    const id = "filter" in target ? "experience" : target.scroll;
    let tries = 0;
    const go = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "auto" });
      else if (tries++ < 40) setTimeout(go, 50);
    };
    setTimeout(go, 100);
  }, [path, setFilter]);
  return null;
}
