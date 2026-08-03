import { Window } from '../ui/Window'
import { experience } from '../../data/portfolioData'

export function ExperienceWindow() {
  return (
    <Window id="experience" title="experience.md" width={540}>
      <div className="space-y-6">
        {experience.map((job) => (
          <article key={job.id} className="relative border-l border-omarchy-border pl-4">
            <span className="absolute -left-[3px] top-1.5 h-1.5 w-1.5 bg-omarchy-accent" />
            <header className="mb-2">
              <h3 className="font-mono text-sm font-semibold text-omarchy-text">
                {job.role}
              </h3>
              <p className="text-sm text-omarchy-accent">
                {job.company}{' '}
                <span className="text-omarchy-muted">({job.location})</span>
              </p>
              <p className="font-mono text-[11px] text-omarchy-muted">{job.period}</p>
            </header>
            <ul className="space-y-2">
              {job.bullets.map((b) => (
                <li key={b} className="text-sm leading-relaxed text-omarchy-dim">
                  <span className="mr-2 font-mono text-omarchy-accent">›</span>
                  {b}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Window>
  )
}
