import PropTypes from 'prop-types'
import clsx from 'clsx'

const TYPE_CLASS = {
  plain: 'text-win-text',
  dim: 'text-win-muted',
  accent: 'text-win-accent',
  ok: 'text-win-success',
  error: 'text-win-danger',
  prompt: 'text-win-dim',
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
