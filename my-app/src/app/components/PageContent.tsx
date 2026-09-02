import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "./icons/GitHubIcon";
import Reveal from "./Reveal";
import Hi from "./Highlight";
import RevealHeading from "./RevealHeading";
import CollapsibleEarlyChapters from "./CollapsibleEarlyChapters";
import TimelineRow from "./TimelineRow";
import CourseList from "./CourseList";
import { terms } from "./courseData";
import { skillIcons } from "./skillIcons";
import ProjectsGrid from "./ProjectsGrid";
import ContactForm from "./ContactForm";
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

function skillIcon(label: string) {
  const Icon = skillIcons[label];
  return Icon ? <Icon size={14} /> : undefined;
}

function SkillChips({ items }: { items: string[] }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
      {items.map((s) => (
        <Chip key={s} label={s} size="small" variant="outlined" icon={skillIcon(s)} sx={chipSx} />
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
        <Chip key={s} label={s} variant="outlined" icon={skillIcon(s)} sx={{ ...chipSx, ...floatSx(i) }} />
      ))}
    </Box>
  );
}

// Every kind of milestone (education, club, co-op, award, certification,
// volunteer role, recommendation) renders through this same entry so the
// whole university journey reads as one continuous, chronologically
// ordered, alternating line. Each entry lives in its own hoverable card,
// slides in from the side it sits on as it scrolls into view and slides
// back out on the way past (once={false}), and its date is shown on the
// rail rather than inside the card — the card itself carries only what
// happened, not when.
function TimelineEntry({
  logo,
  logoAlt,
  tag,
  title,
  org,
  location,
  startDate,
  endDate,
  companyUrl,
  githubUrl,
  skills = [],
  side = "left",
  isLast = false,
  aside,
  children,
}: {
  logo?: string;
  logoAlt?: string;
  tag?: string;
  title: string;
  org?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  companyUrl?: string;
  githubUrl?: string;
  skills?: string[];
  side?: "left" | "right";
  isLast?: boolean;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <TimelineRow side={side} startDate={startDate} endDate={endDate} isLast={isLast} aside={aside}>
      <Reveal direction={side} once={false}>
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 3,
            p: { xs: 2.5, md: 3 },
            transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease, border-color 0.35s ease, background-color 0.35s ease",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 20px 40px -16px rgba(0,0,0,0.6)",
              borderColor: "rgba(255,255,255,0.22)",
              bgcolor: "rgba(255,255,255,0.075)",
            },
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexWrap: "wrap" }}>
            {logo && (
              <Image src={logo} alt={logoAlt ?? ""} width={56} height={56} style={{ objectFit: "contain", filter: dropShadow, flexShrink: 0 }} />
            )}
            <Box sx={{ flex: 1, minWidth: 200 }}>
              {tag && (
                <Typography variant="overline" sx={{ color: "secondary.main", textShadow, letterSpacing: 1.5, display: "block", lineHeight: 1.4 }}>
                  {tag}
                </Typography>
              )}
              <Typography variant="h5" component="h3" sx={{ color: "#fff", textShadow }}>
                {title}
              </Typography>
              {githubUrl && (
                <Box
                  component="a"
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "rgba(255,255,255,0.65)",
                    textShadow,
                    mt: 0.25,
                    "&:hover": { color: "#fff" },
                  }}
                >
                  <GitHubIcon fontSize="small" />
                  <Typography variant="caption">View on GitHub</Typography>
                </Box>
              )}
              {org && (
                <Typography variant="body2" fontStyle="italic" sx={{ color: "rgba(255,255,255,0.8)", textShadow }}>
                  {org}
                  {companyUrl && (
                    <Box
                      component="a"
                      href={companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Company LinkedIn page"
                      sx={{ color: "secondary.main", ml: 0.75, verticalAlign: "middle", display: "inline-flex" }}
                    >
                      <LinkedInIcon fontSize="small" />
                    </Box>
                  )}
                </Typography>
              )}
              {location && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, mt: 0.5 }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.55)" }} />
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", textShadow }}>
                    {location}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {skills.length > 0 && <SkillChips items={skills} />}

          {children}
        </Box>
      </Reveal>
    </TimelineRow>
  );
}

