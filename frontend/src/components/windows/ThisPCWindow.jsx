import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  Desktop24Filled,
  Phone24Color,
  Tablet24Filled,
  Star24Filled,
  Cloud24Filled,
  Delete24Filled,
  HardDrive24Filled,
  Search24Regular,
  Folder24Filled,
  Document24Filled,
} from '@fluentui/react-icons'
import { Window } from '../ui/Window'
import { readSystemInfo } from '../../utils/deviceInfo'
import { useWindows } from '../../contexts/WindowContext'
import { profile } from '../../data/portfolioData'

const SIDEBAR = [
  { id: 'quick', label: 'Quick access', Icon: Star24Filled },
  { id: 'cloud', label: 'OneDrive', Icon: Cloud24Filled },
  { id: 'this-pc', label: 'This PC', Icon: Desktop24Filled, active: true },
  { id: 'recycle', label: 'Recycle Bin', Icon: Delete24Filled },
]

const FOLDERS = [
  { id: 'about', label: 'About Me', Icon: Document24Filled },
  { id: 'projects', label: 'Projects', Icon: Folder24Filled },
  { id: 'skills', label: 'Skills', Icon: Folder24Filled },
  { id: 'contact', label: 'Contact', Icon: Document24Filled },
]

function DriveCard({ drive }) {
  const used = Math.max(0, drive.totalGb - drive.freeGb)
  const pct = Math.min(100, Math.round((used / drive.totalGb) * 100))
  const almostFull = pct >= 85

  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--color-win-border)] bg-[color-mix(in_srgb,var(--color-win-bg)_45%,transparent)] px-3 py-3">
      <HardDrive24Filled className="mt-0.5 h-9 w-9 shrink-0 text-win-accent" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-win-text">{drive.name}</p>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className={clsx(
              'h-full rounded-full transition-all',
              almostFull ? 'bg-[#c42b1c]' : 'bg-win-accent',
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 text-[12px] text-win-muted">
          {drive.freeGb.toFixed(1)} GB free of {drive.totalGb} GB
        </p>
      </div>
    </div>
  )
}

DriveCard.propTypes = {
  drive: PropTypes.object.isRequired,
}

export function ThisPCWindow() {
  const { openWindow } = useWindows()
  const info = useMemo(() => readSystemInfo(), [])
  const [query, setQuery] = useState('')
  const { device, drives } = info

  const DeviceIcon =
    device.kind === 'phone'
      ? Phone24Color
      : device.kind === 'tablet'
        ? Tablet24Filled
        : Desktop24Filled

  const filteredFolders = FOLDERS.filter((f) =>
    f.label.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <Window id="this-pc" title="This PC" width={820} height={640}>
      <div className="-m-4 flex h-[min(440px,70vh)] min-h-[320px] flex-col md:-m-5">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-win-border)] px-3 py-2">
          <span className="rounded-lg px-2 py-1 text-[12px] text-win-muted hover:bg-[var(--color-win-hover)]">
            New
          </span>
          <span className="rounded-lg px-2 py-1 text-[12px] text-win-muted">Cut</span>
          <span className="rounded-lg px-2 py-1 text-[12px] text-win-muted">Copy</span>
          <span className="rounded-lg px-2 py-1 text-[12px] text-win-muted">Paste</span>
          <div className="ml-auto flex min-w-[160px] flex-1 items-center gap-2 rounded-full border border-[var(--color-win-border)] bg-[color-mix(in_srgb,var(--color-win-bg)_60%,transparent)] px-3 py-1.5 sm:max-w-[240px]">
            <Search24Regular className="h-4 w-4 shrink-0 text-win-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search This PC"
              className="w-full bg-transparent text-[13px] text-win-text outline-none placeholder:text-win-muted"
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Sidebar — desktop layout */}
          <aside className="hidden w-[168px] shrink-0 flex-col gap-0.5 border-r border-[var(--color-win-border)] p-2 sm:flex">
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-win-muted">
              Pinned
            </p>
            {SIDEBAR.map((item) => (
              <div
                key={item.id}
                className={clsx(
                  'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px]',
                  item.active
                    ? 'bg-win-accent/15 font-medium text-win-accent'
                    : 'text-win-dim',
                )}
              >
                <item.Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </div>
            ))}
            <p className="mt-3 px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-win-muted">
              Labels
            </p>
            <div className="flex flex-wrap gap-1.5 px-2">
              {['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#f97316', '#a855f7', '#ec4899'].map(
                (c) => (
                  <span
                    key={c}
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: c }}
                  />
                ),
              )}
            </div>
          </aside>

          {/* Main */}
          <div className="scrollbar-win min-w-0 flex-1 overflow-y-auto p-3 sm:p-4">
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-[var(--color-win-border)] bg-[color-mix(in_srgb,var(--color-win-bg)_40%,transparent)] px-3 py-3">
              <DeviceIcon
                className="h-10 w-10 shrink-0 text-win-accent"
                style={{ width: 40, height: 40 }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-win-text">
                  Detected · {device.label}
                </p>
                <p className="text-[12px] text-win-muted">
                  {info.browser} · {info.platform} · {info.screen} · {info.cores}{' '}
                  cores
                  {info.memoryGb ? ` · ~${info.memoryGb} GB RAM` : ''}
                </p>
                <p className="mt-0.5 text-[11px] text-win-accent">
                  {info.online ? 'Online' : 'Offline'} · {profile.name}&apos;s
                  portfolio PC
                </p>
              </div>
            </div>

            <p className="mb-2 text-[13px] font-semibold text-win-text">
              {device.kind === 'desktop'
                ? 'Devices and drives'
                : 'Storage on this device'}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {drives.map((d) => (
                <DriveCard key={d.id} drive={d} />
              ))}
            </div>

            <p className="mb-2 mt-5 text-[13px] font-semibold text-win-text">
              Folders
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {filteredFolders.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => openWindow(f.id)}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-transparent px-2 py-3 text-center hover:border-[var(--color-win-border)] hover:bg-[var(--color-win-hover)]"
                >
                  <f.Icon className="h-8 w-8 text-[#f7b500]" />
                  <span className="text-[12px] text-win-text">{f.label}</span>
                </button>
              ))}
              {!filteredFolders.length && (
                <p className="col-span-full text-sm text-win-muted">
                  No folders match “{query}”
                </p>
              )}
            </div>

            {device.isMobile && (
              <p className="mt-4 rounded-xl bg-win-accent/10 px-3 py-2 text-[12px] text-win-dim">
                You are on a phone-sized screen. This PC shows mobile storage
                instead of desktop disks. Use a larger display for the full
                layout.
              </p>
            )}
          </div>
        </div>
      </div>
    </Window>
  )
}
