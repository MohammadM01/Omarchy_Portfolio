import { Window } from '../ui/Window'
import { skills } from '../../data/portfolioData'

export function SkillsWindow() {
  return (
    <Window id="skills" title="Skills" width={560}>
      <div className="space-y-5">
        {Object.entries(skills).map(([category, items]) => (
          <section key={category}>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5C2D91]">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-[#5C2D91]/35 bg-win-bg px-2.5 py-1 text-xs text-win-text transition-colors duration-200 hover:border-[#5C2D91] hover:text-[#5C2D91]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Window>
  )
}
