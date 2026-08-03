import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from '../../contexts/ToastContext'
import clsx from 'clsx'

const TONE = {
  info: 'border-omarchy-border text-omarchy-text',
  success: 'border-omarchy-success/50 text-omarchy-success',
  error: 'border-omarchy-danger/50 text-omarchy-danger',
  accent: 'border-omarchy-accent/40 text-omarchy-accent',
}

export function ToastHost() {
  const { toasts, dismiss } = useToast()

  return (
    <div
      className="pointer-events-none absolute bottom-16 right-3 z-[90] flex w-[min(320px,calc(100%-1.5rem))] flex-col gap-2 md:bottom-4 md:right-4"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            initial={{ opacity: 0, y: 8, x: 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.18 }}
            onClick={() => dismiss(t.id)}
            className={clsx(
              'pointer-events-auto border bg-omarchy-surface/95 px-3 py-2 text-left font-mono text-[11px] shadow-lg backdrop-blur-[10px]',
              TONE[t.tone] || TONE.info,
            )}
          >
            {t.message}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
