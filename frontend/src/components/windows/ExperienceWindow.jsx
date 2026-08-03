import { Window } from '../ui/Window'
import { experience } from '../../data/portfolioData'

export function ExperienceWindow() {
  return (
    <Window id="experience" title="Experience" width={540}>
      <div className="space-y-6">
        {experience.map((job) => (
          <article key={job.id} className="relative border-l-2 border-[#107C10]/40 pl-4">
            <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[#107C10]" />
            <header className="mb-2">
              <h3 className="text-sm font-semibold text-win-text">
                {job.role}
              </h3>
              <p className="text-sm text-[#107C10]">
                {job.company}{' '}
                <span className="text-win-muted">({job.location})</span>
              </p>
              <p className="font-mono text-[11px] text-win-muted">{job.period}</p>
            </header>
            <ul className="space-y-2">
              {job.bullets.map((b) => (
                <li key={b} className="text-sm leading-relaxed text-win-dim">
                  <span className="mr-2 font-mono text-win-accent">›</span>
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
