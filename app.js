// Cybersecurity Study Plan - Core Scheduler & UI Engine

const MOTIVATIONAL_QUOTES = [
  "Hacking in style... 💖",
  "SecOps, but make it fashion. 💅",
  "Keep compiling, cutie! ✨",
  "Security is hot! Keep studying. 🔒",
  "PortSwigger academy is my happy place! 🍬",
  "Stay secure, stay sparkling. 🌟",
  "Password complexity: high. Cutest tracker: also high. 🔐",
  "LeetCode solved? Time for sweet rewards! 🍧",
  "Protecting databases and looking fabulous. 🕸️🌸",
  "Hackers don't wait for opportunities, they create them in pink! 💻✨"
];

// ⭐ NEW: CATEGORY DEFINITIONS with colors, icons, and metadata
const BUILT_IN_CATEGORIES = {
  portswigger: {
    name: "PortSwigger",
    icon: "🔓",
    color: "#87f0b5",
    weeklyTarget: 12,
    priority: 1,
    required: true,
    description: "Web security labs and exercises"
  },
  secplus: {
    name: "CompTIA Security+",
    icon: "🎓",
    color: "#a6c0fe",
    weeklyTarget: 10,
    priority: 2,
    required: true,
    description: "Security certification prep"
  },
  aws: {
    name: "AWS AI Practitioner",
    icon: "☁️",
    color: "#ffb3a7",
    weeklyTarget: 6,
    priority: 3,
    required: true,
    description: "AWS certification exam prep"
  },
  leetcode: {
    name: "LeetCode Blind 75",
    icon: "💻",
    color: "#c5b3fa",
    weeklyTarget: 5,
    priority: 4,
    required: true,
    description: "Algorithm and data structure practice"
  },
  ahf: {
    name: "AHF Tech Lead",
    icon: "👩‍💼",
    color: "#ff758c",
    weeklyTarget: 7,
    priority: 5,
    required: true,
    description: "Hopeful Fridays tech leadership"
  },
  palana: {
    name: "Palana Preparation",
    icon: "🚀",
    color: "#ff85a2",
    weeklyTarget: 0,
    priority: 7,
    required: false,
    description: "Palana onboarding preparation"
  },
  github: {
    name: "Git Developer Tool",
    icon: "🧑‍💻",
    color: "#ffea79",
    weeklyTarget: 8,
    priority: 8,
    required: false,
    description: "VS Code extension project (with Thanishka)"
  },
  projects: {
    name: "Cybersecurity Projects",
    icon: "🔧",
    color: "#e2bbfd",
    weeklyTarget: 0,
    priority: 9,
    required: false,
    description: "Custom security projects and exercises"
  },
  winfo: {
    name: "WINFO",
    icon: "💰",
    color: "#90EE90",
    weeklyTarget: 5,
    priority: 10,
    required: false,
    description: "Women in finance organization"
  },
  mentor: {
    name: "Mentor Meetings",
    icon: "👨‍🏫",
    color: "#FFD700",
    weeklyTarget: 3,
    priority: 11,
    required: false,
    description: "Cybersecurity mentorship sessions"
  },
  travel: {
    name: "Travel",
    icon: "✈️",
    color: "#87CEEB",
    weeklyTarget: 0,
    priority: 12,
    required: false,
    description: "Travel days with reduced capacity"
  },
  catchup: {
    name: "Catch-Up",
    icon: "🔄",
    color: "#DDA0DD",
    weeklyTarget: 0,
    priority: 13,
    required: false,
    description: "Catch-up and rescheduled work"
  },
  personal: {
    name: "Personal",
    icon: "🏠",
    color: "#F0E68C",
    weeklyTarget: 0,
    priority: 14,
    required: false,
    description: "Personal tasks and breaks"
  },
  palana_security: {
    name: "Palana Security",
    icon: "🛡️",
    color: "#FF6B6B",
    weeklyTarget: 10,
    priority: 15,
    required: false,
    description: "Active Palana security engineering role"
  },
  custom: {
    name: "Custom",
    icon: "✨",
    color: "#ffffff",
    weeklyTarget: 0,
    priority: 99,
    required: false,
    description: "Custom tasks"
  }
};

// ⭐ NEW: EXTRACURRICULAR DEFINITIONS (seed data)
const BUILT_IN_EXTRACURRICULARS = [
  {
    id: "winfo",
    name: "WINFO",
    role: "Finance Director",
    categoryId: "winfo",
    status: "active",
    weeklyHours: 5,
    nextEvent: "TBD",
    notes: "Women in finance organization"
  },
  {
    id: "ahf",
    name: "AHF (Hopeful Fridays)",
    role: "Tech Lead",
    categoryId: "ahf",
    status: "active",
    weeklyHours: 7,
    nextEvent: "TBD",
    notes: "Community platform leadership"
  },
  {
    id: "git-project",
    name: "Git Developer Productivity Tool",
    role: "Co-developer",
    categoryId: "github",
    status: "active",
    weeklyHours: 8,
    nextEvent: "TBD",
    notes: "VS Code extension with Thanishka"
  },
  {
    id: "cybersec-mentor",
    name: "Cybersecurity Mentorship",
    role: "Student",
    categoryId: "mentor",
    status: "active",
    weeklyHours: 3,
    nextEvent: "Monday (weekly meeting with Matt)",
    notes: "Weekly guidance and lab preparation"
  },
  {
    id: "palana-prep",
    name: "Palana Preparation",
    role: "Onboarding",
    categoryId: "palana",
    status: "active-through-june-27",
    weeklyHours: 15,
    nextEvent: "June 15-27",
    notes: "Pre-onboarding security engineering preparation"
  },
  {
    id: "leetcode",
    name: "LeetCode 75",
    role: "Practitioner",
    categoryId: "leetcode",
    status: "active",
    weeklyHours: 5,
    nextEvent: "Daily (1 problem/day)",
    notes: "Algorithm problem solving"
  },
  {
    id: "secplus",
    name: "CompTIA Security+",
    role: "Exam Candidate",
    categoryId: "secplus",
    status: "active",
    weeklyHours: 10,
    nextEvent: "Target: Aug 18-22",
    notes: "Certification exam prep"
  },
  {
    id: "aws",
    name: "AWS AI Practitioner",
    role: "Exam Candidate",
    categoryId: "aws",
    status: "active-until-passed",
    weeklyHours: 6,
    nextEvent: "Target: June 23",
    notes: "Certification exam prep"
  }
];

// 2. PROJECT TASK MODULES (TRACK 4)
const TRACK_4_PROJECTS = [
  {
    id: "password_manager",
    name: "Secure Password Manager",
    desc: "Build a credential vault using Python/Flask or Node.js, implementing AES-GCM encryption for storage and bcrypt for master password hashing.",
    totalHours: 12,
    tasks: [
      { name: "Password Manager: Architecture & Encryption Setup", duration: 3 },
      { name: "Password Manager: User Authentication & Database Schema", duration: 3 },
      { name: "Password Manager: Vault GUI & Secure Copy-Paste", duration: 3 },
      { name: "Password Manager: Security Auditing & Testing", duration: 3 }
    ]
  },
  {
    id: "packet_analyzer",
    name: "Network Packet Analyzer",
    desc: "Create a custom packet sniffer using Python + Scapy to capture, parse, and analyze traffic logs. Detect ARP spoofing or port scans.",
    totalHours: 10,
    tasks: [
      { name: "Packet Sniffer: Raw socket capturing & Scapy environment", duration: 3.5 },
      { name: "Packet Sniffer: Protocol parser (TCP/UDP/ICMP header decoding)", duration: 3.5 },
      { name: "Packet Sniffer: Attack detection rules (port scanning/ARP spoofing)", duration: 3 }
    ]
  },
  {
    id: "vulnerability_scanner",
    name: "Web Vulnerability Scanner",
    desc: "Build a lightweight scanning script that checks target servers for common server misconfigurations, open ports, and basic SQLi/XSS entrypoints.",
    totalHours: 10,
    tasks: [
      { name: "Scanner: Request/Response crawler & Header security audits", duration: 3 },
      { name: "Scanner: SQLi and XSS input fuzzer payloads injection", duration: 4 },
      { name: "Scanner: HTML reporting panel of discovered vulns", duration: 3 }
    ]
  },
  {
    id: "malware_sandbox",
    name: "Keylogger / Malware Sandbox",
    desc: "Ethical keylogger development inside a host-isolated Virtual Machine. Log keystrokes securely and analyze host telemetry changes.",
    totalHours: 14,
    tasks: [
      { name: "Sandbox: VM configuration, firewall isolations, and monitoring tools", duration: 3 },
      { name: "Malware: Keystroke monitoring hook & encrypted local log storage", duration: 4 },
      { name: "Sandbox: Process telemetry, registry audits, and network call tracking", duration: 4 },
      { name: "Sandbox: Indicators of Compromise (IOC) report compilation", duration: 3 }
    ]
  },
  {
    id: "honeypot_setup",
    name: "SSH/Web Honeypot Setup",
    desc: "Deploy a decoy SSH or web listener to log intrusion attempts, brute-force logs, and attacker commands. Push reports to a security dashboard.",
    totalHours: 8,
    tasks: [
      { name: "Honeypot: Mock SSH service configuration & login listener", duration: 3 },
      { name: "Honeypot: Request logger, geolocation API tracker, and alerts system", duration: 3 },
      { name: "Honeypot: Attack pattern analysis & dashboard integration", duration: 2 }
    ]
  }
];

