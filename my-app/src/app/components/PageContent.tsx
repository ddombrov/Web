import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "./icons/GitHubIcon";
import Reveal from "./Reveal";
import Hi from "./Highlight";
import RevealHeading from "./RevealHeading";
import ProjectsGrid from "./ProjectsGrid";
import ContactForm from "./ContactForm";
import LinkedInPosts from "./LinkedInPosts";
import { textShadow, dropShadow, chipSx } from "./styles";

// Each section continues the descent from the hero's dirt-brown fade
// (#332D14) down toward near-black at Contact, so sections read as distinct
// stops on one journey rather than one flat color for the whole page.
const aboutBg = "linear-gradient(180deg, #332D14 0%, #3B331D 100%)";
const skillsBg = "linear-gradient(180deg, #3B331D 0%, #2F2816 100%)";
const experienceBg = "linear-gradient(180deg, #2F2816 0%, #241F10 100%)";
const projectsBg = "linear-gradient(180deg, #241F10 0%, #1A160C 100%)";
const contactBg = "linear-gradient(180deg, #1A160C 0%, #0F0C07 100%)";

const languages = ["Python", "JavaScript", "Java", "C", "Dart", "R", "SQL", "HTML", "CSS"];
const technologies = [
  "React", "TypeScript", "Next.js", "Django", "FastAPI", "Spring Boot", "Flutter", "Flask",
  "AWS", "Terraform", "Hasura", "Docker", "Fastify", "Git", "PostgreSQL", "Firebase", "Supabase", "Pandas",
];

function SkillChips({ items }: { items: string[] }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
      {items.map((s) => (
        <Chip key={s} label={s} size="small" variant="outlined" sx={chipSx} />
      ))}
    </Box>
  );
}

// Deterministic (not Math.random — same hydration issue this project hit
// once before) per-chip bob: varied duration/delay/amplitude by index so a
// whole field of chips drifts asynchronously instead of in lockstep.
function floatSx(i: number) {
  const duration = 3 + (i % 5) * 0.4;
  const delay = (i % 7) * 0.3;
  const amplitude = 5 + (i % 3) * 3;
  return {
    display: "inline-flex",
    animation: `floatChip${amplitude} ${duration}s ease-in-out ${delay}s infinite`,
    [`@keyframes floatChip${amplitude}`]: {
      "0%, 100%": { transform: "translateY(0px)" },
      "50%": { transform: `translateY(-${amplitude}px)` },
    },
    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
  };
}

function FloatingSkillChips({ items }: { items: string[] }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
      {items.map((s, i) => (
        <Chip key={s} label={s} variant="outlined" sx={{ ...chipSx, ...floatSx(i) }} />
      ))}
    </Box>
  );
}

// Vertical timeline entry: a dot + connecting line beside the content,
// instead of a repeated heading/paragraph block for every role.
function TimelineEntry({
  logo,
  logoAlt,
  title,
  subtitle,
  skills,
  isLast = false,
  children,
}: {
  logo?: string;
  logoAlt?: string;
  title: string;
  subtitle: string;
  skills: string[];
  isLast?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", gap: { xs: 2, md: 3 } }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 0.75 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            flexShrink: 0,
            bgcolor: "secondary.main",
            boxShadow: "0 0 0 4px rgba(255,255,255,0.08)",
          }}
        />
        {!isLast && <Box sx={{ flex: 1, width: 2, bgcolor: "rgba(255,255,255,0.2)", mt: 1 }} />}
      </Box>
      <Box sx={{ flex: 1, pb: 6, minWidth: 0 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexWrap: "wrap" }}>
          {logo && (
            <Image src={logo} alt={logoAlt ?? ""} width={56} height={56} style={{ objectFit: "contain", filter: dropShadow }} />
          )}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h5" component="h3" sx={{ color: "#fff", textShadow }}>
              {title}
            </Typography>
            <Typography variant="body2" fontStyle="italic" sx={{ color: "rgba(255,255,255,0.8)", textShadow }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>

        <SkillChips items={skills} />

        {children}
      </Box>
    </Box>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <List dense sx={{ mt: 1 }}>
      {items.map((item, i) => (
        <ListItem key={i} sx={{ py: 0.25 }}>
          <ListItemText primary={<Box sx={{ color: "#EDEFF3", textShadow }}>{item}</Box>} />
        </ListItem>
      ))}
    </List>
  );
}

