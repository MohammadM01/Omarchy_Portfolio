import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const push = useCallback(
    (message, tone = 'info', ttl = 2800) => {
      let id
      setToasts((t) => {
        // Dedupe identical visible toasts (StrictMode / double fire)
        if (t.some((x) => x.message === message)) return t
        id = ++toastId
        return [...t, { id, message, tone }]
      })
      if (id == null) return null
      window.setTimeout(() => dismiss(id), ttl)
      return id
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss])

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  )
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
