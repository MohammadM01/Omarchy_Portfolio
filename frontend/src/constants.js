/** App-wide constants */

export const BOOT_STORAGE_KEY = 'hasBooted'

export const STORAGE_KEYS = {
  theme: 'theme',
  preset: 'preset',
  sound: 'sound',
  windows: 'windows',
  termBanner: 'termBanner',
  boot: BOOT_STORAGE_KEY,
}

export const API_BASE = import.meta.env.VITE_API_URL || ''

export const DOCK_MOBILE_IDS = [
  'terminal',
  'about',
  'projects',
  'github',
  'contact',
  'resume',
]
