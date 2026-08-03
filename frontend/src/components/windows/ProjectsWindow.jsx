import { Window } from '../ui/Window'
import { Card } from '../ui/Card'
import { projects } from '../../data/portfolioData'
import { useWindows } from '../../contexts/WindowContext'
import { ArrowUpRight } from 'lucide-react'

export function ProjectsWindow() {
  const { openWindow } = useWindows()

  return (
    <Window id="projects" title="Projects" width={640}>
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <p className="text-[11px] text-win-muted">
          {projects.length} projects · click to open
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((project) => (
          <Card
            key={project.id}
            onClick={() => openWindow(`project-${project.id}`)}
            className="group flex flex-col gap-2 overflow-hidden p-0"
          >
            <img
              src={project.image}
              alt=""
              className="h-28 w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
            <div className="flex flex-col gap-2 p-3 pt-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-mono text-sm font-semibold text-win-text group-hover:text-win-accent">
                  {project.name}
                </h3>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-win-muted group-hover:text-win-accent" />
              </div>
              <p className="line-clamp-2 text-xs leading-relaxed text-win-dim">
                {project.subtitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.metrics?.slice(0, 3).map((m, i) => (
                  <span
                    key={m.label}
                    className={`font-mono text-[10px] ${i === 1 ? 'text-win-accent' : 'text-win-accent'}`}
                  >
                    {m.value}
                    <span className="ml-1 text-win-muted">{m.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Window>
  )
}
