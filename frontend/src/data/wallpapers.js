/** Wallpaper packs — classic CSS scene + generated dark/light pairs */
export const WALLPAPERS = [
  {
    id: 'classic',
    label: 'Fluent Mosaic',
    hint: 'The original glowing tiles',
    kind: 'css',
    darkPreview:
      'linear-gradient(165deg, #06070c 0%, #101325 48%, #0a0c14 100%)',
    lightPreview:
      'linear-gradient(165deg, #dbe6f7 0%, #eef3fb 50%, #e3ebf8 100%)',
  },
  {
    id: 'aurora',
    label: 'Aurora',
    hint: 'Quiet night skies, soft glow',
    kind: 'image',
    dark: '/wallpapers/wallpaper-aurora-dark.png',
    light: '/wallpapers/wallpaper-aurora-light.png',
  },
  {
    id: 'bloom',
    label: 'Bloom',
    hint: 'Light that feels alive',
    kind: 'image',
    dark: '/wallpapers/wallpaper-bloom-dark.png',
    light: '/wallpapers/wallpaper-bloom-light.png',
  },
  {
    id: 'horizon',
    label: 'Horizon',
    hint: 'A calm line of light',
    kind: 'image',
    dark: '/wallpapers/wallpaper-horizon-dark.png',
    light: '/wallpapers/wallpaper-horizon-light.png',
  },
  {
    id: 'ember',
    label: 'Ember',
    hint: 'Warm reds that feel bold',
    kind: 'image',
    dark: '/wallpapers/wallpaper-ember-dark.png',
    light: '/wallpapers/wallpaper-ember-light.png',
  },
  {
    id: 'moss',
    label: 'Moss',
    hint: 'Fresh greens, easy on the eyes',
    kind: 'image',
    dark: '/wallpapers/wallpaper-moss-dark.png',
    light: '/wallpapers/wallpaper-moss-light.png',
  },
  {
    id: 'solar',
    label: 'Solar',
    hint: 'Golden light, sunny mood',
    kind: 'image',
    dark: '/wallpapers/wallpaper-solar-dark.png',
    light: '/wallpapers/wallpaper-solar-light.png',
  },
]

export function getWallpaperPack(wallpaperId) {
  return WALLPAPERS.find((w) => w.id === wallpaperId) || WALLPAPERS[0]
}

export function wallpaperSrc(wallpaperId, theme) {
  const pack = getWallpaperPack(wallpaperId)
  if (pack.kind === 'css') return null
  return theme === 'light' ? pack.light : pack.dark
}
