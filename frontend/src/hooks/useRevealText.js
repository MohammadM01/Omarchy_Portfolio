import { useTypewriter } from './useTypewriter'
import { prefersReducedMotion } from '../utils/storage'

/**
 * Typewriter that instant-fills when the user prefers reduced motion.
 */
export function useRevealText(text, { delay = 80, speed = 12 } = {}) {
  const reduced = prefersReducedMotion()
  const result = useTypewriter(text, {
    active: true,
    speed: reduced ? 0 : speed,
    delay: reduced ? 0 : delay,
  })

  return {
    ...result,
    output: reduced ? text : result.output,
    done: reduced ? true : result.done,
    reduced,
  }
}
