import PropTypes from 'prop-types'
import clsx from 'clsx'

const TYPE_CLASS = {
  plain: 'text-omarchy-text',
  dim: 'text-omarchy-muted',
  accent: 'text-omarchy-accent',
  ok: 'text-omarchy-success',
  error: 'text-omarchy-danger',
  prompt: 'text-omarchy-dim',
}

export function TerminalLine({ type = 'plain', text }) {
  return (
    <div
      className={clsx(
        'whitespace-pre-wrap break-words font-mono text-[12px] leading-5 md:text-[13px]',
        TYPE_CLASS[type] || TYPE_CLASS.plain,
      )}
    >
      {text}
    </div>
  )
}

TerminalLine.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
}
