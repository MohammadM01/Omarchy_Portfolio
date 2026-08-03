import { Window } from '../ui/Window'
import { useTheme } from '../../contexts/ThemeContext'
import { Moon, Sun, Monitor, Image as ImageIcon } from 'lucide-react'
import clsx from 'clsx'

const THEMES = [
  {
    id: 'light',
    label: 'Light',
    hint: 'Bright & airy',
    Icon: Sun,
  },
  {
    id: 'dark',
    label: 'Dark',
    hint: 'Deep & calm',
    Icon: Moon,
  },
]

function MosaicPreview({ className }) {
  return (
    <span
      className={clsx(
        'grid aspect-square w-full grid-cols-2 gap-[6%]',
        className,
      )}
      aria-hidden
    >
      <span className="aspect-square rounded-[18%] bg-gradient-to-br from-sky-300 to-indigo-400 shadow-sm" />
      <span className="aspect-square rounded-[18%] bg-gradient-to-br from-violet-400 to-pink-300 shadow-sm" />
      <span className="aspect-square rounded-[18%] bg-gradient-to-br from-cyan-400 to-violet-500 shadow-sm" />
      <span className="aspect-square rounded-[18%] bg-gradient-to-br from-pink-400 to-blue-400 shadow-sm" />
    </span>
  )
}

export function PersonalizeWindow() {
  const {
    theme,
    setTheme,
    isDark,
    wallpaperId,
    setWallpaper,
    wallpapers,
  } = useTheme()

  return (
    <Window id="personalize" title="Personalize" width={560} height={640}>
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-win-accent">
            Appearance
          </p>
          <h2 className="mt-1 text-lg font-semibold text-win-text">
            Make it feel like home
          </h2>
          <p className="mt-1 text-sm text-win-muted">
            Pick a theme, then a wallpaper. Dark and light versions stay matched
            for you.
          </p>
        </div>

        <section>
          <p className="mb-2 text-[13px] font-semibold text-win-text">Theme</p>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((t) => {
              const active = theme === t.id
              const pack = wallpapers.find((w) => w.id === wallpaperId)
              const imgSrc =
                pack?.kind === 'image'
                  ? t.id === 'light'
                    ? pack.light
                    : pack.dark
                  : null
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={clsx(
                    'overflow-hidden rounded-2xl border text-left transition-all',
                    active
                      ? 'border-[var(--color-win-accent)] ring-2 ring-[color-mix(in_srgb,var(--color-win-accent)_45%,transparent)]'
                      : 'border-[var(--color-win-border)] hover:border-[var(--color-win-accent)]',
                  )}
                >
                  <span className="relative mx-auto block aspect-square w-full max-w-[140px] overflow-hidden p-3 sm:max-w-none sm:p-4">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt=""
                        className="h-full w-full rounded-xl object-cover"
                        draggable={false}
                      />
                    ) : (
                      <span
                        className="flex h-full w-full items-center justify-center rounded-xl p-[14%]"
                        style={{
                          background:
                            t.id === 'light'
                              ? 'linear-gradient(165deg, #dbe6f7, #eef3fb)'
                              : 'linear-gradient(165deg, #06070c, #101325)',
                        }}
                      >
                        <MosaicPreview />
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-2 px-3 pb-3 pt-1">
                    <t.Icon className="h-4 w-4 text-win-accent" aria-hidden />
                    <span>
                      <span className="block text-sm font-medium text-win-text">
                        {t.label}
                      </span>
                      <span className="block text-[11px] text-win-muted">
                        {t.hint}
                      </span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-win-accent" aria-hidden />
            <p className="text-[13px] font-semibold text-win-text">
              Wallpaper · {isDark ? 'Dark' : 'Light'}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {wallpapers.map((w) => {
              const active = wallpaperId === w.id
              const imgSrc =
                w.kind === 'image' ? (isDark ? w.dark : w.light) : null
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWallpaper(w.id)}
                  className={clsx(
                    'overflow-hidden rounded-xl border text-left transition-all',
                    active
                      ? 'border-[var(--color-win-accent)] ring-2 ring-[color-mix(in_srgb,var(--color-win-accent)_45%,transparent)]'
                      : 'border-[var(--color-win-border)] hover:border-[var(--color-win-accent)]',
                  )}
                >
                  <span className="relative block aspect-square w-full overflow-hidden p-1.5">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt=""
                        className="h-full w-full rounded-lg object-cover"
                        draggable={false}
                      />
                    ) : (
                      <span
                        className="flex h-full w-full items-center justify-center rounded-lg p-[12%]"
                        style={{
                          background: isDark
                            ? 'linear-gradient(165deg, #06070c, #101325)'
                            : 'linear-gradient(165deg, #dbe6f7, #eef3fb)',
                        }}
                      >
                        <MosaicPreview />
                      </span>
                    )}
                  </span>
                  <span className="block px-2 pb-2 pt-0.5">
                    <span className="block truncate text-[12px] font-medium text-win-text">
                      {w.label}
                    </span>
                    <span className="block truncate text-[10px] text-win-muted">
                      {w.hint}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <div className="rounded-2xl border border-[var(--color-win-border)] bg-[color-mix(in_srgb,var(--color-win-bg)_50%,transparent)] px-4 py-3">
          <div className="flex items-start gap-3">
            <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-win-accent" />
            <div>
              <p className="text-sm font-medium text-win-text">Quick tip</p>
              <p className="text-[13px] text-win-muted">
                Right-click the desktop → Personalize anytime. Or flip Light /
                Dark from the taskbar in one click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Window>
  )
}