// Testimonial card: a quote mark + left accent bar instead of yet another
// bordered rectangle, so recommendations read distinctly from timeline entries.
function RecommendationCard({
  name,
  title,
  relationship,
  quote,
}: {
  name: string;
  title: string;
  relationship: string;
  quote: string;
}) {
  return (
    <Box sx={{ borderLeft: "3px solid", borderColor: "secondary.main", pl: 3, py: 0.5 }}>
      <Typography
        aria-hidden
        sx={{ color: "secondary.main", fontSize: "3rem", lineHeight: 0.6, fontFamily: "Georgia, serif" }}
      >
        &ldquo;
      </Typography>
      <Stack spacing={1.5} sx={{ mt: -2 }}>
        {quote.split("\n\n").map((para, i) => (
          <Typography key={i} variant="body1" fontStyle="italic" sx={{ color: "#EDEFF3", textShadow }}>
            {para}
          </Typography>
        ))}
      </Stack>
      <Typography variant="subtitle2" sx={{ color: "#fff", textShadow, mt: 2 }}>
        {name}
      </Typography>
      <Typography variant="caption" display="block" sx={{ color: "rgba(255,255,255,0.7)", textShadow }}>
        {title}
      </Typography>
      <Typography variant="caption" display="block" sx={{ color: "rgba(255,255,255,0.55)", textShadow }}>
        {relationship}
      </Typography>
    </Box>
  );
}

const recommendations = [
  {
    name: "Purvi Patel",
    title: "Regional Manager (Canada), University of Guelph",
    relationship: "Managed Daniel directly · December 5, 2025",
    quote:
      "Daniel participated in a prospective student information event and shared his valuable experiences with future computing students. He was a pleasure to work with as he was professional, dependable and enthusiastic. He is an excellent public speaker. I recommend Daniel for any future endeavors.",
  },
  {
    name: "Monica Cojocaru",
    title: "Associate Dean, Research and Graduate Studies, University of Guelph",
    relationship: "Senior to Daniel, did not manage him directly · October 24, 2024",
    quote:
      "I had the pleasure of working with Daniel Dombrovsky during his time as a Research Web Developer Co-op student at the College of Engineering and Physical Sciences. Daniel exceeded expectations by taking full ownership of designing and developing the AI4CastingHub website, a key initiative advancing research collaboration in disease forecasting. His technical expertise, attention to detail, and ability to create a user-friendly, professional site were praised by faculty, staff, and external partners alike. Daniel's collaboration skills and eagerness to continuously improve made him an invaluable asset to my team.",
  },
  {
    name: "Dr. Bethany Davidson-Eng",
    title: "College Research Manager, College of Engineering and Physical Sciences, University of Guelph",
    relationship: "Managed Daniel directly · September 4, 2024",
    quote:
      "Daniel Dombrovsky was the Research Web Developer and Communications Assistant Co-op student with the College of Engineering and Physical Sciences Dean's Office. Daniel's performance during his four-month term was exceptional, exceeded our expectations and set a new standard for co-op students in our office.\n\nDaniel's innovative approach was evident from the outset. Tasked with gathering data for our annual research output report—a process that typically consumes two weeks of staff time—Daniel chose to tackle the challenge with a creative solution. Rather than completing the task manually, he developed a sophisticated web scraper tool that streamlined data collection. This tool drastically reduced the time required to compile the report from days to mere minutes, saving our office dozens of hours of labor and significantly increasing efficiency. This proactive and inventive solution not only resolved the immediate task but will continue to benefit our office well beyond Daniel's term.\n\nOne of Daniel's notable accomplishments was his work on the website for one of our new initiatives. Initially, the expectation was for Daniel to lay the groundwork for the new manager to develop the site further in Fall 2024. However, Daniel exceeded these expectations by completing the website himself. His dedication and expertise ensured that the site will be launched at the Initiative Launch event this September 2024, a testament to his exceptional work ethic and commitment. His ability to work confidently and effectively with faculty, staff, industry, and government representatives to achieve this goal is a clear indication of his professional integrity and skill.\n\nIn addition to his technical achievements, Daniel has had a remarkable impact on staff morale and the quality of work within our team. His friendly, engaging demeanor and willingness to assist wherever needed made him a pleasure to work with. His enthusiasm and positive attitude fostered a collaborative and supportive work environment, which was greatly appreciated by both colleagues and supervisors.",
  },
];

