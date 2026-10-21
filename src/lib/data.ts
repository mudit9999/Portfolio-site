/**
 * Single source of content. Every string here is taken from (or a light
 * paraphrase of) resume.pdf — nothing is invented. Components only read from it.
 * The résumé has no embedded hyperlinks; GitHub / LinkedIn URLs come from the
 * plain-text handles printed in its header.
 */

export const PROFILE = {
  name: "Mudit Mehrotra",
  firstName: "Mudit",
  initials: "MM",
  title: "Senior Software Engineer",
  role: "Full-Stack & AI/ML Engineer",
  email: "muditmehrotra9999@gmail.com",
  phone: "+91-7906537025",
  phoneHref: "tel:+917906537025",
  github: "https://github.com/mudit9999",
  githubHandle: "mudit9999",
  linkedin: "https://linkedin.com/in/mudit-mehrotra999",
  linkedinHandle: "mudit-mehrotra999",
  resume: "/Mudit-Mehrotra-Resume.pdf",
  resumeSummary:
    "Full-Stack AI/ML Engineer with 5+ years of experience specializing in building end-to-end web applications, intelligent conversational agents, and production-grade, scalable RAG architectures. Experienced in bridging modern frontend and backend engineering (MERN, Python, FastAPI) with LLMs (LangChain, LangGraph) to deliver high-concurrency, real-time AI solutions.",
  currently: "Currently an AI/ML Engineer at Tiger Analytics.",
  languages: "English & Hindi — Full Professional Proficiency",
  interests: ["Problem Solving", "Cricket", "Music"],
  // paraphrase of the résumé summary, used as the About quote
  quote: "Bridging modern frontend and backend engineering with LLMs to deliver real-time AI.",
} as const;

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

/** Section tags, numbered in page order. */
export const SECTION_INDEX = {
  about: "01",
  skills: "02",
  work: "03",
  certifications: "04",
  experience: "05",
  achievements: "06",
  contact: "07",
} as const;

export type Skill = {
  /** key into TechLogo's BRAND / CONCEPT maps */
  logo: string;
  name: string;
  symbol: string;
  /** project ids (PROJECTS) whose résumé bullets name this skill */
  projects: string[];
};

export type SkillGroup = { family: string; skills: Skill[] };

// Families group the résumé's "Technical Skills" lists.
export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "GenAI",
    skills: [
      { logo: "langchain", name: "LangChain", symbol: "Lc", projects: ["retail"] },
      { logo: "langgraph", name: "LangGraph", symbol: "Lg", projects: ["retail"] },
    ],
  },
  {
    family: "Concepts",
    skills: [
      { logo: "multiagent", name: "Multi-Agent Systems", symbol: "Ma", projects: ["retail"] },
      { logo: "rag", name: "Scalable RAG", symbol: "Rg", projects: [] },
      { logo: "guardrails", name: "LLM Guardrails & Model Armor", symbol: "Gr", projects: ["retail"] },
      { logo: "rbac", name: "RBAC", symbol: "Rb", projects: ["retail"] },
      { logo: "rest", name: "REST APIs", symbol: "Ra", projects: ["procurement"] },
    ],
  },
  {
    family: "Languages",
    skills: [
      { logo: "python", name: "Python", symbol: "Py", projects: [] },
      { logo: "javascript", name: "JavaScript", symbol: "Js", projects: [] },
    ],
  },
  {
    family: "Frontend",
    skills: [{ logo: "react", name: "React.js", symbol: "Re", projects: ["shared-services"] }],
  },
  {
    family: "Backend",
    skills: [
      { logo: "fastapi", name: "FastAPI", symbol: "Fa", projects: ["procurement"] },
      { logo: "nodejs", name: "Node.js", symbol: "No", projects: [] },
      { logo: "nestjs", name: "Nest.js", symbol: "Ne", projects: ["shared-services"] },
    ],
  },
  {
    family: "Databases",
    skills: [
      { logo: "microsoftsqlserver", name: "SQL Server", symbol: "Sq", projects: ["procurement"] },
      { logo: "postgresql", name: "Postgres", symbol: "Pg", projects: ["shared-services"] },
    ],
  },
  {
    family: "Data & Tools",
    skills: [
      { logo: "azure", name: "Azure Data Factory", symbol: "Df", projects: [] },
      { logo: "powerbi", name: "Power BI", symbol: "Bi", projects: [] },
      { logo: "git", name: "Git / GitHub", symbol: "Gi", projects: [] },
    ],
  },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  /** skill names from SKILL_GROUPS */
  tech: string[];
  github?: string;
};

