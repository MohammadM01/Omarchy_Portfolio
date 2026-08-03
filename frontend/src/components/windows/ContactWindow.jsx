import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Window } from '../ui/Window'
import { Button } from '../ui/Button'
import { Input, TextArea } from '../ui/Input'
import { profile } from '../../data/portfolioData'
import { Check, Loader2 } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'
import { useSound } from '../../contexts/SoundContext'
import { API_BASE } from '../../constants'

export function ContactWindow() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { push } = useToast()
  const { play } = useSound()

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email'
    if (!form.message.trim() || form.message.trim().length < 8)
      next.message = 'Message must be at least 8 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      play('error')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Request failed (${res.status})`)
      }
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      play('success')
      push('Message sent successfully', 'success')
      window.setTimeout(() => setSent(false), 3200)
    } catch (err) {
      // Fallback: open mailto if API is down
      const subject = encodeURIComponent(`Portfolio contact from ${form.name}`)
      const body = encodeURIComponent(
        `${form.message}\n\n— ${form.name} <${form.email}>`,
      )
      window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`, '_self')
      play('success')
      push(err.message || 'Opened mail client as fallback', 'accent')
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      window.setTimeout(() => setSent(false), 3200)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Window id="contact" title="Contact" width={480}>
      <div className="mb-4 space-y-1">
        <p className="text-sm text-win-dim">
          Prefer email?{' '}
          <a
            href={`mailto:${profile.email}`}
            className="font-mono text-win-accent hover:underline"
          >
            {profile.email}
          </a>
        </p>
        <p className="font-mono text-[11px] text-win-accent">{profile.availability}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <Input
          id="contact-name"
          label="Name"
          placeholder="Your name"
          value={form.name}
          error={errors.name}
          autoComplete="name"
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          id="contact-email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          error={errors.email}
          autoComplete="email"
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <TextArea
          id="contact-message"
          label="Message"
          placeholder="Write a short message…"
          value={form.message}
          error={errors.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        />
        <Button
          type="submit"
          variant="accent"
          className="inline-flex w-full items-center justify-center gap-2 sm:w-auto"
          disabled={loading}
          aria-busy={loading}
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {loading ? 'Sending…' : 'Send message'}
        </Button>
      </form>

      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 border border-win-success/40 bg-win-success/10 px-3 py-2 font-mono text-xs text-win-success"
            role="status"
          >
            <Check className="h-3.5 w-3.5" />
            Message received — thanks for reaching out.
          </motion.div>
        )}
      </AnimatePresence>
    </Window>
  )
}
