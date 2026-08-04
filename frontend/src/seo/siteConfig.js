/**
 * Site SEO / GEO / AEO config.
 * VITE_SITE_URL can override this value for preview deployments.
 */
import { profile, projects, badges } from '../data/portfolioData'
import { BRAND_NAME } from '../constants'

const FALLBACK_ORIGIN =
  typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'https://mohammadmulla.com'

export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || FALLBACK_ORIGIN
).replace(/\/$/, '')

export const SITE_NAME = BRAND_NAME
export const DEFAULT_LOCALE = 'en_IN'
export const CONTENT_LANGUAGE = 'en'

export const GEO = {
  region: 'IN-MH',
  locality: 'Bhiwandi',
  regionName: 'Maharashtra',
  metro: 'Mumbai',
  country: 'IN',
  countryName: 'India',
  latitude: 19.2967,
  longitude: 73.0631,
  placename: 'Bhiwandi, Mumbai, Maharashtra, India',
}

export const DEFAULT_TITLE =
  'Mohammad Mulla | Software Development Engineer (SDE) Portfolio'

export const DEFAULT_DESCRIPTION =
  'Mohammad Mulla — SDE in Bhiwandi, Mumbai. React, Node.js, Java, DSA. National hackathon runner-up · BNB Honorable Mention. Open to SDE roles.'

export const KEYWORDS = [
  'Mohammad Mulla',
  "Mohammad's Portfolio",
  'Mohammad Mulla portfolio',
  'Software Development Engineer',
  'SDE portfolio',
  'full-stack developer Mumbai',
  'React developer Mumbai',
  'Node.js developer India',
  'software engineer Bhiwandi',
  'Mumbai software engineer',
  'hackathon winner portfolio',
  'BNB Hackathon',
  'Smart India Hackathon',
  'CryptGuard',
  'ChainCred',
  'Civic Eye',
  'Java developer',
  'DSA',
  'system design',
].join(', ')

export const SOCIAL_IMAGE_PATH = '/profile.png'
export const SOCIAL_IMAGE_ALT = `${profile.name} — ${profile.title} portfolio`

export const PRIMARY_KEYWORDS = [
  'Mohammad Mulla portfolio',
  'Software Development Engineer portfolio',
  'full-stack developer Mumbai',
  'React Node.js developer India',
  'SDE roles Mumbai remote',
]

export const FAQ_ITEMS = [
  {
    question: 'Who is Mohammad Mulla?',
    answer: `${profile.name} is a ${profile.title} based in ${profile.location}. ${profile.summaryShort}`,
  },
  {
    question: "What is Mohammad's Portfolio?",
    answer: `${SITE_NAME} is the interactive portfolio of ${profile.name}, showcasing projects, skills, experience, education, and hackathon achievements as a Software Development Engineer.`,
  },
  {
    question: 'Where is Mohammad Mulla based?',
    answer: `${profile.name} is based in ${GEO.locality}, ${GEO.metro}, ${GEO.regionName}, ${GEO.countryName}. He is open to Mumbai or remote SDE roles.`,
  },
  {
    question: "What are Mohammad Mulla's top skills?",
    answer:
      'Java, Python, C++, JavaScript, SQL, React, Node.js, Express, FastAPI, MySQL, PostgreSQL, MongoDB, Docker, Git, DSA, system design basics, and AI tooling (RAG, LangChain, LangGraph).',
  },
  {
    question: 'What projects has Mohammad Mulla built?',
    answer: projects
      .map((p) => `${p.name}: ${p.subtitle}`)
      .join(' · '),
  },
  {
    question: 'What hackathon achievements does Mohammad Mulla have?',
    answer: badges.map((b) => b.label).join(' · '),
  },
  {
    question: 'How can I contact Mohammad Mulla?',
    answer: `Email ${profile.email} or use the Contact form on ${SITE_NAME}. LinkedIn: ${profile.linkedinUrl}. GitHub: ${profile.githubUrl}.`,
  },
  {
    question: 'Is Mohammad Mulla open to work?',
    answer: profile.availability,
  },
  {
    question: 'What programming languages does Mohammad Mulla use?',
    answer:
      'Mohammad Mulla works with Java, Python, C++, JavaScript, and SQL, selecting tools based on the product and system requirements.',
  },
  {
    question: 'Does Mohammad Mulla have a resume?',
    answer:
      'Yes. Mohammad Mulla’s current resume is available to download from this portfolio.',
  },
  {
    question: 'What is CryptGuard?',
    answer:
      'CryptGuard is Mohammad Mulla’s encrypted-traffic analysis project, built with C++ and Python for high-throughput threat detection without decryption.',
  },
  {
    question: 'What is ChainCred?',
    answer:
      'ChainCred is a full-stack credential-verification platform by Mohammad Mulla that uses wallet authentication and verifiable on-chain credentials.',
  },
  {
    question: 'What is Civic Eye?',
    answer:
      'Civic Eye is Mohammad Mulla’s civic issue reporting platform with GPS tagging and YOLOv8-based image classification.',
  },
  {
    question: 'Does Mohammad Mulla work with AI?',
    answer:
      'Yes. Mohammad Mulla has worked with machine learning, RAG, LangChain, LangGraph, and YOLOv8-based computer vision.',
  },
  {
    question: 'Has Mohammad Mulla received hackathon recognition?',
    answer:
      'Yes. Mohammad Mulla was a national-level hackathon runner-up, earned a BNB Hackathon honorable mention, and won an internal Smart India Hackathon selection.',
  },
  {
    question: 'How can I hire or contact Mohammad Mulla?',
    answer:
      'Contact Mohammad Mulla through the portfolio contact form, email, LinkedIn, or GitHub for software engineering opportunities and collaborations.',
  },
]

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
