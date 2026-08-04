import {
  achievements,
  education,
  experience,
  profile,
  projects,
  skills,
} from '../data/portfolioData'
import { BRAND_NAME, HOST_NAME, USER_DOMAIN } from '../constants'
import { formatIpConfigLines, getNetworkInfo } from './networkInfo'

const HOME = 'C:\\Users\\Mohammad'
const DESKTOP = `${HOME}\\Desktop`
const DOCS = `${HOME}\\Documents`
const DOWNLOADS = `${HOME}\\Downloads`
const PORTFOLIO = `${DOCS}\\Portfolio`

/** Virtual NTFS-style tree (read-only feel for portfolio). */
const FS = {
  'C:': { type: 'dir' },
  'C:\\Users': { type: 'dir' },
  [HOME]: { type: 'dir' },
  [DESKTOP]: { type: 'dir' },
  [`${DESKTOP}\\This PC.lnk`]: {
    type: 'file',
    content: 'Shortcut → This PC\n',
  },
  [`${DESKTOP}\\About Me.lnk`]: {
    type: 'file',
    content: 'Shortcut → About Me window\n',
  },
  [`${DESKTOP}\\Projects.lnk`]: {
    type: 'file',
    content: 'Shortcut → Projects window\n',
  },
  [`${DESKTOP}\\readme.txt`]: {
    type: 'file',
    content: [
      "Welcome to Mohammad's Portfolio desktop.",
      '',
      'Try: dir, cd Documents\\Portfolio, type about.txt',
      'Portfolio: about | projects | skills | contact',
      '',
    ].join('\n'),
  },
  [DOCS]: { type: 'dir' },
  [PORTFOLIO]: { type: 'dir' },
  [`${PORTFOLIO}\\about.txt`]: {
    type: 'file',
    content: [
      profile.name,
      profile.title,
      '',
      profile.summaryShort,
      '',
      `Email: ${profile.email}`,
      `Phone: ${profile.phone}`,
      `Location: ${profile.location}`,
      `GitHub: ${profile.github}`,
      `LinkedIn: ${profile.linkedin}`,
      '',
    ].join('\n'),
  },
  [`${PORTFOLIO}\\projects.txt`]: {
    type: 'file',
    content:
      projects
        .map(
          (p) =>
            `${p.name}\n  ${p.subtitle}\n  ${p.period}\n  ${p.tech.join(', ')}\n`,
        )
        .join('\n') + '\n',
  },
  [`${PORTFOLIO}\\skills.txt`]: {
    type: 'file',
    content:
      Object.entries(skills)
        .map(([g, list]) => `${g}:\n  ${list.join(', ')}\n`)
        .join('\n') + '\n',
  },
  [`${PORTFOLIO}\\experience.txt`]: {
    type: 'file',
    content:
      experience
        .map(
          (e) =>
            `${e.role} @ ${e.company}\n  ${e.period} · ${e.location}\n` +
            e.bullets.map((b) => `  - ${b}`).join('\n'),
        )
        .join('\n\n') + '\n',
  },
  [`${PORTFOLIO}\\education.txt`]: {
    type: 'file',
    content: [
      education.degree,
      education.school,
      `${education.location} · ${education.period}`,
      `CGPA ${education.cgpa}`,
      '',
    ].join('\n'),
  },
  [`${PORTFOLIO}\\awards.txt`]: {
    type: 'file',
    content:
      achievements.map((a) => `• ${a.title}\n  ${a.detail}\n`).join('\n') +
      '\n',
  },
  [DOWNLOADS]: { type: 'dir' },
  [`${DOWNLOADS}\\Resume.pdf`]: {
    type: 'file',
    content: `Binary file: ${profile.resumeUrl}\nOpen the About window to download.\n`,
  },
  'C:\\Windows': { type: 'dir' },
  'C:\\Windows\\System32': { type: 'dir' },
  'C:\\Windows\\System32\\drivers': { type: 'dir' },
  'C:\\Program Files': { type: 'dir' },
}

