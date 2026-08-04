import PropTypes from 'prop-types'
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
import { PersonalizeWindow } from '../windows/PersonalizeWindow'
import { ThisPCWindow } from '../windows/ThisPCWindow'
import { EdgeWindow } from '../windows/EdgeWindow'
import { AiAgentWindow } from '../windows/AiAgentWindow'
import { Terminal } from '../terminal/Terminal'
import { projects } from '../../data/portfolioData'
import { useWindows } from '../../contexts/WindowContext'
import { useTerminal } from '../../contexts/TerminalContext'
import { useSound } from '../../contexts/SoundContext'
import { DesktopIcons } from '../desktop/DesktopIcon'
import { DesktopBackground } from '../desktop/DesktopBackground'
import { ToastHost } from '../ui/ToastHost'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'

export function Workspace({ onOpenApp, editMode, refreshKey, onExitEdit }) {
  const { windows, openWindow } = useWindows()
  const { toggle: toggleTerminal, isOpen: termOpen } = useTerminal()
  const { play } = useSound()

  const handleIcon = (id) => {
    play('open')
    if (id === 'terminal') {
      toggleTerminal()
      return
    }
    if (onOpenApp) onOpenApp(id)
    else openWindow(id)
  }

  const dimDesktop =
    termOpen ||
    Object.entries(windows).some(
      ([id, w]) => id !== 'welcome' && w?.open && !w?.minimized,
    )

  return (
    <main
      className="relative h-full w-full min-h-0 overflow-hidden"
      aria-label="Desktop workspace"
    >
      <DesktopBackground />

      <AnimatePresence>
        {dimDesktop && !editMode && (
          <motion.div
            key="desk-dim"
            className="pointer-events-none absolute inset-0 z-[25] bg-black/20 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <DesktopIcons
        onOpen={handleIcon}
        editMode={editMode}
        refreshKey={refreshKey}
      />

      <AnimatePresence>
        {editMode && (
          <motion.div
            key="edit-bar"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="pointer-events-auto absolute left-1/2 top-3 z-[45] flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/20 bg-black/55 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-xl"
          >
            <span>Edit mode: drag icons to rearrange</span>
            <button
              type="button"
              onClick={onExitEdit}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black hover:bg-white"
            >
              <Check className="h-3.5 w-3.5" />
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
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
        <PersonalizeWindow />
        <ThisPCWindow />
        <EdgeWindow />
        <AiAgentWindow />
      </div>

      <Terminal />
      <ToastHost />
    </main>
  )
}

Workspace.propTypes = {
  onOpenApp: PropTypes.func,
  editMode: PropTypes.bool,
  refreshKey: PropTypes.number,
  onExitEdit: PropTypes.func,
}
