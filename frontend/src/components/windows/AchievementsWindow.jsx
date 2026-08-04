import { Window } from '../ui/Window'
import { achievements } from '../../data/portfolioData'

export function AchievementsWindow() {
  return (
    <Window id="achievements" title="Achievements" width={640}>
      <ol className="space-y-5">
        {achievements.map((item, index) => (
          <li key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="grid h-7 w-7 place-items-center border border-win-accent/45 font-mono text-xs text-win-accent">
                {index + 1}
              </span>
              {index < achievements.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-win-border" />
              )}
            </div>
            <div className="pb-2">
              <h3 className="font-mono text-sm font-semibold text-win-text">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-win-dim">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Window>
  )
}
