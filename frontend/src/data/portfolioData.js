/**
 * Portfolio data - Mohammad Mulla
 * Positioning: Software Development Engineer (SDE)
 */

export const profile = {
  name: 'Mohammad Mulla',
  title: 'Software Development Engineer',
  phone: '+91-8983228237',
  email: 'mullamohammad123@gmail.com',
  location: 'Bhiwandi, Mumbai, India',
  linkedin: 'linkedin.com/in/mohammadm01',
  linkedinUrl: 'https://linkedin.com/in/mohammadm01',
  github: 'github.com/MohammadM01',
  githubUrl: 'https://github.com/MohammadM01',
  githubUser: 'MohammadM01',
  resumeUrl: '/Resume.pdf',
  photoUrl: '/about_pic/img.png',
  availability: 'Actively looking for SDE roles. Mumbai or Remote.',
  monogram: 'MM',
  tagline: 'Welcome to my Portfolio. Clean code. Sharp systems. Ready to ship.',
  summaryShort:
    'Software Development Engineer with solid DSA and system design fundamentals. Experience building production-style apps in Java, React, Node.js, and SQL. National hackathon recognition and a global BNB Honorable Mention.',
  summary:
    'Software Development Engineer with hands-on experience across backend, frontend, and databases. Comfortable with Java, C++, Python, JavaScript, SQL, React, Node.js, and Docker. Strong DSA practice and system design interest. Delivered projects involving high-throughput processing, REST APIs, and scalable web apps. Recognized in national hackathons and globally at the BNB Hackathon.',
}

export const badges = [
  {
    id: 'national',
    short: '1st Runner-Up · National Level Hackathon',
    label: '1st Runner-Up · National Level Hackathon',
  },
  {
    id: 'bnb',
    short: 'Honorable Mention at BNB Hackathon (Global)',
    label: 'Honorable Mention at BNB Hackathon (Global)',
  },
]

export const experience = [
  {
    id: 'datamatex',
    role: 'Software Developer Intern',
    company: 'DataMatex Technologies',
    location: 'Bhiwandi',
    period: 'Dec 2025 - Mar 2026',
    bullets: [
      'Developed and shipped responsive web apps for 3+ clients using modern frontend practices, improving engagement by ~18%.',
      'Optimized page performance and SEO, reducing load time by ~25% and increasing form submissions by ~12%.',
    ],
  },
]

export const skills = {
  Languages: ['Java', 'Python', 'C++', 'JavaScript', 'SQL'],
  'Core CS': ['Data Structures', 'Algorithms', 'OOP', 'System Design basics'],
  'Backend & APIs': ['Node.js', 'Express.js', 'FastAPI', 'REST APIs'],
  Frontend: ['React.js', 'Next.js', 'Tailwind CSS'],
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
  'Also worked with': ['RAG', 'LangChain', 'LangGraph'],
}

export const education = {
  degree: 'B.Tech in Computer Engineering',
  school: 'Shivajirao S. Jondhale College of Engineering',
  location: 'Dombivli, India',
  period: 'Nov 2022 - May 2026',
  cgpa: '7.5/10',
}

export const projects = [
  {
    id: 'cryptguard',
    name: 'CryptGuard',
    subtitle: 'High-throughput encrypted traffic analysis engine',
    period: 'Feb 2026 - Mar 2026',
    github: 'https://github.com/ShifaKhan21/CryptGuard',
    demo: null,
    image: '/projects/cryptguard.png',
    description:
      'Built a multi-threaded DPI pipeline in C++/Python for encrypted traffic. Processed 22K+ flows/sec at 0.044 ms latency without decryption. Combined rules, threat intel, and ML (Random Forest on CICIDS) for ~99% detection accuracy.',
    tech: ['C++', 'Python', 'Multithreading', 'ML', 'TLS/JA3'],
    metrics: [
      { label: 'flows/sec', value: '22K+' },
      { label: 'latency', value: '0.044ms' },
      { label: 'accuracy', value: '99%' },
    ],
  },
  {
    id: 'chaincred',
    name: 'ChainCred',
    subtitle: 'Full-stack credential verification platform',
    period: 'Oct 2025 - Jan 2026',
    github: 'https://github.com/MohammadM01/Chain-Cred-final',
    demo: 'https://chaincred-frontend.onrender.com/',
    image: '/projects/chaincred.png',
    description:
      'Designed and implemented a full-stack app with wallet auth, on-chain credentials, and a React dashboard. Reduced verification time from days to under 2 minutes. Built APIs, MongoDB models, OCR flow, and resume tooling.',
    tech: ['React', 'Node.js', 'MongoDB', 'Solidity', 'opBNB', 'REST'],
    metrics: [
      { label: 'verify time', value: '<2 min' },
      { label: 'stack', value: 'opBNB' },
      { label: 'award', value: 'BNB HM' },
    ],
  },
  {
    id: 'civic-eye',
    name: 'Civic Eye',
    subtitle: 'End-to-end civic issue reporting system (SIH 2025)',
    period: 'Jul 2025 - Aug 2025',
    github: 'https://github.com/MohammadM01/civic',
    demo: 'https://civic-eye.onrender.com',
    image: '/projects/civic-eye.png',
    description:
      'Shipped a full-stack reporting platform with React frontend, Node/Express APIs, GPS tagging, and YOLOv8-based issue classification (~92% accuracy). Added audit trails and contractor workflows. Deployed demo on Render.',
    tech: [
      'React',
      'Node.js',
      'Express',
      'YOLOv8',
      'REST APIs',
      'MongoDB',
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
    title: '1st Place, Smart India Hackathon (Internal)',
    detail:
      'Led development of Civic Eye. Vision pipeline hit 92% accuracy; placed 1st among 30+ teams.',
  },
  {
    id: 'national',
    title: '1st Runner-Up, National-Level Hackathon',
    detail:
      'Built CryptGuard: 22K+ flows/sec throughput and ~99% threat detection accuracy.',
  },
  {
    id: 'bnb',
    title: 'Honorable Mention, BNB Hackathon (Global)',
    detail:
      'Recognized for ChainCred, a full-stack verifiable credential system on opBNB.',
  },
]

/** Window accent colours (Fluent) */
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
  ai: '#7C3AED',
  personalize: '#0078D4',
  'this-pc': '#0078D4',
  settings: '#6B6B6B',
  edge: '#0078D4',
  feedback: '#8764B8',
}

/** All apps (Start menu / search) */
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
  { id: 'ai', label: 'Resume Agent', accent: WINDOW_ACCENTS.ai, shortcut: '0' },
]

/** Pinned on the taskbar only */
export const TASKBAR_APPS = APPS.filter((a) => a.id === 'terminal' || a.id === 'ai')
