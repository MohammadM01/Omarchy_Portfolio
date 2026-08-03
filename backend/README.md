# Windows 12 Portfolio API

Contact form endpoint for the frontend desktop.

```bash
cd backend
npm install
npm run dev
```

Runs on `http://127.0.0.1:8787`.

## Endpoints

- `GET /api/health` — health check
- `POST /api/contact` — `{ name, email, message }` → stored in `data/messages.json`

Set `VITE_API_URL` in the frontend if the API is not on localhost:8787.

For production, point a reverse proxy (`/api`) to this service, or host it on Railway/Render/Fly.