// 3. CURRICULUM BASE DATASET
const CORE_CURRICULUM = {
  // AWS Tasks (Track 2)
  aws: [
    { id: "aws_udemy_1", title: "Udemy AWS Course: Finish remaining hours (Part 1)", duration: 1.5, link: "https://www.udemy.com/" },
    { id: "aws_udemy_2", title: "Udemy AWS Course: Finish remaining hours (Part 2)", duration: 1.5, link: "https://www.udemy.com/" },
    { id: "aws_rev_1", title: "AWS Review: IAM & Identity Access Security", duration: 1.5, link: "https://skillbuilder.aws/exam-prep/cloud-practitioner" },
    { id: "aws_rev_2", title: "AWS Review: EC2 & Compute Infrastructure", duration: 1.5, link: "https://skillbuilder.aws/exam-prep/cloud-practitioner" },
    { id: "aws_rev_3", title: "AWS Review: S3 & Storage Solutions", duration: 1.5, link: "https://skillbuilder.aws/exam-prep/cloud-practitioner" },
    { id: "aws_rev_4", title: "AWS Review: VPC & Cloud Networking", duration: 1.5, link: "https://skillbuilder.aws/exam-prep/cloud-practitioner" },
    { id: "aws_rev_5", title: "AWS Review: Databases (RDS, DynamoDB, Redshift)", duration: 1.5, link: "https://skillbuilder.aws/exam-prep/cloud-practitioner" },
    { id: "aws_rev_6", title: "AWS Review: Monitoring, Scaling & Elasticity", duration: 1.5, link: "https://skillbuilder.aws/exam-prep/cloud-practitioner" },
    { id: "aws_rev_7", title: "AWS Review: Pricing, Support Plans & TCO", duration: 1.5, link: "https://skillbuilder.aws/exam-prep/cloud-practitioner" },
    { id: "aws_exam_prep", title: "AWS Skill Builder Mock Exam & Review", duration: 1.5, link: "https://skillbuilder.aws/exam-prep/cloud-practitioner" },
    { id: "aws_exam", title: "AWS AI Practitioner Certification Exam", duration: 1.5, link: "https://aws.amazon.com/certification/certified-ai-practitioner/" }
  ],
  
  // PortSwigger Tasks (Track 1)
  portswigger: [
    { id: "ps_lab_1", title: "PortSwigger Lab: SQL Injection (SQLi) union attacks", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_2", title: "PortSwigger Lab: SQLi blind vulnerabilities", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_3", title: "PortSwigger Lab: Authentication bypass & brute-forcing", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_4", title: "PortSwigger Lab: Directory Traversal file access", duration: 1.5, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_5", title: "PortSwigger Lab: Command Injection execution flaws", duration: 1.5, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_6", title: "PortSwigger Lab: Business Logic flaws & bypasses", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_7", title: "PortSwigger Lab: Information Disclosure leaks", duration: 1.5, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_8", title: "PortSwigger Lab: Access Control privileges escalation", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_9", title: "PortSwigger Lab: File Upload remote execution", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_10", title: "PortSwigger Lab: Server-Side Request Forgery (SSRF)", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_11", title: "PortSwigger Lab: Cross-Site Scripting (XSS) reflected", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_12", title: "PortSwigger Lab: Stored XSS & DOM-based XSS", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_13", title: "PortSwigger Lab: CSRF validation bypasses", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_14", title: "PortSwigger Lab: CORS configurations exploits", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_15", title: "PortSwigger Lab: Clickjacking vulnerabilities", duration: 1.5, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_16", title: "PortSwigger Lab: DOM-based open redirects", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_17", title: "PortSwigger Lab: WebSockets message manipulation", duration: 1.5, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_18", title: "PortSwigger Lab: XML External Entity (XXE) attacks", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_19", title: "PortSwigger Lab: Advanced SQLi & Filter bypasses", duration: 2, link: "https://portswigger.net/web-security/all-topics" },
    { id: "ps_lab_20", title: "PortSwigger Lab: Advanced XSS & CSP Bypasses", duration: 2, link: "https://portswigger.net/web-security/all-topics" }
  ],
  
  // CompTIA Security+ Tasks (Track 3)
  secplus: [
    { id: "sec_mod_1a", title: "Security+ Study: Module 1 - General Security Concepts (Part A)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_mod_1b", title: "Security+ Study: Module 1 - General Security Concepts (Part B)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_mod_2a", title: "Security+ Study: Module 2 - Threats, Vulnerabilities & Mitigations (Part A)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_mod_2b", title: "Security+ Study: Module 2 - Threats, Vulnerabilities & Mitigations (Part B)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_mod_2c", title: "Security+ Study: Module 2 - Threats, Vulnerabilities & Mitigations (Part C)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_mod_3a", title: "Security+ Study: Module 3 - Security Architecture (Part A)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_mod_3b", title: "Security+ Study: Module 3 - Security Architecture (Part B)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_mod_3c", title: "Security+ Study: Module 3 - Security Architecture (Part C)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_mod_4a", title: "Security+ Study: Module 4 - Security Operations (Part A)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_mod_4b", title: "Security+ Study: Module 4 - Security Operations (Part B)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_mod_4c", title: "Security+ Study: Module 4 - Security Operations (Part C)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_mod_5a", title: "Security+ Study: Module 5 - Security Program Management (Part A)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_mod_5b", title: "Security+ Study: Module 5 - Security Program Management (Part B)", duration: 2.5, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_prac_1", title: "Security+ Dion Practice Exam 1 & Explanations", duration: 2, link: "https://www.udemy.com/course/securityplus/" },
    { id: "sec_prac_2", title: "Security+ Dion Practice Exam 2 & Explanations", duration: 2, link: "https://www.udemy.com/course/securityplus/" },
    { id: "sec_prac_3", title: "Security+ Dion Practice Exam 3 & Explanations", duration: 2, link: "https://www.udemy.com/course/securityplus/" },
    { id: "sec_prac_4", title: "Security+ Dion Practice Exam 4 & Explanations", duration: 2, link: "https://www.udemy.com/course/securityplus/" },
    { id: "sec_review", title: "Security+ Messer Videos Speed Run & Notes Review", duration: 2, link: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/" },
    { id: "sec_exam", title: "CompTIA Security+ SY0-701 Certification Exam", duration: 2.5, link: "https://www.comptia.org/certifications/security" }
  ]
};

// 4. GLOBAL STATE VARIABLES

// Bump this whenever the schedule-generation logic changes. On load, saved states
// (local + cloud) with an older version auto-migrate while preserving completed tasks.
const SCHEDULE_VERSION = 3;
const PLAN_TIMEZONE = "America/Los_Angeles";

let appState = {
  settings: {
    maxNormalDailyHours: 8,
    palanaEnabled: true,
    awsExamPassed: false,
    securityPlusExamPassed: false,
    selectedProjects: ["password_manager", "packet_analyzer", "vulnerability_scanner"], // default projects
    lastRolloverDay: null, // date string representing the last day forced rollover
    scheduleVersion: SCHEDULE_VERSION,
    palanaSecurityEnabled: true, // Palana Security role secured — cycle always runs post-onboarding
    ahfWeeklyTarget: 7 // ⭐ NEW: AHF weekly hours (editable)
  },
  days: [], // array of all days
  categories: {}, // ⭐ NEW: Custom category storage
  extracurriculars: [], // ⭐ NEW: Extracurricular tracking
  rescheduleLedger: {} // Track reschedule history
};

// Date constants
const START_DATE_STR = "2026-06-13";
const END_DATE_STR = "2026-09-01";
const INDIA_START_STR = "2026-06-24";
const INDIA_END_STR = "2026-07-08";
const INFO_START_STR = "2026-06-22";
const INFO_END_STR = "2026-08-21";

// Palana job: onboarding begins the week of June 27, 2026. Intensive prep is
// front-loaded into the lead-up window (plan start → day before onboarding).
const PALANA_ONBOARDING_STR = "2026-06-27";

// Detailed Palana Preparation tasks (June 15–28, 2026). Mentor meetings come from buildMentorTasksForDay().
const PALANA_PREP_TASKS_DETAILED = {
  "2026-06-15": [ // Monday
    { title: "Create Palana security workspace (meeting notes, architecture, threat model, findings, questions, weekly updates)", duration: 0.75 },
    { title: "Write down known Palana technology stack (React Native, Expo, Go, Firebase, GCP, Railway, Next.js, WebSockets)", duration: 0.33 },
    { title: "Begin cybersecurity threat-modeling course (first section of 3.5h total)", duration: 1.0 }
  ],
  "2026-06-16": [ // Tuesday
    { title: "Continue threat-modeling course (CIA, assets, threats, vulnerabilities, risk, controls)", duration: 1.0 }
  ],
  "2026-06-17": [ // Wednesday
    { title: "Finish remaining threat-modeling course portions", duration: 1.5 },
    { title: "Review four core threat-modeling questions", duration: 0.5 }
  ],
  "2026-06-18": [ // Thursday
    { title: "Watch cybersecurity videos from Matt (add video links in notes)", duration: 1.0 }
  ],
  "2026-06-19": [ // Friday
    { title: "Study STRIDE and apply to Palana ride-request flow (2+ threats per category)", duration: 1.0 },
    { title: "Complete PortSwigger threat/vulnerability analysis (attach lab link)", duration: 1.0 }
  ],
  "2026-06-20": [ // Saturday
    { title: "Review Firebase security (auth vs authorization, rules, emulator suite)", duration: 1.5 }
  ],
  "2026-06-21": [ // Sunday
    { title: "Complete beginner Firebase/access-control exercise", duration: 0.5 },
    { title: "Write questions for Matt and create Week 1 summary", duration: 0.75 }
  ],
  "2026-06-22": [ // Monday
    { title: "Study broken access control and IDOR", duration: 1.0 }
  ],
  "2026-06-23": [ // Tuesday
    { title: "Practice Burp Suite (proxy, repeater, modify IDs/headers/tokens)", duration: 1.5 },
    { title: "Complete PortSwigger access-control lab (record request, impact, mitigation)", duration: 0.5 }
  ],
  "2026-06-24": [ // Wednesday — travel day
    { title: "Save notes for offline access", duration: 0.25 },
    { title: "Download diagrams and save onboarding questions", duration: 0.15 },
    { title: "Review CIA and STRIDE if convenient", duration: 0.15 }
  ],
  "2026-06-26": [ // Friday
    { title: "Organize onboarding questions into categories and choose top 12", duration: 0.5 },
    { title: "Prepare short introduction for onboarding", duration: 0.25 }
  ],
  "2026-06-27": [ // Saturday — onboarding day
    { title: "Attend Palana onboarding", duration: 2.0 },
    { title: "Ask for architecture docs, schema, Firebase products, repo/staging access", duration: 0.5 },
    { title: "Confirm testing boundaries and reporting process", duration: 0.5 },
    { title: "Write immediate onboarding notes — Palana Security Onboarding Summary", duration: 0.75 }
  ],
  "2026-06-28": [ // Sunday — optional follow-up
    { title: "Organize onboarding notes (optional)", duration: 0.75 },
    { title: "Record access received and missing access", duration: 0.25 },
    { title: "List first three likely tasks", duration: 0.5 },
    { title: "Decide whether to activate Palana Security Role", duration: 0.25 }
  ]
};

// ⭐ NEW: DETAILED AHF TASKS (June 15-July 26)
const AHF_TASKS_DETAILED = {
  "2026-06-15": [
    { title: "Log in to AHF Microsoft 365", duration: 0.1, time: 6 },
    { title: "Find Outlook Scheduling Poll", duration: 0.1, time: 6 },
    { title: "Confirm access: GoHighLevel, Microsoft Planner, Teams, GitHub", duration: 0.25, time: 15 },
    { title: "Create 'AHF Summer Tasks and Findings' document (sections: GHL workflows, task mgmt, website/GitHub, Rahul questions, Danny questions)", duration: 0.5, time: 30 },
    { title: "List missing access and send Rahul one consolidated permissions message", duration: 0.5, time: 30 }
  ],
  "2026-06-16": [
    { title: "Create one-hour Saturday scheduling poll (Danny, Rahul, Roslyn, Cale, Tejaswi, Patricia; Pacific afternoon options)", duration: 1.0, time: 60 },
    { title: "Mark existing tasks as: unclear, duplicate, outdated, missing owner, or needs leadership decision", duration: 0.75, time: 45 }
  ],
  "2026-06-17": [
    { title: "Understand GoHighLevel workflows (record for each: name, trigger, entry criteria, email frequency, wait steps, conditions, sender, recipient group, repetition, Corey dependency, reply behavior, exit condition; take screenshots)", duration: 1.5, time: 90 }
  ],
  "2026-06-18": [
    { title: "Create TEST workflow: Tejaswi Recurring Email (test daily + weekly recurring, easy stop condition, clear labels, don't affect real members)", duration: 1.0, time: 60 }
  ],
  "2026-06-19": [
    { title: "Create Hopeful Fridays – Planner POC (buckets: leadership decisions, website/portal, technology, operations, communications, completed)", duration: 1.0, time: 60 },
    { title: "Test Planner features: assignment, due dates, labels, checklists, comments, attachments, Teams view, GitHub links, notifications", duration: 0.75, time: 45 }
  ],
  "2026-06-20": [
    { title: "Leadership meeting on: community platform vs member portal, GHL temporary status, website updates location, new website approval, WordPress pre-alpha, account ownership, priorities before India", duration: 1.5, time: 90 },
    { title: "Record: decisions, open questions, owners, deadlines, approved priorities", duration: 0.5, time: 30 }
  ],
  "2026-06-21": [
    { title: "Clean notes and send recap if needed", duration: 0.5, time: 30 },
    { title: "Check GHL test emails and update task document", duration: 0.5, time: 30 },
    { title: "Select next three priorities", duration: 0.25, time: 15 }
  ],
  "2026-06-22": [
    { title: "Create Hopeful Fridays – Trello POC (test: boards/lists, assignments, labels, due dates, GitHub links, PR attachments, Teams, automation, updates)", duration: 1.5, time: 90 },
    { title: "Compare Planner vs Trello", duration: 0.5, time: 30 }
  ],
  "2026-06-23": [
    { title: "Create pre-travel handoff status update (poll/meeting status, GHL findings, email test results, Planner findings, Trello findings, missing permissions, decisions needed, recommended next step)", duration: 1.0, time: 60 },
    { title: "Save documents in AHF-controlled location and share access", duration: 0.5, time: 30 },
    { title: "Turn off test workflows and mark incomplete work", duration: 0.5, time: 30 }
  ],
  "2026-07-09": [
    { title: "Review messages and decisions after travel", duration: 0.75 },
    { title: "Update master task document and identify active work", duration: 0.75 },
    { title: "Meet Rahul if needed; confirm website approval and GitHub access", duration: 1.0 }
  ],
  "2026-07-10": [
    { title: "Practice feature branches, pull requests, and review workflow", duration: 1.0 },
    { title: "Practice merge conflicts and branch protection", duration: 1.0 }
  ],
  "2026-07-13": [
    { title: "Receive knowledge-transfer documentation and clone/run website", duration: 1.5 },
    { title: "Review file structure, form-to-GHL connection, env vars, hosting", duration: 1.0 }
  ],
  "2026-07-14": [
    { title: "Plan dev/staging/production branches and document deployment", duration: 1.0 },
    { title: "Make one small feature-branch change (if website approved)", duration: 1.0 }
  ],
  "2026-07-20": [
    { title: "Set up development and staging environments", duration: 1.5 },
    { title: "Add branch protections and require PR approval", duration: 1.0 }
  ],
  "2026-07-21": [
    { title: "Test one deployment and document rollback procedure", duration: 1.0 },
    { title: "Prevent accidental production deployment", duration: 0.5 }
  ]
};

const PALANA_PREP_TASKS = [
  "Palana Prep: Company mission, safety domain & product deep-dive",
  "Palana Prep: Set up dev environment, accounts & onboarding tooling",
  "Palana Prep: Study the tech stack & architecture documentation",
  "Palana Prep: Review safety/compliance standards & domain knowledge",
  "Palana Prep: Role-specific skill brush-up & hands-on exercises",
  "Palana Prep: Read team repos, codebase & contribution guidelines",
  "Palana Prep: Draft onboarding goals, questions & a 30-day plan",
  "Palana Prep: Research the team & prepare intro/networking notes",
  "Palana Prep: Mock tasks & practice in the problem space",
  "Palana Prep: Consolidate notes & final onboarding readiness review"
];

// 5. HELPER DATE FUNCTIONS
function parseDate(dateStr) {
  const parts = dateStr.split('-');
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getDaysBetween(startStr, endStr) {
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getDayOfWeek(dateStr) {
  const date = parseDate(dateStr);
  return date.getDay(); // 0 = Sunday, 1 = Monday, etc.
}

// ⭐ NEW: Get the real current date in America/Los_Angeles timezone
function getRealCurrentDate() {
  // Get current date in browser's local timezone
  const now = new Date();
  
  // Convert to LA timezone using Intl API (timezone-aware)
  const laFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const parts = laFormatter.formatToParts(now);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  
  return `${year}-${month}-${day}`;
}

// ⭐ NEW: Get real current date as Date object (midnight LA time)
function getRealCurrentDateObj() {
  const dateStr = getRealCurrentDate();
  return parseDate(dateStr);
}

// Plan "today" — real date clamped to the user's configured plan window
function planToday() {
  const real  = getRealCurrentDate();
  const start = (window.userCalendarSettings?.startDate) || START_DATE_STR;
  const end   = (window.userCalendarSettings?.endDate)   || END_DATE_STR;
  if (real < start) return start;
  if (real > end)   return end;
  return real;
}

function isPlanPast(dateStr) {
  return dateStr < planToday();
}

function isPlanFuture(dateStr) {
  return dateStr > planToday();
}

// Merge built-in + user custom categories
function getAllCategories() {
  const merged = {};
  Object.entries(BUILT_IN_CATEGORIES).forEach(([id, cat]) => {
    merged[id] = Object.assign({ id, builtIn: true, active: true, archived: false, exportEnabled: true, order: cat.priority || 99 }, cat);
  });
  Object.entries(appState.categories || {}).forEach(([id, cat]) => {
    merged[id] = Object.assign({ id, builtIn: false }, cat);
  });
  return merged;
}

// Push each category's color into the matching CSS variable (--cat-<id>) so
// every place that renders a color — calendar dots/blocks, today rows, badges,
// legend, track borders — updates at once when a color is edited.
function applyCategoryColors() {
  const cats = getAllCategories();
  Object.values(cats).forEach(cat => {
    if (cat.id && cat.color) {
      document.documentElement.style.setProperty(`--cat-${cat.id}`, cat.color);
    }
  });
}

function getCategoryDef(catId) {
  const all = getAllCategories();
  return all[catId] || BUILT_IN_CATEGORIES.custom || { name: catId, icon: "✨", color: "#ffffff" };
}

function getCategoryLabel(catId) {
  return getCategoryDef(catId).name || catId;
}

function isIndiaTrip(dateStr) {
  return dateStr >= INDIA_START_STR && dateStr <= INDIA_END_STR;
}

function isInfo310Class(dateStr) {
  return dateStr >= INFO_START_STR && dateStr <= INFO_END_STR;
}

// True during the Palana onboarding lead-up window (plan start → day before onboarding).
// ⭐ NEW: Helper function to build AHF tasks for a day
function buildAHFTasksForDay(dateStr) {
  // Use detailed tasks if available for June 15-23 period
  if (dateStr in AHF_TASKS_DETAILED) {
    const tasksForDay = AHF_TASKS_DETAILED[dateStr];
    return tasksForDay.map((task, index) => ({
      id: `${dateStr}_ahf_${index}`,
      category: "ahf",
      title: task.title,
      duration: task.duration,
      completed: false,
      link: null
    }));
  }
  
  // Default: 1-hour AHF tech lead work for other days
  return [{
    id: `${dateStr}_ahf`,
    category: "ahf",
    title: "AHF Work (Tech Lead Duties)",
    duration: 1.0,
    completed: false,
    link: null
  }];
}

// ⭐ NEW: Helper function to build recurring mentor meetings
function buildMentorTasksForDay(dateStr) {
  const tasks = [];
  const dayOfWeek = getDayOfWeek(dateStr);
  
  // Every Monday: Weekly meeting with Matt (1 hour)
  if (dayOfWeek === 1) {
    tasks.push({
      id: `${dateStr}_mentor_meeting`,
      category: "mentor",
      title: "Cybersecurity Mentor Meeting with Matt",
      duration: 1.0,
      completed: false,
      recurring: "weekly-monday",
      fixed: true,
      link: null
    });
  }
  
  // Every Sunday: Mentor Lab Preparation (1-2 hours)
  if (dayOfWeek === 0) {
    tasks.push({
      id: `${dateStr}_mentor_prep`,
      category: "mentor",
      title: "Mentor Lab Preparation (prep for Monday meeting)",
      duration: 1.5,
      completed: false,
      recurring: "weekly-sunday",
      fixed: true,
      link: null
    });
  }
  
  return tasks;
}

// ⭐ WINFO — Finance Director duties (recurring weekly on Tuesdays)
function buildWinfoTasksForDay(dateStr) {
  const tasks = [];
  if (isIndiaTrip(dateStr)) return tasks; // paused during India trip
  const dayOfWeek = getDayOfWeek(dateStr);
  if (dayOfWeek === 2) { // Tuesday
    tasks.push({
      id: `${dateStr}_winfo_meeting`,
      category: "winfo",
      title: "WINFO Meeting",
      duration: 1.0,
      completed: false,
      recurring: "weekly-tuesday",
      fixed: true,
      link: null
    });
    tasks.push({
      id: `${dateStr}_winfo_reimb`,
      category: "winfo",
      title: "WINFO: Check reimbursements",
      duration: 0.5,
      completed: false,
      link: null
    });
    tasks.push({
      id: `${dateStr}_winfo_grants`,
      category: "winfo",
      title: "WINFO: Check open grants & scholarships",
      duration: 0.5,
      completed: false,
      link: null
    });
  }
  return tasks;
}

function isPalanaPrepWindow(dateStr) {
  return dateStr >= START_DATE_STR && dateStr < PALANA_ONBOARDING_STR;
}

// Builds the Palana task for a given day (or null if none should be scheduled).
// Before onboarding: intensive daily "Palana Onboarding Prep" blocks.
// Post-onboarding Palana Security work runs on a repeating 3-week cycle,
// Monday–Friday, anchored to the first Monday after onboarding (June 29):
//   week 1 → threat modeling, week 2 → test vulnerabilities,
//   week 3 → document & help dev team mitigate, then repeat to end of summer.
const PALANA_CYCLE_START = "2026-06-29";
const PALANA_CYCLE_PHASES = [
  "Threat modeling",
  "Test the vulnerabilities",
  "Document findings & help dev team mitigate"
];

// After onboarding: regular weekday safety-engineering work blocks.
function buildPalanaTaskForDay(dateStr, dayOfWeek, isIndia) {
  if (!appState.settings.palanaEnabled) return [];
  if (isIndia && dateStr !== "2026-06-24") return [];

  // Detailed prep through June 28
  if (dateStr in PALANA_PREP_TASKS_DETAILED) {
    return PALANA_PREP_TASKS_DETAILED[dateStr].map((task, index) => ({
      id: `${dateStr}_palana_${index}`,
      category: "palana",
      title: task.title,
      duration: task.duration,
      completed: false,
      fixed: dateStr <= "2026-06-27",
      link: null
    }));
  }

  // After onboarding the Palana Security role is active, so the work cycle
  // always runs Mon–Fri on the repeating 3-week threat-model → test → mitigate
  // rotation (no toggle required).
  if (dateStr >= PALANA_CYCLE_START) {
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const weeksIn = Math.floor(getDaysBetween(PALANA_CYCLE_START, dateStr) / 7);
      const phaseIdx = ((weeksIn % 3) + 3) % 3;
      const phase = PALANA_CYCLE_PHASES[phaseIdx];
      const palanaHours = dayOfWeek === 5 ? 2.0 : 1.5;
      return [{
        id: `${dateStr}_palana_sec`,
        category: "palana_security",
        title: `Palana Security — ${phase}`,
        duration: palanaHours,
        completed: false,
        cyclePhase: phaseIdx + 1,
        link: null
      }];
    }
  }
  return [];
}

// Check if a day is a rest day (for capacity variation)
// Sunday is the default rest day (capacity 2).
function getBaseCapacityForDay(dateStr, maxNormal) {
  if (isIndiaTrip(dateStr)) {
    return 3.0; // Hard max of 2-3 hours during India trip
  }
  const dayOfWeek = getDayOfWeek(dateStr);
  if (dayOfWeek === 0) { // Sunday
    return 2.0; // 0-2 hours rest day
  } else if (dayOfWeek === 6) { // Saturday
    return 4.0; // Weekend lighter day (3-5 hours)
  }
  
  // Weekday variation (Mon=max, Tue=max-2, Wed=max, Thu=max-2, Fri=max)
  if (dayOfWeek === 2 || dayOfWeek === 4) { // Tue, Thu
    return Math.max(5.0, maxNormal - 2.0); // 5-6 hours
  }
  
  return maxNormal; // Normal weekday max (8 hours)
}

// 6. SCHEDULER ENGINE - BASE GENERATOR
// This function creates the complete schedule from scratch.
function generateBaseSchedule() {
  const daysList = [];
  const start = parseDate(START_DATE_STR);
  const end = parseDate(END_DATE_STR);
  
  let current = new Date(start);
  while (current <= end) {
    const dateStr = formatDate(current);
    const dayOfWeek = getDayOfWeek(dateStr);
    const isIndia = isIndiaTrip(dateStr);
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    
    const dayObj = {
      date: dateStr,
      isIndia: isIndia,
      maxCapacity: getBaseCapacityForDay(dateStr, appState.settings.maxNormalDailyHours),
      tasks: [],
      rolledOver: false
    };
    
    // Add Routines for this day
    // 1. AHF Tech Lead Work (1h base + detailed tasks June 15-23)
    const ahfTasks = buildAHFTasksForDay(dateStr);
    ahfTasks.forEach(task => {
      dayObj.tasks.push(task);
    });
    
    // 2. LeetCode (1 problem/day, daily, ~0.5h)
    // Draw problem id from 1 to 75. Let's do it sequentially.
    // For indexing: let's map it based on the number of days we've generated
    // (We will adjust LC problem IDs dynamically so that Sunday can be skipped/grouped)
    dayObj.tasks.push({
      id: `${dateStr}_leetcode`,
      category: "leetcode",
      title: "LeetCode Blind 75 Problem",
      duration: 0.5,
      completed: false,
      link: "https://neetcode.io/practice/practice/blind75",
      leetcodeId: null // will populate below
    });

    // (INFO 310 course removed — tracked separately in Canvas.)

    // 4. Palana — intensive onboarding prep before the job starts (week of June 27),
    //    then regular safety-engineering work blocks afterwards.
    const palanaTasks = buildPalanaTaskForDay(dateStr, dayOfWeek, isIndia);
    palanaTasks.forEach(task => {
      dayObj.tasks.push(task);
    });

    // 5. Git Developer Productivity Tool (8-week roadmap via git-roadmap.js)
    if (typeof buildGitProjectTasksForDay === "function" && dateStr >= "2026-06-15") {
      const gitTasks = buildGitProjectTasksForDay(dateStr, dayOfWeek, isIndia);
      gitTasks.forEach(t => dayObj.tasks.push(t));
    }

    // 6. ⭐ NEW: Mentor Meetings (recurring: Monday + Sunday prep)
    const mentorTasks = buildMentorTasksForDay(dateStr);
    mentorTasks.forEach(task => {
      dayObj.tasks.push(task);
    });

    // 7. ⭐ WINFO — Finance Director duties (Tuesdays)
    buildWinfoTasksForDay(dateStr).forEach(task => dayObj.tasks.push(task));

    // 8. ⭐ One-off: update resume / CV
    if (dateStr === "2026-06-23") {
      dayObj.tasks.push({
        id: `${dateStr}_resume_update`,
        category: "personal",
        title: "Update resume / CV",
        duration: 1.0,
        completed: false,
        link: null
      });
    }

    daysList.push(dayObj);
    current.setDate(current.getDate() + 1);
  }

  // ⭐ UPDATED: Assign exact LeetCode questions from BLIND_75_QUESTIONS array (1 per day, including Sundays)
  let lcIndex = 0;
  for (let i = 0; i < daysList.length; i++) {
    const day = daysList[i];
    const lcTask = day.tasks.find(t => t.category === "leetcode");
    
    if (lcTask) {
      // Schedule exactly 1 LeetCode problem per day (including Sunday)
      lcTask.title = `LeetCode Blind 75: #${BLIND_75_QUESTIONS[lcIndex % 75].id} - ${BLIND_75_QUESTIONS[lcIndex % 75].name}`;
      lcTask.link = BLIND_75_QUESTIONS[lcIndex % 75].link;
      lcTask.leetcodeId = BLIND_75_QUESTIONS[lcIndex % 75].id;
      lcIndex++;
    }
  }

  // Create Curriculum Backlog (Tracks 1, 2, 3, 4)
  const curriculumBacklog = [];
  
  // Add PortSwigger Tasks (Track 1)
  CORE_CURRICULUM.portswigger.forEach(t => {
    curriculumBacklog.push({
      category: "portswigger",
      title: t.title,
      duration: t.duration,
      link: t.link
    });
  });

  // Add AWS Tasks (Track 2)
  CORE_CURRICULUM.aws.forEach(t => {
    curriculumBacklog.push({
      category: "aws",
      title: t.title,
      duration: t.duration,
      link: t.link
    });
  });

  // Add Security+ Tasks (Track 3)
  CORE_CURRICULUM.secplus.forEach(t => {
    curriculumBacklog.push({
      category: "secplus",
      title: t.title,
      duration: t.duration,
      link: t.link
    });
  });

  // Add Selected Projects Tasks (Track 4)
  appState.settings.selectedProjects.forEach(projId => {
    const proj = TRACK_4_PROJECTS.find(p => p.id === projId);
    if (proj) {
      proj.tasks.forEach(t => {
        curriculumBacklog.push({
          category: "projects",
          title: t.name,
          duration: t.duration,
          link: "https://bestprojectideas.com/cybersecurity-project-ideas/"
        });
      });
    }
  });

  // Schedule Curriculum Tasks sequentially into the calendar days
  distributeCurriculumTasks(daysList, curriculumBacklog, 0);

  appState.days = daysList;
}

// 7. SCHEDULER ENGINE - TASK DISTRIBUTOR / REFLOW ENGINE
// Distributes a backlog of curriculum tasks onto future days (from `startDayIndex` onwards)
// respecting max capacities, India trip constraints, and sequencing rules.
function distributeCurriculumTasks(daysArray, backlog, startDayIndex) {
  // Clear any existing curriculum tasks from the days we are reflowing.
  // Keep completed tasks and all fixed/routine categories — only the curriculum
  // tracks (portswigger/aws/secplus/projects) get redistributed.
  const KEEP_CATS = new Set(["ahf", "leetcode", "palana", "palana_security", "github", "mentor", "winfo", "personal"]);
  for (let i = startDayIndex; i < daysArray.length; i++) {
    daysArray[i].tasks = daysArray[i].tasks.filter(t => t.completed || KEEP_CATS.has(t.category));
  }

  let backlogIndex = 0;
  
  for (let i = startDayIndex; i < daysArray.length; i++) {
    if (backlogIndex >= backlog.length) break;
    
    const day = daysArray[i];
    
    // Rule: PortSwigger (Track 1) runs June 13 - June 27, but drops to 0 hrs during India trip (starts June 24).
    // AWS runs first week (exam June 23).
    // Security+ starts July 9.
    // Projects run after Security+ exam.
    // So we apply constraints based on date ranges:
    const isIndia = day.isIndia;
    
    if (isIndia) {
      // India Trip (reduced workload): Max 2-3 hours.
      // Already fully packed with AHF, LeetCode, and INFO 310 routines.
      // NO curriculum study blocks can be placed here.
      continue; 
    }
    
    // Calculate current scheduled hours from routines
    let scheduledHours = day.tasks.reduce((sum, t) => sum + t.duration, 0);
    
    // Distribute tasks on this day up to its maxCapacity
    while (scheduledHours < day.maxCapacity && backlogIndex < backlog.length) {
      const task = backlog[backlogIndex];
      
      // Check date availability constraints for the specific track:
      if (task.category === "portswigger") {
        // PortSwigger must end before/by India trip overlap (June 24).
        if (day.date >= INDIA_START_STR) {
          // Cannot schedule PortSwigger after India trip starts.
          // In baseline generation, it is forced to fit before June 24.
          // During rollovers, if it cascades past June 24, we push it to July 9 (after India trip).
          if (day.date < "2026-07-09") {
            break; // Skip scheduling PortSwigger during India trip, try next days
          }
        }
      }
      
      if (task.category === "secplus") {
        // Security+ starts after India trip (July 9)
        if (day.date < "2026-07-09") {
          break; // Cannot schedule Sec+ before July 9. Move to next day.
        }
      }

      if (task.category === "projects") {
        // Projects start after Security+ exam (target August 22/23)
        if (day.date < "2026-08-22") {
          break; // Cannot schedule projects before Sec+ finishes
        }
      }

      const availableSpace = day.maxCapacity - scheduledHours;
      
      if (availableSpace >= 0.5) {
        if (task.duration <= availableSpace) {
          // Task fits fully
          day.tasks.push({
            id: `${day.date}_curr_${backlogIndex}_${task.category}`,
            category: task.category,
            title: task.title,
            duration: task.duration,
            completed: false,
            link: task.link
          });
          scheduledHours += task.duration;
          backlogIndex++;
        } else {
          // Task fits partially. Split it!
          const part1Duration = Math.round(availableSpace * 10) / 10;
          if (part1Duration >= 0.5) {
            day.tasks.push({
              id: `${day.date}_curr_${backlogIndex}_${task.category}_p1`,
              category: task.category,
              title: `${task.title} (Part A)`,
              duration: part1Duration,
              completed: false,
              link: task.link
            });
            scheduledHours += part1Duration;
            
            // Put Part 2 back in backlog
            const part2Duration = Math.round((task.duration - part1Duration) * 10) / 10;
            backlog[backlogIndex] = {
              category: task.category,
              title: `${task.title} (Part B)`,
              duration: part2Duration,
              link: task.link
            };
            // Do not increment backlogIndex so we process Part B on the next day
          } else {
            // Space too small to split, push task to next day
            break;
          }
        }
      } else {
        break; // No more capacity on this day
      }
    }
  }

  // If there are still tasks left in the backlog after September 1st, 
  // we create EXTRA days in the schedule to hold them, which flags the At-Risk state.
  if (backlogIndex < backlog.length) {
    let overflowDate = parseDate(END_DATE_STR);
    
    while (backlogIndex < backlog.length) {
      overflowDate.setDate(overflowDate.getDate() + 1);
      const dateStr = formatDate(overflowDate);
      
      const overflowDay = {
        date: dateStr,
        isIndia: false,
        maxCapacity: appState.settings.maxNormalDailyHours,
        tasks: [],
        rolledOver: false,
        isOverflow: true
      };
      
      let scheduledHours = 0;
      
      while (scheduledHours < overflowDay.maxCapacity && backlogIndex < backlog.length) {
        const task = backlog[backlogIndex];
        const availableSpace = overflowDay.maxCapacity - scheduledHours;
        
        if (task.duration <= availableSpace) {
          overflowDay.tasks.push({
            id: `${dateStr}_curr_${backlogIndex}_${task.category}`,
            category: task.category,
            title: task.title,
            duration: task.duration,
            completed: false,
            link: task.link
          });
          scheduledHours += task.duration;
          backlogIndex++;
        } else {
          const part1Duration = availableSpace;
          if (part1Duration >= 0.5) {
            overflowDay.tasks.push({
              id: `${dateStr}_curr_${backlogIndex}_${task.category}_p1`,
              category: task.category,
              title: `${task.title} (Part A)`,
              duration: part1Duration,
              completed: false,
              link: task.link
            });
            scheduledHours += part1Duration;
            
            backlog[backlogIndex] = {
              category: task.category,
              title: `${task.title} (Part B)`,
              duration: task.duration - part1Duration,
              link: task.link
            };
          } else {
            break;
          }
        }
      }
      
      daysArray.push(overflowDay);
    }
  }
}

// 8. SMART ROLLOVER LOGIC ("I didn't finish today")
// Categories that get spread across later days by available capacity
// instead of piling onto today.
const ROLLOVER_DISTRIBUTE = new Set(["aws", "secplus", "leetcode"]);
// Categories left exactly where they are (not rolled at all).
const ROLLOVER_LEAVE = new Set([]);
// Curriculum categories that get a reschedule-ledger entry for exports.
const ROLLOVER_CURRICULUM = new Set(["portswigger", "aws", "secplus", "projects"]);

function forceRollover(dayDateStr) {
  const activeDayIndex = appState.days.findIndex(d => d.date === dayDateStr);
  if (activeDayIndex === -1) return;

  const todayStr = getRealCurrentDate();
  const todayDay = appState.days.find(d => d.date === todayStr);
  if (!todayDay) {
    alert("Today isn't in your plan range, so there's nowhere to roll tasks into. Nothing was changed.");
    return;
  }

  // Save undo snapshot before modifying anything
  appState.rolloverUndoSnapshot = {
    days: JSON.parse(JSON.stringify(appState.days)),
    lastRolloverDay: appState.settings.lastRolloverDay,
    rescheduleLedger: JSON.parse(JSON.stringify(appState.rescheduleLedger || {})),
    fromDate: dayDateStr
  };

  // Mark the day itself as rolled over
  appState.days[activeDayIndex].rolledOver = true;
  appState.settings.lastRolloverDay = dayDateStr;

  // 1. Gather every uncompleted task on or before the selected day, except
  //    INFO 310 (left in place). Split into two buckets:
  //      - toDistribute: AWS / Security+ / LeetCode → spread by capacity
  //      - toToday:      everything else            → pile onto today
  //    Tasks are removed from their original day so nothing is duplicated;
  //    completed tasks and untouched INFO 310 tasks stay put.
  const toDistribute = [];
  const toToday = [];

  const recordLedger = (t, fromDate) => {
    if (!ROLLOVER_CURRICULUM.has(t.category)) return;
    const cleanTitle = t.title.replace(" (Part A)", "").replace(" (Part B)", "").replace(" (Rolled Over)", "");
    appState.rescheduleLedger = appState.rescheduleLedger || {};
    const led = appState.rescheduleLedger[cleanTitle] || { originalDate: (t.originalDate || fromDate), count: 0 };
    led.count += 1;
    led.lastMovedFrom = fromDate;
    led.movedOn = new Date().toISOString();
    appState.rescheduleLedger[cleanTitle] = led;
  };

  // Only the day you actually rolled over is touched — no other day is
  // gathered, cleared, or rescheduled.
  const rolledDay = appState.days[activeDayIndex];
  rolledDay.tasks.forEach(t => {
    if (t.completed || ROLLOVER_LEAVE.has(t.category)) return;
    recordLedger(t, rolledDay.date);
    const cleanTitle = t.title.replace(" (Part A)", "").replace(" (Part B)", "").replace(" (Rolled Over)", "");
    const entry = {
      category: t.category,
      title: cleanTitle,
      duration: t.duration || 0,
      link: t.link || null,
      originalDate: t.originalDate || rolledDay.date
    };
    (ROLLOVER_DISTRIBUTE.has(t.category) ? toDistribute : toToday).push(entry);
  });
  // Keep completed tasks and any untouched INFO 310 tasks on the rolled day
  rolledDay.tasks = rolledDay.tasks.filter(t => t.completed || ROLLOVER_LEAVE.has(t.category));

  let rollSeq = 0;
  const makeTask = (t, dateStr) => ({
    id: `${dateStr}_rollover_${Date.now()}_${rollSeq++}_${t.category}`,
    category: t.category,
    title: t.title + " (Rolled Over)",
    duration: t.duration,
    completed: false,
    link: t.link || null,
    rolledFrom: dayDateStr,
    originalDate: t.originalDate
  });

  // 2. Pile "everything else" onto today.
  toToday.forEach(t => todayDay.tasks.push(makeTask(t, todayStr)));

  // 3. Distribute AWS / Security+ / LeetCode across later days that have spare
  //    capacity (skip India-trip days). Security+ first so it lands soonest;
  //    earliest-fit keeps earlier days full and the load even.
  const distOrder = { secplus: 1, aws: 2, leetcode: 3 };
  toDistribute.sort((a, b) => (distOrder[a.category] || 9) - (distOrder[b.category] || 9));

  const candidateDays = appState.days.filter(d => d.date > todayStr && !d.isIndia);
  const loadOf = (day) => day.tasks.reduce((s, t) => s + (t.duration || 0), 0);

  toDistribute.forEach(t => {
    const target = candidateDays.find(d => loadOf(d) + t.duration <= d.maxCapacity);
    // Fall back to today if no later day has room — never drop the task.
    (target || todayDay).tasks.push(makeTask(t, (target || todayDay).date));
  });

  // Save state & redraw UI
  saveState();
  applyCategoryColors();
  initUI();
  showDayDetails(todayStr);
  playSynthSound("warning");
}

function undoRollover() {
  const snap = appState.rolloverUndoSnapshot;
  if (!snap) return alert("Nothing to undo.");
  appState.days = snap.days;
  appState.settings.lastRolloverDay = snap.lastRolloverDay;
  appState.rescheduleLedger = snap.rescheduleLedger;
  appState.rolloverUndoSnapshot = null;
  saveState();
  initUI();
  showDayDetails(snap.fromDate);
  playSynthSound("click");
}

// One-time repair for schedules damaged by the old multi-day rollover (which
// swept every day from the plan start through the rolled day). Rebuilds any
// day that's missing its original tasks from a freshly generated pristine
// schedule, removes the rolled-over piles, and preserves completion
// checkmarks. Run from the console: repairRolloverDamage()
function repairRolloverDamage(silent) {
  const cleanTitle = (s) => (s || "")
    .replace(/ \(Part [AB]\)/g, "")
    .replace(/ \(Rolled Over\)/g, "")
    .trim();

  // Build a pristine schedule without losing the real one.
  const realDays = appState.days;
  generateBaseSchedule();          // overwrites appState.days with pristine
  const pristine = appState.days;
  appState.days = realDays;        // restore the user's actual days
  const pristineByDate = {};
  pristine.forEach(d => { pristineByDate[d.date] = d; });

  // 1. Remove every rolled-over dumped task (these are the displaced copies).
  let removedRolled = 0;
  appState.days.forEach(d => {
    const before = d.tasks.length;
    d.tasks = d.tasks.filter(t => !t.rolledFrom);
    removedRolled += before - d.tasks.length;
  });

  // 2. For each day, re-add any pristine task that's now missing, preserving
  //    completion if that task title was completed on that day.
  let restoredTasks = 0, repairedDays = 0;
  appState.days.forEach(d => {
    const pris = pristineByDate[d.date];
    if (!pris) return;
    const completedTitles = new Set(
      d.tasks.filter(t => t.completed).map(t => cleanTitle(t.title))
    );
    const currentTitles = new Set(d.tasks.map(t => cleanTitle(t.title)));
    let added = 0;
    pris.tasks.forEach(pt => {
      if (!currentTitles.has(cleanTitle(pt.title))) {
        const copy = JSON.parse(JSON.stringify(pt));
        if (completedTitles.has(cleanTitle(pt.title))) copy.completed = true;
        d.tasks.push(copy);
        added++;
      }
    });
    if (added) { repairedDays++; restoredTasks += added; }
  });

  appState.rolloverUndoSnapshot = null;
  appState.settings.lastRolloverDay = null;
  saveState();
  applyCategoryColors();
  initUI();
  const summary = `Repair complete: restored ${restoredTasks} task(s) across ${repairedDays} day(s), removed ${removedRolled} rolled-over copy(ies).`;
  console.log(summary);
  if (!silent) alert(summary);
  else if (typeof showAuthToast === "function" && (restoredTasks || removedRolled)) {
    showAuthToast("✅ Schedule restored — " + restoredTasks + " tasks recovered.", "success");
  }
  return { restoredTasks, repairedDays, removedRolled };
}
window.repairRolloverDamage = repairRolloverDamage;

// One-time auto-repair: runs once on the next load to undo damage from the old
// multi-day rollover, then sets a flag so it never runs again (future rollovers
// are left alone). Safe no-op on an already-clean schedule.
function maybeAutoRepairRollover() {
  appState.settings = appState.settings || {};
  if (appState.settings.rolloverRepairV1Done) return;
  try {
    repairRolloverDamage(true);
  } catch (e) {
    console.error("Auto-repair failed:", e);
  }
  appState.settings.rolloverRepairV1Done = true;
  saveState();
}

// Reflows scheduled hours if Palana Project toggle or settings are modified.
// Does NOT lock any days, just reflows the future curriculum.
function reflowRemainingCurriculum() {
  // Find current date or last rollover date to start reflowing
  let startReflowIndex = 0;
  if (appState.settings.lastRolloverDay) {
    const idx = appState.days.findIndex(d => d.date === appState.settings.lastRolloverDay);
    if (idx !== -1) {
      startReflowIndex = idx + 1;
    }
  }

  // Pre-calculate the correct LeetCode Blind 75 question index up to startReflowIndex
  let lcIndex = 0;
  for (let i = 0; i < startReflowIndex; i++) {
    const d = appState.days[i];
    d.tasks.forEach(t => {
      // Only count standard LeetCode tasks, not rolled-over ones
      if (t.category === "leetcode" && !t.title.includes("Rolled Over")) {
        lcIndex++;
      }
    });
  }

  // Snapshot the uncompleted curriculum backlog BEFORE rebuilding routines below,
  // because that rebuild clears each day's task list. (Without this, toggling
  // Palana/settings would silently wipe all PortSwigger/AWS/Sec+ tasks.)
  const curriculumBacklog = [];
  for (let i = startReflowIndex; i < appState.days.length; i++) {
    appState.days[i].tasks.forEach(t => {
      const isCurriculum = t.category === "portswigger" || t.category === "aws" || t.category === "secplus";
      if (!t.completed && (isCurriculum || t.title.includes("Rolled Over"))) {
        curriculumBacklog.push({
          category: t.category,
          title: t.title.replace(" (Part A)", "").replace(" (Part B)", ""),
          duration: t.duration,
          link: t.link
        });
      }
    });
  }

  // Re-generate fixed routines for days >= startReflowIndex (to apply Palana/capacity edits)
  for (let i = startReflowIndex; i < appState.days.length; i++) {
    const day = appState.days[i];
    
    // Save any completed tasks first!
    const completedTasks = day.tasks.filter(t => t.completed);
    
    // Clean all tasks
    day.tasks = [];
    
    // Update maxCapacity based on new settings
    day.maxCapacity = getBaseCapacityForDay(day.date, appState.settings.maxNormalDailyHours);
    
    // Restore completed tasks
    completedTasks.forEach(ct => day.tasks.push(ct));
    
    // Re-add routines if they were not already completed
    const dayOfWeek = getDayOfWeek(day.date);
    const isIndia = day.isIndia;
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    
    // AHF — use detailed tasks when available
    if (!day.tasks.some(t => t.category === "ahf")) {
      buildAHFTasksForDay(day.date).forEach(t => day.tasks.push(t));
    }
    
    // LeetCode — exactly 1 problem per day (including Sunday and Monday)
    const existingLc = day.tasks.filter(t => t.category === "leetcode" && !t.title.includes("Rolled Over"));
    lcIndex += existingLc.length;
    if (existingLc.length === 0) {
      const problem = BLIND_75_QUESTIONS[lcIndex % 75];
      day.tasks.push({
        id: `${day.date}_leetcode`,
        category: "leetcode",
        title: `LeetCode Blind 75: #${problem.id} - ${problem.name}`,
        duration: 0.5,
        completed: false,
        link: problem.link,
        leetcodeId: problem.id
      });
      lcIndex++;
    }

    // (INFO 310 course removed — tracked separately in Canvas.)

    // Palana prep / security (array return)
    if (!day.tasks.some(t => t.category === "palana" || t.category === "palana_security")) {
      buildPalanaTaskForDay(day.date, dayOfWeek, isIndia).forEach(t => day.tasks.push(t));
    }

    // Git Developer Productivity Tool roadmap
    if (typeof buildGitProjectTasksForDay === "function" && day.date >= "2026-06-15") {
      if (!day.tasks.some(t => t.category === "github")) {
        buildGitProjectTasksForDay(day.date, dayOfWeek, isIndia).forEach(t => day.tasks.push(t));
      }
    }

    // Mentor meetings (fixed recurring)
    if (!day.tasks.some(t => t.category === "mentor")) {
      buildMentorTasksForDay(day.date).forEach(t => day.tasks.push(t));
    }

    // WINFO — Finance Director duties (Tuesdays)
    if (!day.tasks.some(t => t.category === "winfo")) {
      buildWinfoTasksForDay(day.date).forEach(t => day.tasks.push(t));
    }
  }

  // Remove overflow days (recreated during distribution if the plan runs long)
  appState.days = appState.days.filter(d => !d.isOverflow);

  // Track which project tasks are already completed anywhere in the plan
  // so we don't re-schedule them when rebuilding the project backlog.
  const completedProjectTitles = new Set();
  appState.days.forEach(day => {
    day.tasks.forEach(t => {
      if (t.category === "projects" && t.completed) {
        const clean = t.title.replace(" (Part A)", "").replace(" (Part B)", "").replace(" (Rolled Over)", "");
        completedProjectTitles.add(clean);
      }
    });
  });

  // Rebuild project backlog from scratch using currently selected projects.
  // Only include tasks that haven't been completed yet.
  appState.settings.selectedProjects.forEach(projId => {
    const proj = TRACK_4_PROJECTS.find(p => p.id === projId);
    if (proj) {
      proj.tasks.forEach(t => {
        if (!completedProjectTitles.has(t.name)) {
          curriculumBacklog.push({
            category: "projects",
            title: t.name,
            duration: t.duration,
            link: "https://bestprojectideas.com/cybersecurity-project-ideas/"
          });
        }
      });
    }
  });

  // Sort backlog by original sequence
  const categoryOrder = { "portswigger": 1, "aws": 2, "secplus": 3, "projects": 4 };
  curriculumBacklog.sort((a, b) => (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99));

  // Distribute tasks
  distributeCurriculumTasks(appState.days, curriculumBacklog, startReflowIndex);

  // Save State and Render
  saveState();
  initUI();
}

// 9. LOCAL STORAGE PERSISTENCE & MIGRATION
// ⭐ NEW: Task Notes System Functions
function initializeTaskNotes() {
  if (!appState.taskNotes) appState.taskNotes = {};
}

function getTaskNotes(taskId) {
  initializeTaskNotes();
  const n = appState.taskNotes[taskId];
  if (!n) return { text: "", plannedOutcome: "", actualOutcome: "", learned: "", blockers: "", nextStep: "", links: "", lastUpdated: null };
  if (typeof n === "string") return { text: n, plannedOutcome: "", actualOutcome: "", learned: "", blockers: "", nextStep: "", links: "", lastUpdated: null };
  return n;
}

function saveTaskNote(taskId, noteObj) {
  initializeTaskNotes();
  appState.taskNotes[taskId] = Object.assign({}, noteObj, { lastUpdated: new Date().toISOString() });
  saveState();
}

function taskHasNotes(taskId) {
  const n = getTaskNotes(taskId);
  return !!(n.text || n.plannedOutcome || n.actualOutcome || n.learned || n.blockers || n.nextStep || n.links);
}

function deleteTaskNote(taskId) {
  if (appState.taskNotes) delete appState.taskNotes[taskId];
  saveState();
}

// ⭐ NEW: Render Task Notes Modal
function showTaskNotesModal(taskId, taskTitle) {
  const notes = getTaskNotes(taskId);
  const modal = document.getElementById("task-notes-modal");
  const modalTitle = document.getElementById("task-notes-modal-title");
  const saveBtn = document.getElementById("task-notes-save-btn");
  const deleteBtn = document.getElementById("task-notes-delete-btn");
  const fields = ["task-notes-text", "task-notes-planned", "task-notes-actual", "task-notes-learned", "task-notes-blockers", "task-notes-next", "task-notes-links"];
  const keys = ["text", "plannedOutcome", "actualOutcome", "learned", "blockers", "nextStep", "links"];

  modalTitle.textContent = `Notes: ${taskTitle}`;
  fields.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.value = notes[keys[i]] || "";
  });
  const updatedEl = document.getElementById("task-notes-updated");
  if (updatedEl) updatedEl.textContent = notes.lastUpdated ? "Last updated: " + new Date(notes.lastUpdated).toLocaleString() : "";

  const closeNotesModal = () => {
    modal.classList.remove("open");
    document.getElementById("overlay-backdrop").classList.remove("active");
  };

  saveBtn.onclick = () => {
    const noteObj = {};
    fields.forEach((id, i) => { const el = document.getElementById(id); noteObj[keys[i]] = el ? el.value : ""; });
    saveTaskNote(taskId, noteObj);
    closeNotesModal();
    playSynthSound("success");
    if (selectedDate) showDayDetails(selectedDate);
    renderTodaySection();
  };

  deleteBtn.onclick = () => {
    if (confirm("Delete notes for this task?")) {
      deleteTaskNote(taskId);
      closeNotesModal();
      playSynthSound("click");
    }
  };

  modal.classList.add("open");
  document.getElementById("overlay-backdrop").classList.add("active");
}

// ── Category management ──────────────────────────────────────────────────────
function openCategoryManager() {
  renderCategoryList();
  document.getElementById("category-modal").classList.add("open");
  document.getElementById("overlay-backdrop").classList.add("active");
}

function closeCategoryManager() {
  document.getElementById("category-modal").classList.remove("open");
  document.getElementById("overlay-backdrop").classList.remove("active");
}

function renderCategoryList() {
  const list = document.getElementById("category-list");
  if (!list) return;
  const cats = getAllCategories();
  const sorted = Object.values(cats).sort((a, b) => (a.order || a.priority || 99) - (b.order || b.priority || 99));
  list.innerHTML = "";

  sorted.forEach(cat => {
    const row = document.createElement("div");
    row.className = `cat-row ${cat.archived ? "cat-archived" : ""}`;
    row.dataset.id = cat.id;

    row.innerHTML = `
      <div class="cat-row-summary">
        <span class="cat-color-dot" style="background:${cat.color}"></span>
        <span class="cat-row-icon">${cat.icon}</span>
        <span class="cat-row-name">${cat.name}</span>
        <span class="cat-row-meta">${cat.weeklyTarget || 0}h/wk</span>
        ${cat.required ? '<span class="cat-required-badge">Required</span>' : ""}
        ${cat.archived ? '<span class="cat-archived-badge">Archived</span>' : ""}
        <button class="cat-edit-toggle" title="Edit">✎</button>
        ${!cat.builtIn ? `<button class="cat-delete-btn" title="Delete">✕</button>` : ""}
      </div>
      <div class="cat-edit-inline" style="display:none">
        <div class="cat-edit-row">
          <label>Color</label>
          <input type="color" class="cat-inline-color" value="${cat.color}">
        </div>
        <div class="cat-edit-row">
          <label>Icon</label>
          <input type="text" class="cat-inline-icon form-input" value="${cat.icon}" maxlength="4">
        </div>
        ${!cat.builtIn ? `
        <div class="cat-edit-row">
          <label>Name</label>
          <input type="text" class="cat-inline-name form-input" value="${cat.name}">
        </div>` : ""}
        <div class="cat-edit-row">
          <label>h/wk</label>
          <input type="number" class="cat-inline-weekly form-input" value="${cat.weeklyTarget || 0}" min="0" step="0.5">
        </div>
        <div class="cat-edit-actions">
          ${!cat.builtIn ? `<button class="cat-archive-btn">${cat.archived ? "Restore" : "Archive"}</button>` : ""}
          <button class="cat-save-btn">Save</button>
        </div>
      </div>
    `;

    // Toggle edit panel
    row.querySelector(".cat-edit-toggle").addEventListener("click", () => {
      const panel = row.querySelector(".cat-edit-inline");
      const isOpen = panel.style.display !== "none";
      // Close all others
      list.querySelectorAll(".cat-edit-inline").forEach(p => p.style.display = "none");
      panel.style.display = isOpen ? "none" : "block";
    });

    // Live color preview on the dot
    const colorInput = row.querySelector(".cat-inline-color");
    const dot = row.querySelector(".cat-color-dot");
    colorInput.addEventListener("input", () => { dot.style.background = colorInput.value; });

    // Save
    row.querySelector(".cat-save-btn").addEventListener("click", () => {
      const color = row.querySelector(".cat-inline-color").value;
      const icon = row.querySelector(".cat-inline-icon").value || cat.icon;
      const weekly = parseFloat(row.querySelector(".cat-inline-weekly").value) || 0;

      if (cat.builtIn) {
        // Persist color + icon overrides for built-ins in appState
        appState.categoryOverrides = appState.categoryOverrides || {};
        appState.categoryOverrides[cat.id] = { color, icon, weeklyTarget: weekly };
        BUILT_IN_CATEGORIES[cat.id].color = color;
        BUILT_IN_CATEGORIES[cat.id].icon = icon;
        BUILT_IN_CATEGORIES[cat.id].weeklyTarget = weekly;
      } else {
        const nameEl = row.querySelector(".cat-inline-name");
        appState.categories[cat.id] = Object.assign({}, appState.categories[cat.id], {
          color, icon, weeklyTarget: weekly,
          name: nameEl ? nameEl.value || cat.name : cat.name
        });
      }
      saveState();
      applyCategoryColors();   // update CSS vars so every view recolors
      renderCategoryList();
      renderCalendarDays();
      populateCategorySelects();
      renderTracksChecklists();
      renderTodaySection();
      playSynthSound("success");
    });

    // Archive toggle
    const archiveBtn = row.querySelector(".cat-archive-btn");
    if (archiveBtn) {
      archiveBtn.addEventListener("click", () => {
        appState.categories[cat.id].archived = !appState.categories[cat.id].archived;
        saveState();
        renderCategoryList();
      });
    }

    // Delete
    const deleteBtn = row.querySelector(".cat-delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => deleteCategory(cat.id));
    }

    list.appendChild(row);
  });
}

function addNewCategory() {
  const name = document.getElementById("cat-new-name").value.trim();
  if (!name) {
    document.getElementById("cat-new-name").focus();
    return;
  }
  const id = "custom_" + name.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 30) + "_" + Date.now();
  appState.categories[id] = {
    id, name,
    icon: document.getElementById("cat-new-icon").value || "✨",
    color: document.getElementById("cat-new-color").value || "#c5b3fa",
    weeklyTarget: parseFloat(document.getElementById("cat-new-weekly").value) || 0,
    priority: 50, order: 50,
    exportEnabled: true, active: true, archived: false
  };
  saveState();
  document.getElementById("cat-new-name").value = "";
  renderCategoryList();
  populateCategorySelects();
  playSynthSound("success");
}

