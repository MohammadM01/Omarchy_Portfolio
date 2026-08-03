# Omarchy Portfolio

Personal portfolio for **Mohammad Mulla**, styled as an Omarchy Linux desktop.

## Structure

```
Omarchy_Portfolio/
├── frontend/     # React + Vite + Tailwind
├── backend/      # Express contact API
├── Resume.pdf
└── README.md
```

## Quick start

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (separate terminal)
cd backend
npm install
npm run dev
```

- App: http://127.0.0.1:5173/
- API: http://127.0.0.1:8787/api/health

## Features

- Omarchy desktop metaphor (dock, windows, terminal)
- Boot sequence with skip + replay (View → Replay Boot / `?replay=1`)
- Command palette (`Ctrl+K`)
- Theme presets: Violet Rose / Rose / Mono + light/dark
- Optional OS sounds (View → Sound)
- Window position persistence
- Live GitHub activity
- Contact form → backend inbox (`backend/data/messages.json`)
- Resume PDF download

## Deploy

### Frontend (Vercel / Netlify / Cloudflare Pages)

```bash
cd frontend
npm run build
```

Publish `frontend/dist`. Set `VITE_API_URL` to your API origin at build time.

### Backend

Host `backend/` on Railway, Render, or Fly. Set CORS / reverse-proxy `/api` to it.

### Custom domain

Point your domain (e.g. `mohammadmulla.dev`) to the frontend host and configure DNS as the provider documents.

## Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Command palette |
| `Ctrl+\`` | Toggle terminal |
| `Ctrl+W` | Close active window |
| `Enter` | Skip boot |
