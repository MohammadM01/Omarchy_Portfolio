import { Window } from '../ui/Window'
import { Button } from '../ui/Button'
import { BadgeList } from '../ui/Badge'
import { ProfilePhoto } from '../ui/ProfilePhoto'
import { TypeCursor } from '../ui/TypeCursor'
import { badges, education, profile } from '../../data/portfolioData'
import { useRevealText } from '../../hooks/useRevealText'
import { ExternalLink, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

export function AboutWindow() {
  const { output, done, reduced } = useRevealText(profile.summaryShort, {
    speed: 8,
    delay: 100,
  })

  return (
    <Window id="about" title="About Me" width={560}>
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <ProfilePhoto size="xl" rounded="xl" className="!h-36 !w-36 shadow-xl" />
          <span className="text-[10px] text-win-muted">Profile</span>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2 className="font-mono text-lg font-semibold text-win-text">
              {profile.name}
            </h2>
            <p className="text-sm text-win-accent">{profile.title}</p>
            <p className="mt-1 font-mono text-[11px] text-win-dim">
              {profile.availability}
            </p>
          </div>

          <BadgeList items={badges} />

          <p className="min-h-[3.5rem] text-sm leading-relaxed text-win-dim">
            {output}
            {!reduced && !done && <TypeCursor />}
          </p>

          <ul className="space-y-1.5 font-mono text-xs text-win-dim">
            <li className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-win-accent" aria-hidden />
              {profile.location}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-win-accent" aria-hidden />
              <a href={`tel:${profile.phone}`} className="hover:text-win-accent">
                {profile.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-win-accent" aria-hidden />
              <a href={`mailto:${profile.email}`} className="hover:text-win-accent">
                {profile.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Linkedin className="h-3.5 w-3.5 text-win-accent" aria-hidden />
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-win-accent"
              >
                {profile.linkedin}
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Github className="h-3.5 w-3.5 text-win-accent" aria-hidden />
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-win-accent"
              >
                {profile.github}
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          </ul>

          <div className="flex flex-wrap gap-2 border-t border-win-border pt-3">
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm">
                Download Resume
              </Button>
            </a>
            <p className="w-full font-mono text-[10px] text-win-muted">
              {education.degree} · CGPA {education.cgpa}
            </p>
          </div>
        </div>
      </div>
    </Window>
  )
}
