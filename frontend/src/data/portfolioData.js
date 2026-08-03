/**
 * Portfolio data — Mohammad Mulla
 * Windows 12 desktop portfolio
 */

export const profile = {
  name: 'Mohammad Mulla',
  title: 'Software Engineer · Full-Stack & AI',
  phone: '+91-8983228237',
  email: 'mullamohammad123@gmail.com',
  location: 'Bhiwandi, Mumbai, India',
  linkedin: 'linkedin.com/in/mohammadm01',
  linkedinUrl: 'https://linkedin.com/in/mohammadm01',
  github: 'github.com/MohammadM01',
  githubUrl: 'https://github.com/MohammadM01',
  githubUser: 'MohammadM01',
  resumeUrl: '/Resume.pdf',
  photoUrl: '/profile.png',
  availability: 'Open to roles · Mumbai or Remote',
  monogram: 'MM',
  tagline: 'I build things people can ship — and trust.',
  summaryShort:
    'I love turning messy ideas into clean products. Hackathon wins, AI systems, and full-stack apps are my happy place — Java, React, Node, and modern LLM stacks.',
  summary:
    'I’m a software engineer who enjoys building products end to end — from the first sketch to something real users can click. I’ve placed at national hackathons and earned a global Honorable Mention at the BNB Hackathon. Day to day I work with Java, React, Node.js, SQL, and AI tooling, with a soft spot for systems that feel fast, clear, and thoughtfully designed.',
}

export const badges = [
  { id: 'sih', short: 'SIH 1st', label: '1st · Smart India Hackathon Internal' },
  { id: 'national', short: 'National Runner-up', label: '1st Runner-Up · National Hackathon' },
  { id: 'bnb', short: 'BNB Mention', label: 'Honorable Mention · BNB Hackathon (Global)' },
]

export const experience = [
  {
    id: 'datamatex',
    role: 'Software Developer Intern',
    company: 'DataMatex Technologies',
    location: 'Bhiwandi',
    period: 'Dec 2025 – Mar 2026',
    bullets: [
      'Built fresh, mobile-friendly websites for 3+ local businesses — clearer stories online, and about 18% more people sticking around to engage.',
      'Tuned performance and SEO so pages loaded ~25% faster, and inquiry forms started getting about 12% more submissions.',
    ],
  },
]

export const skills = {
  Languages: ['Java', 'Python', 'C++', 'JavaScript', 'SQL'],
  'Frameworks & Libraries': [
    'React.js',
    'Next.js',
    'Node.js',
    'Express.js',
    'FastAPI',
    'Tailwind CSS',
  ],
  'AI / LLM': ['RAG', 'RAG Pipelines', 'LangChain', 'LangGraph'],
  'Databases & Tools': [
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Git',
    'GitHub',
    'Docker',
    'Postman',
    'Linux',
  ],
}

export const education = {
  degree: 'B.Tech in Computer Engineering',
  school: 'Shivajirao S. Jondhale College of Engineering',
  location: 'Dombivli, India',
  period: 'Nov 2022 – May 2026',
  cgpa: '7.5/10',
}

