# Mohammad's Portfolio API

Secure contact endpoint. Messages are emailed to your inbox. Destination address and SMTP secrets stay in `.env` only (never in the frontend).

```bash
cd backend
cp .env.example .env
# Edit .env — set SMTP_PASS (Gmail App Password)
npm install
npm run dev
```

Runs on `http://127.0.0.1:8787`.

## Gmail setup (required)

1. Turn on [2-Step Verification](https://myaccount.google.com/signinoptions/two-step)
2. Create an [App Password](https://myaccount.google.com/apppasswords) for “Mail”
3. Put that 16-character password in `SMTP_PASS` in `.env` (spaces optional)
4. Set `CONTACT_TO_EMAIL` and `SMTP_USER` to your Gmail

Never put your normal Gmail password in `.env`. Never commit `.env`.

## Security

- Recipient email only on the server (`.env`)
- CORS locked to `ALLOWED_ORIGINS`
- Rate limit: 8 requests / 15 min / IP
- Honeypot field on the form
- Helmet headers, small JSON body limit
- No inbox API; optional local store is off by default
- API responses never include your email or SMTP details
- Server logs only message ids (not visitor content)

## Endpoints

- `GET /api/health` — `{ ok, mailConfigured }`
- `POST /api/contact` — `{ name, email, message, website? }`

## Frontend

Set `VITE_API_URL` if the API is not proxied / not on localhost:8787.
Vite already proxies `/api` to `:8787` in local dev.

## Deploy the mail API on Vercel

Deploy this `backend` folder as a separate Vercel project. The Vercel function
is available at `POST /api/contact` and sends mail directly; it does not use
the local JSON inbox because Vercel functions have no persistent disk.

Add these Vercel environment variables to the mail project:

```text
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-16-character-Google-App-Password
CONTACT_TO_EMAIL=your-gmail-address@gmail.com
ALLOWED_ORIGINS=https://mohammadmulla.com,https://www.mohammadmulla.com
```

Then add `VITE_API_URL=https://your-mail-project.vercel.app` to the frontend
project's production environment variables and redeploy the frontend.
