import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { processCommand } from '../utils/terminalCommands'
import { useWindows } from './WindowContext'
import { useTheme } from './ThemeContext'
import { storageGet, storageSet } from '../utils/storage'
import { STORAGE_KEYS } from '../constants'

const TerminalContext = createContext(null)

let lineId = 0
function nextId() {
  lineId += 1
  return lineId
}

const ASCII_BANNER = [
  { type: 'accent', text: '  __  __       _                               _' },
  { type: 'accent', text: ' |  \\/  | ___ | |__   __ _ _ __ ___  _ __ ___  __| |' },
  { type: 'accent', text: " | |\\/| |/ _ \\| '_ \\ / _` | '_ ` _ \\| '_ ` _ \\/ _` |" },
  { type: 'accent', text: ' | |  | | (_) | | | | (_| | | | | | | | | | | | (_| |' },
  { type: 'accent', text: ' |_|  |_|\\___/|_| |_|\\__,_|_| |_| |_|_| |_| |_|\\__,_|' },
  { type: 'dim', text: '' },
  { type: 'plain', text: ' Mohammad Mulla · Full-Stack & AI · Windows 12 Desktop' },
  { type: 'dim', text: ' Type `help` · try `about` or `projects`' },
  { type: 'dim', text: '' },
]

function buildBootLines(showBanner) {
  const lines = showBanner
    ? ASCII_BANNER.map((l) => ({ id: nextId(), ...l }))
    : [
        { id: nextId(), type: 'dim', text: 'Windows 12 Terminal — ready' },
        {
          id: nextId(),
          type: 'plain',
          text: 'Type `help` for commands.',
        },
      ]
  return lines
}

export function TerminalProvider({ children }) {
  const bannerShown = useRef(storageGet(STORAGE_KEYS.termBanner, false))
  const [isOpen, setIsOpen] = useState(false)
  const [cwd, setCwd] = useState('C:\\Users\\Mohammad')
  const [history, setHistory] = useState(() =>
    buildBootLines(!bannerShown.current),
  )
  const [commandHistory, setCommandHistory] = useState([])
  const { openWindow } = useWindows()
  const { toggleTheme } = useTheme()

  const toggle = useCallback(() => setIsOpen((v) => !v), [])
  const open = useCallback(() => {
    if (!bannerShown.current) {
      bannerShown.current = true
      storageSet(STORAGE_KEYS.termBanner, true)
    }
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])
  const clear = useCallback(() => setHistory([]), [])

  const run = useCallback(
    (raw) => {
      const prompt = `PS ${cwd}> ${raw}`
      setCommandHistory((h) => [...h, raw])

      const result = processCommand(raw, { cwd })

      if (result.clear) {
        setHistory([])
        return
      }

      const out = [
        { id: nextId(), type: 'prompt', text: prompt },
        ...(result.lines || []).map((line) => ({
          id: nextId(),
          type: line.type || 'plain',
          text: line.text,
        })),
      ]

      setHistory((prev) => [...prev, ...out])

      if (result.cwd) setCwd(result.cwd)
      if (result.openWindow) openWindow(result.openWindow)
      if (result.toggleTheme) toggleTheme()
      if (result.exit) setIsOpen(false)
    },
    [cwd, openWindow, toggleTheme],
  )

  const value = useMemo(
    () => ({
      isOpen,
      cwd,
      history,
      commandHistory,
      toggle,
      open,
      close,
      clear,
      run,
      setIsOpen,
    }),
    [isOpen, cwd, history, commandHistory, toggle, open, close, clear, run],
  )

  return (
    <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>
  )
}

TerminalProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useTerminal() {
  const ctx = useContext(TerminalContext)
  if (!ctx) throw new Error('useTerminal must be used within TerminalProvider')
  return ctx
}
