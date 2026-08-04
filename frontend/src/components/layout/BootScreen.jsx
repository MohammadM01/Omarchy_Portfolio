import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { profile } from '../../data/portfolioData'
import { WinLogo } from '../ui/WinLogo'

const STATUS = [
  'Starting Windows…',
  'Loading profile…',
  'Preparing desktop…',
  'Almost ready…',
]

/** Windows 12–style boot splash */
export function BootScreen({ onDone, hold = false }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const [statusIdx, setStatusIdx] = useState(0)
  const skipRef = useRef(false)

  const finish = () => {
    if (hold) return
    skipRef.current = true
    setProgress(100)
    setVisible(false)
    window.setTimeout(() => onDone?.(), 320)
  }

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduced ? 800 : 2800
    const start = performance.now()
    let raf
    const freezeAt = hold ? 62 : 100

    const tick = (now) => {
      if (skipRef.current) return
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 2.2
      const pct = Math.min(freezeAt, Math.floor(eased * 100))
      setProgress(pct)
      setStatusIdx(Math.min(STATUS.length - 1, Math.floor(t * STATUS.length)))

      if (hold && pct >= freezeAt) return

      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setProgress(100)
        window.setTimeout(() => {
          setVisible(false)
          window.setTimeout(() => onDone?.(), 380)
        }, 280)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone, hold])

  useEffect(() => {
    const onKey = (e) => {
      if (hold) return
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        e.preventDefault()
        finish()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hold, onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-[#0b1a2e]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Loading Windows"
          aria-busy={progress < 100}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[40%] h-[50vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0078D4]/25 blur-[100px]" />
            <div className="absolute left-[70%] top-[70%] h-[35vmin] w-[35vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E3008C]/15 blur-[80px]" />
          </div>

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <WinLogo className="h-24 w-24" glow />
            </motion.div>

            <p className="mb-1 text-lg font-semibold tracking-wide text-white">
              {profile.name}
            </p>
            <p className="mb-10 text-sm text-white/60">{profile.title}</p>

            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#60cdff] transition-[width] duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p
              className="mt-4 min-h-[1.25rem] text-xs text-white/50"
              aria-live="polite"
            >
              {STATUS[statusIdx]}
            </p>

            {!hold && (
              <button
                type="button"
                onClick={finish}
                className="mt-10 text-[10px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white/80"
              >
                Skip · Enter
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

BootScreen.propTypes = {
  onDone: PropTypes.func,
  hold: PropTypes.bool,
}
