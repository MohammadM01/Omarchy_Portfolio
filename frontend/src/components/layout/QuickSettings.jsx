import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import {
  Wifi,
  Bluetooth,
  Plane,
  Moon,
  Sun,
  RadioTower,
  Volume2,
  VolumeX,
  MoreHorizontal,
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useSound } from '../../contexts/SoundContext'
import { storageGet, storageSet } from '../../utils/storage'
import { STORAGE_KEYS } from '../../constants'

const ACTIVE_GRAD = 'linear-gradient(90deg, #C0847B 0%, #3b91d8 100%)'

function Tile({ label, Icon, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1.5">
      <span
        className={clsx(
          'grid h-[52px] w-full place-items-center rounded-xl transition-all',
          active
            ? 'text-white shadow-md'
            : 'bg-white/10 text-white/55 hover:bg-white/15',
        )}
        style={active ? { background: ACTIVE_GRAD } : undefined}
      >
        <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.25 : 1.75} />
      </span>
      <span className="text-center text-[11px] leading-tight text-white/90">
        {label}
      </span>
    </button>
  )
}

Tile.propTypes = {
  label: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
}

export function QuickSettings({ open, onClose, anchorRef }) {
  const { isDark, toggleTheme } = useTheme()
  const { enabled: soundOn, toggle: toggleSound, play } = useSound()
  const [wifi, setWifi] = useState(true)
  const [bt, setBt] = useState(true)
  const [airplane, setAirplane] = useState(false)
  const [hotspot, setHotspot] = useState(false)
  const [brightness, setBrightness] = useState(() =>
    Number(storageGet(STORAGE_KEYS.brightness, 100)),
  )

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (anchorRef?.current?.contains(e.target)) return
      const panel = document.getElementById('quick-settings-panel')
      if (panel && !panel.contains(e.target)) onClose?.()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, anchorRef])

  useEffect(() => {
    storageSet(STORAGE_KEYS.brightness, brightness)
    document.documentElement.style.setProperty(
      '--desktop-brightness',
      String(Math.max(0.4, brightness / 100)),
    )
  }, [brightness])

  const tap = (fn) => {
    play('click')
    fn()
  }

  const brightnessPct = ((brightness - 40) / 60) * 100

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="quick-settings-panel"
          role="dialog"
          aria-label="Quick settings"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.16 }}
          className="pointer-events-auto absolute bottom-[calc(100%+12px)] right-0 z-[80] w-[min(320px,calc(100vw-1.5rem))] overflow-hidden rounded-[18px] border border-white/15 bg-[#1c1c1e]/88 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-[28px]"
        >
          <div className="grid grid-cols-3 gap-2.5">
            <Tile
              label="WLAN"
              Icon={Wifi}
              active={wifi && !airplane}
              onClick={() =>
                tap(() => {
                  if (airplane) setAirplane(false)
                  setWifi((v) => !v)
                })
              }
            />
            <Tile
              label="Bluetooth"
              Icon={Bluetooth}
              active={bt && !airplane}
              onClick={() =>
                tap(() => {
                  if (airplane) setAirplane(false)
                  setBt((v) => !v)
                })
              }
            />
            <Tile
              label="Airplane mode"
              Icon={Plane}
              active={airplane}
              onClick={() =>
                tap(() => {
                  setAirplane((v) => {
                    const next = !v
                    if (next) {
                      setWifi(false)
                      setBt(false)
                      setHotspot(false)
                    } else setWifi(true)
                    return next
                  })
                })
              }
            />
            <Tile
              label="Night mode"
              Icon={isDark ? Moon : Sun}
              active={isDark}
              onClick={() =>
                tap(() => {
                  toggleTheme()
                })
              }
            />
            <Tile
              label="Mobile hotspot"
              Icon={RadioTower}
              active={hotspot && !airplane}
              onClick={() => {
                if (airplane) return
                tap(() => setHotspot((v) => !v))
              }}
            />
            <Tile
              label={soundOn ? 'Sound' : 'Muted'}
              Icon={soundOn ? Volume2 : VolumeX}
              active={soundOn}
              onClick={() => {
                toggleSound()
                if (!soundOn) {
                  window.setTimeout(() => play('click'), 0)
                }
              }}
            />
          </div>

          <div className="mt-4 flex items-center gap-3 px-1">
            <Sun className="h-4 w-4 shrink-0 text-white/70" />
            <input
              type="range"
              min={40}
              max={100}
              value={brightness}
              aria-label="Brightness"
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="qs-brightness h-1.5 w-full cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, #60cdff 0%, #3b91d8 ${brightnessPct}%, rgba(255,255,255,0.18) ${brightnessPct}%, rgba(255,255,255,0.18) 100%)`,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

QuickSettings.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  anchorRef: PropTypes.object,
}

export function QuickSettingsTrigger() {
  const [open, setOpen] = useState(false)
  const { play } = useSound()
  const wrapRef = useRef(null)

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label="Quick settings"
        aria-expanded={open}
        title="Quick settings"
        onClick={() => {
          play('click')
          setOpen((v) => !v)
        }}
        className={clsx(
          'grid h-[39px] w-[39px] place-items-center rounded-2xl text-win-text transition-colors',
          open
            ? 'bg-black/[0.1] dark:bg-white/15'
            : 'hover:bg-black/[0.06] dark:hover:bg-white/[0.08]',
        )}
      >
        <MoreHorizontal className="h-[19px] w-[19px]" strokeWidth={2.25} />
      </button>
      <QuickSettings
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={wrapRef}
      />
    </div>
  )
}
