import { useId } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  DocumentFolder24Color,
  Briefcase24Color,
  Code24Color,
  Trophy24Color,
  Mail24Color,
  HatGraduation24Filled,
  Globe24Color,
  Document24Color,
  PaintBrush24Color,
  Person24Color,
  WindowDevTools24Filled,
  Laptop24Color,
  Settings24Color,
  ChatMultiple24Color,
  Desktop24Filled,
} from '@fluentui/react-icons'
import { profile } from '../../data/portfolioData'

/** Inline Edge mark — avoids broken external SVG loads */
function EdgeMark({ size }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden
      className="drop-shadow-sm"
    >
      <circle cx="24" cy="24" r="22" fill="#0B78D0" />
      <path
        fill="#fff"
        d="M38.2 18.4c-1.2-4.6-5.2-8.4-10.4-9.4 4.8 2.2 7.8 6.4 8.2 11.2-3.8-5.6-10.2-7.4-16.2-5.8C13.2 16.4 9 22.2 9 28.8c0 7.2 5.6 13 13.2 13.6 6.2.4 11.8-3 14.2-8.4-4.6 3.2-10.8 2.6-14.6-1.2 5.8.2 10.4-2.2 13-6.6 1.4-2.4 2.2-5.2 2.4-8z"
      />
      <path
        fill="#8CD0FF"
        opacity="0.9"
        d="M22.4 14c5.2-1.4 10.4.2 13.6 4.2-1.6-4.2-5.6-7.2-10.4-7.6-6.6-.6-12.4 3.6-14 9.8 1.6-3.8 5.4-6.6 10.8-6.4z"
      />
    </svg>
  )
}

EdgeMark.propTypes = { size: PropTypes.number }

/** Inline This PC monitor mark */
function ThisPCMark({ size }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-screen`} x1="11" y1="13" x2="37" y2="29">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <rect x="6" y="8" width="36" height="26" rx="3" fill="#60A5FA" />
      <rect x="9" y="11" width="30" height="20" rx="1.5" fill="#0F172A" />
      <rect
        x="11"
        y="13"
        width="26"
        height="16"
        rx="1"
        fill={`url(#${uid}-screen)`}
      />
      <rect x="20" y="34" width="8" height="3" rx="0.5" fill="#94A3B8" />
      <rect x="14" y="37" width="20" height="3" rx="1" fill="#CBD5E1" />
    </svg>
  )
}

ThisPCMark.propTypes = { size: PropTypes.number }

/** Original __ Ai brand mark — underscore bars + luminous core */
function AiMark({ size }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-tile`} x1="6" y1="4" x2="42" y2="44">
          <stop stopColor="#1E1B4B" />
          <stop offset="0.55" stopColor="#312E81" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
        <radialGradient id={`${uid}-core`} cx="50%" cy="42%" r="55%">
          <stop stopColor="#E0E7FF" />
          <stop offset="0.35" stopColor="#A5B4FC" />
          <stop offset="0.7" stopColor="#6366F1" />
          <stop offset="1" stopColor="#4F46E5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-bar`} x1="12" y1="0" x2="36" y2="0">
          <stop stopColor="#67E8F9" />
          <stop offset="0.5" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#F0ABFC" />
        </linearGradient>
        <filter id={`${uid}-soft`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="4" y="4" width="40" height="40" rx="12" fill={`url(#${uid}-tile)`} />
      <rect
        x="4.75"
        y="4.75"
        width="38.5"
        height="38.5"
        rx="11.2"
        fill="none"
        stroke="url(#${uid}-bar)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* Soft AI core */}
      <circle
        cx="24"
        cy="20"
        r="9"
        fill={`url(#${uid}-core)`}
        filter={`url(#${uid}-soft)`}
      />
      <circle cx="24" cy="20" r="3.4" fill="#F8FAFC" />
      <circle cx="22.6" cy="18.8" r="1.1" fill="#fff" opacity="0.85" />

      {/* Double underscore — brand cue */}
      <rect
        x="13"
        y="33"
        width="9"
        height="2.6"
        rx="1.3"
        fill={`url(#${uid}-bar)`}
      />
      <rect
        x="26"
        y="33"
        width="9"
        height="2.6"
        rx="1.3"
        fill={`url(#${uid}-bar)`}
      />
    </svg>
  )
}

AiMark.propTypes = { size: PropTypes.number }

/** Modern terminal mark — prompt + cursor */
function TerminalMark({ size }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="6" y1="4" x2="42" y2="44">
          <stop stopColor="#2D2D30" />
          <stop offset="1" stopColor="#0C0C0C" />
        </linearGradient>
        <linearGradient id={`${uid}-glow`} x1="12" y1="16" x2="36" y2="34">
          <stop stopColor="#3FB950" />
          <stop offset="1" stopColor="#56D364" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="10" fill={`url(#${uid}-bg)`} />
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx="10"
        fill="none"
        stroke="#3FB950"
        strokeOpacity="0.22"
        strokeWidth="1.25"
      />
      {/* chevron > */}
      <path
        d="M15 17.5 L23 24 L15 30.5"
        fill="none"
        stroke={`url(#${uid}-glow)`}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* underscore cursor */}
      <rect x="26" y="28.5" width="10" height="3.2" rx="1.2" fill={`url(#${uid}-glow)`} />
    </svg>
  )
}

TerminalMark.propTypes = { size: PropTypes.number }

