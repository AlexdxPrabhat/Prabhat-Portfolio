// Skills Section Logo's
import htmlLogo from "./assets/tech_logo/html.png";
import cssLogo from "./assets/tech_logo/css.png";
import sassLogo from "./assets/tech_logo/sass.png";
import javascriptLogo from "./assets/tech_logo/javascript.png";
import reactjsLogo from "./assets/tech_logo/reactjs.png";
import reduxLogo from "./assets/tech_logo/redux.png";
import tailwindcssLogo from "./assets/tech_logo/tailwindcss.png";

import nodejsLogo from "./assets/tech_logo/nodejs.png";
import expressjsLogo from "./assets/tech_logo/express.png";
import mysqlLogo from "./assets/tech_logo/mysql.png";
import mongodbLogo from "./assets/tech_logo/mongodb.png";
import firebaseLogo from "./assets/tech_logo/firebase.png";
import cLogo from "./assets/tech_logo/c.png";
import cppLogo from "./assets/tech_logo/cpp.png";
import javaLogo from "./assets/tech_logo/java.png";
import pythonLogo from "./assets/tech_logo/python.png";
import gitLogo from "./assets/tech_logo/git.png";
import githubLogo from "./assets/tech_logo/github.png";
import vscodeLogo from "./assets/tech_logo/vscode.png";
import postmanLogo from "./assets/tech_logo/postman.png";
import mcLogo from "./assets/tech_logo/mc.png";
import vercelLogo from "./assets/tech_logo/vercel.png";

// Experience Section Logo's
import accenture from "./assets/company_logo/accenture.png";

// Education Section Logo's
import graphicEraDeemed from "./assets/education_logo/graphic_era_official_logo.jpg";
import graphicEraHill from "./assets/education_logo/graphicerahilluniversity_logo.jpg";
import sgrrPP from "./assets/education_logo/sgrrPP.png";

// Project Section Logo's

import pasteApp from "./assets/work_logo/pasteApp.png";
import razorPay from "./assets/work_logo/razorPay.png";
import LeetCodeMetric from "./assets/work_logo/LeeetCodeMetric.png";
import weatherApp from "./assets/work_logo/weatherApp.png";
import studySync from "./assets/work_logo/studySync.png";
import promptDeploy from "./assets/work_logo/promptDeploy.png";

export const SkillsInfo = [
  {
    title: "Frontend",
    skills: [
      { name: "HTML", logo: htmlLogo },
      { name: "CSS", logo: cssLogo },
      { name: "SASS", logo: sassLogo },
      { name: "JavaScript", logo: javascriptLogo },
      { name: "React JS", logo: reactjsLogo },
      { name: "Tailwind CSS", logo: tailwindcssLogo },
      { name: "Redux", logo: reduxLogo },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node JS", logo: nodejsLogo },
      { name: "Express JS", logo: expressjsLogo },
      { name: "MySQL", logo: mysqlLogo },
      { name: "MongoDB", logo: mongodbLogo },
      { name: "Firebase", logo: firebaseLogo },
    ],
  },
  {
    title: "Languages",
    skills: [
      { name: "C", logo: cLogo },
      { name: "C++", logo: cppLogo },
      { name: "Java", logo: javaLogo },
      { name: "Python", logo: pythonLogo },
      { name: "JavaScript", logo: javascriptLogo },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", logo: gitLogo },
      { name: "GitHub", logo: githubLogo },
      { name: "VS Code", logo: vscodeLogo },
      { name: "Postman", logo: postmanLogo },
      { name: "Compass", logo: mcLogo },
      { name: "Vercel", logo: vercelLogo },
    ],
  },
];

export const experiences = [
  {
    id: 0,
    img: accenture,
    role: "Packaged App Development Associate",
    company: "Accenture Solutions Private Limited",
    date: "Oct 2024 - Present",
    desc: "Building and deploying responsive web applications using React.js. Developing and integrating RESTful APIs with Node.js and Express.js, resolving frontend/backend issues to improve performance, and designing responsive UIs with HTML, CSS, and JavaScript. Collaborating via Git & GitHub to deliver scalable, user-friendly solutions and creating interactive dashboards for better data visualization.",
    skills: [
      "React.js",
      "Node.js",
      "Express.js",
      "RESTful APIs",
      "JavaScript",
      "HTML",
      "CSS",
      "Git & GitHub",
      "Frontend Development",
      "Backend Development",
      "UI/UX Design",
      "Dashboards & Data Visualization"
    ],
  },
];

