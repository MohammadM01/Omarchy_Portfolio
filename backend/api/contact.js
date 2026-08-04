import { z } from 'zod'
import { createMailer, sendContactEmail } from '../src/mail.js'

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(8).max(5000),
  website: z.string().max(200).optional().default(''),
})

function allowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function setCors(req, res) {
  const origin = req.headers.origin
  const origins = allowedOrigins()

  if (origin && origins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  setCors(req, res)

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })

  const { name, email, message, website } = parsed.data
  // Honeypot: appear successful to bots without sending mail.
  if (website.trim()) return res.status(201).json({ ok: true })

  try {
    const transporter = createMailer()
    await sendContactEmail(transporter, {
      id: crypto.randomUUID(),
      name,
      email,
      message,
      receivedAt: new Date().toISOString(),
    })
    return res.status(201).json({ ok: true })
  } catch (error) {
    console.error('[contact] delivery failed:', error.message)
    return res.status(502).json({ error: 'Could not deliver message. Try again later.' })
  }
}
