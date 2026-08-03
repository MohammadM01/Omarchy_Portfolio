/**
 * Portfolio data — Mohammad Mulla
 * Single source of truth for all UI + terminal content.
 */

export const profile = {
  name: 'Mohammad Mulla',
  title: 'Software Engineer (Full-Stack & AI)',
  phone: '+91-8983228237',
  email: 'mullamohammad123@gmail.com',
  location: 'Bhiwandi, Mumbai, India',
  linkedin: 'linkedin.com/in/mohammadm01',
  linkedinUrl: 'https://linkedin.com/in/mohammadm01',
  github: 'github.com/MohammadMo1',
  githubUrl: 'https://github.com/MohammadMo1',
  githubUser: 'MohammadMo1',
  resumeUrl: '/Resume.pdf',
  availability: 'Open to Full-Stack / AI roles · Mumbai / Remote',
  monogram: 'MM',
  tagline: 'Full-stack & AI engineer. Hackathon-proven systems.',
  summaryShort:
    'Full-stack & AI engineer with national hackathon wins and a global BNB Honorable Mention. Builds scalable apps in Java, React, Node, and modern LLM stacks.',
  summary:
    'Software Engineer specializing in full-stack development and AI-powered systems, recognized with top rankings in national hackathons and an Honorable Mention at the global BNB Hackathon. Experienced in designing scalable applications using Java, React.js, Node.js, SQL, and modern AI technologies, with strong foundations in data structures, algorithms, and system design.',
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
      'Developed responsive websites for 3+ local businesses, improving online visibility and customer engagement by 18% through modern UI/UX and mobile optimization.',
      'Implemented performance and SEO improvements that reduced page load time by 25% and increased inquiry form submissions by 12%.',
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
    subtitle: 'Privacy-Preserving Encrypted Traffic Threat Detection System',
    period: 'Feb 2026 – Mar 2026',
    github: 'https://github.com/MohammadMo1/CryptGuard',
    demo: null,
    image: '/projects/cryptguard.svg',
    description:
      'Multi-threaded DPI engine for encrypted traffic analysis achieving 22K+ flows/sec at 0.044 ms latency via a zero-decryption pipeline. Hybrid threat detection (rules + AbuseIPDB + Random Forest on CICIDS 160K) with 99% accuracy, detecting C2 beaconing.',
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
    subtitle: 'Decentralized Verifiable Credential Platform',
    period: 'Oct 2025 – Jan 2026',
    github: 'https://github.com/MohammadMo1/ChainCred',
    demo: null,
    image: '/projects/chaincred.svg',
    description:
      'DeSoc dApp with EVM wallet login; on-chain verifiable credentials cut verification time from days to under 2 minutes. Dashboard and resume builder with OCR scanning and AI-driven networking.',
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
    subtitle: 'Unified Civic Issue Reporting & Resolution Platform',
    period: 'Jul 2025 – Aug 2025',
    github: 'https://github.com/MohammadMo1/CivicEye',
    demo: 'https://civic-eye.onrender.com',
    image: '/projects/civic-eye.svg',
    description:
      'AI civic-reporting platform (SIH 2025) auto-routing GPS-tagged issues via YOLOv8 categorization. Blockchain audit trails, contractor bidding, and gamification; demo deployed on Render.',
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
    title: '1st Position, Smart India Hackathon Internal',
    detail:
      'Built Civic Eye (Python, OpenCV) with 92% accuracy, outperforming 30+ teams.',
  },
  {
    id: 'national',
    title: '1st Runner-Up, National-Level Hackathon',
    detail:
      'Built CryptGuard DPI engine, achieving 22K+ flows/sec at 99% accuracy threat detection.',
  },
  {
    id: 'bnb',
    title: 'Honorable Mention (Global Level), BNB Hackathon',
    detail:
      'Recognized globally for ChainCred, a decentralized verifiable credential platform.',
  },
]

export const themePresets = [
  {
    id: 'violet-rose',
    label: 'Violet Rose',
    accent: '#c4b5fd',
    accentDim: '#a78bfa',
    glow: 'rgba(196, 181, 253, 0.4)',
    rose: '#ff6b9d',
    roseDim: '#f43f5e',
    roseGlow: 'rgba(255, 107, 157, 0.45)',
    lightAccent: '#7c3aed',
    lightAccentDim: '#6d28d9',
    lightRose: '#e11d48',
    lightRoseDim: '#be123c',
  },
  {
    id: 'rose',
    label: 'Rose',
    accent: '#ff6b9d',
    accentDim: '#f43f5e',
    glow: 'rgba(255, 107, 157, 0.45)',
    rose: '#c4b5fd',
    roseDim: '#a78bfa',
    roseGlow: 'rgba(196, 181, 253, 0.35)',
    lightAccent: '#e11d48',
    lightAccentDim: '#be123c',
    lightRose: '#7c3aed',
    lightRoseDim: '#6d28d9',
  },
  {
    id: 'mono',
    label: 'Mono',
    accent: '#e8e0ef',
    accentDim: '#b6a8c4',
    glow: 'rgba(232, 224, 239, 0.28)',
    rose: '#ff8fab',
    roseDim: '#fb7185',
    roseGlow: 'rgba(255, 143, 171, 0.3)',
    lightAccent: '#1c1228',
    lightAccentDim: '#3f3354',
    lightRose: '#be123c',
    lightRoseDim: '#9f1239',
  },
]

export const commandPaletteItems = [
  { id: 'welcome', label: 'Welcome', hint: 'session', action: 'window' },
  { id: 'about', label: 'About', hint: 'profile', action: 'window' },
  { id: 'projects', label: 'Projects', hint: 'portfolio', action: 'window' },
  { id: 'experience', label: 'Experience', hint: 'work', action: 'window' },
  { id: 'skills', label: 'Skills', hint: 'stack', action: 'window' },
  { id: 'education', label: 'Education', hint: 'degree', action: 'window' },
  { id: 'achievements', label: 'Achievements', hint: 'awards', action: 'window' },
  { id: 'github', label: 'GitHub Activity', hint: 'commits', action: 'window' },
  { id: 'contact', label: 'Contact', hint: 'message', action: 'window' },
  { id: 'terminal', label: 'Terminal', hint: 'Ctrl+`', action: 'terminal' },
  { id: 'resume', label: 'Download Resume', hint: 'PDF', action: 'resume' },
  { id: 'boot', label: 'Replay Boot Intro', hint: 'kernel', action: 'boot' },
]
