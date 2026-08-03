import { Window } from '../ui/Window'
import { education } from '../../data/portfolioData'
import { GraduationCap } from 'lucide-react'

export function EducationWindow() {
  return (
    <Window id="education" title="education.md" width={500}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center border border-omarchy-accent/40 text-omarchy-accent">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-mono text-base font-semibold text-omarchy-text">
              {education.degree}
            </h2>
            <p className="text-sm text-omarchy-accent">{education.school}</p>
            <p className="text-xs text-omarchy-dim">{education.location}</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 border-t border-omarchy-border pt-3 font-mono text-xs">
          <div>
            <dt className="text-omarchy-muted">Period</dt>
            <dd className="mt-1 text-omarchy-text">{education.period}</dd>
          </div>
          <div>
            <dt className="text-omarchy-muted">CGPA</dt>
            <dd className="mt-1 text-omarchy-accent">{education.cgpa}</dd>
          </div>
        </dl>
      </div>
    </Window>
  )
}
