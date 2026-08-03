import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  DocumentFolder24Color,
  Briefcase24Color,
  Code24Color,
  Trophy24Color,
  Mail24Color,
  Prompt24Filled,
  HatGraduation24Filled,
  Globe24Color,
  Document24Color,
  PaintBrush24Color,
  Info24Filled,
  Person24Color,
  WindowDevTools24Filled,
  Desktop24Filled,
  Settings24Color,
  ChatMultiple24Filled,
} from '@fluentui/react-icons'
import { profile } from '../../data/portfolioData'

/**
 * Microsoft Fluent UI System Icons on Win12-style tiles.
 * Prefer official Color glyphs; fall back to Filled on accent plates.
 */
export function AppIcon({ id, size = 40, className }) {
  if (id === 'about') {
    return (
      <span
        className={clsx(
          'block overflow-hidden rounded-[22%] shadow-md ring-1 ring-black/10',
          className,
        )}
        style={{ width: size, height: size }}
      >
        <img
          src={profile.photoUrl}
          alt=""
          className="h-full w-full scale-[1.4] object-cover object-[42%_18%]"
          draggable={false}
        />
      </span>
    )
  }

  const meta = TILES[id] || TILES.projects
  const Icon = meta.Icon
  const iconPx = Math.round(size * (meta.colorIcon ? 0.72 : 0.52))

  return (
    <span
      className={clsx(
        'relative grid place-items-center overflow-hidden rounded-[22%] shadow-md ring-1 ring-black/10',
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
    Icon: Desktop24Filled,
    bg: 'linear-gradient(145deg, #B4D6F0 0%, #4A9FE0 100%)',
    glyph: '#0B3A5C',
  },
  settings: {
    Icon: Settings24Color,
    bg: 'linear-gradient(145deg, #E8EAED 0%, #B0B4BA 100%)',
    colorIcon: true,
  },
  edge: {
    Icon: Globe24Color,
    bg: 'linear-gradient(145deg, #C5D8F8 0%, #5B8DEF 100%)',
    colorIcon: true,
  },
  feedback: {
    Icon: ChatMultiple24Filled,
    bg: 'linear-gradient(145deg, #D0BFFF 0%, #7950F2 100%)',
    glyph: '#fff',
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
  terminal: {
    Icon: Prompt24Filled,
    bg: 'linear-gradient(145deg, #3A3A3C 0%, #0C0C0C 100%)',
    glyph: '#3FB950',
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
  'about-win12': {
    Icon: Info24Filled,
    bg: 'linear-gradient(145deg, #A5D8FF 0%, #228BE6 100%)',
    glyph: '#fff',
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
}