export default function PageContent() {
  return (
    <>
      {/* About */}
      <Box id="about" sx={{ py: { xs: 10, md: 16 }, background: aboutBg, position: "relative", zIndex: 1 }}>
        <Reveal>
        <Container maxWidth="md">
          <RevealHeading text="About Me" />
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 4, md: 6 }, alignItems: "flex-start" }}>
            <Box sx={{ flexShrink: 0, mx: { xs: "auto", md: 0 }, textAlign: "center" }}>
              <Image
                src="/me.jpg"
                alt="Image of Me"
                width={220}
                height={294}
                style={{ borderRadius: 8, objectFit: "cover", filter: dropShadow }}
              />
              <Typography variant="caption" display="block" sx={{ color: "rgba(255,255,255,0.75)", textShadow, mt: 1 }}>
                This is a photo of me during the Fall 2023 semester.
              </Typography>
            </Box>

            <Stack spacing={3} sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow }}>
                My name is Daniel Dombrovsky. I am currently a student at the
                University of Guelph in the Bachelor of Computing program, majoring
                in Software Engineering with Co-op. I love being involved in my
                community by attending computing events, joining clubs, and
                meeting new people. My courses have refined my back-end development
                skills, which are complemented by the hands-on experience I gained
                in front-end development through my extracurriculars. I thrive at
                working in collaborative environments and creating innovative
                solutions to intricate problems.
              </Typography>
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow }}>
                Outside of university, I am interested in baking, I love trying new
                recipes I come across online and cooking family recipes at home. I
                love biking with my family and spending time outside during the
                Summer. I currently live in Cambridge and cannot wait to complete
                my degree to travel the world.
              </Typography>
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow }}>
                A fun fact about me is that I have previously broken my left leg,
                my right leg, and had a fingernail come off.
              </Typography>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.18)", my: 1 }} />

              <Typography variant="h6" sx={{ color: "#fff", textShadow }}>
                Education
              </Typography>
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow }}>
                University of Guelph — Bachelor of Computing, Software Engineering
                Co-op (GPA <Hi>3.84</Hi>), Expected May 2027
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", textShadow }}>
                Minoring in Culture and Technology Studies · Entrance Scholarship
                (2022) · Dean&apos;s Honour List (2022–2023)
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", textShadow }}>
                Courses: Data Structures, Algorithms, Software Development,
                Object-Oriented Programming, Web Development
              </Typography>

              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 1 }}>
                St. Benedict Catholic Secondary School — High School Diploma,
                STEM, Sep 2018 – Jun 2022
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", textShadow }}>
                Member of Robotics Club, Coding Club, Math Club, Business Club,
                and Debate Team · Co-founded Tech Summit, a club discussing
                current tech news during COVID · Student Council, editing
                promotional videos and updating the school&apos;s website
              </Typography>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.18)", my: 1 }} />

              <Typography variant="h6" sx={{ color: "#fff", textShadow }}>
                Honors &amp; Awards
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  flexDirection: { xs: "column", sm: "row" },
                  textAlign: "left",
                }}
              >
                <Box
                  component="a"
                  href="/coop-nomination.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ flexShrink: 0, mx: { xs: "auto", sm: 0 } }}
                >
                  <Image
                    src="/coop-nomination.jpg"
                    alt="Co-op Employee of the Year Nomination certificate"
                    width={110}
                    height={143}
                    style={{ borderRadius: 6, objectFit: "cover", filter: dropShadow }}
                  />
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow }}>
                    Co-op Employee of the Year Nomination
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", textShadow }}>
                    Issued by University of Guelph — Experiential Learning · Aug 2024
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", textShadow }}>
                    Associated with College of Engineering and Physical Sciences,
                    University of Guelph
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Container>
        </Reveal>
      </Box>

      {/* Skills */}
      <Box id="skills" sx={{ py: { xs: 10, md: 16 }, background: skillsBg, position: "relative", zIndex: 1 }}>
        <Reveal>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{ color: "#fff", textAlign: "center", mb: 6, fontSize: { xs: "2rem", md: "2.75rem" }, textShadow }}
          >
            Skills
          </Typography>
          <Stack spacing={4}>
            <Box>
              <Typography variant="h6" sx={{ color: "#fff", textShadow, mb: 2 }}>
                Languages
              </Typography>
              <FloatingSkillChips items={languages} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: "#fff", textShadow, mb: 2 }}>
                Technologies
              </Typography>
              <FloatingSkillChips items={technologies} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: "#fff", textShadow, mb: 2 }}>
                Certifications
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Box
                  component="a"
                  href="/care-ai-cert.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ flexShrink: 0 }}
                >
                  <Image
                    src="/care-ai-cert.png"
                    alt="CARE-AI certificate of completion"
                    width={110}
                    height={143}
                    style={{ borderRadius: 6, objectFit: "cover", filter: dropShadow }}
                  />
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow }}>
                    Introducing Artificial Intelligence: Training for the Road Ahead
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", textShadow }}>
                    CARE-AI, University of Guelph · Issued Jan 2024
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Container>
        </Reveal>
      </Box>

      {/* Experience */}
      <Box id="experience" sx={{ py: { xs: 10, md: 16 }, background: experienceBg, position: "relative", zIndex: 1 }}>
        <Reveal>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{ color: "#fff", textAlign: "center", mb: 6, fontSize: { xs: "2rem", md: "2.75rem" }, textShadow }}
          >
            Experience
          </Typography>
          <Box>
            <TimelineEntry
              title="Software Engineer Intern"
              subtitle="Jan 2026 – Present · Pepper, Toronto, Ontario"
              skills={["React", "TypeScript", "Python", "AWS Lambda", "Postgres", "Terraform", "Django", "Hasura/GraphQL", "FastAPI", "Fastify"]}
            >
              <BulletList
                items={[
                  <>Built and shipped an internal EDI operations dashboard giving field engineers real-time visibility into <Hi>921</Hi> suppliers and <Hi>1,667</Hi> integration pipelines processing roughly <Hi>40,000</Hi> EDI runs a day across <Hi>30+</Hi> ERP systems</>,
                  <>Built a recurring-route planner that was a committed requirement in a <Hi>$99k ARR</Hi> / <Hi>~$297k TCV</Hi> distributor contract close, shipping a sales-rep task manager now covering <Hi>17</Hi> active routes across <Hi>178</Hi> accounts</>,
                  <>Owned and shipped a multi-tenant credit-application and automated-underwriting platform end to end with FCRA-compliant decisioning, launching a self-serve form builder and reviewer dashboard to <Hi>8</Hi> pilot distributor tenants</>,
                  <>Designed the customer-facing successor to the EDI dashboard, currently in progress — moving failure alerting from internal-only visibility into the core product</>,
                ]}
              />
            </TimelineEntry>

            <TimelineEntry
              title="Software Engineer Intern"
              subtitle="Feb 2025 – Dec 2025 · Lapis, Toronto, Ontario"
              skills={["Next.js", "TypeScript", "Supabase", "Google OAuth", "Microsoft OAuth", "CRON"]}
            >
              <BulletList
                items={[
                  <>Architected a high-performance company dashboard, cutting load times from <Hi>4.9s</Hi> to <Hi>200ms</Hi></>,
                  <>Integrated Notion and OneDrive APIs, allowing clients to import databases and files in a single click</>,
                  <>Implemented secure authentication with Google and Microsoft OAuth and custom role-based access control</>,
                  <>Automated nightly Supabase backups with CRON jobs, protecting <Hi>1.6 TB</Hi> of client data across <Hi>31</Hi> accounts</>,
                ]}
              />
            </TimelineEntry>

            <TimelineEntry
              title="Software Engineer Intern"
              subtitle="May 2025 – Aug 2025 · Canadian Institute for Health Information, Toronto, Ontario"
              skills={["Python", "Spring Boot", "UML"]}
            >
              <BulletList
                items={[
                  <>Streamlined <Hi>80%</Hi> of manual data processing by developing Python scripts for healthcare data model conversions</>,
                  <>Designed AI workflows for healthcare data analysis, automating <Hi>19</Hi> weekly review tasks for the data team</>,
                  <>Contributed to national UML diagram standards adopted by <Hi>6,000+</Hi> healthcare facilities across Canada</>,
                  <>Migrated a legacy healthcare data reporting service to Spring Boot, reducing service maintenance costs by <Hi>30%</Hi></>,
                ]}
              />
            </TimelineEntry>

            <TimelineEntry
              title="Marketing Team Member (Volunteer)"
              subtitle="Jan 2025 – Apr 2025 · Guelph Coding Community, Guelph, Ontario"
              skills={[]}
            >
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                Volunteered on the marketing team promoting the Guelph Coding
                Community&apos;s events and initiatives to local students.
              </Typography>
            </TimelineEntry>

            <TimelineEntry
              title="Software Engineer Intern"
              subtitle="May 2024 – Aug 2024 · University of Guelph, Guelph, Ontario"
              skills={["Python", "R", "Plotly", "BeautifulSoup", "Selenium"]}
            >
              <BulletList
                items={[
                  <>Launched an accessible platform for collaboration on disease research modeling used by <Hi>70+</Hi> faculty members</>,
                  <>Built interactive Plotly and R dashboards for hospitalization predictions, supporting <Hi>3</Hi> active research studies</>,
                  <>Accelerated faculty data collection by <Hi>99%</Hi> by engineering a web scraper, extracting data from <Hi>1,000+</Hi> Google Scholar pages in minutes instead of days of manual entry</>,
                ]}
              />
            </TimelineEntry>

            <TimelineEntry
              logo="/gdscLogo.png"
              logoAlt="GDSC logo"
              title="Director of Technical Events"
              subtitle="Sep 2022 – Aug 2023 · Google Developer Student Club, Guelph, Ontario"
              skills={["Git", "Flutter", "React", "Gemini AI"]}
            >
              <BulletList
                items={[
                  <>Organized a <Hi>250+</Hi> person hackathon with <Hi>45</Hi> project submissions and speakers from Google and Echo3D</>,
                  <>Strengthened technical skills across <Hi>200+</Hi> students through workshops on Git, Flutter, React, and Gemini AI</>,
                  <>Grew club membership from <Hi>0</Hi> to <Hi>300+</Hi> students, making it the largest computer science club on campus</>,
                  <>Secured <Hi>$30,000+</Hi> in sponsorships from <Hi>14</Hi> companies to fund <Hi>25+</Hi> technical events and hackathon prizes</>,
                ]}
              />
            </TimelineEntry>

            <TimelineEntry
              logo="/socisLogo.png"
              logoAlt="SOCIS logo"
              title="SOCIS President"
              subtitle="Dec 2023 – Present · Guelph, Ontario, Canada"
              skills={["Leadership", "Budgeting", "Event Planning"]}
              isLast
            >
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                I took over as the president of the Society of Computing and
                Informational Science during a chaotic time for the club and I
                began rebuilding the club. I led the executive team to success
                by organizing meetings, meticulously planning out the budget,
                and advocating for computing students at faculty curriculum
                meetings. The club also launched brand new computing merch to
                represent Guelph Computing, which was very popular with
                students.
              </Typography>

              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                Some of our most successful events for the club were:
              </Typography>
              <BulletList
                items={[
                  <>Study Night (<Hi>50</Hi> people)</>,
                  <>Games Night (<Hi>60</Hi> people)</>,
                  <>Coding Competition (<Hi>75</Hi> people)</>,
                ]}
              />

              <Box sx={{ mt: 2 }}>
                <Image
                  src="/group.jpg"
                  alt="Image of computing community"
                  width={300}
                  height={200}
                  style={{ borderRadius: 8, objectFit: "cover", filter: dropShadow }}
                />
                <Typography variant="caption" display="block" sx={{ color: "rgba(255,255,255,0.75)", textShadow, mt: 1 }}>
                  The above image is a group picture of all the computing
                  leaders coming together at the SOCIS Election Social event to
                  welcome the newcomers.
                </Typography>
              </Box>
            </TimelineEntry>
          </Box>

          <Stack spacing={4} sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ color: "#fff", textShadow, textAlign: "center" }}>
              Recommendations
            </Typography>
            {recommendations.map((r) => (
              <RecommendationCard key={r.name} {...r} />
            ))}
          </Stack>
        </Container>
        </Reveal>
      </Box>

      {/* Projects */}
      <Box id="projects" sx={{ py: { xs: 10, md: 16 }, background: projectsBg, position: "relative", zIndex: 1 }}>
        <Reveal>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{ color: "#fff", textAlign: "center", mb: 6, fontSize: { xs: "2rem", md: "2.75rem" }, textShadow }}
          >
            Projects
          </Typography>
          <ProjectsGrid />
        </Container>
        </Reveal>
      </Box>

      {/* Contact */}
      <Box id="contact" sx={{ py: { xs: 10, md: 14 }, textAlign: "center", background: contactBg, position: "relative", zIndex: 1 }}>
        <Reveal>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ color: "#fff", mb: 1, textShadow }}>
            Contact Me
          </Typography>
          <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mb: 4 }}>
            Feel free to check out my GitHub, LinkedIn, or send me a message below.
          </Typography>
          <LinkedInPosts />
          <ContactForm />
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 5, mb: 4 }}>
            <IconButton component="a" href="https://github.com/ddombrov" aria-label="GitHub" sx={{ color: "#fff" }}>
              <GitHubIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.linkedin.com/in/daniel-dombrovsky-9d/"
              aria-label="LinkedIn"
              sx={{ color: "#fff" }}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton component="a" href="mailto:ddombrov@uoguelph.ca" aria-label="Email" sx={{ color: "#fff" }}>
              <EmailIcon />
            </IconButton>
          </Stack>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", textShadow }}>
            © 2026 Daniel Dombrovsky
          </Typography>
        </Container>
        </Reveal>
      </Box>
    </>
  );
}
