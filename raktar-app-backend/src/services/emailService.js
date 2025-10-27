import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true, // 465 = SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: (process.env.SMTP_PASS || '').trim(),
  },
})



export async function kuldEmail({ to, subject, html, text }) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  })
}

// egyszerű sablonok
export function welcomeEmailHtml(nev) {
  return `
  <div style="font-family:Arial,sans-serif">
    <h2>Üdv a Raktár alkalmazásban, ${nev}!</h2>
    <p>A regisztrációd sikeres volt. Most már bejelentkezhetsz.</p>
    <p>Üdv,<br/>Raktár csapat</p>
  </div>`
}

export function resetEmailHtml(nev, link) {
  return `
  <div style="font-family:Arial,sans-serif">
    <h2>Jelszó visszaállítása</h2>
    <p>Szia ${nev}!</p>
    <p>Az alábbi gombbal tudod visszaállítani a jelszavadat. A link <b>${process.env.RESET_TOKEN_EXPIRES_MIN || 30}</b> percig érvényes.</p>
    <p><a href="${link}" style="display:inline-block;padding:12px 18px;background:#4f46e5;color:#fff;border-radius:10px;text-decoration:none">Jelszó visszaállítása</a></p>
    <p>Ha nem te kérted, hagyd figyelmen kívül.</p>
  </div>`
}


transporter.verify()
  .then(()=>console.log('SMTP OK'))
  .catch(e=>console.error('SMTP FAIL:', e.message))