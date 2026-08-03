import { Window } from '../ui/Window'
import { Button } from '../ui/Button'
import { BadgeList } from '../ui/Badge'
import { Monogram } from '../ui/OmarchyMark'
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
    <Window id="about" title="about.md — Profile" width={560}>
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <Monogram value={profile.monogram} size="lg" />
          <span className="font-mono text-[10px] text-omarchy-muted">uid=1000</span>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2 className="font-mono text-lg font-semibold text-omarchy-text">
              {profile.name}
            </h2>
            <p className="text-sm text-omarchy-accent">{profile.title}</p>
            <p className="mt-1 font-mono text-[11px] text-omarchy-dim">
              {profile.availability}
            </p>
          </div>

          <BadgeList items={badges} />

          <p className="min-h-[3.5rem] text-sm leading-relaxed text-omarchy-dim">
            {output}
            {!reduced && !done && <TypeCursor />}
          </p>

          <ul className="space-y-1.5 font-mono text-xs text-omarchy-dim">
            <li className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-omarchy-accent" aria-hidden />
              {profile.location}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-omarchy-accent" aria-hidden />
              <a href={`tel:${profile.phone}`} className="hover:text-omarchy-accent">
                {profile.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-omarchy-accent" aria-hidden />
              <a href={`mailto:${profile.email}`} className="hover:text-omarchy-accent">
                {profile.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Linkedin className="h-3.5 w-3.5 text-omarchy-accent" aria-hidden />
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-omarchy-accent"
              >
                {profile.linkedin}
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Github className="h-3.5 w-3.5 text-omarchy-accent" aria-hidden />
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-omarchy-accent"
              >
                {profile.github}
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          </ul>

          <div className="flex flex-wrap gap-2 border-t border-omarchy-border pt-3">
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm">
                Download Resume
              </Button>
            </a>
            <p className="w-full font-mono text-[10px] text-omarchy-muted">
              {education.degree} · CGPA {education.cgpa}
            </p>
          </div>
        </div>
      </div>
    </Window>
  )
}
