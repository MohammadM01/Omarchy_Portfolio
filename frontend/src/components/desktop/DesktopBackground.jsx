import { useTheme } from '../../contexts/ThemeContext'

/**
 * Desktop scenery — classic CSS mosaic or selected image wallpaper.
 */
export function DesktopBackground() {
  const { wallpaperId, wallpaperUrl, isDark } = useTheme()
  const isClassic = wallpaperId === 'classic' || !wallpaperUrl

  if (isClassic) {
    return (
      <div
        className="desktop-scene pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="desktop-scene__base" />
        <div className="desktop-scene__mesh" />
        <div className="desktop-scene__vignette" />

        <span className="desktop-glow desktop-glow--1" />
        <span className="desktop-glow desktop-glow--2" />
        <span className="desktop-glow desktop-glow--3" />

        <div className="desktop-hero">
          <div className="desktop-hero__grid">
            <span className="desktop-tile desktop-tile--tl" />
            <span className="desktop-tile desktop-tile--tr" />
            <span className="desktop-tile desktop-tile--bl" />
            <span className="desktop-tile desktop-tile--br" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="desktop-scene pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <img
        src={wallpaperUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable={false}
      />
      <div className="desktop-scene__mesh opacity-30" />
      <div
        className="desktop-scene__vignette"
        style={
          isDark
            ? undefined
            : {
                background:
                  'radial-gradient(ellipse 72% 68% at 50% 48%, transparent 40%, rgba(40, 60, 100, 0.1) 100%)',
              }
        }
      />
    </div>
  )
}
