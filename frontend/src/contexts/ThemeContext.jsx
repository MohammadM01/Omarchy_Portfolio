import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { storageGet, storageSet } from '../utils/storage'
import { STORAGE_KEYS } from '../constants'
import { WALLPAPERS, wallpaperSrc } from '../data/wallpapers'

const ThemeContext = createContext(null)

function applyTheme(theme) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

function normalizeWallpaper(id) {
  return WALLPAPERS.some((w) => w.id === id) ? id : WALLPAPERS[0].id
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = storageGet(STORAGE_KEYS.theme, 'dark')
    return saved === 'light' ? 'light' : 'dark'
  })
  const [wallpaperId, setWallpaperIdState] = useState(() =>
    normalizeWallpaper(storageGet(STORAGE_KEYS.wallpaper, 'classic')),
  )

  useEffect(() => {
    applyTheme(theme)
    storageSet(STORAGE_KEYS.theme, theme)
  }, [theme])

  useEffect(() => {
    storageSet(STORAGE_KEYS.wallpaper, wallpaperId)
  }, [wallpaperId])

  const setTheme = useCallback((next) => {
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      storageSet(STORAGE_KEYS.theme, next)
      return next
    })
  }, [])

  const setWallpaper = useCallback((id) => {
    setWallpaperIdState(normalizeWallpaper(id))
  }, [])

  const wallpaperUrl = useMemo(
    () => wallpaperSrc(wallpaperId, theme),
    [wallpaperId, theme],
  )

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme,
      toggleTheme,
      wallpaperId,
      setWallpaper,
      wallpaperUrl,
      wallpapers: WALLPAPERS,
    }),
    [
      theme,
      setTheme,
      toggleTheme,
      wallpaperId,
      setWallpaper,
      wallpaperUrl,
    ],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