// The résumé lists no personal repos; these are its professional engagements.
export const PROJECTS: Project[] = [
  {
    id: "retail",
    index: "01",
    title: "Retail Sales & Operations Intelligence Platform",
    kicker: "Apparel Retail — Gap Inc. · Tiger Analytics",
    description:
      "Architected and scaled an enterprise retail analytics platform serving ~4,000 daily active users (Store Managers, District Managers, and Executives) to track real-time sales and operational KPIs.",
    features: [
      "Insights Assist — single-agent LangChain executive summaries",
      "Multi-agent, multi-tool LangGraph chatbot",
      "~10–20 s end-to-end response latency",
      "Strict RBAC, Model Armor & LLM guardrails",
      "Text-to-Speech & Speech-to-Text",
      "Contextual follow-up question generation",
    ],
    tech: ["LangChain", "LangGraph", "Multi-Agent Systems", "LLM Guardrails & Model Armor", "RBAC"],
  },
  {
    id: "procurement",
    index: "02",
    title: "Procurement & Supply Chain Management Tool",
    kicker: "PepsiCo — US & Canada Plants · Tiger Analytics",
    description:
      "Built and automated a comprehensive Procurement & Supply Tool managing raw material (Potato) procurement and supply across US and Canada manufacturing plants, covering end-to-end demand planning, forecasting, and actual supplied material tracking.",
    features: [
      "End-to-end demand planning",
      "Forecasting vs. actual supplied material",
      "50+ high-performance FastAPI REST APIs",
      "30+ optimized SQL Server procedures",
      "Migrations across Dev, QA & Production",
      "US & Canada manufacturing plants",
    ],
    tech: ["FastAPI", "REST APIs", "SQL Server"],
  },
  {
    id: "shared-services",
    index: "03",
    title: "Shared Services & Enterprise Budgeting Applications",
    kicker: "Pharma & Enterprise · Tiger Analytics",
    description:
      "Built a full-stack Shared Services Request Application (PostgreSQL, Nest.js, React.js) for a leading Pharma client, boosting Operational Excellence team efficiency by 50% and enabling data-driven budget allocation by location and request type.",
    features: [
      "50% boost in team efficiency",
      "Budget allocation by location & request type",
      "Headcount & Budget Management Tool",
      "Multi-stage approval workflows",
      "Flows for new joiners & internal movers",
      "Zero-defect production deliveries",
    ],
    tech: ["React.js", "Nest.js", "Postgres"],
  },
  {
    id: "automation",
    index: "04",
    title: "Workflow Automation & Risk Management Apps",
    kicker: "Tata Consultancy Services",
    description:
      "Engineered reusable, modular workflow automation packages that standardized deployment across multiple client environments, and developed custom Risk Management web applications backed by structured data lists.",
    features: [
      "Reusable, modular automation packages",
      "Standardized multi-client deployment",
      "Reduced engineering & maintenance effort",
      "Risk Management web applications",
      "Replaced manual spreadsheets",
      "Improved data governance",
    ],
    tech: [],
  },
];

export const CERTIFICATIONS = [
  {
    title: "Microsoft Certified: Data Analyst Associate",
    issuer: "Microsoft · Power BI Data Analytics & Visualization (PL-300)",
  },
];

export type Stop = { year: string; title: string; place: string; detail: string; kind: "education" | "work" };

export const EDUCATION: Stop[] = [
  {
    year: "2016 — 2020",
    title: "B.Tech in Information Technology",
    place: "Ajay Kumar Garg Engineering College (A.K.T.U.)",
    detail: "07/2016 – 09/2020 · Member of Google Developers Club (GDC).",
    kind: "education",
  },
];

export const EXPERIENCE: Stop[] = [
  {
    year: "2021 — 2023",
    title: "System Engineer",
    place: "Tata Consultancy Services (TCS)",
    detail:
      "02/2021 – 04/2023 · Reusable workflow automation packages and custom Risk Management web applications that replaced manual spreadsheets.",
    kind: "work",
  },
  {
    year: "2023 — Now",
    title: "AI/ML Engineer",
    place: "Tiger Analytics",
    detail:
      "05/2023 – Present · Retail intelligence with LangChain & LangGraph agents, a procurement & supply tool on FastAPI and SQL Server, and full-stack budgeting apps. Collaborates with architects on system design and UAT for zero-defect deliveries.",
    kind: "work",
  },
];

export type Achievement = {
  logo: string;
  label: string;
  caption: string;
  detail: string;
  value: number;
  prefix?: string;
  suffix?: string;
  /** years shouldn't count up from zero */
  static?: boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    logo: "trophy",
    label: "Smart India Hackathon",
    caption: "National Finalist",
    detail: "Smart India Hackathon (SIH) 2018",
    value: 2018,
    static: true,
  },
  {
    logo: "rank",
    label: "TCS CodeVita Season 8",
    caption: "Global Rank",
    detail: "Secured Global Rank 4520",
    value: 4520,
    prefix: "#",
  },
  {
    logo: "users",
    label: "Daily active users",
    caption: "Retail intelligence platform",
    detail: "Store Managers, District Managers & Executives",
    value: 4000,
    prefix: "~",
  },
  {
    logo: "fastapi",
    label: "Backend REST APIs",
    caption: "High-performance, on FastAPI",
    detail: "Procurement & Supply Chain Management Tool",
    value: 50,
    suffix: "+",
  },
  {
    logo: "microsoftsqlserver",
    label: "SQL Server procedures",
    caption: "Complex business logic, optimized",
    detail: "Migrated across Dev, QA & Production",
    value: 30,
    suffix: "+",
  },
  {
    logo: "trend",
    label: "Team efficiency",
    caption: "Operational Excellence team",
    detail: "Shared Services Request Application",
    value: 50,
    suffix: "%",
  },
  {
    logo: "calendar",
    label: "Years of experience",
    caption: "Full-stack & AI/ML engineering",
    detail: "Tiger Analytics · TCS",
    value: 5,
    suffix: "+",
  },
];
