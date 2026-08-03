import { Window } from '../ui/Window'
import { skills } from '../../data/portfolioData'

export function SkillsWindow() {
  return (
    <Window id="skills" title="skills.md" width={560}>
      <div className="space-y-5">
        {Object.entries(skills).map(([category, items]) => (
          <section key={category}>
            <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-omarchy-accent">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <span
                  key={skill}
                  className="border border-omarchy-accent/35 bg-omarchy-bg px-2.5 py-1 font-mono text-xs text-omarchy-text transition-colors duration-200 hover:border-omarchy-rose hover:text-omarchy-rose"
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
