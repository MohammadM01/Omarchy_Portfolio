import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * CSS grid + dust motes (violet + soft rose) that gently follow the pointer.
 */
export function DesktopBackground() {
  const canvasRef = useRef(null)
  const pointer = useRef({ x: 0.5, y: 0.5 })
  const particles = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    let raf
    let running = true

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const init = () => {
      const count = Math.min(
        52,
        Math.floor((window.innerWidth * window.innerHeight) / 26000),
      )
      particles.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.28 + 0.05,
        rose: Math.random() > 0.55,
      }))
    }

    const onMove = (e) => {
      pointer.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }

    const tick = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const tx = (pointer.current.x - 0.5) * 18
      const ty = (pointer.current.y - 0.5) * 18

      for (const p of particles.current) {
        p.x += p.vx + tx * 0.002
        p.y += p.vy + ty * 0.002
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.fillStyle = p.rose
          ? `rgba(255,107,157,${p.a + 0.08})`
          : `rgba(196,181,253,${p.a})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    init()
    tick()
    window.addEventListener('resize', () => {
      resize()
      init()
    })
    window.addEventListener('pointermove', onMove)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="omarchy-bg" />
      <div className="omarchy-grid" />
      <div className="omarchy-noise" />
      <motion.div
        className="absolute left-[42%] top-[34%] h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-omarchy-accent/10 blur-3xl"
        animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.06, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[72%] top-[68%] h-[38vmin] w-[38vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-omarchy-rose/20 blur-3xl"
        animate={{ opacity: [0.25, 0.45, 0.25], scale: [1.04, 1, 1.04] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
    </div>
  )
}
