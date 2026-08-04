import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMailer, sendContactEmail } from './mail.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', 'data')
const INBOX = path.join(DATA_DIR, 'messages.json')

const PORT = Number(process.env.PORT || 8787)
const STORE_LOCAL = String(process.env.CONTACT_STORE_LOCAL || 'true') !== 'false'
const isDev = process.env.NODE_ENV !== 'production'

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (allowedOrigins.includes(origin)) return true
  // Local Vite (any port) during development / when proxied
  if (isDev && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
    return true
  }
  return false
}

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) return callback(null, true)
      return callback(null, false)
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    maxAge: 600,
  }),
)

app.use(express.json({ limit: '16kb' }))

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again later.' },
})

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(8).max(5000),
  website: z.string().max(200).optional().default(''),
})

let transporter = null
let mailError = null
try {
  transporter = createMailer()
} catch (err) {
  mailError = err.message
  console.error('[mail] Configuration error:', err.message)
  console.error(
    '[mail] Set SMTP_PASS in backend/.env (Gmail App Password). Messages will still be saved locally.',
  )
}

function ensureInbox() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(INBOX)) fs.writeFileSync(INBOX, '[]', 'utf8')
}

function saveLocal(entry) {
  ensureInbox()
  const existing = JSON.parse(fs.readFileSync(INBOX, 'utf8'))
  existing.push(entry)
  fs.writeFileSync(INBOX, JSON.stringify(existing, null, 2), 'utf8')
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'win12-backend',
    mailConfigured: Boolean(transporter && process.env.CONTACT_TO_EMAIL),
    mailError: transporter ? null : mailError,
  })
})

app.post('/api/contact', contactLimiter, async (req, res) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const { name, email, message, website } = parsed.data

  if (website && website.trim().length > 0) {
    return res.status(201).json({ ok: true })
  }

  const entry = {
    id: crypto.randomUUID(),
    name,
    email,
    message,
    receivedAt: new Date().toISOString(),
  }

  let emailed = false

  if (transporter && process.env.CONTACT_TO_EMAIL?.trim()) {
    try {
      await sendContactEmail(transporter, entry)
      emailed = true
    } catch (err) {
      console.error(`[contact] send failed id=${entry.id}:`, err.message)
    }
  }

  if (STORE_LOCAL || !emailed) {
    try {
      saveLocal(entry)
    } catch (err) {
      console.error(`[contact] local save failed id=${entry.id}:`, err.message)
      if (!emailed) {
        return res
          .status(502)
          .json({ error: 'Could not deliver message. Try again later.' })
      }
    }
  }

  console.log(
    `[contact] accepted id=${entry.id} emailed=${emailed} stored=${STORE_LOCAL || !emailed}`,
  )
  return res.status(201).json({ ok: true })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, _req, res, _next) => {
  console.error('[server]', err.message)
  return res.status(500).json({ error: 'Server error' })
})

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Win12 backend listening on http://127.0.0.1:${PORT}`)
  if (!transporter) {
    console.warn(
      '[mail] SMTP not ready — contact form saves to backend/data/messages.json until SMTP_PASS is set.',
    )
  } else {
    console.log('[mail] SMTP ready — emails will go to CONTACT_TO_EMAIL')
  }
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `[server] Port ${PORT} is already in use. Stop the other process, then restart.`,
    )
    console.error(
      `  PowerShell: Get-NetTCPConnection -LocalPort ${PORT} | Stop-Process -Id {$_.OwningProcess} -Force`,
    )
    process.exit(1)
  }
  throw err
})
