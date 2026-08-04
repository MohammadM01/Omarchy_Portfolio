import PropTypes from 'prop-types'
import clsx from 'clsx'

const TYPE_CLASS = {
  plain: 'text-win-text',
  dim: 'text-win-muted',
  accent: 'text-win-accent',
  title: 'text-win-accent text-[16px] font-semibold tracking-tight md:text-[17px]',
  ok: 'text-win-success',
  error: 'text-win-danger',
  prompt: 'text-win-dim',
}

export function TerminalLine({ type = 'plain', text }) {
  return (
    <div
      className={clsx(
        'whitespace-pre-wrap break-words font-sans text-[13px] leading-6 md:text-[14px]',
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
