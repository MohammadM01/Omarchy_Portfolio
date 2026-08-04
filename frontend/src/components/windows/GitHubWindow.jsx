import { useEffect, useState } from 'react'
import { Window } from '../ui/Window'
import { profile, projects } from '../../data/portfolioData'
import { ExternalLink, GitCommitHorizontal, Loader2, Star } from 'lucide-react'
import { Button } from '../ui/Button'

const GH_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

function fallbackRepos() {
  return projects.map((p, i) => ({
    id: `local-${p.id}`,
    name: p.name,
    full_name: p.github.replace('https://github.com/', ''),
    html_url: p.github,
    description: p.subtitle,
    language: p.tech?.[0] || 'JavaScript',
    stargazers_count: null,
    updated_at: null,
    _local: true,
    _order: i,
  }))
}

export function GitHubWindow() {
  const [repos, setRepos] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setNotice(null)

      try {
        // Repos + profile are more reliable than /events (often 403 when rate-limited)
        const [userRes, repoRes] = await Promise.all([
          fetch(`https://api.github.com/users/${profile.githubUser}`, {
            headers: GH_HEADERS,
          }),
          fetch(
            `https://api.github.com/users/${profile.githubUser}/repos?sort=updated&per_page=8&type=owner`,
            { headers: GH_HEADERS },
          ),
        ])

        if (userRes.status === 403 || repoRes.status === 403) {
          throw new Error('rate_limited')
        }
        if (!userRes.ok) throw new Error(`user_${userRes.status}`)
        if (!repoRes.ok) throw new Error(`repos_${repoRes.status}`)

        const userData = await userRes.json()
        const repoData = await repoRes.json()
        if (cancelled) return

        setUser(userData)
        setRepos(Array.isArray(repoData) ? repoData.slice(0, 8) : [])
      } catch {
        if (cancelled) return
        setUser({
          login: profile.githubUser,
          public_repos: projects.length,
          followers: null,
          html_url: profile.githubUrl,
        })
        setRepos(fallbackRepos())
        setNotice(
          'Live GitHub feed is temporarily limited. Showing your featured projects instead.',
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Window id="github" title="GitHub" width={620} height={600}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-win-text">
            @{profile.githubUser}
          </p>
          <p className="text-[11px] text-win-muted">
            {user?.public_repos != null
              ? `${user.public_repos} public repos`
              : 'Featured work'}
            {user?.followers != null ? ` · ${user.followers} followers` : ''}
          </p>
        </div>
        <a href={profile.githubUrl} target="_blank" rel="noreferrer">
          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-1"
          >
            Open profile <ExternalLink className="h-3 w-3" />
          </Button>
        </a>
      </div>

      {notice && (
        <p className="mb-3 rounded-lg border border-win-accent/30 bg-win-accent/10 px-3 py-2 text-[12px] text-win-dim">
          {notice}
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-8 text-xs text-win-muted">
          <Loader2 className="h-4 w-4 animate-spin text-win-accent" />
          Loading repositories…
        </div>
      )}

      {!loading && (
        <ul className="space-y-2">
          {repos.map((repo) => (
            <li key={repo.id}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex gap-2 rounded-xl border border-[var(--color-win-border)] bg-[color-mix(in_srgb,var(--color-win-bg)_45%,transparent)] px-3 py-2.5 transition-colors hover:border-win-accent/40 hover:bg-[var(--color-win-hover)]"
              >
                <GitCommitHorizontal className="mt-0.5 h-3.5 w-3.5 shrink-0 text-win-accent" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-win-text">
                    {repo.name}
                  </p>
                  <p className="line-clamp-2 text-[11px] text-win-muted">
                    {repo.description || 'No description'}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-win-muted">
                    {repo.language && <span>{repo.language}</span>}
                    {typeof repo.stargazers_count === 'number' && (
                      <span className="inline-flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5" />
                        {repo.stargazers_count}
                      </span>
                    )}
                    {repo.updated_at && (
                      <span>
                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Window>
  )
}
