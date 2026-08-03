import { WelcomeWindow } from '../windows/WelcomeWindow'
import { AboutWindow } from '../windows/AboutWindow'
import { ExperienceWindow } from '../windows/ExperienceWindow'
import { SkillsWindow } from '../windows/SkillsWindow'
import { ProjectsWindow } from '../windows/ProjectsWindow'
import { ProjectDetailWindow } from '../windows/ProjectDetailWindow'
import { AchievementsWindow } from '../windows/AchievementsWindow'
import { EducationWindow } from '../windows/EducationWindow'
import { GitHubWindow } from '../windows/GitHubWindow'
import { ContactWindow } from '../windows/ContactWindow'
import { Terminal } from '../terminal/Terminal'
import { projects } from '../../data/portfolioData'
import { useWindows } from '../../contexts/WindowContext'
import { DesktopBackground } from './DesktopBackground'
import { ToastHost } from '../ui/ToastHost'

export function Workspace() {
  const { windows } = useWindows()

  return (
    <main className="relative h-full w-full min-h-0 overflow-hidden" aria-label="Desktop workspace">
      <DesktopBackground />

      <div className="absolute inset-0 z-10 overflow-auto md:overflow-hidden">
        <div className="relative min-h-full w-full p-2 pb-4 md:absolute md:inset-0 md:min-h-0 md:p-0">
          <WelcomeWindow />
          <AboutWindow />
          <ExperienceWindow />
          <SkillsWindow />
          <ProjectsWindow />
          {projects.map((p) =>
            windows[`project-${p.id}`]?.open ? (
              <ProjectDetailWindow key={p.id} projectId={p.id} />
            ) : null,
          )}
          <EducationWindow />
          <AchievementsWindow />
          <GitHubWindow />
          <ContactWindow />
        </div>
      </div>

      <Terminal />
      <ToastHost />
    </main>
  )
}
