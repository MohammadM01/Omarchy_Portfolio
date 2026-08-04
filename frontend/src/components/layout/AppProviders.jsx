import PropTypes from 'prop-types'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { SoundProvider } from '../../contexts/SoundContext'
import { WindowProvider } from '../../contexts/WindowContext'
import { TerminalProvider } from '../../contexts/TerminalContext'
import { ToastProvider } from '../../contexts/ToastContext'

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <SoundProvider>
        <WindowProvider>
          <TerminalProvider>
            <ToastProvider>{children}</ToastProvider>
          </TerminalProvider>
        </WindowProvider>
      </SoundProvider>
    </ThemeProvider>
  )
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
}
