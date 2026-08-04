import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BootScreen } from './components/layout/BootScreen'
import { Desktop } from './components/layout/Desktop'
import { AppProviders } from './components/layout/AppProviders'
import { easings } from './utils/motion'

function readQueryFlag(name) {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has(name)
}

export default function App() {
  const holdBoot = readQueryFlag('boot')
  // Always start on the loading screen (refresh / new visit)
  const [booted, setBooted] = useState(false)

  const onBootDone = useCallback(() => {
    if (holdBoot) return
    setBooted(true)
  }, [holdBoot])

  const replayBoot = useCallback(() => setBooted(false), [])

  return (
    <AppProviders>
      <AnimatePresence mode="wait">
        {!booted ? (
          <motion.div
            key="boot"
            className="h-full w-full"
            exit={{
              opacity: 0,
              scale: 1.04,
              filter: 'blur(8px)',
            }}
            transition={{ duration: 0.55, ease: easings.out }}
          >
            <BootScreen onDone={onBootDone} hold={holdBoot} />
          </motion.div>
        ) : (
          <motion.div
            key="desktop"
            className="h-full w-full"
            initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.45, ease: easings.out }}
          >
            <Desktop onReplayBoot={replayBoot} />
          </motion.div>
        )}
      </AnimatePresence>
    </AppProviders>
  )
}
