import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import PropTypes from 'prop-types'
import { storageGet, storageSet } from '../utils/storage'
import { STORAGE_KEYS } from '../constants'

const WindowContext = createContext(null)

const DEFAULT_WINDOWS = {
  welcome: { open: true, minimized: false, zIndex: 10, x: 80, y: 56 },
}

function loadInitial() {
  const saved = storageGet(STORAGE_KEYS.windows, null)
  if (saved?.windows && typeof saved.windows === 'object') {
    return {
      windows: saved.windows,
      activeId: saved.activeId || null,
      nextZ: saved.nextZ || 20,
    }
  }
  return {
    windows: { ...DEFAULT_WINDOWS },
    activeId: 'welcome',
    nextZ: 11,
  }
}

function randomOffset(baseX, baseY) {
  const dx = Math.floor(Math.random() * 80) - 20
  const dy = Math.floor(Math.random() * 60) - 10
  return { x: Math.max(24, baseX + dx), y: Math.max(48, baseY + dy) }
}

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN': {
      const { id, defaults = {} } = action
      const existing = state.windows[id]
      const zIndex = state.nextZ
      if (existing) {
        return {
          ...state,
          activeId: id,
          nextZ: zIndex + 1,
          windows: {
            ...state.windows,
            [id]: { ...existing, open: true, minimized: false, zIndex },
          },
        }
      }
      const pos = randomOffset(defaults.x ?? 120, defaults.y ?? 80)
      return {
        ...state,
        activeId: id,
        nextZ: zIndex + 1,
        windows: {
          ...state.windows,
          [id]: {
            open: true,
            minimized: false,
            zIndex,
            ...defaults,
            ...pos,
          },
        },
      }
    }
    case 'CLOSE': {
      const id = action.id
      const win = state.windows[id]
      if (!win) return state
      return {
        ...state,
        activeId: state.activeId === id ? null : state.activeId,
        windows: {
          ...state.windows,
          [id]: { ...win, open: false, minimized: false },
        },
      }
    }
    case 'MINIMIZE': {
      const id = action.id
      const win = state.windows[id]
      if (!win) return state
      return {
        ...state,
        activeId: state.activeId === id ? null : state.activeId,
        windows: {
          ...state.windows,
          [id]: { ...win, minimized: true },
        },
      }
    }
    case 'FOCUS': {
      const id = action.id
      const win = state.windows[id]
      if (!win || !win.open) return state
      const zIndex = state.nextZ
      return {
        ...state,
        activeId: id,
        nextZ: zIndex + 1,
        windows: {
          ...state.windows,
          [id]: { ...win, minimized: false, zIndex },
        },
      }
    }
    case 'MOVE': {
      const { id, x, y } = action
      const win = state.windows[id]
      if (!win) return state
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: { ...win, x, y },
        },
      }
    }
    case 'CLOSE_ACTIVE': {
      if (!state.activeId) return state
      return reducer(state, { type: 'CLOSE', id: state.activeId })
    }
    default:
      return state
  }
}

export function WindowProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial)
  const loadingRef = useRef(new Set())
  const persistTimer = useRef(null)

  useEffect(() => {
    if (persistTimer.current) window.clearTimeout(persistTimer.current)
    persistTimer.current = window.setTimeout(() => {
      storageSet(STORAGE_KEYS.windows, {
        windows: state.windows,
        activeId: state.activeId,
        nextZ: state.nextZ,
      })
    }, 200)
    return () => {
      if (persistTimer.current) window.clearTimeout(persistTimer.current)
    }
  }, [state])

  const openWindow = useCallback((id, defaults) => {
    loadingRef.current.add(id)
    dispatch({ type: 'OPEN', id, defaults })
    window.setTimeout(() => loadingRef.current.delete(id), 180)
  }, [])

  const closeWindow = useCallback((id) => dispatch({ type: 'CLOSE', id }), [])
  const minimizeWindow = useCallback(
    (id) => dispatch({ type: 'MINIMIZE', id }),
    [],
  )
  const focusWindow = useCallback((id) => dispatch({ type: 'FOCUS', id }), [])
  const moveWindow = useCallback(
    (id, x, y) => dispatch({ type: 'MOVE', id, x, y }),
    [],
  )
  const closeActive = useCallback(() => dispatch({ type: 'CLOSE_ACTIVE' }), [])

  const isOpen = useCallback(
    (id) => Boolean(state.windows[id]?.open && !state.windows[id]?.minimized),
    [state.windows],
  )

  const value = useMemo(
    () => ({
      windows: state.windows,
      activeId: state.activeId,
      openWindow,
      closeWindow,
      minimizeWindow,
      focusWindow,
      moveWindow,
      closeActive,
      isOpen,
      isLoading: (id) => loadingRef.current.has(id),
    }),
    [
      state.windows,
      state.activeId,
      openWindow,
      closeWindow,
      minimizeWindow,
      focusWindow,
      moveWindow,
      closeActive,
      isOpen,
    ],
  )

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  )
}

WindowProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useWindows() {
  const ctx = useContext(WindowContext)
  if (!ctx) throw new Error('useWindows must be used within WindowProvider')
  return ctx
}
