import { useCallback, useState } from 'react'
import { BootScreen } from './components/layout/BootScreen'
import { DesktopShell } from './components/layout/DesktopShell'
import { AppProviders } from './components/layout/AppProviders'
import { storageGet, storageSet } from './utils/storage'
import { BOOT_STORAGE_KEY } from './constants'

function readQueryFlag(name) {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has(name)
}

export default function App() {
  const holdBoot = readQueryFlag('boot')
  const forceBoot = readQueryFlag('replay')

  const [booted, setBooted] = useState(() => {
    if (holdBoot || forceBoot) return false
    return Boolean(storageGet(BOOT_STORAGE_KEY, false))
  })

  const onBootDone = useCallback(() => {
    if (holdBoot) return
    storageSet(BOOT_STORAGE_KEY, true)
    setBooted(true)
  }, [holdBoot])

  const replayBoot = useCallback(() => setBooted(false), [])

  return (
    <AppProviders>
      {!booted && <BootScreen onDone={onBootDone} hold={holdBoot} />}
      {booted && <DesktopShell onReplayBoot={replayBoot} />}
    </AppProviders>
  )
}