function archiveCategory(catId) {
  if (!appState.categories[catId]) return;
  appState.categories[catId].archived = !appState.categories[catId].archived;
  saveState();
  renderCategoryList();
}

function deleteCategory(catId) {
  if (BUILT_IN_CATEGORIES[catId]) return alert("Built-in categories cannot be deleted.");
  if (!confirm("Delete this category? Tasks will be preserved under 'custom'.")) return;
  appState.days.forEach(day => {
    day.tasks.forEach(t => { if (t.category === catId) t.category = "custom"; });
  });
  delete appState.categories[catId];
  saveState();
  renderCategoryList();
  populateCategorySelects();
}

function populateCategorySelects() {
  const sel = document.getElementById("new-task-category");
  if (!sel) return;
  const prev = sel.value;
  sel.innerHTML = "";
  Object.values(getAllCategories()).filter(c => !c.archived).sort((a, b) => (a.order || 99) - (b.order || 99)).forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
  if (prev) sel.value = prev;
}

// ── Task action helpers ──────────────────────────────────────────────────────
function markTaskPartial(task, day, completedHours) {
  const done = Math.max(0, Math.min(task.duration, completedHours || 0));
  task.completedMinutes = Math.round(done * 60);
  task.remainingMinutes = Math.round((task.duration - done) * 60);
  task.status = done >= task.duration ? "done" : "partial";
  task.completed = done >= task.duration;
  if (task.completed) {
    task.completedOnDate = day.date;
    task.completedAt = new Date().toISOString();
  }
  saveState();
}

