import { catFile, formatProfileAscii, listDir } from './formatters'

const HELP = [
  'Omarchy shell — available commands',
  '',
  '  ls                     List directory contents',
  '  cd <section>           Change directory (projects, ~, /)',
  '  cat <file>             Print file contents',
  '  ./mohammad_mulla --profile --full',
  '                         Print ASCII profile card',
  '  clear                  Clear the terminal',
  '  help                   Show this help',
  '  exit                   Close the terminal',
  '',
  'Tip: open sections via dock icons or `cd projects` then `cat cryptguard.md`',
]

/**
 * Process a terminal command string.
 * @param {string} raw
 * @param {{ cwd: string }} state
 * @returns {{ lines: Array<{type?: string, text: string}>, cwd?: string, clear?: boolean, exit?: boolean, openWindow?: string }}
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

  if (cmd === 'ls') {
    const entries = listDir(state.cwd)
    if (!entries) {
      return {
        lines: [{ type: 'error', text: `ls: cannot access '${state.cwd}': No such file` }],
      }
    }
    return {
      lines: entries.map((name) => ({
        type: name.endsWith('/') || name.endsWith('*') ? 'accent' : 'plain',
        text: name,
      })),
    }
  }

  if (cmd === 'cd') {
    const target = (args[0] || '~').replace(/\/$/, '')
    if (target === '~' || target === '/' || target === '..' || target === '') {
      return { lines: [], cwd: '~' }
    }
    if (target === 'projects' || target === './projects') {
      return { lines: [], cwd: 'projects' }
    }
    const sectionMap = {
      about: 'about',
      experience: 'experience',
      skills: 'skills',
      achievements: 'achievements',
      education: 'education',
      contact: 'contact',
      welcome: 'welcome',
      github: 'github',
    }
    if (sectionMap[target]) {
      return {
        lines: [
          {
            type: 'dim',
            text: `Opening ${sectionMap[target]} window…`,
          },
        ],
        openWindow: sectionMap[target],
      }
    }
    return {
      lines: [{ type: 'error', text: `cd: no such directory: ${target}` }],
    }
  }

  if (cmd === 'cat') {
    if (!args[0]) {
      return { lines: [{ type: 'error', text: 'cat: missing file operand' }] }
    }
    const file =
      state.cwd === 'projects' && !args[0].includes('/')
        ? args[0]
        : args[0]
    const content = catFile(file)
    if (!content) {
      return {
        lines: [{ type: 'error', text: `cat: ${args[0]}: No such file` }],
      }
    }
    return { lines: content.map((text) => ({ type: 'plain', text })) }
  }

  if (
    cmd === './mohammad_mulla' ||
    cmd === 'mohammad_mulla' ||
    cmd === './mohammad_mulla.exe'
  ) {
    const flags = args.join(' ')
    if (flags.includes('--profile') && flags.includes('--full')) {
      return { lines: formatProfileAscii() }
    }
    return {
      lines: [
        {
          type: 'dim',
          text: 'Usage: ./mohammad_mulla --profile --full',
        },
      ],
    }
  }

  if (cmd === 'whoami') {
    return { lines: [{ type: 'accent', text: 'mohammad' }] }
  }

  if (cmd === 'pwd') {
    return {
      lines: [{ type: 'plain', text: state.cwd === '~' ? '/home/mohammad' : `/home/mohammad/${state.cwd}` }],
    }
  }

  if (cmd === 'date') {
    return { lines: [{ type: 'plain', text: new Date().toString() }] }
  }

  if (cmd === 'uname') {
    return {
      lines: [
        {
          type: 'plain',
          text: 'Omarchy 1.0.0 x86_64 GNU/Linux',
        },
      ],
    }
  }

  return {
    lines: [
      {
        type: 'error',
        text: `omarchy: command not found: ${cmd}. Type 'help' for commands.`,
      },
    ],
  }
}