// An empty, dashed-border slot sitting in the timeline's opposite column —
// scaffolding for a real photo to be dropped in later, so the page reads as
// a photo-and-text collage rather than a wall of cards even before any
// images exist yet.
function PhotoSlot({ label = "Photo coming soon" }: { label?: string }) {
  return (
    <Box
      sx={{
        border: "2px dashed rgba(255,255,255,0.16)",
        borderRadius: 3,
        aspectRatio: "4 / 3",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        color: "rgba(255,255,255,0.3)",
      }}
    >
      <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 30 }} />
      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)" }}>
        {label}
      </Typography>
    </Box>
  );
}

// One academic term's courses, rendered as its own timeline entry at that
// term's approximate start month so coursework sits alongside whatever
// else was happening that semester, instead of one giant collapsed blob.
function CourseTermEntry({ label, side }: { label: string; side: "left" | "right" }) {
  const term = terms.find((t) => t.label === label);
  if (!term) return null;
  return (
    <TimelineEntry
      side={side}
      tag={term.upcoming ? "Upcoming" : "Coursework"}
      title={term.label}
      org="University of Guelph"
      startDate={term.date}
    >
      <CourseList courses={term.courses} />
    </TimelineEntry>
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

              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", textShadow }}>
                My full education, awards, and work history are laid out as a
                timeline below, in the order they happened.
              </Typography>
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
          </Stack>
        </Container>
        </Reveal>
      </Box>

      {/* Experience */}
      <Box id="experience" sx={{ py: { xs: 10, md: 16 }, background: experienceBg, position: "relative", zIndex: 1 }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{ color: "#fff", textAlign: "center", mb: 1, fontSize: { xs: "2rem", md: "2.75rem" }, textShadow }}
          >
            My Journey
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)", textShadow, textAlign: "center", mb: 6 }}>
            Education, co-ops, clubs, and recognition, in the order they happened.
          </Typography>
          <Box>
            <CollapsibleEarlyChapters label="2017 – 2023 · Before university (high school, summer jobs)">
              <TimelineEntry
                side="left"
                tag="Job"
                title="Day Camp Volunteer"
                org="YMCA Canada"
                location="Cambridge, Ontario"
                startDate="Jun 2017"
                endDate="Jun 2020"
              >
                <BulletList
                  items={[
                    <>Assisted counsellors with daily camp activities and helped campers who needed support at camp</>,
                    <>Kept children well-behaved while counsellors supervised children and ran different games and activities</>,
                    <>Brought counsellors required items for events including craft supplies, lifejackets, and game equipment</>,
                  ]}
                />
              </TimelineEntry>

              <TimelineEntry
                side="right"
                tag="Education"
                title="High School Diploma, STEM"
                org="St. Benedict Catholic Secondary School"
                location="Cambridge, Ontario"
                startDate="Sep 2018"
                endDate="Jun 2022"
              >
                <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                  Member of Robotics Club, Coding Club, Math Club, Business Club,
                  and Debate Team. Co-founded Tech Summit, a club discussing
                  current tech news during COVID, and served on Student Council
                  editing promotional videos and updating the school&apos;s website.
                </Typography>
              </TimelineEntry>

              <TimelineEntry
                side="left"
                tag="Job"
                title="General Laborer"
                org="Bloomex Canada"
                location="Cambridge, Ontario"
                startDate="Oct 2019"
                endDate="Feb 2022"
                aside={<PhotoSlot />}
              >
                <BulletList
                  items={[
                    <>Kept warehouse inventory organized by sorting boxes of chocolates, cookies, and teddy bears</>,
                    <>Offloaded new shipments of products from trucks and delivered them to different warehouse locations</>,
                    <>Built ten different versions of gift baskets with varieties of sweet treats, flowers, and neat packaging</>,
                  ]}
                />
              </TimelineEntry>

              <TimelineEntry
                side="right"
                tag="Job"
                title="Day Camp Counselor"
                org="YMCA Canada"
                location="Cambridge, Ontario"
                startDate="Jun 2020"
                endDate="Jul 2021"
              >
                <BulletList
                  items={[
                    <>Supervised campers and ensured the safety of children by explaining camp rules and expected behaviours</>,
                    <>Took groups hiking, fishing, kayaking, and reminded them about poison ivy and other outdoor dangers</>,
                    <>Created weekly schedules for counsellor groups, planned craft activities, and organized camp supplies</>,
                  ]}
                />
              </TimelineEntry>

              <TimelineEntry
                side="left"
                tag="Job"
                title="Youth Mentor"
                org="YMCA Canada"
                location="Cambridge, Ontario"
                startDate="Jun 2021"
                endDate="Jul 2023"
                aside={<PhotoSlot />}
              >
                <BulletList
                  items={[
                    <>Taught leaders in training how to work with children, run games, lead activities, and bond with campers</>,
                    <>Lectured students on safety when working with children and the responsibility associated with their role</>,
                    <>Evaluated the leaders in training, providing daily feedback, and submitting results to hiring managers</>,
                  ]}
                />
              </TimelineEntry>
            </CollapsibleEarlyChapters>

            <TimelineEntry
              side="right"
              tag="Education"
              title="Bachelor of Computing, Software Engineering Co-op"
              org="University of Guelph"
              location="Guelph, Ontario"
              startDate="Sep 2022"
              endDate="Expected May 2027"
            >
              <BulletList
                items={[
                  <>Current cumulative GPA <Hi>3.84</Hi>; minoring in Culture and Technology Studies</>,
                  <>Entrance Scholarship (2022)</>,
                  <>Dean&apos;s Honour List (2022–2023)</>,
                ]}
              />
            </TimelineEntry>

            <CourseTermEntry label="Fall 2022" side="left" />

            <TimelineEntry
              logo="/socisLogo.png"
              logoAlt="SOCIS logo"
              side="right"
              tag="Club"
              title="Marketing Committee Member"
              org="SOCIS"
              location="Guelph, Ontario"
              startDate="Sep 2022"
              endDate="Apr 2023"
              skills={["Problem Solving"]}
              aside={<PhotoSlot />}
            >
              <BulletList
                items={[
                  <>Ran the largest event of the year, with an attendance of <Hi>50+</Hi> people for a trivia night</>,
                  <>Independently planned a marketing campaign for events by creating videos, posts, and flyers</>,
                ]}
              />
            </TimelineEntry>

            <CourseTermEntry label="Winter 2023" side="left" />

            <TimelineEntry
              side="right"
              tag="Project"
              title="Baby Names Frequency Tracker"
              startDate="Jan 2023"
              endDate="Apr 2023"
              githubUrl="https://github.com/ddombrov/BabyNamesFrequencyProject"
              skills={["Python", "Pandas"]}
            >
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                In Software Design II, me and a group of four collaborated
                developed a user-friendly menu together, that allowed users to
                track names&apos; popularities across time and determine their
                ethnicities. This was implemented by normalizing CSV files to a
                standard format and converting them to Pandas data frames in
                Python.
              </Typography>
            </TimelineEntry>

            <TimelineEntry
              logo="/socisLogo.png"
              logoAlt="SOCIS logo"
              side="left"
              tag="Club"
              title="Vice President Communications"
              org="SOCIS"
              location="Guelph, Ontario"
              startDate="Apr 2023"
              endDate="Dec 2023"
            >
              <BulletList
                items={[
                  <>Ran study nights, guest speaker talks, Makerspace technology workshops, and other fun events</>,
                  <>Successfully promoted the club in new ways, increasing attendance to <Hi>70+</Hi> people per event</>,
                  <>Managed the club&apos;s online presence through Instagram and Discord; revamped the outdated website</>,
                  <>Designed promotional Instagram posts and physical flyers to market upcoming events and initiatives</>,
                ]}
              />
            </TimelineEntry>

            <CourseTermEntry label="Summer 2023" side="right" />

            <CourseTermEntry label="Fall 2023" side="left" />

            <TimelineEntry
              logo="/gdscLogo.png"
              logoAlt="GDSC logo"
              side="right"
              tag="Club"
              title="Marketing and Publicity Director"
              org="Google Developer Student Club"
              location="Guelph, Ontario"
              startDate="Sep 2023"
              endDate="May 2024"
              skills={["JavaScript", "HTML", "Firebase"]}
              aside={<PhotoSlot />}
            >
              <BulletList
                items={[
                  <>Worked with other executives to plan various technical events averaging <Hi>100+</Hi> attendance</>,
                  <>Led workshops introducing APIs and front-end implementation with JavaScript and HTML</>,
                  <>Taught students how to use and incorporate Google&apos;s Firebase technology into their websites</>,
                  <>Volunteered at Google DevFest Waterloo 2023, a <Hi>300</Hi>-person event, alongside other community leaders</>,
                  <>Marketed all club activity on Instagram and Discord, and managed a team of designers</>,
                  <>Organized a <Hi>200+</Hi> participant hackathon, raising over <Hi>$25,000</Hi> in funding for <Hi>25+</Hi> events</>,
                ]}
              />
            </TimelineEntry>

            <TimelineEntry
              logo="/socisLogo.png"
              logoAlt="SOCIS logo"
              side="left"
              tag="Club"
              title="SOCIS President"
              location="Guelph, Ontario"
              startDate="Dec 2023"
              endDate="May 2024"
              skills={["Time Management", "Public Speaking", "Leadership", "Budgeting", "Event Planning"]}
            >
              <BulletList
                items={[
                  <>Ran <Hi>16</Hi> different events throughout one semester, including coding competitions and circuitry events</>,
                  <>Attended faculty meetings to advocate for computing students on curriculum changes</>,
                  <>Led the organization&apos;s executives and staff, managing <Hi>30</Hi> members across <Hi>5</Hi> committees</>,
                  <>Spearheaded a new initiative to create websites for other university clubs to generate revenue</>,
                ]}
              />

              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                I took over as president during a chaotic time for the club and
                began rebuilding it, meticulously planning out the budget and
                launching brand new computing merch to represent Guelph
                Computing, which was very popular with students.
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

            <CourseTermEntry label="Winter 2024" side="right" />

            <TimelineEntry
              side="left"
              tag="Certification"
              title="Introducing Artificial Intelligence: Training for the Road Ahead"
              org="CARE-AI, University of Guelph"
              startDate="Jan 2024"
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mt: 2 }}>
                <Box component="a" href="/care-ai-cert.png" target="_blank" rel="noopener noreferrer" sx={{ flexShrink: 0 }}>
                  <Image
                    src="/care-ai-cert.png"
                    alt="CARE-AI certificate of completion"
                    width={90}
                    height={117}
                    style={{ borderRadius: 6, objectFit: "cover", filter: dropShadow }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", textShadow }}>
                  Completed through the Centre for Advancing Responsible &amp;
                  Ethical Artificial Intelligence at the University of Guelph.
                </Typography>
              </Box>
            </TimelineEntry>

            <TimelineEntry
              side="right"
              tag="Project"
              title="Billiards Pool Game Simulator"
              startDate="Jan 2024"
              endDate="Apr 2024"
              githubUrl="https://github.com/ddombrov/Billards-Game"
              skills={["C", "Python", "JavaScript", "jQuery", "SQL", "HTML", "CSS"]}
            >
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                In CIS*2750, Software Systems Development and Integration, I
                programmed a C physics library to simulate billiards ball
                collisions, and then I integrated the program with a
                Python-based web server to dynamically generate SVG images
                onto an HTML website.
              </Typography>
            </TimelineEntry>

            <CourseTermEntry label="Summer 2024" side="left" />

            <TimelineEntry
              side="right"
              tag="Co-op"
              title="Software Engineer"
              org="College of Engineering and Physical Sciences, University of Guelph"
              location="Guelph, Ontario"
              startDate="May 2024"
              endDate="Aug 2024"
              companyUrl="https://www.linkedin.com/company/ccmps-uofg"
              skills={["Python", "R", "Plotly", "BeautifulSoup", "Selenium"]}
              aside={
                <Stack spacing={3}>
                  <RecommendationCard {...recommendations[2]} />
                  <RecommendationCard {...recommendations[1]} />
                </Stack>
              }
            >
              <BulletList
                items={[
                  <>Launched an accessible platform for collaboration on disease research modeling used by <Hi>70+</Hi> faculty members</>,
                  <>Built interactive Plotly and R dashboards for hospitalization predictions, supporting <Hi>3</Hi> active research studies</>,
                  <>Accelerated faculty data collection by <Hi>99%</Hi> by engineering a web scraper, extracting data from <Hi>1,000+</Hi> Google Scholar pages in minutes instead of days of manual entry</>,
                ]}
              />

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  flexDirection: { xs: "column", sm: "row" },
                  mt: 3,
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
                    width={90}
                    height={117}
                    style={{ borderRadius: 6, objectFit: "cover", filter: dropShadow }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "#EDEFF3", textShadow }}>
                    Nominated for Co-op Employee of the Year by University of
                    Guelph Experiential Learning, Aug 2024, on behalf of the
                    College of Engineering and Physical Sciences.
                  </Typography>
                </Box>
              </Box>
            </TimelineEntry>

            <TimelineEntry
              side="left"
              tag="Project"
              title="AI Voice Caller"
              startDate="Aug 2024"
              githubUrl="https://github.com/ddombrov/HackThe6ix2024"
              skills={["Next.js", "OpenAI", "ElevenLabs", "Python", "React", "Firebase", "Material UI"]}
            >
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                Produced an AI-driven app to automate voice calls to businesses
                and clients for booking appointments or meetings. Synthesized
                emotional dialogue through OpenAI and ElevenLabs APIs, using
                Twilio to deliver calls to users. Built at the Hack the 6ix
                2024 hackathon.
              </Typography>
            </TimelineEntry>

            <CourseTermEntry label="Fall 2024" side="right" />

            <TimelineEntry
              side="left"
              tag="Co-op"
              title="IT Support Technician"
              org="City of Guelph"
              location="Guelph, Ontario"
              startDate="Sep 2024"
              endDate="Dec 2024"
              skills={["Time Management", "Public Speaking", "Active Directory"]}
              aside={<PhotoSlot />}
            >
              <BulletList
                items={[
                  <>Provided IT support for <Hi>350+</Hi> City of Guelph staff across <Hi>10+</Hi> departments, ensuring smooth daily operations</>,
                  <>Answered calls to deliver remote assistance to users and addressed in-person inquiries regarding device repairs</>,
                  <>Facilitated the onboarding of <Hi>125+</Hi> new hires by setting them up on the city network, installing operating systems and software, and disabling accounts for terminated staff using Active Directory</>,
                ]}
              />
            </TimelineEntry>

            <CourseTermEntry label="Winter 2025" side="right" />

            <TimelineEntry
              side="left"
              tag="Volunteer"
              title="Marketing Team Member"
              org="Guelph Coding Community"
              location="Guelph, Ontario"
              startDate="Jan 2025"
              endDate="Apr 2025"
            >
              <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow, mt: 2 }}>
                Volunteered on the marketing team promoting the Guelph Coding
                Community&apos;s events and initiatives to local students.
              </Typography>
            </TimelineEntry>

            <TimelineEntry
              side="right"
              tag="Part-time"
              title="Head of Infrastructure: Full Stack Developer"
              org="Lapis"
              location="Guelph, Ontario"
              startDate="Feb 2025"
              endDate="Dec 2025"
              companyUrl="https://www.linkedin.com/company/lapis-research"
              skills={["Next.js", "TypeScript", "Supabase", "Google OAuth", "Microsoft OAuth", "CRON"]}
              aside={<PhotoSlot />}
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

            <CourseTermEntry label="Summer 2025" side="left" />

            <TimelineEntry
              side="right"
              tag="Co-op"
              title="Software Engineer"
              org="Canadian Institute for Health Information"
              location="North York, Ontario"
              startDate="May 2025"
              endDate="Aug 2025"
              companyUrl="https://www.linkedin.com/company/canadian-institute-for-health-information"
              skills={["Python", "Spring Boot", "UML"]}
              aside={<PhotoSlot />}
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

            <CourseTermEntry label="Fall 2025" side="left" />

            <TimelineEntry
              side="right"
              tag="Recommendation"
              title="Recommendation"
              org="From Purvi Patel, Regional Manager (Canada), University of Guelph"
              startDate="Dec 2025"
            >
              <Box sx={{ mt: 2 }}>
                <RecommendationCard {...recommendations[0]} />
              </Box>
            </TimelineEntry>

            <CourseTermEntry label="Winter 2026" side="left" />

            <TimelineEntry
              side="right"
              tag="Co-op"
              title="Software Engineer"
              org="Pepper"
              location="Toronto, Ontario"
              startDate="Jan 2026"
              endDate="Present"
              companyUrl="https://www.linkedin.com/company/usepepper"
              skills={["React", "TypeScript", "Python", "AWS Lambda", "Postgres", "Terraform", "Django", "Hasura/GraphQL", "FastAPI", "Fastify"]}
              aside={<PhotoSlot />}
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

            <CourseTermEntry label="Summer 2026" side="left" />

            <CourseTermEntry label="Fall 2026" side="right" />

            <TimelineEntry
              side="left"
              tag="Upcoming"
              title="Winter 2027"
              org="University of Guelph"
              startDate="Jan 2027"
              isLast
            >
              <CourseList courses={terms.find((t) => t.label === "Winter 2027")!.courses} />
            </TimelineEntry>
          </Box>
        </Container>
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