export const education = [
  {
    id: 0,
    img: graphicEraDeemed,
    school: "Graphic Era Deemed to be University, Dehradun",
    date: "April 2025 - March 2027",
    grade: "Not Declared",
    desc: "I am currently pursuing my Master's degree (MCA) in Computer Applications from Graphic Era Deemed to be University, Dehradun. My coursework covers Data Structures, Algorithms, Object-Oriented Programming, Database Management Systems, Web Development, and Software Engineering. I actively engage in workshops and technical events to enhance my technical skills and industry knowledge. This program is strengthening my foundation in programming, software development, and computer science concepts.",
    degree: "Master of Computer Applications - MCA",
  },
  {
    id: 1,
    img: graphicEraHill,
    school: "Graphic Era Hill University, Dehradun",
    date: "Sept 2021 - Aug 2024",
    grade: "7.54 CGPA",
    desc: "I completed my Bachelor's degree (BCA) in Computer Applications from Graphic Era Hill University, Dehradun. During this program, I built a solid foundation in programming, data structures, algorithms, database systems, web development, and software engineering. I actively participated in coding competitions, technical events, and hands-on projects that helped me apply theoretical knowledge to practical challenges.",
    degree: "Bachelor of Computer Applications - BCA",
  },
  {
    id: 2,
    img: sgrrPP,
    school: "Sri Guru Ram Rai Public School Patelnagar",
    date: "Apr 2020 - March 2021",
    grade: "66.6%",
    desc: "I completed my Class 12 education (Commerce with Information Practices) from SGRR Public School, Patel Nagar, Dehradun. This phase allowed me to gain knowledge in business studies, accountancy, and core computing concepts through Information Practices, further igniting my interest in technology and software development.",
    degree: "CBSE(XII) - Commerce with Computer Science",
  },
  {
    id: 3,
    img: sgrrPP,
    school: "Sri Guru Ram Rai Public School Patelnagar",
    date: "Apr 2018 - March 2019",
    grade: "67%",
    desc: "I completed my Class 10 education from SGRR Public School, Patel Nagar, Dehradun. This stage helped me build a strong academic foundation, especially in mathematics and science, setting the base for my interest in computer science and technology.",
    degree: "CBSE(X), Science with Computer Application",
  },
];

export const projects = [
  {
    id: 0,
    title: "PromptDeploy",
    description:
      "A Python-powered automation tool that generates and deploys complete websites from natural language prompts. Users provide a prompt in the command line, and the app leverages the Gemini Flash API to generate HTML, CSS, and JS code, which is then auto-deployed to Firebase for instant hosting. Streamlines web creation for rapid prototyping and deployment.",
    image: promptDeploy,
    tags: ["Automation", "Python", "Gemini Flash API"],
    github: "https://github.com/AlexdxPrabhat/PromptDeploy",
    webapp: "",
  },
  {
    id: 1,
    title: "PasteApp",
    description:
      "A modern paste management web app built with React.js and Tailwind CSS. Allows users to create, edit, view, delete, and search pastes with an intuitive interface. Features include real-time paste creation, timestamping, and easy copy/share functionality. Designed for speed, usability, and clean dark-mode aesthetics",
    image: pasteApp,
    tags: ["React JS", "React Router", "Redux", "Vercel", "TailwindCss"],
    github: "https://github.com/AlexdxPrabhat/Paste-App",
    webapp: "https://paste-app-woad-seven.vercel.app/",
  },
  {
    id: 2,
    title: "RazorPay Clone",
    description:
      "A responsive Razorpay landing page clone built with React, TailwindCss showcasing modern UI design inspired by the original Razorpay site. Features include glassmorphism effects, smooth scroll, interactive elements, and a pixel-perfect layout. Fully optimized for mobile and desktop screens.",
    image: razorPay,
    tags: ["React JS", "TailwindCSS", "Firebase"],
    github: "https://github.com/AlexdxPrabhat/RazorpayClone",
    webapp: "https://razorpayclone-49d17.web.app/",
  },
  {
    id: 3,
    title: "LeetCodeMetric",
    description:
      "A high-performance web app that fetches and visualizes LeetCode stats in an ultra-clean, animated, and interactive dashboard. Features dynamic conic gradient charts, instant data fetch on username input, and a fully responsive design for all devices.",
    image: LeetCodeMetric,
    tags: ["Html", "CSS", "JavaScript", "Firebase"],
    github: "https://github.com/AlexdxPrabhat/leetCodeMetric",
    webapp: "https://leetcode-metric.web.app/",
  },
  {
    id: 4,
    title: "WeatherApp",
    description:
      "A sleek and responsive weather prediction app that provides real-time weather details for any city worldwide. Features dynamic icons, fast data fetching, and a lightweight UI for a smooth user experience across all devices.",
    image: weatherApp,
    tags: ["JavaScript", "HTML", "CSS", "Firebase"],
    github: "https://github.com/AlexdxPrabhat/WeatherApp",
    webapp: "https://weatherapp-e890e.web.app/",
  },
  {
    id: 5,
    title: "StudySync",
    description:
      "An original and modern website concept for my future educational platform, StudySync. Built using HTML, CSS, and JavaScript, it features smooth animations, a clean and professional layout, and sections to showcase services, testimonials, and features. Designed as a foundation for scaling into a full-featured learning portal.",
    image: studySync,
    tags: ["HTML", "CSS", "Firebase"],
    github: "https://github.com/AlexdxPrabhat/StudySync",
    webapp: "https://alexdxprabhat.github.io/StudySync/",
  },
];
