# Windows 12 Portfolio

Personal portfolio for **Mohammad Mulla**, styled as a Windows 12 Fluent desktop.

## Structure

```
Win12_Portfolio/
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

- Windows 12 desktop (taskbar, Start menu, acrylic windows)
- Colorful per-app window accents
- Light / dark Fluent themes
- Desktop icons + right-click context menu
- Boot sequence with skip + replay (`?replay=1`)
- Terminal (`help`, `about`, `projects`, `skills`, `contact`, `theme`, `exit`)
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

## Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Start menu / search |
| `Ctrl+\`` | Toggle terminal |
| `Ctrl+W` | Close active window |
| `Ctrl+1…9` | Launch pinned apps |
| `Enter` | Skip boot |
