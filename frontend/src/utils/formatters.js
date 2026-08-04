import {
  achievements,
  education,
  experience,
  profile,
  projects,
  skills,
} from '../data/portfolioData'

/** Wrap lines for terminal-friendly display */
export function wrapText(text, width = 56) {
  const words = text.split(/\s+/)
  const lines = []
  let current = ''

  for (const word of words) {
    if ((current + ' ' + word).trim().length > width) {
      if (current) lines.push(current)
      current = word
    } else {
      current = current ? `${current} ${word}` : word
    }
  }
  if (current) lines.push(current)
  return lines
}

export function formatProfileAscii() {
  const summaryLines = wrapText(profile.summary, 56)
  return [
    { type: 'accent', text: '================================================' },
    { type: 'accent', text: '         MOHAMMAD MULLA – PROFILE' },
    { type: 'accent', text: '================================================' },
    { type: 'plain', text: `  Full Name   : ${profile.name}` },
    { type: 'plain', text: `  Title       : ${profile.title}` },
    { type: 'plain', text: `  Location    : ${profile.location}` },
    { type: 'plain', text: `  Phone       : ${profile.phone}` },
    { type: 'plain', text: `  Email       : ${profile.email}` },
    { type: 'plain', text: `  LinkedIn    : ${profile.linkedin}` },
    { type: 'plain', text: `  GitHub      : ${profile.github}` },
    { type: 'plain', text: '' },
    { type: 'dim', text: '  Summary:' },
    ...summaryLines.map((line) => ({ type: 'plain', text: `  ${line}` })),
    { type: 'plain', text: '' },
    { type: 'accent', text: '  ======== Achievements ========' },
    ...achievements.map((a, i) => ({
      type: 'ok',
      text: `  ${i + 1}. ${a.title}`,
    })),
    { type: 'accent', text: '================================================' },
  ]
}

export function catFile(name) {
  const key = name.replace(/^\.\//, '').toLowerCase()

  if (key === 'about.md' || key === 'about') {
    return [
      `# ${profile.name}`,
      profile.title,
      '',
      profile.summary,
      '',
      `Location: ${profile.location}`,
      `Email: ${profile.email}`,
      `Phone: ${profile.phone}`,
    ]
  }

  if (key === 'experience.md' || key === 'experience') {
    return experience.flatMap((job) => [
      `${job.role} @ ${job.company} (${job.location})`,
      job.period,
      ...job.bullets.map((b) => `  - ${b}`),
      '',
    ])
  }

  if (key === 'skills.md' || key === 'skills') {
    return Object.entries(skills).flatMap(([cat, items]) => [
      `[${cat}]`,
      `  ${items.join(', ')}`,
      '',
    ])
  }

  if (key === 'education.md' || key === 'education') {
    return [
      education.degree,
      education.school,
      education.location,
      education.period,
      `CGPA: ${education.cgpa}`,
    ]
  }

  if (key === 'achievements.md' || key === 'achievements') {
    return achievements.flatMap((a, i) => [
      `${i + 1}. ${a.title}`,
      `   ${a.detail}`,
      '',
    ])
  }

  if (key === 'contact.md' || key === 'contact') {
    return [
      `Email    : ${profile.email}`,
      `Phone    : ${profile.phone}`,
      `LinkedIn : ${profile.linkedin}`,
      `GitHub   : ${profile.github}`,
      `Location : ${profile.location}`,
    ]
  }

  if (key === 'welcome.md' || key === 'welcome') {
    return [
      `Welcome to Mohammad's Portfolio. ${profile.name}'s desktop.`,
      profile.availability,
      'Open Terminal or use the dock to explore.',
      'Try: ./mohammad_mulla --profile --full',
    ]
  }

  if (key === 'github.md' || key === 'github') {
    return [
      `GitHub: ${profile.github}`,
      `Profile: ${profile.githubUrl}`,
      'Open the GitHub window from the dock for live public events.',
    ]
  }

  const project = projects.find(
    (p) =>
      key === `${p.id}.md` ||
      key === p.id ||
      key === `${p.name.toLowerCase()}.md`,
  )
  if (project) {
    return [
      `${project.name}: ${project.subtitle}`,
      project.period,
      '',
      project.description,
      '',
      `Tech: ${project.tech.join(', ')}`,
      `GitHub: ${project.github}`,
    ]
  }

  return null
}

export function listDir(cwd) {
  if (cwd === '/' || cwd === '~' || cwd === '') {
    return [
      'about.md',
      'achievements.md',
      'contact.md',
      'education.md',
      'experience.md',
      'github.md',
      'projects/',
      'skills.md',
      'welcome.md',
      'mohammad_mulla*',
    ]
  }
  if (cwd === 'projects' || cwd === '/projects' || cwd === '~/projects') {
    return projects.map((p) => `${p.id}.md`)
  }
  return null
}
