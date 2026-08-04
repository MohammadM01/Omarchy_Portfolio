import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Window } from '../ui/Window'
import { AppIcon } from '../ui/AppIcon'
import {
  achievements,
  education,
  experience,
  profile,
  projects,
  skills,
  badges,
} from '../../data/portfolioData'

function replyTo(raw) {
  const q = raw.toLowerCase().trim()
  if (!q) return 'Ask me anything about Mohammad — skills, projects, experience, or how to reach him.'

  if (/^(hi|hello|hey|yo)\b/.test(q)) {
    return `Hey — I'm Resume Agent, Mohammad's portfolio copilot. Ask about his projects, skills, hackathons, or how to contact him.`
  }

  if (/who (are you|is resume agent)|what (are you|is resume agent)/.test(q)) {
    return `Resume Agent is a lightweight assistant built into Mohammad's Portfolio. I answer from his resume data — no cloud required.`
  }

  if (/who is mohammad|about( me| him)?|tell me about|summary|bio/.test(q)) {
    return `${profile.name} is a ${profile.title} based in ${profile.location}. ${profile.summaryShort}`
  }

  if (/contact|email|phone|reach|hire|linkedin/.test(q)) {
    return `Reach Mohammad at ${profile.email} · ${profile.phone}. LinkedIn: ${profile.linkedinUrl}. Or open the Contact window from Start.`
  }

  if (/skill|tech|stack|know|language|framework/.test(q)) {
    return Object.entries(skills)
      .map(([g, list]) => `${g}: ${list.join(', ')}`)
      .join('\n')
  }

  if (/project|built|cryptguard|chaincred|civic/.test(q)) {
    const hit = projects.find((p) => q.includes(p.id) || q.includes(p.name.toLowerCase()))
    if (hit) {
      return `${hit.name} — ${hit.subtitle}\n${hit.description}\nTech: ${hit.tech.join(', ')}${hit.demo ? `\nDemo: ${hit.demo}` : ''}`
    }
    return projects.map((p) => `• ${p.name}: ${p.subtitle}`).join('\n')
  }

  if (/experience|intern|work|job|datamatex|company/.test(q)) {
    return experience
      .map(
        (e) =>
          `${e.role} @ ${e.company} (${e.period}, ${e.location})\n${e.bullets.map((b) => `  – ${b}`).join('\n')}`,
      )
      .join('\n\n')
  }

  if (/educat|college|degree|school|cgpa|b\.?tech/.test(q)) {
    return `${education.degree} — ${education.school} (${education.location}). ${education.period}. CGPA ${education.cgpa}.`
  }

  if (/award|hackathon|achiev|bnb|sih|runner/.test(q)) {
    return [...badges.map((b) => `• ${b.label}`), ...achievements.map((a) => `• ${a.title}: ${a.detail}`)].join(
      '\n',
    )
  }

  if (/open to work|available|hiring|looking|role|sde/.test(q)) {
    return profile.availability
  }

  if (/resume|cv|pdf/.test(q)) {
    return `Resume PDF: ${profile.resumeUrl} — also available from About Me.`
  }

  if (/github/.test(q)) {
    return `GitHub: ${profile.githubUrl}`
  }

  if (/help|what can you|commands/.test(q)) {
    return `Try asking:\n• Who is Mohammad?\n• What are his skills?\n• Tell me about CryptGuard / ChainCred / Civic Eye\n• Show experience / education / awards\n• How do I contact him?`
  }

  return `I'm not sure about that yet. Try skills, projects, experience, awards, or contact — or say "help".`
}

const STARTERS = [
  'Who is Mohammad?',
  'Show projects',
  'What skills does he have?',
  'How do I contact him?',
]

export function AiAgentWindow() {
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [chatId, setChatId] = useState(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: `Hi — I'm Resume Agent. Ask me anything about ${profile.name}'s work, stack, or how to get in touch.`,
    },
  ])
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    // Fetch a new chat ID on mount
    fetch('http://127.0.0.1:8000/new-chat')
      .then((res) => res.json())
      .then((data) => setChatId(data.chat_id))
      .catch((err) => {
        console.error('Failed to start a new chat session:', err)
        // Fallback to client-generated UUID if endpoint fails
        setChatId(crypto.randomUUID())
      })
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  const send = async (text) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed || busy) return

    const userMsg = { id: Date.now(), role: 'user', text: trimmed }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setBusy(true)

    // Ensure we have a chatId
    const activeChatId = chatId || crypto.randomUUID()
    if (!chatId) setChatId(activeChatId)

    // Create placeholder for the streaming response
    const streamingId = Date.now() + 1
    setMessages((m) => [...m, { id: streamingId, role: 'assistant', text: '' }])

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/chat?chat_id=${activeChatId}&question=${encodeURIComponent(trimmed)}`
      )

      if (!response.ok) {
        throw new Error('Network error or invalid response')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let botText = ''

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunk = decoder.decode(value, { stream: !done })
        if (chunk) {
          botText += chunk
          setMessages((m) =>
            m.map((msg) =>
              msg.id === streamingId ? { ...msg, text: botText } : msg
            )
          )
        }
      }
    } catch (err) {
      console.error(err)
      // Fallback to local reply if backend is offline / errors
      const fallbackAnswer = replyTo(trimmed)
      setMessages((m) =>
        m.map((msg) =>
          msg.id === streamingId
            ? {
                ...msg,
                text: `${fallbackAnswer}\n\n*(Note: Groq LLM backend was offline, showing local fallback)*`,
              }
            : msg
        )
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Window id="ai" title="Resume Agent" accent="#7C3AED">
      <div className="flex h-full min-h-0 flex-col bg-gradient-to-b from-[#0b0b12] to-[#12121a] text-white">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <AppIcon id="ai" size={32} />
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight">Resume Agent</p>
            <p className="text-[11px] text-white/45">Portfolio copilot · local answers</p>
          </div>
        </div>

        <div className="scrollbar-win flex-1 space-y-3 overflow-auto px-4 py-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              }
            >
              <div
                className={
                  msg.role === 'user'
                    ? 'max-w-[85%] rounded-2xl rounded-br-md bg-[#3B82F6] px-3.5 py-2 text-[13px] leading-relaxed text-white'
                    : 'max-w-[90%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[13px] leading-relaxed text-white/90 whitespace-pre-wrap'
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[12px] text-white/50">
                Resume Agent is thinking…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-3 pt-2">
          {STARTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/60 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          className="flex items-center gap-2 p-3"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Resume Agent…"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-[13px] text-white outline-none placeholder:text-white/35 focus:border-violet-400/50"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.94 }}
            disabled={busy || !input.trim()}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#6366F1] text-white shadow-md disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </form>
      </div>
    </Window>
  )
}
