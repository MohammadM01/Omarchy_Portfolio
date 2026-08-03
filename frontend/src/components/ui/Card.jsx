import PropTypes from 'prop-types'
import clsx from 'clsx'

export function Card({ children, className, onClick }) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick(e)
              }
            }
          : undefined
      }
      className={clsx(
        'border border-omarchy-border bg-omarchy-panel/80 transition-colors duration-200',
        !/\bp-/.test(className || '') && 'p-4',
        onClick &&
          'cursor-pointer hover:border-omarchy-accent/60 hover:bg-omarchy-panel focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-omarchy-accent',
        className,
      )}
    >
      {children}
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
}