export const projects = [
  {
    id: 'cryptguard',
    name: 'CryptGuard',
    subtitle: 'Catch threats in encrypted traffic — without breaking privacy',
    period: 'Feb 2026 – Mar 2026',
    github: 'https://github.com/ShifaKhan21/CryptGuard',
    demo: null,
    image: '/projects/cryptguard.svg',
    description:
      'A fast DPI engine that studies encrypted traffic without decrypting it. It keeps pace at 22K+ flows/sec with tiny latency, and spots dangerous patterns — like C2 beaconing — with ~99% accuracy using rules, threat intel, and machine learning.',
    tech: ['C++', 'Python', 'DPI', 'ML', 'TLS/JA3'],
    metrics: [
      { label: 'flows/sec', value: '22K+' },
      { label: 'latency', value: '0.044ms' },
      { label: 'accuracy', value: '99%' },
    ],
  },
  {
    id: 'chaincred',
    name: 'ChainCred',
    subtitle: 'Credentials you can prove in minutes, not days',
    period: 'Oct 2025 – Jan 2026',
    github: 'https://github.com/MohammadM01/Chain-Cred-final',
    demo: null,
    image: '/projects/chaincred.svg',
    description:
      'A decentralized credential app with wallet login. Instead of waiting days to verify someone’s background, checks finish in under two minutes — plus a dashboard, resume tools, OCR, and smarter networking built in.',
    tech: ['React', 'Node.js', 'MongoDB', 'Solidity', 'opBNB', 'BNB Greenfield'],
    metrics: [
      { label: 'verify time', value: '<2 min' },
      { label: 'stack', value: 'opBNB' },
      { label: 'award', value: 'BNB HM' },
    ],
  },
  {
    id: 'civic-eye',
    name: 'Civic Eye',
    subtitle: 'Report a city issue. Watch it get routed and resolved.',
    period: 'Jul 2025 – Aug 2025',
    github: 'https://github.com/MohammadM01/civic',
    demo: 'https://civic-eye.onrender.com',
    image: '/projects/civic-eye.svg',
    description:
      'Built for SIH 2025: snap a civic problem, tag the location, and AI (YOLOv8) helps sort it. Transparent trails, contractor bidding, and a bit of gamification keep the loop honest — live demo on Render.',
    tech: [
      'React',
      'Node.js',
      'Express',
      'YOLOv8',
      'Blockchain',
      'Google Translate API',
      'REST APIs',
    ],
    metrics: [
      { label: 'vision acc.', value: '92%' },
      { label: 'event', value: 'SIH 2025' },
      { label: 'deploy', value: 'Render' },
    ],
  },
]

export const achievements = [
  {
    id: 'sih',
    title: '1st · Smart India Hackathon (Internal)',
    detail:
      'Shipped Civic Eye with computer vision hitting 92% accuracy — and finished ahead of 30+ teams.',
  },
  {
    id: 'national',
    title: '1st Runner-Up · National Hackathon',
    detail:
      'Brought CryptGuard to the floor: 22K+ flows/sec and ~99% detection accuracy under pressure.',
  },
  {
    id: 'bnb',
    title: 'Honorable Mention · BNB Hackathon (Global)',
    detail:
      'ChainCred caught global attention for making verifiable credentials feel practical, not theoretical.',
  },
]

/** Window accent colours (Fluent / Win12) */
export const WINDOW_ACCENTS = {
  welcome: '#0078D4',
  about: '#0078D4',
  experience: '#107C10',
  skills: '#5C2D91',
  projects: '#008080',
  education: '#8764B8',
  achievements: '#FF8C00',
  github: '#24292F',
  contact: '#E3008C',
  terminal: '#1A1A1A',
  personalize: '#0078D4',
  'about-win12': '#3b91d8',
  'this-pc': '#0078D4',
  settings: '#6B6B6B',
  edge: '#0078D4',
  feedback: '#8764B8',
}

/** Taskbar / Start pinned apps */
export const APPS = [
  { id: 'about', label: 'About Me', accent: WINDOW_ACCENTS.about, shortcut: '1' },
  { id: 'experience', label: 'Experience', accent: WINDOW_ACCENTS.experience, shortcut: '2' },
  { id: 'skills', label: 'Skills', accent: WINDOW_ACCENTS.skills, shortcut: '3' },
  { id: 'projects', label: 'Projects', accent: WINDOW_ACCENTS.projects, shortcut: '4' },
  { id: 'achievements', label: 'Achievements', accent: WINDOW_ACCENTS.achievements, shortcut: '5' },
  { id: 'education', label: 'Education', accent: WINDOW_ACCENTS.education, shortcut: '6' },
  { id: 'github', label: 'GitHub', accent: WINDOW_ACCENTS.github, shortcut: '7' },
  { id: 'contact', label: 'Contact', accent: WINDOW_ACCENTS.contact, shortcut: '8' },
  { id: 'terminal', label: 'Terminal', accent: WINDOW_ACCENTS.terminal, shortcut: '9', kind: 'terminal' },
]
