import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from '../../contexts/ToastContext'
import clsx from 'clsx'

const TONE = {
  info: 'border-win-border text-win-text',
  success: 'border-win-success/50 text-win-success',
  error: 'border-win-danger/50 text-win-danger',
  accent: 'border-win-accent/40 text-win-accent',
}

export function ToastHost() {
  const { toasts, dismiss } = useToast()

  return (
    <div
      className="pointer-events-none absolute bottom-20 right-3 z-[90] flex w-[min(320px,calc(100%-1.5rem))] flex-col gap-2 md:right-4"
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
              'pointer-events-auto rounded-xl border bg-win-surface/95 px-3 py-2 text-left text-[11px] shadow-lg backdrop-blur-[10px]',
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
