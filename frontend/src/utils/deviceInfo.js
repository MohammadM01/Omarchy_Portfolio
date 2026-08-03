/**
 * Detect device class + gather safe browser "system" facts for This PC.
 */
export function detectDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      kind: 'desktop',
      label: 'Desktop PC',
      isMobile: false,
      isTablet: false,
    }
  }

  const ua = navigator.userAgent || ''
  const touch = navigator.maxTouchPoints > 0
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.matchMedia('(max-width: 767px)').matches
  const mid = window.matchMedia('(max-width: 1023px)').matches

  const uaMobile = /Android|iPhone|iPod|Windows Phone|Mobile/i.test(ua)
  const uaTablet = /iPad|Tablet|Android(?!.*Mobile)/i.test(ua)

  const isMobile = uaMobile || (narrow && (touch || coarse))
  const isTablet =
    !isMobile && (uaTablet || (mid && touch && window.innerWidth >= 600))

  let kind = 'desktop'
  let label = 'Desktop PC'
  if (isMobile) {
    kind = 'phone'
    label = 'Phone'
  } else if (isTablet) {
    kind = 'tablet'
    label = 'Tablet'
  }

  return { kind, label, isMobile, isTablet }
}

export function readSystemInfo() {
  const device = detectDevice()
  const nav = typeof navigator !== 'undefined' ? navigator : {}
  const scr = typeof screen !== 'undefined' ? screen : {}

  const cores = nav.hardwareConcurrency || 4
  const memoryGb = nav.deviceMemory || (device.isMobile ? 4 : 8)
  const platform = nav.platform || nav.userAgentData?.platform || 'Unknown'
  const language = nav.language || 'en'
  const online = typeof nav.onLine === 'boolean' ? nav.onLine : true
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  const screenW = scr.width || window?.innerWidth || 1920
  const screenH = scr.height || window?.innerHeight || 1080

  // Synthetic drive capacities — scaled by device class for a real OS feel
  const drives =
    device.kind === 'phone'
      ? [
          {
            id: 'internal',
            name: 'Internal storage',
            letter: null,
            totalGb: 128,
            freeGb: 42.5,
            kind: 'phone',
          },
          {
            id: 'shared',
            name: 'Shared / SD',
            letter: null,
            totalGb: 64,
            freeGb: 51.2,
            kind: 'phone',
          },
        ]
      : device.kind === 'tablet'
        ? [
            {
              id: 'internal',
              name: 'Device storage',
              letter: null,
              totalGb: 256,
              freeGb: 118.4,
              kind: 'tablet',
            },
          ]
        : [
            {
              id: 'c',
              name: 'Local Disk (C:)',
              letter: 'C:',
              totalGb: 143,
              freeGb: 32.6,
              kind: 'disk',
            },
            {
              id: 'd',
              name: 'Local Disk (D:)',
              letter: 'D:',
              totalGb: 216,
              freeGb: 185.3,
              kind: 'disk',
            },
          ]

  return {
    device,
    cores,
    memoryGb,
    platform,
    language,
    online,
    pixelRatio,
    screen: `${screenW} × ${screenH}`,
    viewport:
      typeof window !== 'undefined'
        ? `${window.innerWidth} × ${window.innerHeight}`
        : '—',
    drives,
    browser: guessBrowser(nav.userAgent || ''),
  }
}

function guessBrowser(ua) {
  if (/Edg\//.test(ua)) return 'Microsoft Edge'
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return 'Google Chrome'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari'
  return 'Web Browser'
}
