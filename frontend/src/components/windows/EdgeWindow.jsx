import { Window } from '../ui/Window'
import { Button } from '../ui/Button'
import { AppIcon } from '../ui/AppIcon'
import { profile } from '../../data/portfolioData'

export function EdgeWindow() {
  return (
    <Window id="edge" title="Microsoft Edge" width={660} height={540}>
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <AppIcon id="edge" size={64} />
        <div>
          <h2 className="text-lg font-semibold text-win-text">Microsoft Edge</h2>
          <p className="mt-1 text-sm text-win-muted">
            Open GitHub, LinkedIn, or this portfolio repo in your browser.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <a href={profile.githubUrl} target="_blank" rel="noreferrer">
            <Button variant="accent" size="sm">
              Open GitHub
            </Button>
          </a>
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              LinkedIn
            </Button>
          </a>
          <a
            href="https://github.com/MohammadM01/Omarchy_Portfolio"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="ghost" size="sm">
              This site’s repo
            </Button>
          </a>
        </div>
      </div>
    </Window>
  )
}
