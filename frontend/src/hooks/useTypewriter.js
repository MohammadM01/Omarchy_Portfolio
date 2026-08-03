import { useEffect, useState } from 'react'

/**
 * Typewriter reveal for a string when `active` becomes true.
 * @param {string} text
 * @param {{ active?: boolean, speed?: number, delay?: number }} options
 */
export function useTypewriter(text, { active = true, speed = 12, delay = 80 } = {}) {
  const [output, setOutput] = useState(speed === 0 ? text : '')
  const [done, setDone] = useState(speed === 0)

  useEffect(() => {
    if (!active) {
      setOutput('')
      setDone(false)
      return undefined
    }

    if (speed === 0) {
      setOutput(text)
      setDone(true)
      return undefined
    }

    setOutput('')
    setDone(false)
    let i = 0
    let intervalId

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        i += 1
        setOutput(text.slice(0, i))
        if (i >= text.length) {
          window.clearInterval(intervalId)
          setDone(true)
        }
      }, speed)
    }, delay)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [text, active, speed, delay])

  return { output, done }
}
