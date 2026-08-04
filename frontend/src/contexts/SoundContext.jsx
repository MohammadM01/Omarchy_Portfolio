import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { sounds } from '../utils/sounds'
import { storageGet, storageSet } from '../utils/storage'

const SoundContext = createContext(null)
const SOUND_KEY = 'win12_sound'

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(() => storageGet(SOUND_KEY, true))

  const play = useCallback(
    (name) => {
      if (!enabled) return
      sounds[name]?.()
    },
    [enabled],
  )

  const toggle = useCallback(() => {
    setEnabled((v) => {
      const next = !v
      storageSet(SOUND_KEY, next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ enabled, setEnabled, toggle, play }),
    [enabled, toggle, play],
  )

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  )
}

SoundProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSound must be used within SoundProvider')
  return ctx
}
