import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from '../../contexts/ToastContext'
import clsx from 'clsx'
import { toastMotion, springs } from '../../utils/motion'

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
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            layout
            {...toastMotion}
            transition={springs.menu}
            onClick={() => dismiss(t.id)}
            className={clsx(
              'pointer-events-auto relative overflow-hidden rounded-xl border bg-win-surface/95 px-3 py-2.5 text-left text-[11px] shadow-lg backdrop-blur-[10px]',
              TONE[t.tone] || TONE.info,
            )}
          >
            {t.message}
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 bg-current opacity-40"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{
                duration: Math.max(1.2, (t.ttl || 3200) / 1000),
                ease: 'linear',
              }}
              aria-hidden
            />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
