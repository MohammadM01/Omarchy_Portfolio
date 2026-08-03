/**
 * Subtle OS sounds via Web Audio API — no external assets.
 */
let ctx

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function tone({ freq = 440, duration = 0.06, type = 'square', gain = 0.03, slideTo }) {
  const audio = getCtx()
  if (!audio) return
  if (audio.state === 'suspended') audio.resume()

  const osc = audio.createOscillator()
  const g = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, audio.currentTime)
  if (slideTo) {
    osc.frequency.exponentialRampToValueAtTime(slideTo, audio.currentTime + duration)
  }
  g.gain.setValueAtTime(gain, audio.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration)
  osc.connect(g)
  g.connect(audio.destination)
  osc.start()
  osc.stop(audio.currentTime + duration + 0.02)
}

export const sounds = {
  click: () => tone({ freq: 620, duration: 0.04, gain: 0.025 }),
  open: () => tone({ freq: 320, duration: 0.08, type: 'triangle', gain: 0.03, slideTo: 520 }),
  close: () => tone({ freq: 480, duration: 0.07, type: 'triangle', gain: 0.025, slideTo: 220 }),
  boot: () => {
    tone({ freq: 180, duration: 0.12, type: 'sawtooth', gain: 0.02 })
    window.setTimeout(() => tone({ freq: 360, duration: 0.1, type: 'square', gain: 0.02 }), 90)
    window.setTimeout(() => tone({ freq: 540, duration: 0.14, type: 'triangle', gain: 0.025 }), 180)
  },
  success: () => {
    tone({ freq: 520, duration: 0.08, type: 'triangle', gain: 0.03 })
    window.setTimeout(() => tone({ freq: 780, duration: 0.1, type: 'triangle', gain: 0.03 }), 70)
  },
  error: () => tone({ freq: 160, duration: 0.14, type: 'sawtooth', gain: 0.03 }),
}