function moveTaskToTomorrow(task, day) {
  if (task.fixed) return alert("Fixed meetings cannot be moved automatically.");
  const idx = appState.days.findIndex(d => d.date === day.date);
  if (idx === -1 || idx + 1 >= appState.days.length) return;
  const tomorrow = appState.days[idx + 1];
  if (tomorrow.tasks.reduce((s, t) => s + t.duration, 0) + task.duration > tomorrow.maxCapacity) {
    return alert("Tomorrow is at capacity. Use Reschedule or Force Rollover.");
  }
  day.tasks = day.tasks.filter(t => t.id !== task.id);
  task.originalDate = task.originalDate || day.date;
  task.rescheduleCount = (task.rescheduleCount || 0) + 1;
  tomorrow.tasks.push(task);
  appState.rescheduleLedger = appState.rescheduleLedger || {};
  const key = task.title.replace(" (Rolled Over)", "").trim();
  const led = appState.rescheduleLedger[key] || { originalDate: task.originalDate, count: 0 };
  led.count++; led.lastMovedFrom = day.date; led.movedOn = planToday();
  appState.rescheduleLedger[key] = led;
  saveState();
  renderDashboardMetrics();
  renderCalendarDays();
  showDayDetails(tomorrow.date);
}

function skipTask(task, day) {
  task.status = "skipped";
  task.completed = false;
  saveState();
  showDayDetails(day.date);
}

