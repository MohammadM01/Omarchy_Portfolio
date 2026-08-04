import nodemailer from 'nodemailer'

function required(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing required env: ${name}`)
  return value
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function createMailer() {
  const host = required('SMTP_HOST')
  const port = Number(process.env.SMTP_PORT || 465)
  const secure = String(process.env.SMTP_SECURE ?? 'true') !== 'false'
  const user = required('SMTP_USER')
  // Gmail App Passwords: strip spaces; either format works when quoted in .env
  const pass = required('SMTP_PASS').replace(/\s+/g, '')

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

export async function sendContactEmail(transporter, payload) {
  const to = required('CONTACT_TO_EMAIL')
  const fromUser = required('SMTP_USER')
  const fromName = process.env.CONTACT_FROM_NAME?.trim() || 'Portfolio Contact'

  const { name, email, message, id, receivedAt } = payload
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />')

  const subject = `Portfolio contact from ${name}`.slice(0, 140)

  await transporter.sendMail({
    from: `"${fromName}" <${fromUser}>`,
    to,
    replyTo: `${name} <${email}>`,
    subject,
    text: [
      `New message from your portfolio contact form.`,
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Received: ${receivedAt}`,
      `Id: ${id}`,
      '',
      'Message:',
      message,
    ].join('\n'),
    html: `
      <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#111">
        <p><strong>New portfolio contact</strong></p>
        <p>
          <strong>Name:</strong> ${safeName}<br />
          <strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a><br />
          <strong>Received:</strong> ${escapeHtml(receivedAt)}<br />
          <strong>Id:</strong> ${escapeHtml(id)}
        </p>
        <hr />
        <p>${safeMessage}</p>
      </div>
    `,
  })
}
