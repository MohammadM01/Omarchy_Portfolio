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

const WELCOME_BANNER = [
  { type: 'title', text: "Mohammad's Portfolio" },
  { type: 'plain', text: 'Mohammad Mulla · Software Development Engineer' },
  {
    type: 'dim',
    text: 'Type help · try dir, cd Documents\\Portfolio, type about.txt',
  },
  { type: 'dim', text: '' },
]

function buildBootLines(showBanner) {
  const lines = showBanner
    ? WELCOME_BANNER.map((l) => ({ id: nextId(), ...l }))
    : [
        { id: nextId(), type: 'title', text: "Mohammad's Portfolio" },
        {
          id: nextId(),
          type: 'dim',
          text: 'Terminal ready · type help for commands',
        },
        { id: nextId(), type: 'dim', text: '' },
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
  const { openWindow, focusWindow } = useWindows()
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
    async (raw) => {
      const prompt = `PS ${cwd}> ${raw}`
      setCommandHistory((h) => [...h, raw])

      const result = await processCommand(raw, { cwd })

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
      if (result.toggleTheme) toggleTheme()
      if (result.exit) {
        setIsOpen(false)
        return
      }

      if (result.openWindow) {
        // Terminal overlays at z-80 — close it so the app window can take focus
        setIsOpen(false)
        openWindow(result.openWindow)
        // Ensure focus after open (restores if minimized)
        window.setTimeout(() => focusWindow(result.openWindow), 0)
      }
    },
    [cwd, openWindow, focusWindow, toggleTheme],
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
