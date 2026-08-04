import PropTypes from 'prop-types'
import { Window } from '../ui/Window'
import { Button } from '../ui/Button'
import { TypeCursor } from '../ui/TypeCursor'
import { projects } from '../../data/portfolioData'
import { ExternalLink, Github } from 'lucide-react'
import { useRevealText } from '../../hooks/useRevealText'

export function ProjectDetailWindow({ projectId }) {
  const project = projects.find((p) => p.id === projectId)
  if (!project) return null

  return <ProjectDetailContent project={project} />
}

function ProjectDetailContent({ project }) {
  const { output, done, reduced } = useRevealText(project.description, {
    speed: 10,
    delay: 80,
  })

  return (
    <Window id={`project-${project.id}`} title={project.name} width={660}>
      <div className="space-y-4">
        <img
          src={project.image}
          alt={`${project.name} preview`}
          className="h-40 w-full rounded-lg border border-win-border object-cover"
        />

        <header>
          <p className="font-mono text-[10px] uppercase tracking-wider text-win-muted">
            {project.period}
          </p>
          <h2 className="font-mono text-lg font-semibold text-win-text">
            {project.name}
          </h2>
          <p className="text-sm text-win-accent">{project.subtitle}</p>
        </header>

        {project.metrics?.length > 0 && (
          <div className="grid grid-cols-3 gap-2 border border-win-border bg-win-bg/50 p-2">
            {project.metrics.map((m, i) => (
              <div key={m.label} className="text-center">
                <p
                  className={`font-mono text-sm font-semibold ${i === 1 ? 'text-win-accent' : 'text-win-accent'}`}
                >
                  {m.value}
                </p>
                <p className="font-mono text-[10px] text-win-muted">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        <p className="min-h-[4rem] text-sm leading-relaxed text-win-dim">
          {output}
          {!reduced && !done && <TypeCursor />}
        </p>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-win-muted">
            Tech stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="border border-win-accent/30 px-2 py-1 font-mono text-xs text-win-text"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href={project.github} target="_blank" rel="noreferrer">
            <Button variant="outline" className="inline-flex items-center gap-2">
              <Github className="h-3.5 w-3.5" />
              GitHub
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer">
              <Button variant="accent" className="inline-flex items-center gap-2">
                Live demo
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </Window>
  )
}

ProjectDetailWindow.propTypes = {
  projectId: PropTypes.string.isRequired,
}

ProjectDetailContent.propTypes = {
  project: PropTypes.object.isRequired,
}
