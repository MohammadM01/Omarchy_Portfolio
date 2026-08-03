import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { profile } from '../../data/portfolioData'

const STATUS = [
  'Initializing workspace…',
  'Loading profile…',
  'Mounting projects…',
  'Almost ready…',
]

/**
 * Clean circular boot — violet → rose ring.
 */
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
    const duration = reduced ? 800 : 3200
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

  const size = 168
  const stroke = 3.5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (progress / 100) * c

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-[#07050c]"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Loading Omarchy"
          aria-busy={progress < 100}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[38%] h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-omarchy-accent/15 blur-[90px]" />
            <div className="absolute left-[62%] top-[58%] h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-omarchy-rose/18 blur-[80px]" />
            <div className="omarchy-noise opacity-[0.06]" />
          </div>

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
            <div className="relative mb-8">
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="-rotate-90"
                aria-hidden
              >
                <defs>
                  <linearGradient id="bootRing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-omarchy-accent)" />
                    <stop offset="100%" stopColor="var(--color-omarchy-rose)" />
                  </linearGradient>
                </defs>
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={stroke}
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke="url(#bootRing)"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={offset}
                  style={{ transition: 'stroke-dashoffset 60ms linear' }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-bold tracking-widest text-omarchy-text">
                  {profile.monogram}
                </span>
                <span className="mt-1 font-mono text-[10px] tabular-nums text-omarchy-rose">
                  {String(progress).padStart(3, '0')}%
                </span>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="omarchy-gradient-text mb-2 font-mono text-sm font-semibold tracking-[0.35em]"
            >
              OMARCHY
            </motion.p>

            <p className="mb-1 font-mono text-xs text-omarchy-dim sm:text-sm">
              {profile.name}
            </p>
            <p className="mb-8 max-w-xs text-center font-mono text-[11px] text-omarchy-muted">
              {profile.title}
            </p>

            <p
              className="min-h-[1.25rem] font-mono text-[11px] text-omarchy-accent"
              aria-live="polite"
            >
              {STATUS[statusIdx]}
            </p>

            <div className="mt-4 h-[2px] w-40 overflow-hidden bg-white/5">
              <div
                className="omarchy-gradient-bar h-full transition-[width] duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            {!hold && (
              <button
                type="button"
                onClick={finish}
                className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-omarchy-muted transition-colors hover:text-omarchy-rose"
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