function blockTask(task, day) {
  task.status = "blocked";
  saveState();
  showDayDetails(day.date);
}

// ── Today dashboard section ──────────────────────────────────────────────────
function renderTodaySection() {
  const container = document.getElementById("today-section-container");
  if (!container) return;
  const today = planToday();
  const day = appState.days.find(d => d.date === today);
  if (!day) { container.innerHTML = "<p>No tasks for today.</p>"; return; }

  const formatted = parseDate(today).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const total = day.tasks.reduce((s, t) => s + t.duration, 0);
  const done = day.tasks.filter(t => t.completed).length;
  const pending = day.tasks.filter(t => !t.completed);

  container.innerHTML = `
    <div class="today-section-header">
      <h3>📅 TODAY — ${formatted}</h3>
      <span class="today-stats">${done}/${day.tasks.length} done · ${total.toFixed(1)}h scheduled · ${day.maxCapacity}h capacity</span>
    </div>
    <div class="today-task-list">
      ${pending.length === 0 ? '<p class="today-all-done">All tasks complete for today! 🎉</p>' :
        pending.map(t => {
          const cat = getCategoryDef(t.category);
          return `<div class="today-task-row cat-${t.category}" onclick="showDayDetails('${today}')">
            <span class="today-cat-badge" style="border-color:${cat.color}">${cat.icon} ${cat.name || t.category}</span>
            <span class="today-task-title">${t.title}</span>
            <span class="today-task-dur">${t.duration}h</span>
            ${taskHasNotes(t.id) ? '<span class="notes-dot">📝</span>' : ''}
            ${t.fixed ? '<span class="fixed-badge">Fixed</span>' : ''}
          </div>`;
        }).join("")}
    </div>
  `;
}

