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
 * Portrait crop tuned for Formal-pic landscape photo (face near center-left).
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
        alt={alt || profile.name}
        className="h-full w-full scale-[1.35] object-cover object-[42%_18%]"
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
