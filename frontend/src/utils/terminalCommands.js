import { achievements, education, profile, projects, skills } from '../data/portfolioData'

const HELP = [
  'Windows 12 Terminal — available commands',
  '',
  '  help                   Show this help',
  '  about                  Open About / print profile',
  '  projects               List projects',
  '  skills                 List skills',
  '  contact                Open contact form',
  '  clear / cls            Clear the terminal',
  '  theme                  Toggle light / dark',
  '  exit                   Close the terminal',
  '',
  'Also: whoami, date, uname, open <app>',
]

/**
 * @param {string} raw
 * @param {{ cwd: string }} state
 */
export function processCommand(raw, state) {
  const input = raw.trim()
  if (!input) return { lines: [] }

  const parts = input.split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1)

  if (cmd === 'help' || cmd === '?') {
    return { lines: HELP.map((text) => ({ type: 'dim', text })) }
  }

  if (cmd === 'clear' || cmd === 'cls') {
    return { lines: [], clear: true }
  }

  if (cmd === 'exit' || cmd === 'logout') {
    return { lines: [{ type: 'dim', text: 'Session closed.' }], exit: true }
  }

  if (cmd === 'theme') {
    return {
      lines: [{ type: 'accent', text: 'Toggling theme…' }],
      toggleTheme: true,
    }
  }

  if (cmd === 'about') {
    return {
      lines: [
        { type: 'accent', text: profile.name },
        { type: 'plain', text: profile.title },
        { type: 'dim', text: profile.summaryShort },
        { type: 'dim', text: `${profile.email} · ${profile.location}` },
      ],
      openWindow: 'about',
    }
  }

  if (cmd === 'projects') {
    return {
      lines: [
        { type: 'accent', text: 'Projects' },
        ...projects.map((p) => ({
          type: 'plain',
          text: `  ${p.name} — ${p.subtitle}`,
        })),
      ],
      openWindow: 'projects',
    }
  }

  if (cmd === 'skills') {
    const lines = [{ type: 'accent', text: 'Skills' }]
    for (const [group, list] of Object.entries(skills)) {
      lines.push({ type: 'dim', text: `  ${group}` })
      lines.push({ type: 'plain', text: `    ${list.join(', ')}` })
    }
    return { lines, openWindow: 'skills' }
  }

  if (cmd === 'contact') {
    return {
      lines: [
        { type: 'plain', text: `Email: ${profile.email}` },
        { type: 'plain', text: `Phone: ${profile.phone}` },
        { type: 'dim', text: 'Opening contact window…' },
      ],
      openWindow: 'contact',
    }
  }

  if (cmd === 'education') {
    return {
      lines: [
        { type: 'accent', text: education.degree },
        { type: 'plain', text: education.school },
        { type: 'dim', text: `${education.period} · CGPA ${education.cgpa}` },
      ],
      openWindow: 'education',
    }
  }

  if (cmd === 'achievements' || cmd === 'awards') {
    return {
      lines: [
        { type: 'accent', text: 'Achievements' },
        ...achievements.map((a) => ({ type: 'plain', text: `  • ${a.title}` })),
      ],
      openWindow: 'achievements',
    }
  }

  if (cmd === 'open') {
    const target = (args[0] || '').toLowerCase()
    const map = {
      about: 'about',
      experience: 'experience',
      skills: 'skills',
      projects: 'projects',
      achievements: 'achievements',
      education: 'education',
      contact: 'contact',
      github: 'github',
      welcome: 'welcome',
    }
    if (map[target]) {
      return {
        lines: [{ type: 'dim', text: `Opening ${map[target]}…` }],
        openWindow: map[target],
      }
    }
    return {
      lines: [{ type: 'error', text: `open: unknown app '${args[0] || ''}'` }],
    }
  }

  if (cmd === 'whoami') {
    return { lines: [{ type: 'accent', text: 'mohammad' }] }
  }

  if (cmd === 'date') {
    return { lines: [{ type: 'plain', text: new Date().toString() }] }
  }

  if (cmd === 'uname') {
    return {
      lines: [
        {
          type: 'plain',
          text: 'Windows_NT Win12 Portfolio 1.0.0 x86_64',
        },
      ],
    }
  }

  if (cmd === 'pwd') {
    return {
      lines: [
        {
          type: 'plain',
          text: 'C:\\Users\\Mohammad\\Desktop',
        },
      ],
    }
  }

  return {
    lines: [
      {
        type: 'error',
        text: `'${cmd}' is not recognized. Type 'help' for commands.`,
      },
    ],
  }
}
