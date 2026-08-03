import { useEffect, useState } from 'react'
import { Window } from '../ui/Window'
import { profile } from '../../data/portfolioData'
import { ExternalLink, GitCommitHorizontal, Loader2 } from 'lucide-react'
import { Button } from '../ui/Button'

export function GitHubWindow() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `https://api.github.com/users/${profile.githubUser}/events/public?per_page=12`,
          { headers: { Accept: 'application/vnd.github+json' } },
        )
        if (!res.ok) throw new Error(`GitHub API ${res.status}`)
        const data = await res.json()
        if (!cancelled) {
          setEvents(
            data
              .filter((e) =>
                ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'WatchEvent'].includes(
                  e.type,
                ),
              )
              .slice(0, 8),
          )
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const labelFor = (event) => {
    const repo = event.repo?.name || 'repo'
    if (event.type === 'PushEvent') {
      const n = event.payload?.commits?.length || 0
      return `pushed ${n} commit${n === 1 ? '' : 's'} → ${repo}`
    }
    if (event.type === 'PullRequestEvent') {
      return `${event.payload?.action || 'updated'} PR → ${repo}`
    }
    if (event.type === 'CreateEvent') {
      return `created ${event.payload?.ref_type || 'ref'} → ${repo}`
    }
    return `starred → ${repo}`
  }

  return (
    <Window id="github" title="github — recent activity" width={520}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] text-omarchy-muted">
          @{profile.githubUser} · public events
        </p>
        <a href={profile.githubUrl} target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm" className="inline-flex items-center gap-1">
            Profile <ExternalLink className="h-3 w-3" />
          </Button>
        </a>
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-8 font-mono text-xs text-omarchy-muted">
          <Loader2 className="h-4 w-4 animate-spin text-omarchy-accent" />
          fetching events…
        </div>
      )}

      {error && (
        <div className="border border-omarchy-danger/30 bg-omarchy-danger/5 p-3 font-mono text-xs text-omarchy-danger">
          {error}
          <p className="mt-2 text-omarchy-muted">
            Rate limits apply for unauthenticated requests. Open the profile link instead.
          </p>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <p className="py-6 font-mono text-xs text-omarchy-muted">No recent public events.</p>
      )}

      <ul className="space-y-2">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex gap-2 border border-omarchy-border/80 bg-omarchy-bg/40 px-3 py-2"
          >
            <GitCommitHorizontal className="mt-0.5 h-3.5 w-3.5 shrink-0 text-omarchy-accent" />
            <div className="min-w-0">
              <p className="truncate font-mono text-xs text-omarchy-text">{labelFor(event)}</p>
              <p className="font-mono text-[10px] text-omarchy-muted">
                {new Date(event.created_at).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Window>
  )
}
