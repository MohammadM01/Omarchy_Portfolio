/** Wallpaper packs: classic CSS scene + image pairs */
export const WALLPAPERS = [
  {
    id: 'classic',
    label: 'Fluent Mosaic',
    hint: 'Original desktop tiles',
    kind: 'css',
    darkPreview:
      'linear-gradient(165deg, #06070c 0%, #101325 48%, #0a0c14 100%)',
    lightPreview:
      'linear-gradient(165deg, #dbe6f7 0%, #eef3fb 50%, #e3ebf8 100%)',
  },
  {
    id: 'aurora',
    label: 'Aurora',
    hint: 'Blue and purple glow',
    kind: 'image',
    dark: '/wallpapers/wallpaper-aurora-dark.png',
    light: '/wallpapers/wallpaper-aurora-light.png',
  },
  {
    id: 'bloom',
    label: 'Bloom',
    hint: 'Soft light orbs',
    kind: 'image',
    dark: '/wallpapers/wallpaper-bloom-dark.png',
    light: '/wallpapers/wallpaper-bloom-light.png',
  },
  {
    id: 'horizon',
    label: 'Horizon',
    hint: 'Wide light band',
    kind: 'image',
    dark: '/wallpapers/wallpaper-horizon-dark.png',
    light: '/wallpapers/wallpaper-horizon-light.png',
  },
  {
    id: 'ember',
    label: 'Ember',
    hint: 'Red tones',
    kind: 'image',
    dark: '/wallpapers/wallpaper-ember-dark.png',
    light: '/wallpapers/wallpaper-ember-light.png',
  },
  {
    id: 'moss',
    label: 'Moss',
    hint: 'Green tones',
    kind: 'image',
    dark: '/wallpapers/wallpaper-moss-dark.png',
    light: '/wallpapers/wallpaper-moss-light.png',
  },
  {
    id: 'solar',
    label: 'Solar',
    hint: 'Gold tones',
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
