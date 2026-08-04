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
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    website: '',
  })
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
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          website: form.website,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(body.error || `Request failed (${res.status})`)
      }
      setSent(true)
      setForm({ name: '', email: '', message: '', website: '' })
      play('success')
      push('Message sent successfully', 'success')
      window.setTimeout(() => setSent(false), 3200)
    } catch (err) {
      play('error')
      push(err.message || 'Could not send message. Try again later.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Window id="contact" title="Contact" width={580}>
      <div className="mb-4 space-y-1">
        <p className="text-sm text-win-dim">
          Send a message below. I will reply to the email you provide.
        </p>
        <p className="font-mono text-[11px] text-win-accent">{profile.availability}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        {/* Honeypot — hidden from real users */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
          tabIndex={-1}
        >
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            autoComplete="off"
            tabIndex={-1}
            value={form.website}
            onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
          />
        </div>

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
            Message received. Thanks for reaching out.
          </motion.div>
        )}
      </AnimatePresence>
    </Window>
  )
}
