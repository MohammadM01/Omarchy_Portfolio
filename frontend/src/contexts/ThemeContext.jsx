import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { themePresets } from '../data/portfolioData'
import { storageGet, storageSet } from '../utils/storage'
import { STORAGE_KEYS } from '../constants'

const ThemeContext = createContext(null)

function applyPreset(preset, mode) {
  const root = document.documentElement
  const isLight = mode === 'light'
  const accent = isLight ? preset.lightAccent : preset.accent
  const accentDim = isLight ? preset.lightAccentDim : preset.accentDim
  const rose = isLight ? preset.lightRose || preset.rose : preset.rose
  const roseDim = isLight ? preset.lightRoseDim || preset.roseDim : preset.roseDim

  root.style.setProperty('--color-omarchy-accent', accent)
  root.style.setProperty('--color-omarchy-accent-dim', accentDim)
  root.style.setProperty('--color-omarchy-accent-glow', preset.glow)
  root.style.setProperty('--color-omarchy-rose', rose)
  root.style.setProperty('--color-omarchy-rose-dim', roseDim)
  root.style.setProperty(
    '--color-omarchy-rose-glow',
    preset.roseGlow || 'rgba(255, 107, 157, 0.45)',
  )
  root.style.setProperty(
    '--color-omarchy-rose-soft',
    `color-mix(in srgb, ${rose} 16%, transparent)`,
  )
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => storageGet(STORAGE_KEYS.theme, 'dark'))
  const [presetId, setPresetId] = useState(() => {
    const saved = storageGet(STORAGE_KEYS.preset, 'violet-rose')
    if (saved === 'violet' || saved === 'cyan') return 'violet-rose'
    return saved
  })
  const [soundEnabled, setSoundEnabled] = useState(() =>
    storageGet(STORAGE_KEYS.sound, false),
  )

  const preset = themePresets.find((p) => p.id === presetId) || themePresets[0]

  useEffect(() => {
    applyPreset(preset, theme)
    storageSet(STORAGE_KEYS.theme, theme)
    storageSet(STORAGE_KEYS.preset, presetId)
  }, [preset, presetId, theme])

  useEffect(() => {
    storageSet(STORAGE_KEYS.sound, soundEnabled)
  }, [soundEnabled])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      presetId,
      preset,
      soundEnabled,
      setTheme,
      setPresetId,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      toggleSound: () => setSoundEnabled((s) => !s),
      setSoundEnabled,
    }),
    [theme, presetId, preset, soundEnabled],
  )

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={`h-full min-h-0 w-full ${theme === 'light' ? 'omarchy-light' : 'omarchy-dark'}`}
        data-theme={theme}
        data-preset={presetId}
      >
        {children}
      </div>
    </ThemeContext.Provider>
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

export function useSound() {
  const { soundEnabled } = useTheme()
  const play = useCallback(
    (name) => {
      if (!soundEnabled) return
      import('../utils/sounds').then((m) => m.sounds[name]?.())
    },
    [soundEnabled],
  )
  return { play, soundEnabled }
}