/**
 * App icons — Fluent Color glyphs + reliable inline OS marks.
 * Globally rendered 2% smaller than requested (text elsewhere unchanged).
 */
export function AppIcon({ id, size: sizeProp = 40, className }) {
  const size = Math.max(1, Math.round(sizeProp * 0.98))

  if (id === 'ai') {
    return (
      <span
        className={clsx(
          'grid aspect-square place-items-center overflow-hidden rounded-[22%] shadow-md ring-1 ring-black/10',
          className,
        )}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <AiMark size={size} />
      </span>
    )
  }

  if (id === 'terminal') {
    return (
      <span
        className={clsx(
          'grid aspect-square place-items-center overflow-hidden rounded-[22%] shadow-md ring-1 ring-black/10',
          className,
        )}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <TerminalMark size={size} />
      </span>
    )
  }

  if (id === 'about') {
    return (
      <span
        className={clsx(
          'block aspect-square overflow-hidden rounded-[22%] shadow-md ring-1 ring-black/10',
          className,
        )}
        style={{ width: size, height: size }}
      >
        <img
          src={profile.photoUrl}
          alt=""
          className="h-full w-full object-cover object-[50%_18%]"
          draggable={false}
        />
      </span>
    )
  }

  if (id === 'edge') {
    return (
      <span
        className={clsx(
          'grid aspect-square place-items-center overflow-hidden rounded-[22%] bg-white shadow-md ring-1 ring-black/10 dark:bg-[#1f1f22]',
          className,
        )}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <EdgeMark size={Math.round(size * 0.78)} />
      </span>
    )
  }

  if (id === 'this-pc') {
    return (
      <span
        className={clsx(
          'grid aspect-square place-items-center overflow-hidden rounded-[22%] bg-gradient-to-br from-[#E8F1FB] to-[#B4D6F0] shadow-md ring-1 ring-black/10',
          className,
        )}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <ThisPCMark size={Math.round(size * 0.82)} />
      </span>
    )
  }

  const meta = TILES[id] || TILES.projects
  const Icon = meta.Icon
  const iconPx = Math.round(size * (meta.colorIcon ? 0.78 : 0.55))

  return (
    <span
      className={clsx(
        'relative grid aspect-square place-items-center overflow-hidden rounded-[22%] shadow-md ring-1 ring-black/10',
        className,
      )}
      style={{
        width: size,
        height: size,
        background: meta.bg,
      }}
      aria-hidden
    >
      <Icon
        style={{
          width: iconPx,
          height: iconPx,
          color: meta.glyph || '#fff',
        }}
      />
    </span>
  )
}

AppIcon.propTypes = {
  id: PropTypes.string.isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
}

const TILES = {
  'this-pc': {
    Icon: Laptop24Color,
    bg: 'linear-gradient(145deg, #E8F1FB 0%, #C5D8F0 100%)',
    colorIcon: true,
  },
  settings: {
    Icon: Settings24Color,
    bg: 'linear-gradient(145deg, #F3F4F6 0%, #D1D5DB 100%)',
    colorIcon: true,
  },
  feedback: {
    Icon: ChatMultiple24Color,
    bg: 'linear-gradient(145deg, #EDE4FF 0%, #D0BFFF 100%)',
    colorIcon: true,
  },
  projects: {
    Icon: DocumentFolder24Color,
    bg: 'linear-gradient(145deg, #E8F4FC 0%, #B4D6F0 100%)',
    colorIcon: true,
  },
  experience: {
    Icon: Briefcase24Color,
    bg: 'linear-gradient(145deg, #E5F6E8 0%, #A8DDB5 100%)',
    colorIcon: true,
  },
  skills: {
    Icon: Code24Color,
    bg: 'linear-gradient(145deg, #EDE4FF 0%, #C5B3F5 100%)',
    colorIcon: true,
  },
  achievements: {
    Icon: Trophy24Color,
    bg: 'linear-gradient(145deg, #FFF0D6 0%, #FFC978 100%)',
    colorIcon: true,
  },
  contact: {
    Icon: Mail24Color,
    bg: 'linear-gradient(145deg, #DCEBFF 0%, #8EC8F6 100%)',
    colorIcon: true,
  },
  education: {
    Icon: HatGraduation24Filled,
    bg: 'linear-gradient(145deg, #B197FC 0%, #7950F2 100%)',
    glyph: '#fff',
  },
  github: {
    Icon: Globe24Color,
    bg: 'linear-gradient(145deg, #E8EAED 0%, #9AA0A6 100%)',
    colorIcon: true,
  },
  welcome: {
    Icon: Document24Color,
    bg: 'linear-gradient(145deg, #D0EBFF 0%, #74C0FC 100%)',
    colorIcon: true,
  },
  personalize: {
    Icon: PaintBrush24Color,
    bg: 'linear-gradient(145deg, #FFE3E3 0%, #FFA8A8 100%)',
    colorIcon: true,
  },
  person: {
    Icon: Person24Color,
    bg: 'linear-gradient(145deg, #D0EBFF 0%, #74C0FC 100%)',
    colorIcon: true,
  },
  tools: {
    Icon: WindowDevTools24Filled,
    bg: 'linear-gradient(145deg, #495057 0%, #212529 100%)',
    glyph: '#fff',
  },
  desktop: {
    Icon: Desktop24Filled,
    bg: 'linear-gradient(145deg, #E8F1FB 0%, #B4D6F0 100%)',
    glyph: '#1e3a5f',
  },
}