// ⭐ NEW: Extracurricular Summary Rendering
function renderExtracurricularSummary() {
  const container = document.getElementById("extracurricular-summary-container");
  if (!container) return;
  
  if (!appState.extracurriculars || appState.extracurriculars.length === 0) {
    container.innerHTML = `
      <div class="extracurricular-card empty">
        <p>No extracurriculars added yet. Create one to get started!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = appState.extracurriculars.map((ec, idx) => {
    const categoryDef = BUILT_IN_CATEGORIES[ec.categoryId];
    const icon = categoryDef ? categoryDef.icon : "✨";
    const color = categoryDef ? categoryDef.color : "#ffffff";
    
    return `
      <div class="extracurricular-card" style="border-left: 4px solid ${color}">
        <div class="extracurricular-header">
          <span class="extracurricular-icon">${icon}</span>
          <div class="extracurricular-titles">
            <div class="extracurricular-name">${ec.name}</div>
            <div class="extracurricular-role">${ec.role}</div>
          </div>
          <span class="extracurricular-status ${ec.status}">${ec.status.replace("-", " ")}</span>
        </div>
        <div class="extracurricular-details">
          <div class="detail-row">
            <span class="detail-label">Weekly Hours:</span>
            <span class="detail-value">${ec.weeklyHours}h</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Next Event:</span>
            <span class="detail-value">${ec.nextEvent}</span>
          </div>
          ${ec.notes ? `<div class="detail-row"><span class="detail-value notes">${ec.notes}</span></div>` : ''}
        </div>
        <div class="extracurricular-actions">
          <button class="action-btn edit-btn" onclick="editExtracurricular(${idx})">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteExtracurricular(${idx})">Remove</button>
        </div>
      </div>
    `;
  }).join('');
}

function editExtracurricular(idx) {
  const ec = appState.extracurriculars[idx];
  const modal = document.getElementById("extracurricular-modal");
  const form = document.getElementById("extracurricular-form");
  
  document.getElementById("ec-name").value = ec.name;
  document.getElementById("ec-role").value = ec.role;
  document.getElementById("ec-category").value = ec.categoryId;
  document.getElementById("ec-status").value = ec.status;
  document.getElementById("ec-weeklyHours").value = ec.weeklyHours;
  document.getElementById("ec-nextEvent").value = ec.nextEvent;
  document.getElementById("ec-notes").value = ec.notes || "";
  
  document.getElementById("ec-save-btn").onclick = () => {
    appState.extracurriculars[idx] = {
      id: ec.id,
      name: document.getElementById("ec-name").value,
      role: document.getElementById("ec-role").value,
      categoryId: document.getElementById("ec-category").value,
      status: document.getElementById("ec-status").value,
      weeklyHours: parseFloat(document.getElementById("ec-weeklyHours").value) || 0,
      nextEvent: document.getElementById("ec-nextEvent").value,
      notes: document.getElementById("ec-notes").value
    };
    saveState();
    modal.classList.remove("open");
    document.getElementById("overlay-backdrop").classList.remove("active");
    renderExtracurricularSummary();
    playSynthSound("success");
  };

  modal.classList.add("open");
  document.getElementById("overlay-backdrop").classList.add("active");
}

function deleteExtracurricular(idx) {
  if (confirm("Remove this extracurricular?")) {
    appState.extracurriculars.splice(idx, 1);
    saveState();
    renderExtracurricularSummary();
    playSynthSound("click");
  }
}

function addNewExtracurricular() {
  const modal = document.getElementById("extracurricular-modal");
  document.getElementById("extracurricular-form").reset();
  document.getElementById("ec-status").value = "active";
  
  document.getElementById("ec-save-btn").onclick = () => {
    const newEc = {
      id: `ec_${Date.now()}`,
      name: document.getElementById("ec-name").value,
      role: document.getElementById("ec-role").value,
      categoryId: document.getElementById("ec-category").value,
      status: document.getElementById("ec-status").value,
      weeklyHours: parseFloat(document.getElementById("ec-weeklyHours").value) || 0,
      nextEvent: document.getElementById("ec-nextEvent").value,
      notes: document.getElementById("ec-notes").value
    };
    if (newEc.name && newEc.role) {
      appState.extracurriculars.push(newEc);
      saveState();
      modal.classList.remove("open");
      document.getElementById("overlay-backdrop").classList.remove("active");
      renderExtracurricularSummary();
      playSynthSound("success");
    } else {
      alert("Please fill in Name and Role");
    }
  };

  modal.classList.add("open");
}

let _saveTimer = null;
function saveState() {
  // Write to localStorage immediately so nothing is lost. Strip the transient
  // undo snapshot first — it's a full copy of every day and would roughly
  // double the saved size for no benefit (undo only needs to work in-session).
  const { rolloverUndoSnapshot, ...persistable } = appState;
  localStorage.setItem("cyber_study_plan_state_2026", JSON.stringify(persistable));
  // Debounce Firestore writes — collapse rapid saves into one network call
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    if (typeof saveStateToFirestore === "function" && currentUser) {
      saveStateToFirestore();
    }
  }, 800);
}

function loadState() {
  const saved = localStorage.getItem("cyber_study_plan_state_2026");
  if (saved) {
    try {
      appState = JSON.parse(saved);
      // Validate load
      if (!appState.days || appState.days.length === 0) {
        generateNewState();
      }
      // ⭐ NEW: Migrate from simulated today to real today
      migrateToRealCurrentDate();
      // Re-apply any saved color/icon overrides for built-in categories
      if (appState.categoryOverrides) {
        Object.entries(appState.categoryOverrides).forEach(([id, ov]) => {
          if (BUILT_IN_CATEGORIES[id]) Object.assign(BUILT_IN_CATEGORIES[id], ov);
        });
      }
    } catch (e) {
      console.error("Failed to parse state, generating new.", e);
      generateNewState();
    }
  } else {
    generateNewState();
  }
}

function generateNewState() {
  generateBaseSchedule();
  saveState();
}

// Migrate saved state to v3 — preserves completed tasks and notes
function migrateToRealCurrentDate() {
  if (!appState.settings) return;
  // v3: do NOT overwrite lastRolloverDay with real today — that field tracks rollover only.
  // Real today is always derived from getRealCurrentDate() / planToday().
  if (appState.settings.migratedRealDateV3) return;
  appState.settings.migratedRealDateV3 = true;
  saveState();
}

function migrateScheduleIfNeeded() {
  if (!appState || !appState.settings || !appState.days || appState.days.length === 0) return false;
  if (appState.settings.scheduleVersion === SCHEDULE_VERSION) return false;

  // Archive old generic Palana work tasks (preserve completion history)
  appState.archivedTasks = appState.archivedTasks || [];
  appState.days.forEach(day => {
    day.tasks.forEach(t => {
      if (t.category === "palana" && t.title.includes("Palana Work (Safety Engineering)")) {
        appState.archivedTasks.push(Object.assign({}, t, { archivedOn: planToday(), reason: "Replaced by Palana Preparation schedule" }));
      }
      if (t.category === "github" && t.title.includes("Git Extension Project")) {
        appState.archivedTasks.push(Object.assign({}, t, { archivedOn: planToday(), reason: "Replaced by Git Developer Productivity Tool roadmap" }));
      }
    });
    day.tasks = day.tasks.filter(t =>
      !(t.category === "palana" && t.title.includes("Palana Work (Safety Engineering)")) &&
      !(t.category === "github" && t.title.includes("Git Extension Project"))
    );
  });

  // Initialize custom categories object if missing
  if (!appState.categories) appState.categories = {};
  if (!appState.taskNotes) appState.taskNotes = {};

  appState.settings.scheduleVersion = SCHEDULE_VERSION;
  appState.settings.palanaSecurityEnabled = appState.settings.palanaSecurityEnabled || false;
  appState.settings.ahfWeeklyTarget = appState.settings.ahfWeeklyTarget || 7;
  migrateToRealCurrentDate();
  reflowRemainingCurriculum();
  return true;
}

function resetPlannerState() {
  localStorage.removeItem("cyber_study_plan_state_2026");
  appState.settings = {
    maxNormalDailyHours: 8,
    palanaEnabled: true,
    awsExamPassed: false,
    securityPlusExamPassed: false,
    selectedProjects: ["password_manager", "packet_analyzer", "vulnerability_scanner"],
    lastRolloverDay: null,
    scheduleVersion: SCHEDULE_VERSION
  };
  generateNewState();
  initUI();
  playSynthSound("reset");
}

// 10. SYNTH AUDIO FOR RETRO HACKER CHIMES
// Creates offline sound pulses using Web Audio API
let _sharedAudioCtx = null;
function playSynthSound(type) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    // Reuse ONE AudioContext for the whole session. Creating a new one per
    // click leaks contexts and crashes the tab once the browser's hard cap
    // (~6) is hit.
    if (!_sharedAudioCtx) _sharedAudioCtx = new AudioContextClass();
    const ctx = _sharedAudioCtx;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "success") {
      // Arpeggio
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "warning") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(110, now + 0.15); // A2
      osc.frequency.setValueAtTime(220, now + 0.16); 
      osc.frequency.linearRampToValueAtTime(110, now + 0.32);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "reset") {
      osc.type = "square";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.5);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (e) {
    // Ignore audio failures if blocked by browser autoplay rules
  }
}

// 10.5 SPARKLE PARTICLE EMITTER (KAWAII METRIC IMPACT)
function spawnSparkles(e) {
  const rect = e.target.getBoundingClientRect();
  const x = rect.left + rect.width / 2 + window.scrollX;
  const y = rect.top + rect.height / 2 + window.scrollY;
  
  const particles = ["✨", "💖", "⭐", "🌸", "🍬"];
  
  for (let i = 0; i < 8; i++) {
    const span = document.createElement("span");
    span.className = "sparkle-particle";
    span.innerText = particles[Math.floor(Math.random() * particles.length)];
    
    // Random angle and distance vector
    const angle = Math.random() * Math.PI * 2;
    const velocity = 30 + Math.random() * 60;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity;
    
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    span.style.setProperty("--dx", `${dx}px`);
    span.style.setProperty("--dy", `${dy}px`);
    
    document.body.appendChild(span);
    
    // Remove span after particle animation ends
    setTimeout(() => {
      span.remove();
    }, 1000);
  }
}

// 11. UI RENDERING & COMPONENT BUILDERS
// Active calendar month — defaults to current real month, updated by renderCalendarMonthControls
let activeMonth = getRealCurrentDate ? getRealCurrentDate().substring(0, 7) : "2026-07";
let selectedDate = null;     // Date open in side drawer

function initUI() {
  initializeExtracurriculars();
  populateCategorySelects();
  renderDashboardMetrics();
  renderTodaySection();
  renderCalendarMonthControls();
  renderCalendarDays();
  renderTracksChecklists();
  renderExtracurricularSummary();
  updateRiskBanner();
  cycleQuotes();
  // New multi-user modules
  if (typeof renderTrackerMetrics === 'function') renderTrackerMetrics();
  if (typeof renderSectionLegend  === 'function') renderSectionLegend();
  if (typeof renderResourcesPanel === 'function') renderResourcesPanel();
}

// ⭐ NEW: Initialize extracurriculars with seed data on first load
function initializeExtracurriculars() {
  if (!appState.extracurriculars || appState.extracurriculars.length === 0) {
    appState.extracurriculars = [...BUILT_IN_EXTRACURRICULARS];
    saveState();
  }
}

// Overall Stats calculations
function renderDashboardMetrics() {
  // Count total tasks
  let totalTasks = 0;
  let completedTasks = 0;
  let leetCodeDone = 0;
  let totalLeetCode = 75; // Blind 75
  
  let portswiggerDone = 0;
  let totalPortswigger = CORE_CURRICULUM.portswigger.length;
  
  let secPlusHours = 0;
  
  appState.days.forEach(day => {
    day.tasks.forEach(t => {
      totalTasks++;
      if (t.completed) completedTasks++;
      
      // Portswigger specific
      if (t.category === "portswigger" && t.completed) {
        portswiggerDone++;
      }
      
      // Leetcode specific
      if (t.category === "leetcode" && t.completed) {
        leetCodeDone++;
      }
      
      // Sec+ study logged hours
      if (t.category === "secplus" && t.completed) {
        secPlusHours += t.duration;
      }
    });
  });

  // Calculate Streak
  let longestStreak = 0;
  let currentStreak = 0;
  
  // Sort days chronologically
  const sortedDays = [...appState.days].sort((a, b) => a.date.localeCompare(b.date));

  // ⭐ NEW: Use real browser date (America/Los_Angeles timezone), not simulated
  let realTodayStr = getRealCurrentDate();

  // We calculate streak based on days that have tasks and ALL tasks are completed
  // (or at least 1 task was completed and nothing left unchecked)
  for (let i = 0; i < sortedDays.length; i++) {
    const day = sortedDays[i];
    // Only count days up to and including real today (NOT simulated today)
    if (day.date > realTodayStr) break;
    // Check if day has tasks
    if (day.tasks.length > 0) {
      const allDone = day.tasks.every(t => t.completed);
      const anyDone = day.tasks.some(t => t.completed);
      
      if (allDone && anyDone) {
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }
  }
  
  // Overall percentage
  const compPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  document.getElementById("metric-completion").innerText = `${compPercent}%`;
  document.getElementById("metric-completion-fill").style.width = `${compPercent}%`;
  document.getElementById("metric-completion-sub").innerText = `${completedTasks} / ${totalTasks} Tasks Completed`;
  
  // Countdown to Sept 1, 2026
  // ⭐ NEW: Use real browser date (America/Los_Angeles timezone), not simulated
  let realToday = getRealCurrentDateObj();
  const endPlanDate = parseDate(END_DATE_STR);
  const diffTime = endPlanDate - realToday;
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  document.getElementById("metric-countdown").innerText = `${daysLeft} days`;

  // Streak rendering
  document.getElementById("metric-streak").innerText = `${currentStreak} days`;
  document.getElementById("metric-longest-streak").innerText = `Longest: ${longestStreak} days`;
  
  // LeetCode progress
  document.getElementById("metric-leetcode").innerText = `${leetCodeDone} / ${totalLeetCode}`;
  const lcPercent = Math.min(100, Math.round((leetCodeDone / totalLeetCode) * 100));
  document.getElementById("metric-leetcode-fill").style.width = `${lcPercent}%`;
  
  // Certifications list update
  const awsBadge = document.getElementById("badge-aws");
  const secPlusBadge = document.getElementById("badge-secplus");

  // AWS badge
  if (appState.settings.awsExamPassed) {
    awsBadge.innerText = "PASSED ✅";
    awsBadge.className = "cert-badge status-passed";
  } else {
    // Check if exam task is checked
    const awsExamTaskCompleted = appState.days.some(d => d.tasks.some(t => t.category === "aws" && t.title.includes("Certification Exam") && t.completed));
    if (awsExamTaskCompleted) {
      awsBadge.innerText = "PASSED ✅";
      awsBadge.className = "cert-badge status-passed";
    } else {
      // In progress if some AWS tasks are completed
      const someAwsDone = appState.days.some(d => d.tasks.some(t => t.category === "aws" && t.completed));
      if (someAwsDone) {
        awsBadge.innerText = "IN PROGRESS";
        awsBadge.className = "cert-badge status-progress";
      } else {
        awsBadge.innerText = "NOT STARTED";
        awsBadge.className = "cert-badge status-todo";
      }
    }
  }

  // Sec+ badge
  if (appState.settings.securityPlusExamPassed) {
    secPlusBadge.innerText = "PASSED ✅";
    secPlusBadge.className = "cert-badge status-passed";
  } else {
    const secExamTaskCompleted = appState.days.some(d => d.tasks.some(t => t.category === "secplus" && t.title.includes("Certification Exam") && t.completed));
    if (secExamTaskCompleted) {
      secPlusBadge.innerText = "PASSED ✅";
      secPlusBadge.className = "cert-badge status-passed";
    } else {
      const someSecDone = appState.days.some(d => d.tasks.some(t => t.category === "secplus" && t.completed));
      if (someSecDone) {
        secPlusBadge.innerText = "IN PROGRESS";
        secPlusBadge.className = "cert-badge status-progress";
      } else {
        secPlusBadge.innerText = "NOT STARTED";
        secPlusBadge.className = "cert-badge status-todo";
      }
    }
  }

  // Bind settings modal checkboxes to state
  document.getElementById("settings-aws-passed").checked = appState.settings.awsExamPassed;
  document.getElementById("settings-secplus-passed").checked = appState.settings.securityPlusExamPassed;
  document.getElementById("palana-toggle").checked = appState.settings.palanaEnabled;
  document.getElementById("settings-palana-toggle").checked = appState.settings.palanaEnabled;
}

// Sidebar project checkboxes (legacy — only shown if project-options-list element exists)
function renderProjectSelector() {
  const container = document.getElementById("project-options-list");
  if (!container) return;
  container.innerHTML = "";

  TRACK_4_PROJECTS.forEach(proj => {
    const isSelected = appState.settings.selectedProjects.includes(proj.id);
    const label = document.createElement("label");
    label.className = "checkbox-container";
    label.innerHTML = `
      <input type="checkbox" value="${proj.id}" ${isSelected ? 'checked' : ''}>
      <span class="custom-checkbox"></span>
      ${proj.name}
      <span class="proj-meta">${proj.totalHours} hrs • 1-2 weeks</span>
    `;
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', (e) => {
      playSynthSound("click");
      if (e.target.checked) {
        appState.settings.selectedProjects.push(proj.id);
      } else {
        appState.settings.selectedProjects = appState.settings.selectedProjects.filter(id => id !== proj.id);
      }
      reflowRemainingCurriculum();
    });
    container.appendChild(label);
  });
}

// Monthly Navigation tabs for Calendar
function renderCalendarMonthControls() {
  const container = document.getElementById("month-tabs");
  container.innerHTML = "";

  // Build month list from the user's calendar settings OR legacy appState range
  const startStr = (window.userCalendarSettings?.startDate) || START_DATE_STR;
  const endStr   = (window.userCalendarSettings?.endDate)   || END_DATE_STR;

  const start = parseDate(startStr);
  const end   = parseDate(endStr);
  const seen  = new Set();

  let cur = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cur <= end) {
    const code  = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}`;
    const label = cur.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
    if (!seen.has(code)) {
      seen.add(code);
      const btn = document.createElement("button");
      btn.className  = `month-tab-btn ${activeMonth === code ? 'active' : ''}`;
      btn.innerText  = label;
      btn.dataset.month = code;
      btn.addEventListener('click', () => {
        playSynthSound("click");
        activeMonth = code;
        renderCalendarMonthControls();
        renderCalendarDays();
      });
      container.appendChild(btn);
    }
    cur.setMonth(cur.getMonth() + 1);
  }

  // Default active month to first available if not set
  if (!activeMonth || !seen.has(activeMonth)) {
    activeMonth = [...seen][0] || '';
  }
}

