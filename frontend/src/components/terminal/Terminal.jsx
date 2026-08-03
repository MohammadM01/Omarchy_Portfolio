import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useTerminal } from '../../contexts/TerminalContext'
import { TerminalLine } from './TerminalLine'
import { useIsMobile } from '../../hooks/useMediaQuery'

export function Terminal() {
  const { isOpen, close, history, run, cwd, commandHistory } = useTerminal()
  const [value, setValue] = useState('')
  const [histIndex, setHistIndex] = useState(-1)
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [isOpen, history])

  const onSubmit = (e) => {
    e.preventDefault()
    const raw = value
    setValue('')
    setHistIndex(-1)
    run(raw)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!commandHistory.length) return
      const next =
        histIndex < 0
          ? commandHistory.length - 1
          : Math.max(0, histIndex - 1)
      setHistIndex(next)
      setValue(commandHistory[next] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIndex < 0) return
      const next = histIndex + 1
      if (next >= commandHistory.length) {
        setHistIndex(-1)
        setValue('')
      } else {
        setHistIndex(next)
        setValue(commandHistory[next] || '')
      }
    } else if (e.key === 'Escape') {
      close()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="pointer-events-auto absolute inset-0 z-[80] flex items-end justify-center p-0 md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Close terminal backdrop"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={close}
          />

          <motion.div
            role="dialog"
            aria-label="Omarchy Terminal"
            initial={{ opacity: 0, y: isMobile ? 40 : 16, scale: isMobile ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full flex-col overflow-hidden border border-omarchy-accent/25 bg-[#100c18]/96 shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_40px_rgba(240,171,252,0.06)] backdrop-blur-[10px] md:h-[min(70vh,560px)] md:max-w-3xl"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex h-9 shrink-0 items-center justify-between border-b border-omarchy-border bg-omarchy-panel/80 px-3">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-omarchy-rose shadow-[0_0_8px_var(--color-omarchy-rose-glow)]" />
                <span className="font-mono text-xs text-omarchy-text">
                  terminal — mohammad@omarchy:{cwd}
                </span>
              </div>
              <button
                type="button"
                aria-label="Close terminal"
                className="grid h-6 w-6 place-items-center text-omarchy-muted hover:text-omarchy-danger"
                onClick={close}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="scrollbar-omarchy flex-1 space-y-0.5 overflow-auto p-3 md:p-4">
              {history.map((line) => (
                <TerminalLine key={line.id} type={line.type} text={line.text} />
              ))}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={onSubmit}
              className="flex shrink-0 items-center gap-2 border-t border-omarchy-border bg-omarchy-bg px-3 py-2.5"
            >
              <span className="shrink-0 font-mono text-[12px] text-omarchy-accent md:text-[13px]">
                mohammad@omarchy:{cwd}$
              </span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-omarchy-text outline-none md:text-[13px]"
                aria-label="Terminal input"
              />
              <span className="h-4 w-2 shrink-0 animate-[cursor-blink_1s_step-end_infinite] bg-omarchy-rose" />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