const HELP = [
  "Mohammad's Portfolio shell",
  '',
  'Navigation & files',
  '  dir / ls / gci         List directory',
  '  cd / chdir / sl        Change directory',
  '  pwd / cd               Print / show location',
  '  tree                   Directory tree',
  '  type / cat / gc        Show file contents',
  '  echo / write-output  Print text',
  '  more / head            Preview file',
  '',
  'System',
  '  cls / clear            Clear screen',
  '  whoami / hostname      User / machine name',
  '  ver / winver           OS version',
  '  date / time            Date & time',
  '  systeminfo             System summary',
  '  ipconfig               Live network adapters',
  '  ping <host>            ICMP echo (sim)',
  '  tasklist               Running apps',
  '  vol                    Volume label',
  '  set / env              Environment vars',
  '  where <cmd>           Locate command',
  '',
  'Portfolio',
  '  about  projects  skills  contact  education  awards',
  '  open <app>             Open a window',
  '  theme                  Toggle light / dark',
  '  start <app>            Same as open',
  '  exit / logout          Close terminal',
  '',
  'Tips: paths use \\  ·  try  cd Documents\\Portfolio',
]

function normPath(p) {
  if (!p) return HOME
  let s = String(p).replace(/\//g, '\\').trim()
  if (!s) return HOME
  // Strip quotes
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1)
  }
  // Drive-only
  if (/^[a-zA-Z]:$/.test(s)) s = `${s}\\`
  // Collapse separators
  s = s.replace(/\\+/g, '\\')
  // Remove trailing slash except drive root
  if (s.length > 3 && s.endsWith('\\')) s = s.slice(0, -1)
  // Uppercase drive letter
  if (/^[a-z]:/i.test(s)) s = s[0].toUpperCase() + s.slice(1)
  return s
}

