import PropTypes from 'prop-types'
import clsx from 'clsx'

export function Input({ className, label, id, error, ...props }) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={id}>
      {label && (
        <span className="text-[11px] font-medium uppercase tracking-wider text-win-muted">
          {label}
        </span>
      )}
      <input
        id={id}
        className={clsx(
          'w-full rounded-lg border border-win-border bg-win-bg px-3 py-2 font-sans text-sm text-win-text outline-none transition-colors duration-200 placeholder:text-win-muted focus:border-win-accent',
          error && 'border-win-danger',
          className,
        )}
        {...props}
      />
      {error && (
        <span className="text-[11px] text-win-danger">{error}</span>
      )}
    </label>
  )
}

Input.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
}

export function TextArea({ className, label, id, error, ...props }) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={id}>
      {label && (
        <span className="text-[11px] font-medium uppercase tracking-wider text-win-muted">
          {label}
        </span>
      )}
      <textarea
        id={id}
        className={clsx(
          'min-h-[110px] w-full resize-y rounded-lg border border-win-border bg-win-bg px-3 py-2 font-sans text-sm text-win-text outline-none transition-colors duration-200 placeholder:text-win-muted focus:border-win-accent',
          error && 'border-win-danger',
          className,
        )}
        {...props}
      />
      {error && (
        <span className="text-[11px] text-win-danger">{error}</span>
      )}
    </label>
  )
}

TextArea.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
}
