import {
  achievements,
  education,
  experience,
  profile,
  projects,
  skills,
  badges,
} from '../../data/portfolioData'
import { FAQ_ITEMS, GEO, SITE_NAME } from '../../seo/siteConfig'

/**
 * Visually hidden but crawlable / AEO-friendly copy for answer engines.
 * Keeps the Fluent UI intact while exposing real text to parsers.
 */
export function SeoContent() {
  return (
    <div className="seo-content" aria-hidden="false">
      <header>
        <h1>
          {profile.name} — {profile.title} | {SITE_NAME}
        </h1>
        <p>{profile.summary}</p>
        <p>
          Based in {GEO.placename}. {profile.availability}
        </p>
        <p>
          Contact: {profile.email} · {profile.phone} ·{' '}
          <a href={profile.linkedinUrl}>LinkedIn</a> ·{' '}
          <a href={profile.githubUrl}>GitHub</a>
        </p>
      </header>

      <main>
        <section aria-labelledby="seo-about">
          <h2 id="seo-about">About Mohammad Mulla</h2>
          <p>{profile.summaryShort}</p>
          <ul>
            {badges.map((b) => (
              <li key={b.id}>{b.label}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="seo-experience">
          <h2 id="seo-experience">Experience</h2>
          {experience.map((job) => (
            <article key={job.id}>
              <h3>
                {job.role} at {job.company}
              </h3>
              <p>
                {job.location} · {job.period}
              </p>
              <ul>
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section aria-labelledby="seo-skills">
          <h2 id="seo-skills">Skills</h2>
          {Object.entries(skills).map(([group, list]) => (
            <div key={group}>
              <h3>{group}</h3>
              <p>{list.join(', ')}</p>
            </div>
          ))}
        </section>

        <section aria-labelledby="seo-projects">
          <h2 id="seo-projects">Projects</h2>
          {projects.map((p) => (
            <article key={p.id}>
              <h3>{p.name}</h3>
              <p>{p.subtitle}</p>
              <p>{p.description}</p>
              <p>Tech: {p.tech.join(', ')}</p>
              <p>
                {p.github && (
                  <a href={p.github}>Source</a>
                )}
                {p.demo && (
                  <>
                    {' · '}
                    <a href={p.demo}>Live demo</a>
                  </>
                )}
              </p>
            </article>
          ))}
        </section>

        <section aria-labelledby="seo-education">
          <h2 id="seo-education">Education</h2>
          <p>
            {education.degree} — {education.school} ({education.location}).{' '}
            {education.period}. CGPA {education.cgpa}.
          </p>
        </section>

        <section aria-labelledby="seo-awards">
          <h2 id="seo-awards">Achievements</h2>
          <ul>
            {achievements.map((a) => (
              <li key={a.id}>
                <strong>{a.title}</strong> — {a.detail}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="seo-faq">
          <h2 id="seo-faq">Frequently asked questions</h2>
          {FAQ_ITEMS.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
