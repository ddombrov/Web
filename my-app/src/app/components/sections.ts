import type { JourneyFilter } from "./JourneyFilterContext";

// Each part of the home page has its own address, so /about-me, /skills and the rest open the home page there.
// Scroll targets are sections on the page; filters open the Skills, Experience or Projects view of the Journey.
export type SectionTarget = { scroll: string } | { filter: Exclude<JourneyFilter, null> };

export const SECTION_PATHS: Record<string, SectionTarget> = {
  "/about-me": { scroll: "about" },
  "/my-journey": { scroll: "experience" },
  "/journey": { scroll: "experience" },
  "/skills": { filter: "skills" },
  "/experience": { filter: "experience" },
  "/projects": { filter: "projects" },
  "/contact": { scroll: "contact" },
};

/** The path without a trailing slash, so "/about-me/" and "/about-me" match. */
export const cleanPath = (p: string | null) => (p && p.length > 1 ? p.replace(/\/+$/, "") : p || "/");

/** Whether this path shows the home page (the page itself, or one of its sections). */
export const isHomePath = (p: string | null) => cleanPath(p) === "/" || cleanPath(p) in SECTION_PATHS;

/** The address for a section id or filter, used to keep the address bar in step with where the visitor is. */
export function pathFor(target: { scroll: string } | { filter: string }): string {
  if ("filter" in target) return `/${target.filter}/`;
  const found = Object.entries(SECTION_PATHS).find(([path, t]) => "scroll" in t && t.scroll === target.scroll && path !== "/journey");
  return found ? `${found[0]}/` : "/";
}