function resolvePath(cwd, target) {
  if (!target || target === '.') return normPath(cwd)
  if (target === '~' || target === '%USERPROFILE%') return HOME
  if (target === '\\' || target === '/') return 'C:'
  let t = target.replace(/\//g, '\\')
  if (/^[a-zA-Z]:/.test(t)) return normPath(t)
  if (t.startsWith('\\')) return normPath(`C:${t}`)

  const base = normPath(cwd)
  const parts = [...base.split('\\').filter(Boolean), ...t.split('\\').filter(Boolean)]
  const out = []
  for (const part of parts) {
    if (part === '.' || part === '') continue
    if (part === '..') {
      if (out.length > 1) out.pop()
      continue
    }
    out.push(part)
  }
  if (out.length === 1 && /^[A-Za-z]:$/.test(out[0])) return out[0]
  return normPath(out.join('\\'))
}

function getNode(path) {
  const p = normPath(path)
  if (FS[p]) return { path: p, node: FS[p] }
  // Drive root alias
  if (p === 'C:\\') return { path: 'C:', node: FS['C:'] }
  return null
}

function listChildren(path) {
  const p = normPath(path)
  const prefix = p === 'C:' || p === 'C:\\' ? 'C:\\' : `${p}\\`
  const names = new Set()
  for (const key of Object.keys(FS)) {
    if (!key.startsWith(prefix)) continue
    const rest = key.slice(prefix.length)
    if (!rest || rest.includes('\\')) {
      const first = rest.split('\\')[0]
      if (first) names.add(first)
      continue
    }
    names.add(rest)
  }
  return [...names].sort((a, b) => a.localeCompare(b))
}

function formatDirListing(path) {
  const p = normPath(path)
  const children = listChildren(p)
  const lines = [
    { type: 'dim', text: ` Directory of ${p === 'C:' ? 'C:\\' : p}` },
    { type: 'dim', text: '' },
  ]

  const rows = []
  // . and ..
  rows.push({ name: '.', kind: 'dir' })
  if (p !== 'C:' && p !== 'C:\\') rows.push({ name: '..', kind: 'dir' })

  for (const name of children) {
    const childPath = p === 'C:' || p === 'C:\\' ? `C:\\${name}` : `${p}\\${name}`
    const node = getNode(childPath)?.node
    rows.push({
      name,
      kind: node?.type === 'file' ? 'file' : 'dir',
    })
  }

  const stamp = '08/04/2026  07:15 PM'
  for (const row of rows) {
    if (row.kind === 'dir') {
      lines.push({
        type: 'plain',
        text: `${stamp}    <DIR>          ${row.name}`,
      })
    } else {
      const size = String(getNode(`${p}\\${row.name}`)?.node?.content?.length || 0).padStart(12)
      lines.push({
        type: 'plain',
        text: `${stamp} ${size} ${row.name}`,
      })
    }
  }

  const dirs = rows.filter((r) => r.kind === 'dir').length
  const files = rows.filter((r) => r.kind === 'file').length
  lines.push({ type: 'dim', text: '' })
  lines.push({
    type: 'dim',
    text: `               ${files} File(s)`,
  })
  lines.push({
    type: 'dim',
    text: `               ${dirs} Dir(s)`,
  })
  return lines
}

function treeLines(path, prefix = '', depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return []
  const children = listChildren(path)
  const lines = []
  children.forEach((name, i) => {
    const last = i === children.length - 1
    const branch = last ? '└───' : '├───'
    const childPath =
      path === 'C:' || path === 'C:\\' ? `C:\\${name}` : `${path}\\${name}`
    const node = getNode(childPath)?.node
    const tag = node?.type === 'file' ? name : `${name}\\`
    lines.push({ type: 'plain', text: `${prefix}${branch}${tag}` })
    if (node?.type !== 'file') {
      const nextPrefix = prefix + (last ? '    ' : '│   ')
      lines.push(...treeLines(childPath, nextPrefix, depth + 1, maxDepth))
    }
  })
  return lines
}

function envLines() {
  return [
    { type: 'plain', text: `ALLUSERSPROFILE=C:\\ProgramData` },
    { type: 'plain', text: `APPDATA=C:\\Users\\Mohammad\\AppData\\Roaming` },
    { type: 'plain', text: `COMPUTERNAME=${HOST_NAME}` },
    { type: 'plain', text: `HOMEDRIVE=C:` },
    { type: 'plain', text: `HOMEPATH=\\Users\\Mohammad` },
    { type: 'plain', text: `NUMBER_OF_PROCESSORS=8` },
    { type: 'plain', text: `OS=Portfolio_NT` },
    { type: 'plain', text: `Path=C:\\Windows\\System32;C:\\Windows;C:\\Users\\Mohammad\\AppData\\Local\\Programs` },
    { type: 'plain', text: `PROCESSOR_ARCHITECTURE=AMD64` },
    { type: 'plain', text: `SystemRoot=C:\\Windows` },
    { type: 'plain', text: `TEMP=C:\\Users\\Mohammad\\AppData\\Local\\Temp` },
    { type: 'plain', text: `USERDOMAIN=${USER_DOMAIN}` },
    { type: 'plain', text: `USERNAME=Mohammad` },
    { type: 'plain', text: `USERPROFILE=C:\\Users\\Mohammad` },
    { type: 'plain', text: `windir=C:\\Windows` },
  ]
}

const APP_MAP = {
  about: 'about',
  me: 'about',
  profile: 'about',
  experience: 'experience',
  work: 'experience',
  skills: 'skills',
  projects: 'projects',
  project: 'projects',
  achievements: 'achievements',
  awards: 'achievements',
  education: 'education',
  contact: 'contact',
  github: 'github',
  welcome: 'welcome',
  portfolio: 'welcome',
  home: 'welcome',
  'this-pc': 'this-pc',
  pc: 'this-pc',
  explorer: 'this-pc',
  computer: 'this-pc',
  ai: 'ai',
  '__ai': 'ai',
  copilot: 'ai',
}

const KNOWN_CMDS = [
  'help',
  '?',
  'dir',
  'ls',
  'gci',
  'get-childitem',
  'cd',
  'chdir',
  'sl',
  'set-location',
  'pwd',
  'get-location',
  'gl',
  'tree',
  'type',
  'cat',
  'gc',
  'get-content',
  'more',
  'head',
  'echo',
  'write-output',
  'cls',
  'clear',
  'clear-host',
  'whoami',
  'hostname',
  'ver',
  'winver',
  'date',
  'time',
  'get-date',
  'systeminfo',
  'ipconfig',
  'ping',
  'tasklist',
  'vol',
  'set',
  'env',
  'get-childitem env:',
  'where',
  'which',
  'about',
  'projects',
  'skills',
  'contact',
  'education',
  'achievements',
  'awards',
  'open',
  'start',
  'theme',
  'exit',
  'logout',
  'uname',
  'mkdir',
  'md',
  'rmdir',
  'rd',
  'del',
  'rm',
  'copy',
  'move',
  'ren',
  'title',
]

/**
 * @param {string} raw
 * @param {{ cwd: string }} state
 */
export async function processCommand(raw, state) {
  const input = raw.trim()
  if (!input) return { lines: [] }

  const cwd = normPath(state?.cwd || HOME)

  // PowerShell-ish: Get-ChildItem Env:
  const lowered = input.toLowerCase()
  if (
    lowered === 'get-childitem env:' ||
    lowered === 'gci env:' ||
    lowered === 'ls env:' ||
    lowered === 'dir env:'
  ) {
    return { lines: envLines() }
  }

  const parts = input.match(/(?:[^\s"]+|"[^"]*")+/g) || []
  const cmd = (parts[0] || '').toLowerCase().replace(/\.exe$/i, '')
  const args = parts.slice(1).map((a) => a.replace(/^"|"$/g, ''))

  if (cmd === 'help' || cmd === '?') {
    return { lines: HELP.map((text) => ({ type: 'dim', text })) }
  }

  if (cmd === 'clear' || cmd === 'cls' || cmd === 'clear-host') {
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

  if (cmd === 'title') {
    const title = args.join(' ') || 'Terminal'
    return {
      lines: [{ type: 'dim', text: `Window title set to "${title}" (sim).` }],
    }
  }

  // —— Directory listing ——
  if (
    cmd === 'dir' ||
    cmd === 'ls' ||
    cmd === 'gci' ||
    cmd === 'get-childitem'
  ) {
    const target = resolvePath(cwd, args[0])
    const node = getNode(target)
    if (!node) {
      return {
        lines: [
          {
            type: 'error',
            text: `dir : Cannot find path '${args[0] || target}' because it does not exist.`,
          },
        ],
      }
    }
    if (node.node.type === 'file') {
      return {
        lines: [
          {
            type: 'plain',
            text: ` ${node.path}`,
          },
        ],
      }
    }
    return { lines: formatDirListing(node.path) }
  }

  // —— cd / pwd ——
  if (
    cmd === 'cd' ||
    cmd === 'chdir' ||
    cmd === 'sl' ||
    cmd === 'set-location'
  ) {
    if (!args[0] || args[0] === '') {
      return { lines: [{ type: 'plain', text: cwd }] }
    }
    const target = resolvePath(cwd, args[0])
    const node = getNode(target)
    if (!node || node.node.type === 'file') {
      return {
        lines: [
          {
            type: 'error',
            text: `cd : Cannot find path '${args[0]}' because it does not exist.`,
          },
        ],
      }
    }
    return {
      lines: [],
      cwd: node.path === 'C:' ? 'C:\\' : node.path,
    }
  }

  if (cmd === 'pwd' || cmd === 'get-location' || cmd === 'gl') {
    return {
      lines: [
        { type: 'dim', text: '' },
        { type: 'dim', text: 'Path' },
        { type: 'dim', text: '----' },
        { type: 'plain', text: cwd === 'C:' ? 'C:\\' : cwd },
        { type: 'dim', text: '' },
      ],
    }
  }

  // —— tree ——
  if (cmd === 'tree') {
    const target = resolvePath(cwd, args[0])
    const node = getNode(target)
    if (!node || node.node.type === 'file') {
      return {
        lines: [
          {
            type: 'error',
            text: `ERROR: Invalid path - '${args[0] || target}'`,
          },
        ],
      }
    }
    const root = node.path === 'C:' ? 'C:\\' : node.path
    return {
      lines: [
        { type: 'plain', text: `Folder PATH listing for volume ${BRAND_NAME}` },
        { type: 'plain', text: `Volume serial number is 1A2B-3C4D` },
        { type: 'accent', text: root },
        ...treeLines(node.path),
      ],
    }
  }

  // —— type / cat ——
  if (
    cmd === 'type' ||
    cmd === 'cat' ||
    cmd === 'gc' ||
    cmd === 'get-content' ||
    cmd === 'more' ||
    cmd === 'head'
  ) {
    if (!args[0]) {
      return {
        lines: [
          {
            type: 'error',
            text: `${cmd} : Missing file path.`,
          },
        ],
      }
    }
    const target = resolvePath(cwd, args[0])
    const node = getNode(target)
    if (!node) {
      return {
        lines: [
          {
            type: 'error',
            text: `${cmd} : Cannot find path '${args[0]}' because it does not exist.`,
          },
        ],
      }
    }
    if (node.node.type !== 'file') {
      return {
        lines: [
          {
            type: 'error',
            text: `${cmd} : Access to the path '${target}' is denied (directory).`,
          },
        ],
      }
    }
    let text = node.node.content || ''
    if (cmd === 'head') {
      text = text.split('\n').slice(0, 10).join('\n')
    }
    return {
      lines: text.split('\n').map((line) => ({ type: 'plain', text: line })),
    }
  }

  // —— echo ——
  if (cmd === 'echo' || cmd === 'write-output') {
    let msg = args.join(' ')
    msg = msg
      .replace(/%USERNAME%/gi, 'Mohammad')
      .replace(/%USERPROFILE%/gi, HOME)
      .replace(/%COMPUTERNAME%/gi, HOST_NAME)
      .replace(/%CD%/gi, cwd)
    if (msg.toLowerCase() === 'on' || msg.toLowerCase() === 'off') {
      return { lines: [{ type: 'plain', text: `ECHO is ${msg.toUpperCase()}.` }] }
    }
    return { lines: [{ type: 'plain', text: msg }] }
  }

  // —— system ——
  if (cmd === 'whoami') {
    return {
      lines: [
        {
          type: 'plain',
          text: `${USER_DOMAIN.toLowerCase()}\\mohammad`,
        },
      ],
    }
  }

  if (cmd === 'hostname') {
    return { lines: [{ type: 'plain', text: HOST_NAME }] }
  }

  if (cmd === 'ver' || cmd === 'winver') {
    return {
      lines: [
        {
          type: 'plain',
          text: `${BRAND_NAME} [Version 1.0.0]`,
        },
      ],
    }
  }

  if (cmd === 'uname') {
    return {
      lines: [
        {
          type: 'plain',
          text: `Portfolio_NT ${HOST_NAME} 1.0.0  ${BRAND_NAME} x86_64`,
        },
      ],
    }
  }

  if (cmd === 'date' || cmd === 'get-date') {
    return {
      lines: [
        {
          type: 'plain',
          text: `The current date is: ${new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
          })}`,
        },
      ],
    }
  }

  if (cmd === 'time') {
    return {
      lines: [
        {
          type: 'plain',
          text: `The current time is: ${new Date().toLocaleTimeString('en-US')}`,
        },
      ],
    }
  }

  if (cmd === 'vol') {
    return {
      lines: [
        { type: 'plain', text: ` Volume in drive C is ${BRAND_NAME}` },
        { type: 'plain', text: ' Volume Serial Number is 1A2B-3C4D' },
      ],
    }
  }

  if (cmd === 'systeminfo') {
    const now = new Date().toString()
    return {
      lines: [
        { type: 'accent', text: `Host Name:                 ${HOST_NAME}` },
        { type: 'plain', text: `OS Name:                   ${BRAND_NAME}` },
        { type: 'plain', text: 'OS Version:                1.0.0' },
        { type: 'plain', text: `OS Manufacturer:           ${profile.name}` },
        { type: 'plain', text: 'System Manufacturer:       Portfolio Desktop' },
        { type: 'plain', text: 'System Type:               x64-based PC' },
        { type: 'plain', text: 'Processor(s):              1 Processor(s) Installed.' },
        { type: 'plain', text: '                           [01]: AMD64 Family 25 · 8 Cores' },
        { type: 'plain', text: 'Total Physical Memory:     16,384 MB' },
        { type: 'plain', text: 'Available Physical Memory: 9,842 MB' },
        { type: 'plain', text: `System Boot Time:          ${now}` },
        { type: 'plain', text: `Domain:                    WORKGROUP` },
        { type: 'plain', text: `Logon Server:              \\\\${HOST_NAME}` },
        { type: 'dim', text: `Owner:                     ${profile.name} · ${profile.title}` },
      ],
    }
  }

  if (cmd === 'ipconfig') {
    try {
      const info = await getNetworkInfo()
      return { lines: formatIpConfigLines(info) }
    } catch {
      return {
        lines: [
          {
            type: 'error',
            text: 'ipconfig : Failed to query network adapters.',
          },
        ],
      }
    }
  }

  if (cmd === 'ping') {
    const host = args[0] || 'localhost'
    return {
      lines: [
        {
          type: 'plain',
          text: `Pinging ${host} [127.0.0.1] with 32 bytes of data:`,
        },
        {
          type: 'plain',
          text: `Reply from 127.0.0.1: bytes=32 time<1ms TTL=128`,
        },
        {
          type: 'plain',
          text: `Reply from 127.0.0.1: bytes=32 time<1ms TTL=128`,
        },
        {
          type: 'plain',
          text: `Reply from 127.0.0.1: bytes=32 time=1ms TTL=128`,
        },
        {
          type: 'plain',
          text: `Reply from 127.0.0.1: bytes=32 time<1ms TTL=128`,
        },
        { type: 'dim', text: '' },
        {
          type: 'plain',
          text: `Ping statistics for 127.0.0.1:`,
        },
        {
          type: 'plain',
          text: `    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`,
        },
        {
          type: 'plain',
          text: `Approximate round trip times in milli-seconds:`,
        },
        {
          type: 'plain',
          text: `    Minimum = 0ms, Maximum = 1ms, Average = 0ms`,
        },
      ],
    }
  }

  if (cmd === 'tasklist') {
    return {
      lines: [
        {
          type: 'dim',
          text: 'Image Name                     PID Session Name        Mem Usage',
        },
        {
          type: 'dim',
          text: '========================= ======== ================ ============',
        },
        {
          type: 'plain',
          text: 'System Idle Process              0 Services               8 K',
        },
        {
          type: 'plain',
          text: 'System                           4 Services             144 K',
        },
        {
          type: 'plain',
          text: 'explorer.exe                  4820 Console           82,412 K',
        },
        {
          type: 'plain',
          text: 'PortfolioTerminal.exe          6104 Console           64,220 K',
        },
        {
          type: 'plain',
          text: 'Portfolio.exe                 7120 Console          128,004 K',
        },
        {
          type: 'plain',
          text: 'node.exe                      8840 Console           96,112 K',
        },
      ],
    }
  }

  if (cmd === 'set' || cmd === 'env') {
    if (args[0]) {
      const key = args[0].replace(/=.*$/, '').toUpperCase()
      const hit = envLines().find((l) =>
        l.text.toUpperCase().startsWith(`${key}=`),
      )
      if (hit) return { lines: [hit] }
      return {
        lines: [
          {
            type: 'error',
            text: `Environment variable ${args[0]} not defined`,
          },
        ],
      }
    }
    return { lines: envLines() }
  }

  if (cmd === 'where' || cmd === 'which') {
    const name = (args[0] || '').toLowerCase()
    if (!name) {
      return {
        lines: [{ type: 'error', text: 'where: missing argument' }],
      }
    }
    const base = name.replace(/\.exe$/i, '')
    if (KNOWN_CMDS.includes(base) || APP_MAP[base]) {
      return {
        lines: [
          {
            type: 'plain',
            text: `C:\\Windows\\System32\\${base}.exe`,
          },
        ],
      }
    }
    return {
      lines: [
        {
          type: 'error',
          text: `INFO: Could not find files for the given pattern(s).`,
        },
      ],
    }
  }

  // —— write-protected FS ops ——
  if (
    cmd === 'mkdir' ||
    cmd === 'md' ||
    cmd === 'rmdir' ||
    cmd === 'rd' ||
    cmd === 'del' ||
    cmd === 'rm' ||
    cmd === 'copy' ||
    cmd === 'move' ||
    cmd === 'ren'
  ) {
    return {
      lines: [
        {
          type: 'error',
          text: `Access is denied. This portfolio volume is read-only.`,
        },
      ],
    }
  }

  // —— portfolio shortcuts ——
  if (cmd === 'about') {
    return {
      lines: [
        { type: 'accent', text: profile.name },
        { type: 'plain', text: profile.title },
        { type: 'dim', text: profile.summaryShort },
        { type: 'dim', text: `${profile.email} · ${profile.location}` },
      ],
      openWindow: 'about',
      focusWindow: true,
    }
  }

  if (cmd === 'projects') {
    return {
      lines: [
        { type: 'accent', text: 'Projects' },
        ...projects.map((p) => ({
          type: 'plain',
          text: `  ${p.name}: ${p.subtitle}`,
        })),
      ],
      openWindow: 'projects',
      focusWindow: true,
    }
  }

  if (cmd === 'skills') {
    const lines = [{ type: 'accent', text: 'Skills' }]
    for (const [group, list] of Object.entries(skills)) {
      lines.push({ type: 'dim', text: `  ${group}` })
      lines.push({ type: 'plain', text: `    ${list.join(', ')}` })
    }
    return { lines, openWindow: 'skills', focusWindow: true }
  }

  if (cmd === 'contact') {
    return {
      lines: [
        { type: 'plain', text: `Email: ${profile.email}` },
        { type: 'plain', text: `Phone: ${profile.phone}` },
        { type: 'dim', text: 'Opening contact window…' },
      ],
      openWindow: 'contact',
      focusWindow: true,
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
      focusWindow: true,
    }
  }

  if (cmd === 'achievements' || cmd === 'awards') {
    return {
      lines: [
        { type: 'accent', text: 'Achievements' },
        ...achievements.map((a) => ({ type: 'plain', text: `  • ${a.title}` })),
      ],
      openWindow: 'achievements',
      focusWindow: true,
    }
  }

  if (cmd === 'open' || cmd === 'start') {
    const target = (args[0] || '').toLowerCase()
    if (!target) {
      return {
        lines: [
          {
            type: 'dim',
            text: `Usage: ${cmd} <app>`,
          },
          {
            type: 'dim',
            text:
              'Apps: about, portfolio, projects, skills, contact, experience, education, awards, github, this-pc',
          },
        ],
      }
    }
    if (APP_MAP[target]) {
      return {
        lines: [{ type: 'dim', text: `Opening ${APP_MAP[target]}…` }],
        openWindow: APP_MAP[target],
        focusWindow: true,
      }
    }
    // start https://...
    if (/^https?:\/\//i.test(args[0] || '')) {
      window.open(args[0], '_blank', 'noopener,noreferrer')
      return { lines: [{ type: 'dim', text: `Started ${args[0]}` }] }
    }
    return {
      lines: [
        {
          type: 'error',
          text: `${cmd}: unknown app '${args[0]}'.`,
        },
        {
          type: 'dim',
          text:
            'Try: about, portfolio, projects, skills, contact, experience, education, awards, github',
        },
      ],
    }
  }

  // Unknown — Windows-style error
  return {
    lines: [
      {
        type: 'error',
        text: `'${cmd}' is not recognized as an internal or external command,`,
      },
      {
        type: 'error',
        text: `operable program or batch file.`,
      },
      {
        type: 'dim',
        text: `Type 'help' for available commands.`,
      },
    ],
  }
}
