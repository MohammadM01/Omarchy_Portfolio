import PropTypes from 'prop-types'
import clsx from 'clsx'

export function Input({ className, label, id, error, ...props }) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={id}>
      {label && (
        <span className="font-mono text-[11px] uppercase tracking-wider text-omarchy-muted">
          {label}
        </span>
      )}
      <input
        id={id}
        className={clsx(
          'w-full border border-omarchy-border bg-omarchy-bg px-3 py-2 font-sans text-sm text-omarchy-text outline-none transition-colors duration-200 placeholder:text-omarchy-muted focus:border-omarchy-accent',
          error && 'border-omarchy-danger',
          className,
        )}
        {...props}
      />
      {error && (
        <span className="font-mono text-[11px] text-omarchy-danger">{error}</span>
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
        <span className="font-mono text-[11px] uppercase tracking-wider text-omarchy-muted">
          {label}
        </span>
      )}
      <textarea
        id={id}
        className={clsx(
          'min-h-[110px] w-full resize-y border border-omarchy-border bg-omarchy-bg px-3 py-2 font-sans text-sm text-omarchy-text outline-none transition-colors duration-200 placeholder:text-omarchy-muted focus:border-omarchy-accent',
          error && 'border-omarchy-danger',
          className,
        )}
        {...props}
      />
      {error && (
        <span className="font-mono text-[11px] text-omarchy-danger">{error}</span>
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