// Re-render calendar after settings change
function rerenderCalendarForSettings() {
  renderCalendarMonthControls();
  renderCalendarDays();
  if (typeof renderTrackerMetrics === 'function') renderTrackerMetrics();
}

// Render Days inside Calendar View
function renderCalendarDays() {
  const container = document.getElementById("calendar-days-grid");
  container.innerHTML = "";

  const startStr = (window.userCalendarSettings?.startDate) || START_DATE_STR;
  const endStr   = (window.userCalendarSettings?.endDate)   || END_DATE_STR;
  const dailyMax = (window.userCalendarSettings?.dailyMaxHours) || appState.settings?.maxNormalDailyHours || 8;

  // Build the set of dates in this month from user settings range
  const allDatesInRange = [];
  let cur = parseDate(startStr);
  const endDate = parseDate(endStr);
  while (cur <= endDate) {
    allDatesInRange.push(formatDate(cur));
    const next = new Date(cur);
    next.setDate(next.getDate() + 1);
    cur = next;
  }

  const monthDates = allDatesInRange.filter(d => d.startsWith(activeMonth));

  // Fallback: use appState.days if user settings dates are not available
  const legacyMonthDays = appState.days.filter(d => d.date.startsWith(activeMonth));

  if (monthDates.length === 0 && legacyMonthDays.length === 0) return;

  const datesToRender = monthDates.length > 0 ? monthDates : legacyMonthDays.map(d => d.date);
  if (datesToRender.length === 0) return;

  const startDayPadding = getDayOfWeek(datesToRender[0]);
  for (let i = 0; i < startDayPadding; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day-cell empty-day";
    container.appendChild(emptyCell);
  }

  datesToRender.forEach(dateStr => {
    const day           = appState.days.find(d => d.date === dateStr);
    const maxCap        = day ? day.maxCapacity : dailyMax;
    const totalScheduled= day ? day.tasks.reduce((s, t) => s + t.duration, 0) : 0;
    const capacityRatio = maxCap > 0 ? (totalScheduled / maxCap) : 0;

    const dayCell = document.createElement("div");
    dayCell.className       = "day-cell";
    dayCell.dataset.date    = dateStr;

    const realTodayDate = getRealCurrentDate();
    const isToday       = realTodayDate === dateStr;
    if (isToday)               dayCell.classList.add("today-cell");
    if (isPlanPast(dateStr))   dayCell.classList.add("past-day");
    if (isPlanFuture(dateStr)) dayCell.classList.add("future-day");
    if (day?.isIndia)          dayCell.classList.add("travel-day");

    let loadClass = "load-optimal";
    if (capacityRatio > 1.0) {
      loadClass = "load-overloaded";
    } else if (capacityRatio >= 0.8) {
      loadClass = "load-warning";
    }

    const isPast = isPlanPast(dateStr);
    const hasUnfinishedPast = isPast && day && day.tasks.some(t => !t.completed && !t.fixed);
    const warningIconHtml = hasUnfinishedPast
      ? `<span class="cell-warning-icon" title="Uncompleted tasks! Click rollover.">⚠️</span>`
      : '';

    const dayNum     = parseInt(dateStr.split('-')[2]);
    const displayCap = parseFloat(maxCap).toFixed(0);

    dayCell.innerHTML = `
      <div class="day-header-info">
        <span class="day-number">${dayNum}${isToday ? '<span class="today-badge">Today</span>' : ''}</span>
        <span class="day-capacity-badge">${displayCap}h Max</span>
      </div>
      <div class="day-load-meter">
        <div class="day-load-fill ${loadClass}" style="width: ${Math.min(100, Math.round(capacityRatio * 100))}%"></div>
      </div>
      <div class="day-tasks-dots">
        <!-- Dynamically filled with task tokens -->
      </div>
      ${warningIconHtml}
    `;
    
    // Add colored task blocks (legacy appState tasks)
    const dotsContainer = dayCell.querySelector(".day-tasks-dots");
    const legacyTasks = day ? [...day.tasks].sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0)) : [];

    legacyTasks.forEach(task => {
      const block = document.createElement("div");
      block.className = `day-task-block cat-${task.category} ${task.completed ? 'task-completed' : ''}`;
      block.innerText = task.title;
      dotsContainer.appendChild(block);
    });

    // Drop target: accept tasks dragged from the drawer
    dayCell.addEventListener('dragover', (e) => {
      if (window._dragTask) {
        e.preventDefault();
        dayCell.classList.add("drag-over");
      }
    });
    dayCell.addEventListener('dragleave', () => dayCell.classList.remove("drag-over"));
    dayCell.addEventListener('drop', (e) => {
      e.preventDefault();
      dayCell.classList.remove("drag-over");
      const { task, fromDate } = window._dragTask || {};
      if (!task || !day || fromDate === dateStr) return;
      const fromDay = appState.days.find(d => d.date === fromDate);
      if (!fromDay) return;
      fromDay.tasks = fromDay.tasks.filter(t => t.id !== task.id);
      task.originalDate = task.originalDate || fromDate;
      task.rescheduleCount = (task.rescheduleCount || 0) + 1;
      task.id = `${dateStr}_moved_${Date.now()}_${task.category}`;
      day.tasks.push(task);
      saveState();
      renderDashboardMetrics();
      renderCalendarDays();
      showDayDetails(dateStr);
      playSynthSound("success");
      window._dragTask = null;
    });

    // Click action opens drawer
    dayCell.addEventListener('click', () => {
      playSynthSound("click");
      showDayDetails(dateStr);
    });

    container.appendChild(dayCell);
  });

  // After rendering day cells, overlay user task dots
  if (typeof renderCalendarUserTaskDots === 'function') renderCalendarUserTaskDots();
}

// Side Drawer Detail Drawer Renderer
function showDayDetails(dateStr) {
  selectedDate = dateStr;
  const day = appState.days.find(d => d.date === dateStr);

  const drawer   = document.getElementById("day-detail-drawer");
  const backdrop = document.getElementById("overlay-backdrop");

  // Date titles
  const formattedTitle = parseDate(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById("drawer-date-title").innerText = formattedTitle;
  document.getElementById("drawer-date-code").innerText  = `SYS_DAY_${dateStr.replace(/-/g, '')}`;

  // Capacity and schedule hours (use day if found, else fall back to user settings)
  const maxCap = day ? day.maxCapacity : (window.userCalendarSettings?.dailyMaxHours || 8);
  const totalScheduled = day ? day.tasks.reduce((sum, t) => sum + t.duration, 0) : 0;
  document.getElementById("drawer-max-hours").innerText      = `${parseFloat(maxCap).toFixed(1)} hrs`;
  document.getElementById("drawer-scheduled-hours").innerText= `${totalScheduled.toFixed(1)} hrs`;

  // Load status
  const statusEl = document.getElementById("drawer-status");
  if (totalScheduled > maxCap) {
    statusEl.innerText = "OVERLOADED";
    statusEl.className = "cap-val status-indicator status-heavy";
  } else if (totalScheduled >= maxCap * 0.8) {
    statusEl.innerText = "HEAVY LOAD";
    statusEl.className = "cap-val status-indicator status-warning";
  } else {
    statusEl.innerText = "OPTIMAL";
    statusEl.className = "cap-val status-indicator status-optimal";
  }

  // Trip / day note
  const noteEl = document.getElementById("drawer-day-note");
  if (day?.isIndia) {
    noteEl.innerText = "TRAVEL DAY: Workload capped. Light tasks only.";
    noteEl.className = "drawer-day-note";
    noteEl.classList.remove("hidden");
  } else {
    noteEl.classList.add("hidden");
  }

  // Legacy task checklist listing (appState tasks)
  const listContainer = document.getElementById("drawer-tasks-list");
  listContainer.innerHTML = "";

  if (!day || day.tasks.length === 0) {
    listContainer.innerHTML = `<div class="empty-state-text" style="font-size:0.75rem; color:var(--text-muted); text-align:center; padding:1rem;">No tasks scheduled. Relax! 🛰️</div>`;
  } else if (day) {
    day.tasks.forEach(task => {
      const itemRow = document.createElement("div");
      itemRow.className = `drawer-task-item ${task.completed ? 'task-checked' : ''}`;
      itemRow.draggable = true;
      itemRow.title = "Drag to a calendar day to move this task";
      itemRow.addEventListener('dragstart', (e) => {
        window._dragTask = { task, fromDate: dateStr };
        itemRow.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
      });
      itemRow.addEventListener('dragend', () => {
        itemRow.classList.remove("dragging");
        document.querySelectorAll(".drag-over").forEach(el => el.classList.remove("drag-over"));
      });
      
      const linkHtml = task.link ? 
        `<a href="${task.link}" target="_blank" class="task-link-arrow" title="View Reference Link">&rarr;</a>` : '';

      const isCustom = task.category === "custom";
      const deleteHtml = isCustom
        ? `<button class="task-delete-btn" title="Delete task">✕</button>`
        : '';
      
      const taskNotes = getTaskNotes(task.id);
      const hasNotes = taskHasNotes(task.id);
      const notesIndicator = hasNotes ? `<span class="task-notes-indicator" title="Has notes">📝</span>` : '';
      const notesBtn = `<button class="task-notes-btn" title="Edit notes">📝</button>`;
      const statusBadge = task.status && task.status !== "done" ? `<span class="task-status-badge status-${task.status}">${task.status}</span>` : '';
      const ownerBadge = task.owner ? `<span class="owner-badge owner-${task.owner}">${task.owner === "shared" ? "Shared" : task.owner === "tejaswi" ? "Tejaswi" : "Thanishka"}</span>` : '';
      const actionsHtml = task.completed ? '' : `
        <div class="task-actions-row">
          <button class="task-action-btn" data-action="partial" title="Partial completion">Partial</button>
          <button class="task-action-btn" data-action="tomorrow" title="Move to tomorrow">Tomorrow</button>
          <button class="task-action-btn" data-action="skip" title="Skip">Skip</button>
          <button class="task-action-btn" data-action="blocked" title="Blocked">Blocked</button>
        </div>`;
      
      itemRow.innerHTML = `
        <label class="checkbox-container">
          <input type="checkbox" ${task.completed ? 'checked' : ''}>
          <span class="custom-checkbox"></span>
        </label>
        <div class="task-details">
          <span class="task-label">${task.title}${notesIndicator}${statusBadge}${ownerBadge}</span>
          <div class="task-sub-meta">
            <span class="task-cat-badge badge-${task.category}">${getCategoryLabel(task.category)}</span>
            <span>Est: ${task.duration} hr${task.duration > 1 ? 's' : ''}${task.completedMinutes ? ` · ${(task.completedMinutes/60).toFixed(1)}h done` : ''}</span>
          </div>
          ${actionsHtml}
        </div>
        ${linkHtml}
        ${notesBtn}
        ${deleteHtml}
      `;

      // Notes button listener
      itemRow.querySelector('.task-notes-btn').addEventListener('click', () => {
        playSynthSound("click");
        showTaskNotesModal(task.id, task.title);
      });

      // Task action buttons (browser only)
      if (typeof itemRow.querySelectorAll === "function") {
        itemRow.querySelectorAll(".task-action-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const action = btn.getAttribute("data-action");
            if (action === "partial") {
              const hrs = prompt(`How many hours completed? (of ${task.duration}h)`, String((task.completedMinutes || 0) / 60 || task.duration / 2));
              if (hrs != null) markTaskPartial(task, day, parseFloat(hrs));
            } else if (action === "tomorrow") moveTaskToTomorrow(task, day);
            else if (action === "skip") skipTask(task, day);
            else if (action === "blocked") blockTask(task, day);
            showDayDetails(dateStr);
            renderTodaySection();
            renderDashboardMetrics();
            renderCalendarDays();
          });
        });
      }

      // Delete button for custom tasks
      if (isCustom) {
        itemRow.querySelector('.task-delete-btn').addEventListener('click', () => {
          playSynthSound("click");
          day.tasks = day.tasks.filter(t => t.id !== task.id);
          saveState();
          renderDashboardMetrics();
          renderCalendarDays();
          showDayDetails(dateStr); // re-render drawer
        });
      }
      
      // Checkbox listener
      const cb = itemRow.querySelector('input');
      cb.addEventListener('change', (e) => {
        task.completed = e.target.checked;
        if (task.completed) {
          // Record completion metadata for accurate exports / reporting
          task.completedAt = new Date().toISOString();
          task.completedOnDate = dateStr;
          playSynthSound("success");
          spawnSparkles(e);
        } else {
          delete task.completedAt;
          delete task.completedOnDate;
          playSynthSound("click");
        }
        saveState();
        
        // Re-draw metrics, calendar dots
        renderDashboardMetrics();
        renderCalendarDays();
        renderTracksChecklists();
        
        // Refresh drawer metrics
        const newTotal = day.tasks.reduce((sum, t) => sum + t.duration, 0);
        document.getElementById("drawer-scheduled-hours").innerText = `${newTotal.toFixed(1)} hrs`;
        
        if (task.completed) {
          itemRow.classList.add('task-checked');
        } else {
          itemRow.classList.remove('task-checked');
        }
      });
      
      listContainer.appendChild(itemRow);
    });
  }
  
  // Wire up "Add Task" button (new Firestore-backed task modal)
  const addTaskFullBtn = document.getElementById("drawer-add-task-btn");
  if (addTaskFullBtn) {
    const newBtn = addTaskFullBtn.cloneNode(true);
    addTaskFullBtn.parentNode.replaceChild(newBtn, addTaskFullBtn);
    newBtn.addEventListener('click', () => {
      if (typeof openAddTaskModal === 'function') openAddTaskModal(dateStr);
    });
  }

  // Wire up daily checklist add button
  const addChecklistBtn = document.getElementById("add-day-checklist-btn");
  if (addChecklistBtn) {
    const newCLBtn = addChecklistBtn.cloneNode(true);
    addChecklistBtn.parentNode.replaceChild(newCLBtn, addChecklistBtn);
    newCLBtn.addEventListener('click', () => {
      if (typeof addDayChecklistItem === 'function') addDayChecklistItem(dateStr);
    });
  }

  // Wire up day notes save button
  const dayNotesSaveBtn = document.getElementById("day-notes-save-btn");
  if (dayNotesSaveBtn) {
    const newNoteBtn = dayNotesSaveBtn.cloneNode(true);
    dayNotesSaveBtn.parentNode.replaceChild(newNoteBtn, dayNotesSaveBtn);
    newNoteBtn.addEventListener('click', () => {
      if (typeof saveDayNoteText === 'function') saveDayNoteText(dateStr);
    });
  }

  // Render new Firestore user tasks for this day
  if (typeof renderUserTasksForDay === 'function') renderUserTasksForDay(dateStr);
  if (typeof renderDayChecklist     === 'function') renderDayChecklist(dateStr);

  // Show undo button if a rollover snapshot exists for this day
  const undoBtn = document.getElementById("undo-rollover-btn");
  if (undoBtn) undoBtn.style.display = appState.rolloverUndoSnapshot ? "block" : "none";

  // Open the drawer UI
  drawer.classList.add("open");
  backdrop.classList.add("active");
}

