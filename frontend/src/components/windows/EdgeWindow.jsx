import { Window } from '../ui/Window'
import { Button } from '../ui/Button'
import { profile } from '../../data/portfolioData'
import { Globe24Color } from '@fluentui/react-icons'

export function EdgeWindow() {
  return (
    <Window id="edge" title="Microsoft Edge" width={560} height={420}>
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <Globe24Color style={{ width: 56, height: 56 }} />
        <div>
          <h2 className="text-lg font-semibold text-win-text">Microsoft Edge</h2>
          <p className="mt-1 text-sm text-win-muted">
            Jump out to the real web — GitHub, LinkedIn, or this portfolio repo.
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
        <p className="max-w-sm text-[12px] text-win-muted">
          Detected browser tabs open outside this desktop — Edge here is a quick
          launcher, just like the Win12 demo.
        </p>
      </div>
    </Window>
  )
}
