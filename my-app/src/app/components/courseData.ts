export type Course = { code: string; name: string; description: string };
export type Term = { label: string; date: string; upcoming?: boolean; courses: Course[] };

// One entry per academic term so each can sit at its own point on the
// journey timeline, alongside whatever else was happening that semester.
// Kept in a plain (non-client) module, separate from CourseList.tsx's
// "use client" interactive rows, since a client module's named data
// exports don't reliably cross the server/client boundary during static
// prerendering.
export const terms: Term[] = [
  {
    label: "Fall 2022",
    date: "Sep 2022",
    courses: [
      { code: "CIS*1300", name: "Programming", description: "Applied and conceptual aspects of programming: data and control structures, program design, problem solving and algorithm design, operating systems concepts, and fundamental programming skills." },
      { code: "CIS*1250", name: "Software Design I", description: "An introductory overview of design and problem-solving across disciplines, examining the qualities of software as an end product, with applied team-based design and development experience." },
      { code: "MATH*1200", name: "Calculus I", description: "A theoretical course covering limits, continuity, derivatives, Fermat's/Rolle's/mean-value theorems, Riemann sums, the definite integral, and the fundamental theorem of calculus." },
      { code: "MATH*1160", name: "Linear Algebra I", description: "Introduction to linear algebra in Euclidean space: vectors, matrix operations, systems of linear equations, subspaces, eigenvalues/eigenvectors, diagonalization, and linear transformations." },
      { code: "CIS*1910", name: "Discrete Structures in Computing I", description: "Boolean algebra, propositional and predicate logic, proof techniques, set theory, equivalence relations, order relations, and functions." },
    ],
  },
  {
    label: "Winter 2023",
    date: "Jan 2023",
    courses: [
      { code: "CIS*2910", name: "Discrete Structures in Computing II", description: "Further discrete structures: sequences, summations, recursion, combinatorics, discrete probability, and graph theory." },
      { code: "CIS*2250", name: "Software Design II", description: "Evaluating software designs and tools with emphasis on usability, functionality, and ethics; peer code review and static modeling in team settings." },
      { code: "CIS*2500", name: "Intermediate Programming", description: "Interpreting program specifications and implementing reliable code; pointers, complex data types, and intermediate problem-solving/testing techniques." },
      { code: "CIS*2170", name: "User Interface Design", description: "Practical introduction to UI design, including components, best practices, prototyping approaches, and interface evaluation techniques." },
      { code: "STAT*2040", name: "Statistics I", description: "Descriptive statistics, probability models, the central limit theorem, hypothesis testing, estimation, regression/correlation, and intro to ANOVA." },
    ],
  },
  {
    label: "Summer 2023",
    date: "May 2023",
    courses: [
      { code: "NUTR*1010", name: "Introduction to Nutrition", description: "Introduction to human nutrition, emphasizing nutrients, their dietary sources, functions, and relationships to health, plus current popular topics and diet-disease relationships." },
      { code: "COOP*1100", name: "Introduction to Co-operative Education", description: "Introduces students to the theory, practice, and policies of co-operative education, preparing them to take full advantage of the co-op option." },
    ],
  },
  {
    label: "Fall 2023",
    date: "Sep 2023",
    courses: [
      { code: "CIS*2520", name: "Data Structures", description: "Lists, stacks, queues, trees, tables; abstract data types, traversal/search/insertion/sorting algorithms, and intro to algorithm analysis." },
      { code: "CIS*2030", name: "Structure and Application of Microcomputers", description: "Computer system components (memories, CPU, buses, I/O), instruction sets, assembly/machine-language programming." },
      { code: "CIS*2430", name: "Object Oriented Programming", description: "OO approach to programming/algorithm design: class libraries, inheritance, modularity, generics, collections, and intro to OO design." },
      { code: "CIS*3250", name: "Software Design III", description: "Maintenance and evolution of software systems, dynamic modeling, reverse engineering, release planning, and version control." },
      { code: "CTS*1000", name: "Culture and Technology: Keywords", description: "Core concepts/skills for digital literacy connecting information technologies with ethics, culture, and what it means to be human." },
    ],
  },
  {
    label: "Winter 2024",
    date: "Jan 2024",
    courses: [
      { code: "CIS*3490", name: "Analysis and Design of Computer Algorithms", description: "Efficient algorithm design/analysis: asymptotic behaviour, optimality, graph algorithms, matrix computations, NP-completeness." },
      { code: "CIS*2750", name: "Software Systems Development and Integration", description: "Development/integration of modular software systems, data storage, QA, testing, and multi-language component integration." },
      { code: "CIS*3110", name: "Operating Systems I", description: "Scheduling, resource allocation, process management, multitasking, I/O control, file systems, and client-server mechanisms." },
      { code: "CIS*1050", name: "Web Design and Development", description: "Basics of designing/developing websites: core concepts, technologies, and techniques, suited for beginners." },
    ],
  },
  {
    label: "Summer 2024",
    date: "May 2024",
    courses: [],
  },
  {
    label: "Fall 2024",
    date: "Sep 2024",
    courses: [],
  },
  {
    label: "Winter 2025",
    date: "Jan 2025",
    courses: [
      { code: "CIS*3190", name: "Software for Legacy Systems", description: "Introduction to legacy systems in business/manufacturing/engineering: COBOL programming, mainframes, and integration with modern systems." },
      { code: "CIS*4030", name: "Mobile Computing", description: "Mobile computing and app development: mobile technology, user interaction, data storage, and development tools." },
      { code: "CIS*3750", name: "System Analysis and Design in Applications", description: "System analysis, requirements gathering, structured modeling, test-driven development, and ethical/societal considerations in software design." },
      { code: "PHIL*2110", name: "Formal Logic", description: "Basic principles of formal logic: logical structure of sentences/arguments, sentential logic, and quantification." },
      { code: "CTS*2010", name: "Digital Approaches to Culture", description: "Hands-on introduction to digital humanities methods: text analysis, data mining, visualization, AR, game design, curation, storytelling." },
    ],
  },
  {
    label: "Summer 2025",
    date: "May 2025",
    courses: [],
  },
  {
    label: "Fall 2025",
    date: "Sep 2025",
    courses: [
      { code: "CIS*3530", name: "Database Systems and Concepts", description: "Data organization/management, database models, query specification/processing, concurrency, security, integrity, and recovery." },
      { code: "CIS*4300", name: "Human Computer Interaction", description: "User interface software design methods, interface representations/testing, evaluation of application systems, and impacts of IT on individuals/organizations." },
      { code: "CIS*3760", name: "Software Engineering", description: "Overview of the software engineering process with emphasis on Agile methodologies and structured development." },
      { code: "CTS*3010", name: "Digital Arts & Critical Making", description: "Hands-on \"maker\" methods (Arduino, Raspberry Pi, 3D design, VR/AR); students build a project, informed by design theory." },
      { code: "CTS*2000", name: "Scripting for the Humanities", description: "Data creation, representation, and interpretation; modeling data, developing schemas, and basic R/Python programming with version control." },
    ],
  },
  {
    label: "Winter 2026",
    date: "Jan 2026",
    courses: [
      { code: "CIS*3700", name: "Introduction to Intelligent Systems", description: "Core AI topics: agents/environments, search, knowledge representation, reasoning, and learning, using logic as a common formalism." },
    ],
  },
  {
    label: "Summer 2026",
    date: "May 2026",
    courses: [
      { code: "ENVS*2210", name: "Apiculture and Honey Bee Biology", description: "Beekeeping fundamentals: honey bee biology/behaviour, honey production management, hive products, pests, and bees as agricultural pollinators." },
    ],
  },
  {
    label: "Fall 2026",
    date: "Sep 2026",
    upcoming: true,
    courses: [
      { code: "CIS*4150", name: "Software Reliability & Testing", description: "Systematic testing/verification methods (static & dynamic), reliability prediction, and various testing types (unit, integration, regression, system)." },
      { code: "CIS*3260", name: "Software Design IV", description: "Advanced software architectures, design patterns, modeling methodologies, and evaluating tools/frameworks for scalable systems." },
      { code: "ENVS*1060", name: "Discovering Planet Earth", description: "Introduction to geological principles and their application to interpreting Earth materials and processes." },
      { code: "UNIV*1000", name: "University Learning Skills", description: "Learning theory as a foundation for university success: metacognitive strategies, problem-solving, self-efficacy, and resilience." },
      { code: "PHYS*1600", name: "Contemporary Astronomy", description: "Interdisciplinary astronomy for non-science students: solar system, stellar evolution, pulsars, black holes, quasars, cosmology." },
    ],
  },
  {
    label: "Winter 2027",
    date: "Jan 2027",
    upcoming: true,
    courses: [
      { code: "CIS*4250", name: "Software Design V", description: "Capstone course applying prior Software Design knowledge to a large team project with applied design/development experience." },
      { code: "PHIL*3370", name: "Ethics of Artificial Intelligence", description: "Explores real/possible implications of AI decision-making: privacy, algorithmic bias, social inequality, and moral status of AI." },
      { code: "CTS*3000", name: "Data and Difference", description: "Social categories of difference in digital contexts; identity, bodies, communities, and issues of access/self-representation/social justice." },
      { code: "MUSC*2150", name: "Music and Popular Culture", description: "Survey of major genres, styles, and performers of 20th-century popular music, examining links to race, class, technology, and art." },
      { code: "THST*2500", name: "Contemporary Cinema", description: "Review of contemporary cinematic expression through curated film and media texts." },
    ],
  },
];
