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
import { storageSet } from '../utils/storage'
import { STORAGE_KEYS } from '../constants'

const WindowContext = createContext(null)

const TASKBAR = 56
const MIN_W = 360
const MIN_H = 260

function viewportSize() {
  if (typeof window === 'undefined') return { vw: 1280, vh: 800 }
  return { vw: window.innerWidth, vh: window.innerHeight }
}

export function centerPosition(width = 520, height = 420) {
  const { vw, vh } = viewportSize()
  const w = Math.min(width, vw - 32)
  const h = Math.min(height, vh - TASKBAR - 32)
  return {
    x: Math.max(16, Math.round((vw - w) / 2)),
    y: Math.max(16, Math.round((vh - TASKBAR - h) / 2)),
    width: w,
    height: h,
  }
}

const DEFAULT_WINDOWS = {
  welcome: {
    open: true,
    minimized: false,
    maximized: false,
    zIndex: 10,
    ...centerPosition(520, 440),
  },
}

function loadInitial() {
  // Recenter on every fresh load so windows never spawn off-screen / at 0,0
  if (typeof window !== 'undefined') {
    return {
      windows: {
        welcome: {
          open: true,
          minimized: false,
          maximized: false,
          zIndex: 10,
          ...centerPosition(520, 440),
        },
      },
      activeId: 'welcome',
      nextZ: 11,
    }
  }
  return {
    windows: { ...DEFAULT_WINDOWS },
    activeId: 'welcome',
    nextZ: 11,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN': {
      const { id, defaults = {} } = action
      const existing = state.windows[id]
      const zIndex = state.nextZ
      if (existing) {
        const centered = centerPosition(
          existing.width || defaults.width || 520,
          existing.height || defaults.height || 420,
        )
        return {
          ...state,
          activeId: id,
          nextZ: zIndex + 1,
          windows: {
            ...state.windows,
            [id]: {
              ...existing,
              ...centered,
              open: true,
              minimized: false,
              maximized: false,
              zIndex,
            },
          },
        }
      }
      const w = defaults.width ?? 520
      const h = defaults.height ?? 420
      const pos = centerPosition(w, h)
      return {
        ...state,
        activeId: id,
        nextZ: zIndex + 1,
        windows: {
          ...state.windows,
          [id]: {
            open: true,
            minimized: false,
            maximized: false,
            zIndex,
            ...pos,
            ...defaults,
            ...centerPosition(defaults.width ?? w, defaults.height ?? h),
          },
        },
      }
    }
    case 'CLOSE': {
      const id = action.id
      const win = state.windows[id]
      if (!win) return state

      const windows = {
        ...state.windows,
        [id]: { ...win, open: false, minimized: false, maximized: false },
      }

      return {
        ...state,
        activeId: state.activeId === id ? null : state.activeId,
        windows,
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
    case 'MAXIMIZE': {
      const id = action.id
      const win = state.windows[id]
      if (!win) return state
      if (win.maximized) {
        const restore = win._restore || centerPosition(win.width || 520, win.height || 420)
        return {
          ...state,
          activeId: id,
          nextZ: state.nextZ + 1,
          windows: {
            ...state.windows,
            [id]: {
              ...win,
              ...restore,
              maximized: false,
              minimized: false,
              zIndex: state.nextZ,
              _restore: undefined,
            },
          },
        }
      }
      const { vw, vh } = viewportSize()
      return {
        ...state,
        activeId: id,
        nextZ: state.nextZ + 1,
        windows: {
          ...state.windows,
          [id]: {
            ...win,
            _restore: {
              x: win.x,
              y: win.y,
              width: win.width,
              height: win.height,
            },
            maximized: true,
            minimized: false,
            x: 0,
            y: 0,
            width: vw,
            height: Math.max(MIN_H, vh - TASKBAR),
            zIndex: state.nextZ,
          },
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
      if (!win || win.maximized) return state
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: { ...win, x, y },
        },
      }
    }
    case 'RESIZE': {
      const { id, width, height, x, y } = action
      const win = state.windows[id]
      if (!win || win.maximized) return state
      const { vw, vh } = viewportSize()
      const next = {
        ...win,
        width: Math.min(vw - 16, Math.max(MIN_W, width)),
        height: Math.min(vh - TASKBAR - 8, Math.max(MIN_H, height)),
      }
      if (typeof x === 'number') next.x = Math.max(0, x)
      if (typeof y === 'number') next.y = Math.max(0, y)
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: next,
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
  const maximizeWindow = useCallback(
    (id) => dispatch({ type: 'MAXIMIZE', id }),
    [],
  )
  const focusWindow = useCallback((id) => dispatch({ type: 'FOCUS', id }), [])
  const moveWindow = useCallback(
    (id, x, y) => dispatch({ type: 'MOVE', id, x, y }),
    [],
  )
  const resizeWindow = useCallback(
    (id, payload) => dispatch({ type: 'RESIZE', id, ...payload }),
    [],
  )
  const closeActive = useCallback(() => dispatch({ type: 'CLOSE_ACTIVE' }), [])

  const isOpen = useCallback(
    (id) => Boolean(state.windows[id]?.open && !state.windows[id]?.minimized),
    [state.windows],
  )

  const hasVisibleWindow = useMemo(
    () =>
      Object.values(state.windows).some((w) => w?.open && !w?.minimized),
    [state.windows],
  )

  const value = useMemo(
    () => ({
      windows: state.windows,
      activeId: state.activeId,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      moveWindow,
      resizeWindow,
      closeActive,
      isOpen,
      hasVisibleWindow,
      isLoading: (id) => loadingRef.current.has(id),
    }),
    [
      state.windows,
      state.activeId,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      moveWindow,
      resizeWindow,
      closeActive,
      isOpen,
      hasVisibleWindow,
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
