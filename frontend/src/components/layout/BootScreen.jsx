import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import PropTypes from 'prop-types'
import { profile } from '../../data/portfolioData'

const STATUS = [
  'Starting Mohammad\'s Portfolio…',
  'Loading profile…',
  'Preparing desktop…',
  'Almost ready…',
]

/** Four panes of /win-logo.svg assemble from corners */
const PANES = [
  { id: 'tl', left: 0, top: 0, ox: -1, oy: -1 },
  { id: 'tr', left: 0.5, top: 0, ox: 1, oy: -1 },
  { id: 'bl', left: 0, top: 0.5, ox: -1, oy: 1 },
  { id: 'br', left: 0.5, top: 0.5, ox: 1, oy: 1 },
]

function BootWinLogo({ reduced, size = 128 }) {
  const half = size / 2
  const travel = size * 0.55

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size + 40, height: size + 40 }}
    >
      {!reduced && (
        <motion.span
          className="pointer-events-none absolute rounded-full"
          style={{
            width: size * 1.7,
            height: size * 1.7,
            background:
              'radial-gradient(circle, rgba(139,124,246,0.22) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0.25, 0.5, 0.3], scale: 1 }}
          transition={{
            opacity: {
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.85,
            },
            scale: { duration: 0.85, delay: 0.7 },
          }}
        />
      )}

      <div
        className="relative drop-shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        style={{ width: size, height: size }}
        aria-hidden
      >
        {PANES.map((p, i) => (
          <motion.div
            key={p.id}
            className="absolute overflow-hidden"
            style={{
              left: p.left * size,
              top: p.top * size,
              width: half,
              height: half,
            }}
            initial={
              reduced
                ? false
                : {
                    opacity: 0,
                    x: p.ox * travel,
                    y: p.oy * travel,
                    scale: 0.55,
                  }
            }
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 20,
              delay: reduced ? 0 : 0.12 + i * 0.13,
            }}
          >
            <img
              src="/win-logo.svg"
              alt=""
              draggable={false}
              width={size}
              height={size}
              className="pointer-events-none max-w-none"
              style={{
                width: size,
                height: size,
                transform: `translate(${-p.left * size}px, ${-p.top * size}px)`,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

BootWinLogo.propTypes = {
  reduced: PropTypes.bool,
  size: PropTypes.number,
}

/** Boot screen — win-logo.svg mark (assembled panes) */
export function BootScreen({ onDone, hold = false }) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const [statusIdx, setStatusIdx] = useState(0)
  const [logoReady, setLogoReady] = useState(false)
  const skipRef = useRef(false)

  const finish = () => {
    if (hold || skipRef.current) return
    skipRef.current = true
    setProgress(100)
    setVisible(false)
    window.setTimeout(() => onDone?.(), reduced ? 180 : 550)
  }

  useEffect(() => {
    const t = window.setTimeout(
      () => setLogoReady(true),
      reduced ? 100 : 1100,
    )
    return () => window.clearTimeout(t)
  }, [reduced])

  useEffect(() => {
    if (!logoReady) return

    const loadMs = reduced ? 800 : 2200
    const start = performance.now()
    let raf
    const freezeAt = hold ? 64 : 100

    const tick = (now) => {
      if (skipRef.current) return
      const t = Math.min(1, (now - start) / loadMs)
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
          window.setTimeout(() => onDone?.(), reduced ? 160 : 500)
        }, reduced ? 100 : 350)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [logoReady, onDone, hold, reduced])

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
          className="boot-screen fixed inset-0 z-[100] overflow-hidden"
          initial={false}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.06,
            filter: reduced ? 'none' : 'blur(10px)',
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Loading Mohammad's Portfolio"
          aria-busy={progress < 100}
        >
          <div className="absolute inset-0 bg-[#05070d]" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(12,48,96,0.5) 0%, transparent 70%), linear-gradient(165deg, #05070d 0%, #0a1422 50%, #05070d 100%)',
            }}
          />
          <div className="boot-grid pointer-events-none absolute inset-0 opacity-[0.1]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
            <BootWinLogo reduced={reduced} size={250} />

            <motion.div
              className="mt-10 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 0.85, duration: 0.45 }}
            >
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-white/50">{profile.title}</p>
            </motion.div>

            <motion.div
              className="mt-10 w-full max-w-[240px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: logoReady ? 1 : 0.25 }}
              transition={{ duration: 0.35 }}
            >
              <div className="boot-progress relative h-[3px] overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#0078D4] via-[#60cdff] to-[#a5d8ff]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p
                className="mt-4 min-h-5 text-center text-xs text-white/45"
                aria-live="polite"
              >
                {STATUS[statusIdx]}
              </p>
            </motion.div>

            {!hold && (
              <motion.button
                type="button"
                onClick={finish}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-10 text-[10px] uppercase tracking-[0.28em] text-white/30 transition-colors hover:text-white/70"
              >
                Skip · Enter
              </motion.button>
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
