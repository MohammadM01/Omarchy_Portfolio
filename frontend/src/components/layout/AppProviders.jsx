import PropTypes from 'prop-types'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { WindowProvider } from '../../contexts/WindowContext'
import { TerminalProvider } from '../../contexts/TerminalContext'
import { ToastProvider } from '../../contexts/ToastContext'

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <WindowProvider>
        <TerminalProvider>
          <ToastProvider>{children}</ToastProvider>
        </TerminalProvider>
      </WindowProvider>
    </ThemeProvider>
  )
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
}
