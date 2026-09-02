import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Image from "next/image";
import { textShadow, chipSx } from "./styles";
import Hi from "./Highlight";
import GitHubIcon from "./icons/GitHubIcon";
import Reveal from "./Reveal";

type ProjectImage = { src: string; alt: string; width: number; height: number };

type Project = {
  title: string;
  meta?: string;
  skills: string[];
  description: React.ReactNode;
  images: ProjectImage[];
  githubUrl: string;
  // Gradient stand-in for a screenshot, used until a real one is provided.
  placeholderGradient: string;
};

const projects: Project[] = [
  {
    title: "Canadian-Origin Barcode Scanner",
    skills: ["Flutter", "Dart", "Firestore"],
    description: (
      <>
        Developed a barcode scanning app that retrieves product and
        sustainability information for <Hi>1M+</Hi> products. Leveraged
        Firestore for data management, implementing social features, profile
        settings, and accessibility modes.
      </>
    ),
    images: [],
    githubUrl: "https://github.com/ddombrov/oh_scanada",
    placeholderGradient: "linear-gradient(135deg, #3B331D 0%, #D98E33 100%)",
  },
  {
    title: "AI Voice Caller",
    skills: ["Next.js", "OpenAI", "ElevenLabs", "Python", "React", "Firebase", "Material UI"],
    description: (
      <>
        Produced an AI-driven app to automate voice calls to businesses and
        clients for booking appointments or meetings. Synthesized emotional
        dialogue through OpenAI and ElevenLabs APIs, using Twilio to deliver
        calls to users.
      </>
    ),
    images: [],
    githubUrl: "https://github.com/ddombrov/HackThe6ix2024",
    placeholderGradient: "linear-gradient(135deg, #1B2A41 0%, #7498C7 100%)",
  },
  {
    title: "Baby Names Frequency Tracker",
    meta: "January 2023 – April 2023",
    skills: ["Python", "Pandas"],
    description: (
      <>
        In Software Design II, me and a group of four collaborated developed
        a user-friendly menu together, that allowed users to track
        names&apos; popularities across time and determine their ethnicities.
        This was implemented by normalizing CSV files to a standard format
        and converting them to Pandas data frames in Python.
      </>
    ),
    images: [{ src: "/babyNames.png", alt: "Baby Names Image", width: 600, height: 338 }],
    githubUrl: "https://github.com/ddombrov/BabyNamesFrequencyProject",
    placeholderGradient: "linear-gradient(135deg, #241F10 0%, #4C6289 100%)",
  },
  {
    title: "Billiards Pool Game Simulator",
    meta: "Jan 2024 – April 2024",
    skills: ["C", "Python", "JavaScript", "jQuery", "SQL", "HTML", "CSS"],
    description: (
      <>
        In CIS*2750, Software Systems Development and Integration, I
        programmed a C physics library to simulate billiards ball collisions,
        and then I integrated the program with a Python-based web server to
        dynamically generate SVG images onto an HTML website.
      </>
    ),
    images: [
      { src: "/table-0.svg", alt: "Table 0", width: 300, height: 300 },
      { src: "/table-1.svg", alt: "Table 1", width: 300, height: 300 },
      { src: "/table-2.svg", alt: "Table 2", width: 300, height: 300 },
      { src: "/table-3.svg", alt: "Table 3", width: 300, height: 300 },
    ],
    githubUrl: "https://github.com/ddombrov/Billards-Game",
    placeholderGradient: "linear-gradient(135deg, #332D14 0%, #6E7F9C 100%)",
  },
];

export default function ProjectsGrid() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 4,
      }}
    >
      {projects.map((p, i) => (
        <Reveal key={p.title} direction="up" delay={i * 0.08}>
        <Box
          sx={{
            transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease",
            borderRadius: 2,
            "&:hover": {
              transform: "translateY(-10px) scale(1.02)",
              boxShadow: "0 22px 44px -14px rgba(0,0,0,0.6)",
              "& .project-media img": { transform: "scale(1.08)" },
              "& .project-media": { boxShadow: "0 0 0 2px rgba(255,255,255,0.35)" },
            },
          }}
        >
          <Box
            className="project-media"
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: 2,
              overflow: "hidden",
              background: p.placeholderGradient,
              transition: "box-shadow 0.4s ease",
            }}
          >
            {p.images.length === 1 ? (
              <Image
                src={p.images[0].src}
                alt={p.images[0].alt}
                fill
                style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
              />
            ) : p.images.length > 1 ? (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "2px",
                  p: "2px",
                }}
              >
                {p.images.map((img) => (
                  <Box key={img.src} sx={{ position: "relative", bgcolor: "#fff" }}>
                    <Image src={img.src} alt={img.alt} fill style={{ objectFit: "contain" }} />
                  </Box>
                ))}
              </Box>
            ) : null}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <Typography variant="h6" component="h3" sx={{ color: "#fff", textShadow }}>
              {p.title}
            </Typography>
            <Box
              component="a"
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.title} on GitHub`}
              sx={{ color: "rgba(255,255,255,0.75)", display: "inline-flex", "&:hover": { color: "#fff" } }}
            >
              <GitHubIcon fontSize="small" />
            </Box>
          </Box>
          {p.meta && (
            <Typography variant="body2" fontStyle="italic" sx={{ color: "rgba(255,255,255,0.8)", textShadow }}>
              {p.meta}
            </Typography>
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, mb: 1.5 }}>
            {p.skills.map((s) => (
              <Chip key={s} label={s} size="small" variant="outlined" sx={chipSx} />
            ))}
          </Box>
          <Typography variant="body2" sx={{ color: "#EDEFF3", textShadow }}>
            {p.description}
          </Typography>
        </Box>
        </Reveal>
      ))}
    </Box>
  );
}
