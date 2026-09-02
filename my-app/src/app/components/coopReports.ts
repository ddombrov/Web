// Full text of each official University of Guelph co-op work term report,
// shown inline when a co-op entry on the timeline is expanded (rather than
// linking out to a separate page). Each report follows the same four-part
// structure the university requires: Introduction, Duties, Goals,
// Conclusion, plus the same four photo placements the original reports use
// (opening photo, one per section) — kept as PhotoSlot placeholders with
// the original captions until real photos are supplied.
export type ReportPhoto = { src: string; alt: string; width: number; height: number };

export type CoopReport = {
  photos: ReportPhoto[];
  intro: string[];
  duties: string[];
  goals: string[];
  conclusion: string[];
};

export const coopReports: Record<string, CoopReport> = {
  "uofg-2024": {
    photos: [
      { src: "/coop/s24a.png", alt: "The Summerlee Science Centre in the daytime", width: 520, height: 292 },
      { src: "/coop/s24b.png", alt: "A screenshot of the AI4CastingHub's homepage on their website", width: 1280, height: 719 },
      { src: "/coop/s24c.png", alt: "A screenshot of the statistical research that the AI4CastingHub works with", width: 1280, height: 719 },
      { src: "/coop/s24d.png", alt: "The University of Guelph crest", width: 864, height: 304 },
    ],
    intro: [
      "I was hired by the University of Guelph in their College of Engineering and Physical Sciences department. My role involved working directly for the research manager of graduate studies, Dr. Bethany Davidson-Eng, to contribute to web development projects. I was placed in an office in the Summerlee Science Centre, where I was near other co-op students, graduate students, and professors, all contributing to varied important research.",
    ],
    duties: [
      "While completing my training, Dr. Bethany informed me that I would be developing the AI4CastingHub's website, a platform integrating AI models to forecast human diseases. This research initiative was led by Dr. Monica Cojocaru, the director of the AI4CastingHub, and would enable advanced public health planning and research. I gathered Dr. Monica's requirements for the website and was tasked with laying the groundwork for the next co-op student to build upon before the end of my co-op term.",
      "I began drafting the initial website sketches on Canva and creating the wireframe using Figma. I visited other established platforms like the CDC and Respicast to learn from them and view how they integrate interactive graphs. Using CampusPress, I built the website, focusing on accessibility and user experience. I began by creating numerous designs and incorporating feedback from peers and supervisors to refine the look of the website.",
      "The core skills required for the front-end development were covered in my User Interface and Web Design classes, while my familiarity with statistical software came from my Introduction to Statistics course. My extracurricular experiences and Software Design classes taught me the importance of using a Kanban board, so I immediately began using one in the role.",
    ],
    goals: [
      "This was my first ever developer-client project and I had to make sure that I could understand the statistical data, develop the website, and complete my tasks on time. I chose to focus on improving my quantitative, technical, and organizational skills. I aimed to deepen my understanding of complex data and its application in web development while working with content management systems and a Kanban board.",
      "My goals were directly related to my job tasks. I set specific objectives, such as improving my quantitative skills by working with virus-spread data and using tools like R, Google Sheets, ShinyApps, and Plotly for interactive graph creation. Additionally, I aimed to refine my web development skills by building a website for Dr. Monica Cojocaru, the director of the AI4CastingHub, using content management systems like Content Hub, Drupal, SharePoint, and CampusPress. Another key goal was to improve my time management through careful task planning and organization using Trello.",
      "I wanted to sharpen my skills in data analysis and web development while also improving my time management and communication in a professional setting. These skills are essential for future work experiences as they involve practical tools and methodologies used in both web development and data science, making me more versatile and effective in future technical roles.",
      "I sought to work with R, ShinyApps, Plotly, and various content management systems, mainly CampusPress, to develop a web application. These technologies were chosen because they are widely used in both data visualization and web development, and utilizing them would broaden my technical expertise, making me more valuable in both research and industry settings.",
      "I successfully completed my goals. For quantitative literacy, I developed a website that uses ShinyApps to dynamically display virus spread data. For technological literacy, I successfully developed a user-friendly and functional website for Dr. Monica, receiving positive feedback from her and her team. Lastly, for time management, I effectively used Trello to stay on track with tasks, completing all assignments on time and even optimizing task processes. No goals were left uncompleted during this work term.",
    ],
    conclusion: [
      "Working for the University allowed me to better understand my institution, peek behind the scenes, and contribute to impactful research at my university. By completing a process from start to finish, I practiced an agile methodology along the way and adapted where needed. I learned and accomplished a lot.",
      "I would like to thank my supervisor, Bethany, for her guidance and support throughout the term. Her trust in my abilities allowed me to work independently and grow as a developer. I also appreciate the collaboration with my coworker, Sukhman, who provided valuable insights and assistance. This work term has been instrumental in developing my technical and professional skills. I gained valuable experience in web development, data visualization, and project management, which will benefit my future career in software engineering. I am grateful for the opportunity to contribute to meaningful projects and learn from experienced professionals.",
    ],
  },

  "guelph-2024": {
    photos: [
      { src: "/coop/f24a.jpg", alt: "Guelph City Hall, located at 1 Carden Street, in the daytime", width: 800, height: 449 },
      { src: "/coop/f24b.jpg", alt: "A whiteboard with the words \"Welcome to IT!\" and drawings of a computer and Clippy", width: 1280, height: 719 },
      { src: "/coop/f24c.jpg", alt: "The IT Service Desk team dressed as Skittles on Halloween", width: 1280, height: 960 },
      { src: "/coop/f24d.png", alt: "The City of Guelph logo, with the slogan \"Making a Difference\"", width: 900, height: 500 },
    ],
    intro: [
      "During this term, I was employed by the City of Guelph in their IT Service Desk department. My role involved working directly for Viva Batista, the IT Service Desk Supervisor, to assist city staff with their day-to-day technology problems. I worked at the front desk of the IT Service Desk at City Hall, where I worked with another co-op student, senior support technicians, and the IT Asset team. We all collaborated to ensure smooth daily operations for the City.",
    ],
    duties: [
      "During my training, Viva explained that I would be the first line of support for city staff, enabling them to do their important work in city planning, finance, building services, and more. As I settled into my position, Viva offered me more opportunities to bring a new perspective and introduce new ideas to the IT Service Desk.",
      "My first two months on the job consisted of becoming familiar with the office's daily operations. I was provided abundant training to handle technical issues and my prior experience in computer science extracurriculars allowed me to pick up the technical skills quickly. I would install software for users, help them successfully log in, and ensure they had all the resources to complete their tasks. As I gained more experience and knowledge, I began to assist with more complicated problems.",
      "In the latter half of my co-op, I began to focus on automating certain timely tasks to lighten the workload for support technicians. For example, I noticed that a lot of my day was consumed with resolving locked account tickets, creating borrowed equipment tickets, and searching for customer assets in the office. Luckily, now we have an \"Incident Action\" to resolve a locked account ticket immediately, a ticket classification for borrowed equipment, and an organized and logical equipment pick-up cabinet. One major feature I introduced was setting up Microsoft Booking calendars to allow customers to schedule meetings with technicians to prevent numerous back-and-forth emails. All of these improvements are used on a daily basis and save a lot of time for the office.",
      "My final duty at the city was to improve the training for the next co-ops after Mashrur and me. I compiled useful documentation onto the city's internal SharePoint to serve as a reference for future co-op students. It covers all software used by the city, outlining functionality, best troubleshooting practices, and other solutions.",
    ],
    goals: [
      "As this was my first IT position, I had to make sure that I could speak to users well enough to understand their issues and determine solutions. I chose to focus on improving my critical and creative thinking skills and oral communication skills. I aimed to deepen my understanding of what working with clients in a real work environment is like while learning about information technology.",
      "My goals were directly related to my job tasks. I set out to critically analyze problems when working with users by asking more meaningful questions. Additionally, I aimed to refine my problem solving skills by trying to handle problems on my own and reaching out when I need help. Another key goal was to improve my oral communication skills through daily practice and reflection on previous conversations.",
      "I wanted to sharpen my skills in approaching problems with more information while also improving my oral communication in a professional setting. These skills are essential for future work experiences as they require me to be more thoughtful, thorough, aware, and diplomatic, making me more versatile and effective in future technical team roles.",
      "I directly worked with various information technology systems such as Active Directory, Lansweeper, and Microsoft SCCM. Utilizing them broadened my technical expertise, making me more valuable in industry settings.",
      "I successfully completed my goals. For inquiry and analysis, I developed a strategy to best determine the problem, from software or hardware issues to user errors. For problem-solving, I successfully helped city staff with thousands of problems and received positive feedback from customers and my supervisor. Lastly, for oral communication, I worked with a variety of staff and determined communication strategies to best explain solutions to users. No goals were left uncompleted during this work term.",
    ],
    conclusion: [
      "My time at the City of Guelph allowed me to better understand the city that I live in, see all the important work that the city does, and contribute to important work in my community. I learned a lot of technical skills, gained an adaptive mindset and accomplished all of my goals.",
      "I would like to thank my manager, Viva, and all of the support technicians for their leadership and guidance throughout the term. The support and direction I received allowed me to provide excellent customer service and grow as a software engineering student. I also appreciate collaborating with my coworker, Mashrur, who provided valuable insights and assistance. This work term was important in developing my technical and professional skills. I gained experience in information technology, customer service, and critical thinking, which will help me in the future as a software engineer. I am thankful for the opportunity to join a team of IT professionals and contribute to important work.",
    ],
  },

  "cihi-2025": {
    photos: [
      { src: "/coop/s25a.png", alt: "The exterior of CIHI's Toronto office building", width: 967, height: 640 },
      { src: "/coop/s25b.jpg", alt: "Two co-ops at a CIHI celebration event", width: 1280, height: 960 },
      { src: "/coop/s25c.png", alt: "A group photo of all of CIHI's Toronto co-ops", width: 1280, height: 960 },
      { src: "/coop/s25d.png", alt: "The CIHI logo, \"Canadian Institute for Health Information\"", width: 1280, height: 720 },
    ],
    intro: [
      "I was hired by CIHI in their Enterprise Architecture department. My role involved working closely with my supervisor, Emerald Liang, to automate various projects for the Enterprise Architecture team. I worked in a hybrid format, spending three days from home and two days at CIHI's Toronto office, where I collaborated with other co-op students, technical architects, and business analysts working on healthcare system improvements across Canada.",
    ],
    duties: [
      "During my training, Emerald explained that I would be contributing to healthcare data standardization by automating tasks for the Enterprise Architecture team. Our department focuses on creating Logical Data Model diagrams (LDMs) to ensure seamless data exchange between provinces, preventing misinterpretation when healthcare information transfers between different provincial systems.",
      "I began by developing Python scripts to transform XML files from LDMs for cross-platform compatibility. This involved working with CIHI's Enterprise Architecture software (EASparx) and creating automated tools to make files compatible with their new software (Erwin). I also automated the export of LDMs into AODA-compliant PDFs for public review, ensuring legal accessibility standards were met.",
      "As I gained more experience, I took on additional responsibilities including reviewing and verifying 50 business glossary healthcare definitions that will be used across Canada. I also reconciled IT applications with server usage data for CIHI's annual report. Lastly, my final contribution was collaborating with my co-worker Mark to create a video showcasing the co-op experience at CIHI.",
      "The programming skills from my Software Design courses provided the foundation for the Python automation work, while my previous co-op experiences with project management helped me navigate the collaborative healthcare environment effectively.",
    ],
    goals: [
      "This was my first role in enterprise architecture and healthcare systems, requiring me to apply programming skills in a specialized domain while managing multiple projects. I chose to focus on improving my technical literacy, informational literacy, and professional time management skills. I aimed to develop Python programming abilities in a real-world healthcare setting while learning about the industry and maintaining strong organization.",
      "My goals were directly related to my job tasks. I set specific objectives, such as building Python-based tools to automate XML file conversion and implementing automated tests to verify output files met CIHI's standards. Additionally, I aimed to gain comprehensive understanding of healthcare processes and technical tools used at CIHI. Another key goal was improving my time management by using CIHI's Eclipse time-tracking software to balance multiple tasks and meet deadlines consistently.",
      "I wanted to strengthen my programming skills in a healthcare context while expanding my industry knowledge and professional organization abilities. These skills are essential for future software engineering roles as they demonstrate adaptability to specialized domains and effective collaboration in technical teams.",
      "I worked directly with Python scripting, healthcare-specific tools like LDMs, and professional management systems like Eclipse. Utilizing these technologies broadened my technical expertise in enterprise architecture and healthcare data management, making me more valuable in industry settings.",
      "I successfully completed all of my goals. For technical literacy, I developed Python automation tools that impressed the technical architects and received positive feedback from my team. For informational literacy, I gained substantial healthcare knowledge through daily exposure to medical systems and terminology, enabling confident discussions with team members about CIHI processes. Lastly, for time management, I effectively used Eclipse to balance multiple concurrent projects, meeting all deadlines throughout the term.",
    ],
    conclusion: [
      "Working at CIHI allowed me to contribute to meaningful healthcare improvements across Canada while gaining experience in enterprise architecture. The hybrid work environment and collaborative culture provided excellent opportunities to learn from healthcare professionals. I developed technical expertise while understanding how technology serves broader societal needs.",
      "I would like to thank my supervisor, Emerald, for her guidance and support throughout the term. Her trust in my abilities allowed me to work on challenging automation projects and grow as a developer. I also appreciate the collaboration with my co-worker, Mark, who provided valuable ideas and support. This work term has been important in developing my technical and professional skills. I gained experience in Python automation, healthcare systems, and enterprise architecture, which will benefit my future career in software engineering. I am grateful for the opportunity to contribute to Canada's healthcare infrastructure and learn from experienced professionals.",
    ],
  },

  "pepper-2026-winter": {
    photos: [
      { src: "/coop/w26a.png", alt: "The exterior of Pepper's Toronto office building (in the WeWork building)", width: 724, height: 1074 },
      { src: "/coop/w26b.png", alt: "The view from Pepper's Toronto office", width: 1172, height: 1026 },
      { src: "/coop/w26c.png", alt: "The coffee shop on the first floor where staff sometimes go for lunch", width: 1280, height: 828 },
      { src: "/coop/w26d.png", alt: "The Pepper logo, dark green background with light green text", width: 200, height: 200 },
    ],
    intro: [
      "I was hired by Pepper in the Business Operations department. My role involved working directly for the Head of Business Operations, Senior Director, Anna Toronova, to contribute to software projects. The job was remote with the option of coming to the office in downtown Toronto, beside Union Station, near other co-op students and full-time employees.",
    ],
    duties: [
      "While completing my brief training, Anna gave all the interns an overview of Pepper. Pepper services food suppliers by digitally helping them sell to restaurants. Additionally, she informed me that I would be on the Pepper Labs team, developing projects called \"Pepper Labs tools\". Each intern would own their \"tools\" from beginning to end.",
      "My first project was the Integrations Explorer. When Pepper sets up a distributor, we connect their ERP (Enterprise Resource Planning) software to our PMC (Pepper Management Centre) with an integration. For example, if a distributor has their prices in an Excel sheet, we would have an integration to translate their data to properly formatted data that our system uses. My tool enabled distributors to see behind the scenes of their integrations and learn how the process works, greatly reducing the number of support tickets regarding integrations.",
      "My second project was the Sales Rep Task Manager. The tool enabled supplier managers to track their team's progress and assign tasks to their team, via a Kanban board. When supplier managers entered the tool on the PMC, they would view their own tasks and their team's, while employees would only view their own tasks.",
      "The core skills required for the two projects were covered in my Software Engineering and Software Design courses, which taught me how to gather requirements, work in teams, and use Git, while Software Systems Development taught me how to take ownership of a project from the frontend to the backend. Lastly, I will give credit to Mobile Computing, Database Systems, and my extracurricular activities for mobile and database programming skills.",
    ],
    goals: [
      "I completed all of my goals.",
      "As this was my first private financial company software engineering job, I wanted to focus on improving my Technological Literacy. Before this position, I had never used AWS or another cloud computing service, which is important for future computer science roles. At Pepper, I have been able to use AWS for two different projects, going from no AWS experience to knowing which AWS service to use — CloudWatch, S3, Lambda, etc. — for my projects.",
      "My Reading Comprehension was my second goal. During my time at Pepper, I wanted to be able to understand project details. This involved reading project requirements documents and making tech plans with them. Understanding Pepper's architecture and business has helped me develop more thought-out projects by servicing users and how they use Pepper's platform.",
      "Lastly, my final goal was Problem Solving. By working through my first project from frontend to backend, I developed a strong understanding of the full-stack development process and became more confident experimenting with new ideas, knowing when to ask for help and when to work independently, demonstrating sound judgment and a productive problem-solving mindset. I have had so much guidance at Pepper, which enabled me to contribute productive work all day independently and seek counsel when stuck.",
    ],
    conclusion: [
      "Working for Pepper allowed me to better understand my abilities and contribute to real-world important work. By completing a process from start to finish, I practiced an agile methodology along the way and adapted where needed. I learned and accomplished a lot.",
      "I would like to thank my supervisor, Anna, and full-time support network — Praj, Ayaz, JC, and Roy — for their guidance and support throughout the term. Their trust in my abilities allowed me to work independently and grow as a developer. I also appreciate the collaboration with my coworker, Meharban, who provided valuable insights and assistance. This work term has been instrumental in developing my technical and professional skills. I gained valuable experience in frontend development, backend development, and database management, which will benefit my future career in software engineering. I am grateful for the opportunity to contribute to meaningful projects and learn from experienced professionals.",
    ],
  },

  "pepper-2026-summer": {
    photos: [
      { src: "/coop/s26a.png", alt: "The exterior of Pepper's Toronto office building", width: 1280, height: 1728 },
      { src: "/coop/s26b.png", alt: "The lobby area on the 14th floor, where Pepper's office is located", width: 1280, height: 853 },
      { src: "/coop/s26c.png", alt: "The third floor lounge area where staff sometimes go for coffee", width: 1280, height: 854 },
      { src: "/coop/s26d.png", alt: "The new Pepper logo", width: 600, height: 138 },
    ],
    intro: [
      "During this term, I continued to be employed by Pepper in their Pepper Labs department. My role involved working directly for Anna Toronova, the Head of Business Operations, Senior Director, to develop new projects and tools. I worked at 1 University Avenue, just beside Union Station, where I worked alongside another co-op student and an assortment of other employees in marketing, business, and engineering. We all collaborated to launch products successfully and deliver real value to our customers.",
    ],
    duties: [
      "During my second semester at Pepper, JC Moreno guided me and provided feedback as he introduced my new project. He explained the Become a Customer project: an application form for our distributors to acquire new customers. I was the sole developer on this project and also got some guidance from my mentor Praj.",
      "The start of the project was slow: I was continuing work from a past intern, which involved fixing a lot of their mistakes. We started in Supabase, which was not going to be the long-term database solution. I needed to create new database tables in Postgres, consider what the default values would be, what type each variable should be, and so on — a real-world application of my Database Systems and Concepts course. Then I needed to transfer the old Lambda functions to scalable solutions in another repo that utilized Django, Postgres, and Hasura GraphQL actions. Lastly, I updated the frontend to look cleaner and more clear.",
      "Once I had improved upon the past intern's work, the real work began. We started by consulting the customer success, marketing, and business teams to determine the best solution for this tool. We decided on one form for customer contact details, where we would store all information, and a secondary form for credit applications, where we would not store sensitive information submitted in the form. We started piloting with consumer credit checks, and after meeting with distributors, we realized we needed to pivot and also offer business credit checks.",
      "Lastly, for the final part of my co-op, my role involved wrapping up everything from the past eight months. That meant building a long-term solution for the project I started last semester. I worked on documentation for all of the projects, met with the people taking over my projects to ensure thorough understanding, and outlined detailed next steps for where each project ended.",
    ],
    goals: [
      "My first goal fell under Critical & Creative Thinking. I wanted to understand the core business needs of the distributors I was building tools for. My plan was to learn from the new Pepper Labs feedback form and from meetings with distributors, and that is largely how it happened. Building a revenue-generating project, the Become a Customer tool, meant sitting down with customer success, marketing, and business stakeholders to work out what each of them actually needed. The real measure of success was how the tool responded to feedback: when distributors told us consumer credit checks alone would not work, we pivoted to offer business credit checks as well.",
      "My second goal was Oral Communication, to become a more effective speaker. The plan was to build confidence by preparing thoroughly for every meeting, and being challenged in those meetings is what actually improved me. I presented my tool to different stakeholders, and I now come to meetings ready to answer detailed questions about project goals and functionality instead of just reporting status.",
      "My final goal was Technological Literacy. I wanted to gain familiarity with Pepper's backend and with real-world software engineering practices. I submitted GitHub pull request reviews and received feedback directly on GitHub, mirroring the practices of my Software Engineering course. Migrating the old Lambda functions into a scalable, properly structured repository taught me more about production systems than any course had, and I am no longer making the mistakes I made at the start of the internship.",
      "I completed all three goals, and each one made the others easier: understanding the business told me what to build, communicating clearly kept the right people involved, and better engineering practices made the result something Pepper can maintain after I leave.",
    ],
    conclusion: [
      "My time at Pepper allowed me to better understand the software development lifecycle from start to finish. I had never gone this in depth on a project before, or carried one all the way through to the maintenance phase. I learned a great deal about building software for real users, gained the confidence to own a project end to end, and accomplished all of my goals.",
      "I would like to thank my team — Anna, JC Moreno, Praj, and Roy Liu — for their leadership and guidance throughout the term. The support and direction I received allowed me to grow and thrive as a software engineering student. I also appreciate collaborating with my intern coworker, Meharban, who shared advice and feedback. This work term was important in developing my technical and professional skills. I gained experience in full-stack development, database design, and working with stakeholders across a business, all of which will help me in the future as a software engineer. I am thankful for the opportunity to join a team of talented, generous professionals and contribute to important work.",
    ],
  },
};
