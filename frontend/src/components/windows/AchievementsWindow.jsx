import { Window } from '../ui/Window'
import { achievements } from '../../data/portfolioData'

export function AchievementsWindow() {
  return (
    <Window id="achievements" title="achievements.md" width={540}>
      <ol className="space-y-5">
        {achievements.map((item, index) => (
          <li key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="grid h-7 w-7 place-items-center border border-omarchy-rose/45 font-mono text-xs text-omarchy-rose">
                {index + 1}
              </span>
              {index < achievements.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-omarchy-border" />
              )}
            </div>
            <div className="pb-2">
              <h3 className="font-mono text-sm font-semibold text-omarchy-text">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-omarchy-dim">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Window>
  )
}
