import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Draggable from 'react-draggable'
import { Minus, X } from 'lucide-react'
import { useTerminal } from '../../contexts/TerminalContext'
import { TerminalLine } from './TerminalLine'
import { useIsMobile } from '../../hooks/useMediaQuery'

export function Terminal() {
  const { isOpen, close, history, run, cwd, commandHistory } = useTerminal()
  const [value, setValue] = useState('')
  const [histIndex, setHistIndex] = useState(-1)
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const nodeRef = useRef(null)
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

  const panel = (
    <motion.div
      ref={nodeRef}
      role="dialog"
      aria-label="Mohammad's Portfolio Terminal"
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28, mass: 0.85 }}
      className="relative z-10 flex h-full w-full flex-col overflow-hidden rounded-[10px] border border-white/10 bg-[#0c0c0c]/96 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md md:h-[min(68vh,540px)] md:w-[min(92vw,720px)]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="term-drag flex h-9 shrink-0 cursor-grab items-center justify-between border-b border-white/10 bg-[#1a1a1a] px-1 active:cursor-grabbing">
        <div className="flex items-center gap-2 pl-2">
          <span className="h-2.5 w-2.5 rounded-full bg-win-accent" />
          <span className="text-xs text-white/90">Terminal · {cwd}</span>
        </div>
        <div className="flex">
          {!isMobile && (
            <button
              type="button"
              aria-label="Minimize terminal"
              className="grid h-9 w-11 place-items-center text-white/50 hover:bg-white/10 hover:text-white"
              onClick={close}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            aria-label="Close terminal"
            className="grid h-9 w-11 place-items-center text-white/50 hover:bg-win-danger hover:text-white"
            onClick={close}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="scrollbar-win flex-1 space-y-0.5 overflow-auto p-3 md:p-4">
        {history.map((line) => (
          <TerminalLine key={line.id} type={line.type} text={line.text} />
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="flex shrink-0 items-center gap-2 border-t border-white/10 bg-[#0c0c0c] px-3 py-2.5"
      >
        <span className="shrink-0 font-sans text-[13px] font-medium text-[#6ccb5f] md:text-[14px]">
          PS {cwd}&gt;
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
          className="min-w-0 flex-1 bg-transparent font-sans text-[13px] text-white outline-none md:text-[14px]"
          aria-label="Terminal input"
        />
        <span className="h-4 w-2 shrink-0 animate-pulse bg-white/80" />
      </form>
    </motion.div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="pointer-events-auto absolute inset-0 z-[80] flex items-center justify-center p-3 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.button
            type="button"
            aria-label="Close terminal backdrop"
            className="absolute inset-0 bg-black/40 backdrop-blur-[8px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {isMobile ? (
            panel
          ) : (
            <Draggable nodeRef={nodeRef} handle=".term-drag" bounds="parent">
              {panel}
            </Draggable>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
