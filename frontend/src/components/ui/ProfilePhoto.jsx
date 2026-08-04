import PropTypes from 'prop-types'
import clsx from 'clsx'
import { profile } from '../../data/portfolioData'

const SIZES = {
  sm: 'h-9 w-9',
  md: 'h-14 w-14',
  lg: 'h-24 w-24',
  xl: 'h-36 w-36',
}

/**
 * Profile portrait — centered headshot crop.
 */
export function ProfilePhoto({
  size = 'md',
  className = '',
  rounded = 'full',
  alt,
}) {
  const radius =
    rounded === 'full'
      ? 'rounded-full'
      : rounded === 'xl'
        ? 'rounded-2xl'
        : 'rounded-xl'

  return (
    <div
      className={clsx(
        'relative shrink-0 overflow-hidden bg-[#1a1a1a] shadow-lg ring-2 ring-white/30 dark:ring-white/20',
        SIZES[size] || SIZES.md,
        radius,
        className,
      )}
    >
      <img
        src={profile.photoUrl}
        alt={alt || `${profile.name}, ${profile.title}`}
        width={144}
        height={144}
        loading={size === 'xl' || size === 'lg' ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover object-[50%_18%]"
        draggable={false}
      />
    </div>
  )
}

ProfilePhoto.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  rounded: PropTypes.oneOf(['full', 'xl', 'lg']),
  alt: PropTypes.string,
}
