import type { IconType } from "react-icons";
import {
  SiPython, SiJavascript, SiOpenjdk, SiDart, SiR, SiHtml5, SiCss,
  SiReact, SiTypescript, SiNextdotjs, SiDjango, SiFastapi, SiSpringboot, SiFlutter,
  SiFlask, SiTerraform, SiHasura, SiDocker, SiFastify, SiGit,
  SiPostgresql, SiFirebase, SiSupabase, SiPandas,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

// Not every language has a real, recognizable brand mark (C and SQL don't),
// so those are simply left without an icon rather than forcing a fake one.
export const skillIcons: Record<string, IconType> = {
  Python: SiPython,
  JavaScript: SiJavascript,
  Java: SiOpenjdk,
  Dart: SiDart,
  R: SiR,
  HTML: SiHtml5,
  CSS: SiCss,
  React: SiReact,
  TypeScript: SiTypescript,
  "Next.js": SiNextdotjs,
  Django: SiDjango,
  FastAPI: SiFastapi,
  "Spring Boot": SiSpringboot,
  Flutter: SiFlutter,
  Flask: SiFlask,
  AWS: FaAws,
  Terraform: SiTerraform,
  Hasura: SiHasura,
  Docker: SiDocker,
  Fastify: SiFastify,
  Git: SiGit,
  PostgreSQL: SiPostgresql,
  Firebase: SiFirebase,
  Supabase: SiSupabase,
  Pandas: SiPandas,
};
