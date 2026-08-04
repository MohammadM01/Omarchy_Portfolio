import {
  achievements,
  education,
  experience,
  profile,
  projects,
  skills,
} from '../data/portfolioData'
import {
  absoluteUrl,
  FAQ_ITEMS,
  GEO,
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
} from './siteConfig'

export function buildPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: profile.name,
    alternateName: 'Mohammad Mo',
    jobTitle: profile.title,
    description: profile.summary,
    url: SITE_URL,
    image: absoluteUrl(profile.photoUrl),
    email: profile.email,
    telephone: profile.phone,
    sameAs: [profile.linkedinUrl, profile.githubUrl],
    address: {
      '@type': 'PostalAddress',
      addressLocality: GEO.locality,
      addressRegion: GEO.metro,
      addressCountry: GEO.country,
    },
    homeLocation: {
      '@type': 'Place',
      name: GEO.placename,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: GEO.latitude,
        longitude: GEO.longitude,
      },
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: education.school,
      address: education.location,
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: profile.title,
      occupationLocation: {
        '@type': 'City',
        name: GEO.metro,
      },
    },
    knowsAbout: Object.values(skills).flat(),
    award: achievements.map((a) => a.title),
  }
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'en-IN',
    publisher: { '@id': `${SITE_URL}/#person` },
    about: { '@id': `${SITE_URL}/#person` },
  }
}

export function buildWebPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: `${profile.name} | ${profile.title}`,
    description: DEFAULT_DESCRIPTION,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    mainEntity: { '@id': `${SITE_URL}/#person` },
    inLanguage: 'en-IN',
  }
}

export function buildPortfolioSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/#portfolio`,
    name: `${profile.name} — Projects & Portfolio`,
    description: `Selected software projects by ${profile.name}, ${profile.title}.`,
    url: SITE_URL,
    about: { '@id': `${SITE_URL}/#person` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: p.name,
          description: p.description || p.subtitle,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web',
          url: p.demo || p.github,
          codeRepository: p.github,
          author: { '@id': `${SITE_URL}/#person` },
          keywords: p.tech?.join(', '),
          image: p.image ? absoluteUrl(p.image) : undefined,
        },
      })),
    },
  }
}

export function buildExperienceSchema() {
  return experience.map((job) => ({
    '@context': 'https://schema.org',
    '@type': 'EmployeeRole',
    roleName: job.role,
    description: job.bullets?.join(' '),
    startDate: '2025-12',
    endDate: '2026-03',
    worksFor: {
      '@type': 'Organization',
      name: job.company,
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'IN',
      },
    },
    employee: { '@id': `${SITE_URL}/#person` },
  }))
}

export function buildEducationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name: education.degree,
    credentialCategory: "Bachelor's Degree",
    educationalLevel: 'Undergraduate',
    recognizedBy: {
      '@type': 'CollegeOrUniversity',
      name: education.school,
      address: education.location,
    },
    about: { '@id': `${SITE_URL}/#person` },
  }
}

export function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function buildPlaceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: GEO.placename,
    address: {
      '@type': 'PostalAddress',
      addressLocality: GEO.locality,
      addressRegion: GEO.metro,
      addressCountry: GEO.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
  }
}

/** All JSON-LD graphs to inject once on the home portfolio shell */
export function buildAllSchemas() {
  return [
    buildPersonSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema(),
    buildPortfolioSchema(),
    buildEducationSchema(),
    buildFaqSchema(),
    buildPlaceSchema(),
    ...buildExperienceSchema(),
  ]
}
