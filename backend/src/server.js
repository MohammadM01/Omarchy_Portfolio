import express from 'express'
import cors from 'cors'
import { z } from 'zod'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', 'data')
const INBOX = path.join(DATA_DIR, 'messages.json')

const app = express()
const PORT = process.env.PORT || 8787

app.use(cors({ origin: true }))
app.use(express.json({ limit: '32kb' }))

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(8).max(5000),
})

function ensureInbox() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(INBOX)) fs.writeFileSync(INBOX, '[]', 'utf8')
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'win12-backend' })
})

app.post('/api/contact', (req, res) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() })
  }

  ensureInbox()
  const entry = {
    id: crypto.randomUUID(),
    ...parsed.data,
    receivedAt: new Date().toISOString(),
    userAgent: req.get('user-agent') || null,
  }

  const existing = JSON.parse(fs.readFileSync(INBOX, 'utf8'))
  existing.push(entry)
  fs.writeFileSync(INBOX, JSON.stringify(existing, null, 2), 'utf8')

  console.log(`[contact] ${entry.name} <${entry.email}>`)
  return res.status(201).json({ ok: true, id: entry.id })
})

app.listen(PORT, () => {
  console.log(`Win12 backend listening on http://127.0.0.1:${PORT}`)
})
