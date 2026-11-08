export const skillCategories = [
  "Languages",
  "Frameworks & Libraries",
  "Tools & Technologies",
  "Soft & Professional Skills",
] as const;

const byCategory: string[][] = [
  ["Python", "JavaScript", "TypeScript", "Java", "C", "Dart", "R", "SQL", "HTML", "CSS"],
  [
    "React", "Next.js", "Django", "FastAPI", "Fastify", "Spring Boot", "Flutter", "jQuery",
    "Material UI", "Tailwind CSS", "Pandas", "Plotly", "BeautifulSoup", "Selenium", "Swing", "JUnit",
  ],
  [
    "Firebase", "Firestore", "Supabase", "Postgres", "Hasura/GraphQL", "AWS Lambda", "Terraform",
    "Adyen", "Plaid", "OpenAI", "ElevenLabs", "Gemini", "Google Maps", "Google Places",
    "Google OAuth", "Microsoft OAuth", "Reddit", "Ticketmaster", "CRON", "UML", "Active Directory",
  ],
  [
    "Time Management", "Public Speaking", "Leadership", "Budgeting", "Event Planning", "Teamwork",
    "Communication", "Responsibility", "Organization", "Attention to Detail", "Safety Management",
    "Planning", "Mentorship", "Performance Evaluation", "Problem Solving", "Marketing",
    "Social Media Management", "Graphic Design", "Community Outreach",
  ],
];

const placement = new Map<string, { cat: number; rank: number }>();
byCategory.forEach((skills, cat) => {
  [...skills]
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .forEach((s, rank) => placement.set(s, { cat, rank }));
});

// A skill not listed above falls into the last category, after the listed ones.
export function skillCategoryIndex(label: string) {
  return placement.get(label)?.cat ?? skillCategories.length - 1;
}

// CSS flex `order`: grouped by category, alphabetical within it. Category
// headings sit at (index * 1000 - 1), just ahead of their chips.
export function skillOrder(label: string) {
  const p = placement.get(label);
  return (p?.cat ?? skillCategories.length - 1) * 1000 + (p?.rank ?? 999);
}
