import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'

/**
 * Desktop scenery — classic CSS mosaic or selected image wallpaper.
 */
export function DesktopBackground() {
  const { wallpaperId, wallpaperUrl, isDark } = useTheme()
  const isClassic = wallpaperId === 'classic' || !wallpaperUrl

  if (isClassic) {
    return (
      <motion.div
        key={`classic-${isDark ? 'dark' : 'light'}`}
        className="desktop-scene pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="desktop-scene__base" />
        <div className="desktop-scene__mesh" />
        <div className="desktop-scene__vignette" />

        <span className="desktop-glow desktop-glow--1" />
        <span className="desktop-glow desktop-glow--2" />
        <span className="desktop-glow desktop-glow--3" />

        <div className="desktop-hero select-none">
          <div className="flex flex-col items-center justify-center text-center gap-2.5 font-display px-4">
            <h1 className="desktop-hero-text text-3xl md:text-5xl font-bold tracking-tight transition-colors duration-400">
              Hey, I m Mohammad!
            </h1>
            <p className="desktop-hero-text--sub text-3xl md:text-5xl font-bold tracking-tight transition-colors duration-400">
              Welcome to my Portfolio
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div
      className="desktop-scene pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.img
          key={wallpaperUrl}
          src={wallpaperUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          draggable={false}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        />
      </AnimatePresence>
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

      {/* Hero text on wallpaper — glass pill for readability */}
      <div className="desktop-hero select-none">
        <div
          className="flex flex-col items-center justify-center text-center gap-2.5 font-display px-8 py-5 rounded-2xl"
          style={{
            background: isDark
              ? 'rgba(0,0,0,0.32)'
              : 'rgba(255,255,255,0.28)',
            backdropFilter: 'blur(14px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
            boxShadow: isDark
              ? '0 4px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)'
              : '0 4px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.55)',
            border: isDark
              ? '1px solid rgba(255,255,255,0.09)'
              : '1px solid rgba(255,255,255,0.6)',
          }}
        >
          <h1 className="desktop-hero-text text-3xl md:text-5xl font-bold tracking-tight transition-colors duration-400">
            Hey, I m Mohammad!
          </h1>
          <p className="desktop-hero-text--sub text-3xl md:text-5xl font-bold tracking-tight transition-colors duration-400">
            Welcome to my Portfolio
          </p>
        </div>
      </div>
    </div>
  )
}