function closeDrawer() {
  document.getElementById("day-detail-drawer").classList.remove("open");
  document.getElementById("overlay-backdrop").classList.remove("active");
  selectedDate = null;
}

// Tab 2: Render Syllabus Progression Lists
function renderTracksChecklists() {
  const tracks = ["portswigger", "aws", "secplus", "projects"];
  
  tracks.forEach(track => {
    const listContainer = document.getElementById(`list-${track}-tasks`);
    listContainer.innerHTML = "";
    
    // Extract all unique tasks of this category across the entire plan
    const uniqueTasks = [];
    const seenTitles = new Set();
    let completedCount = 0;
    
    appState.days.forEach(day => {
      day.tasks.forEach(task => {
        if (task.category === track) {
          // Clean name for grouping
          const cleanTitle = task.title.replace(" (Part A)", "").replace(" (Part B)", "");
          
          if (!seenTitles.has(cleanTitle)) {
            seenTitles.add(cleanTitle);
            uniqueTasks.push({
              title: cleanTitle,
              link: task.link,
              completed: task.completed,
              originalDay: day.date
            });
          } else {
            // If already seen, we aggregate completion status (completed if all parts are completed)
            const idx = uniqueTasks.findIndex(ut => ut.title === cleanTitle);
            if (idx !== -1 && !task.completed) {
              uniqueTasks[idx].completed = false; // if any part is unfinished, set group to unfinished
            }
          }
        }
      });
    });

    // Recalculate complete count
    uniqueTasks.forEach(ut => {
      if (ut.completed) completedCount++;
    });

    document.getElementById(`substats-${track}`).innerText = `${completedCount} / ${uniqueTasks.length} Modules Finished`;

    if (uniqueTasks.length === 0) {
      listContainer.innerHTML = `<div class="empty-state-text" style="font-size:0.75rem; color:var(--text-muted); text-align:center; width:100%; padding:1rem;">No modules scheduled for this track.</div>`;
    } else {
      uniqueTasks.forEach(ut => {
        const row = document.createElement("div");
        row.className = `track-item-row comp-${track} ${ut.completed ? 'task-checked' : ''}`;
        
        const linkHtml = ut.link ? ` (<a href="${ut.link}" target="_blank">Link</a>)` : '';
        const dateParts = ut.originalDay.split('-');
        const displayDate = `${dateParts[1]}/${dateParts[2]}`;
        
        row.innerHTML = `
          <span style="color:${ut.completed ? 'var(--neon-green)' : 'var(--text-muted)'}">${ut.completed ? '✅' : '⚙️'}</span>
          <span style="flex-grow:1">${ut.title}${linkHtml}</span>
          <span style="font-size:0.65rem; color:var(--text-muted); font-family:var(--font-mono)">Sched: ${displayDate}</span>
        `;
        listContainer.appendChild(row);
      });
    }
  });
}

// Flashes UI alert warning if we scheduled past September 1st
function updateRiskBanner() {
  const atRisk = appState.days.some(d => d.isOverflow);
  const warningBanner = document.getElementById("at-risk-warning");
  if (atRisk) {
    warningBanner.classList.remove("hidden");
  } else {
    warningBanner.classList.add("hidden");
  }
}

// Cycles through motivational hacker quotes
let quoteInterval = null;
function cycleQuotes() {
  const quoteEl = document.getElementById("motivational-quote");
  
  // Set initial quote
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  quoteEl.innerText = MOTIVATIONAL_QUOTES[index];
  
  if (quoteInterval) clearInterval(quoteInterval);
  quoteInterval = setInterval(() => {
    // Typewriter emulation
    quoteEl.style.opacity = 0;
    setTimeout(() => {
      const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      quoteEl.innerText = MOTIVATIONAL_QUOTES[idx];
      quoteEl.style.opacity = 1;
    }, 400);
  }, 12000);
}

// ⭐ NEW: Go to Today - Jump calendar to today's date and open the day details
function goToToday() {
  const realToday = getRealCurrentDate();
  const todayMonth = realToday.substring(0, 7); // "2026-06" format
  
  // Switch active month to today's month
  activeMonth = todayMonth;
  
  playSynthSound("click");
  
  // Re-render calendar and month controls
  renderCalendarMonthControls();
  renderCalendarDays();
  
  // Open today's day details
  setTimeout(() => {
    showDayDetails(realToday);
    
    // Scroll today's cell into view
    const todayCell = document.querySelector(".day-cell.today-cell");
    if (todayCell) {
      todayCell.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
}

// Expose for export.js
window.planToday = planToday;
window.getRealCurrentDate = getRealCurrentDate;
window.getAllCategories = getAllCategories;
window.getCategoryLabel = getCategoryLabel;
window.openCategoryManager = openCategoryManager;
window.addNewCategory = addNewCategory;
window.archiveCategory = archiveCategory;
window.deleteCategory = deleteCategory;
window.showDayDetails = showDayDetails;
window.addNewExtracurricular = addNewExtracurricular;

// 12. EVENT LISTENERS & SETUP
function bootApp() {
  // Load local storage state
  loadState();
  migrateScheduleIfNeeded(); // upgrade older saved schedules (adds Palana onboarding prep)
  maybeAutoRepairRollover(); // one-time fix for old multi-day rollover damage
  applyCategoryColors();     // sync edited category colors into CSS variables
  initUI();
  
  // 1. Overlay click handler
  document.getElementById("overlay-backdrop").addEventListener("click", () => {
    closeDrawer();
    closeSettings();
    closeCategoryManager();
    document.getElementById("task-notes-modal").classList.remove("open");
    document.getElementById("extracurricular-modal").classList.remove("open");
    document.getElementById("overlay-backdrop").classList.remove("active");
  });
  
  // 2. Drawer actions
  document.getElementById("close-drawer-btn").addEventListener("click", closeDrawer);
  document.getElementById("rollover-btn").addEventListener("click", () => {
    if (selectedDate) {
      forceRollover(selectedDate);
      document.getElementById("undo-rollover-btn").style.display = "block";
    }
  });
  document.getElementById("undo-rollover-btn").addEventListener("click", () => {
    undoRollover();
    document.getElementById("undo-rollover-btn").style.display = appState.rolloverUndoSnapshot ? "block" : "none";
  });

  // 3. Tab navigation switcher
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      playSynthSound("click");
      tabButtons.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      
      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // 4. Header quick toggle
  document.getElementById("palana-toggle").addEventListener("change", (e) => {
    playSynthSound("click");
    appState.settings.palanaEnabled = e.target.checked;
    reflowRemainingCurriculum();
  });

  // 5. Settings modal handlers
  const settingsModal = document.getElementById("settings-modal");
  const openSettingsBtn = document.getElementById("open-settings-btn");
  const closeSettingsBtn = document.getElementById("close-settings-btn");
  const saveSettingsBtn = document.getElementById("save-settings-btn");
  const maxHoursInput = document.getElementById("input-max-hours");
  const maxHoursVal = document.getElementById("val-max-hours");

  function openSettings() {
    playSynthSound("click");
    // Sync UI values from state
    maxHoursInput.value = appState.settings.maxNormalDailyHours;
    maxHoursVal.innerText = appState.settings.maxNormalDailyHours;
    document.getElementById("settings-palana-toggle").checked = appState.settings.palanaEnabled;
    const palSec = document.getElementById("settings-palana-security-toggle");
    if (palSec) palSec.checked = appState.settings.palanaSecurityEnabled;
    const ahfTarget = document.getElementById("settings-ahf-weekly");
    if (ahfTarget) ahfTarget.value = appState.settings.ahfWeeklyTarget || 7;
    document.getElementById("settings-aws-passed").checked = appState.settings.awsExamPassed;
    document.getElementById("settings-secplus-passed").checked = appState.settings.securityPlusExamPassed;
    
    settingsModal.classList.add("open");
    document.getElementById("overlay-backdrop").classList.add("active");
  }

  function closeSettings() {
    settingsModal.classList.remove("open");
    document.getElementById("overlay-backdrop").classList.remove("active");
  }

  openSettingsBtn.addEventListener("click", openSettings);
  closeSettingsBtn.addEventListener("click", () => {
    playSynthSound("click");
    closeSettings();
  });
  
  maxHoursInput.addEventListener("input", (e) => {
    maxHoursVal.innerText = e.target.value;
  });

  saveSettingsBtn.addEventListener("click", () => {
    playSynthSound("success");
    // Apply options to state
    appState.settings.maxNormalDailyHours = parseFloat(maxHoursInput.value);
    appState.settings.palanaEnabled = document.getElementById("settings-palana-toggle").checked;
    const palSec = document.getElementById("settings-palana-security-toggle");
    if (palSec) appState.settings.palanaSecurityEnabled = palSec.checked;
    const ahfTarget = document.getElementById("settings-ahf-weekly");
    if (ahfTarget) appState.settings.ahfWeeklyTarget = parseFloat(ahfTarget.value) || 7;
    appState.settings.awsExamPassed = document.getElementById("settings-aws-passed").checked;
    appState.settings.securityPlusExamPassed = document.getElementById("settings-secplus-passed").checked;
    
    closeSettings();
    reflowRemainingCurriculum();
  });

  // 6. Reset planner
  document.getElementById("reset-system-btn").addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("WARNING: Are you sure you want to hard reset your system state? All checked tasks will be wiped.")) {
      resetPlannerState();
      closeSettings();
    }
  });

  // 7. Firebase auth buttons
  document.getElementById("auth-signin-btn").addEventListener("click", () => {
    if (typeof signInWithGoogle === "function") signInWithGoogle();
  });
  document.getElementById("auth-signout-btn").addEventListener("click", () => {
    if (typeof signOutFirebase === "function") signOutFirebase();
  });
  
  // ⭐ NEW: Go to Today button
  const goToTodayBtn = document.getElementById("go-to-today-btn");
  if (goToTodayBtn) {
    goToTodayBtn.addEventListener("click", goToToday);
  }
  
  // ⭐ Auto-open the month containing today on page load
  const realTodayDate = getRealCurrentDate();
  activeMonth = realTodayDate.substring(0, 7);
  renderCalendarMonthControls();
  renderCalendarDays();

  // Refresh today highlight after midnight (LA timezone)
  setInterval(() => {
    const nowToday = getRealCurrentDate();
    if (nowToday !== realTodayDate) {
      activeMonth = nowToday.substring(0, 7);
      initUI();
    }
  }, 60000);

  // Category manager button
  const catMgrBtn = document.getElementById("open-category-manager-btn");
  if (catMgrBtn) catMgrBtn.addEventListener("click", openCategoryManager);

  const palanaSecToggle = document.getElementById("settings-palana-security-toggle");
  if (palanaSecToggle) {
    palanaSecToggle.addEventListener("change", (e) => {
      appState.settings.palanaSecurityEnabled = e.target.checked;
      reflowRemainingCurriculum();
    });
  }
}

// Run boot immediately if the DOM is already parsed (scripts at end of body
// can execute after DOMContentLoaded has already fired, in which case a
// DOMContentLoaded listener would never run — leaving every button dead).
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootApp);
} else {
  bootApp();
}
