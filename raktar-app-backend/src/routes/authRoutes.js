import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import { kuldEmail, welcomeEmailHtml, resetEmailHtml } from '../services/emailService.js'

const router = Router()

router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
    if (!token) return res.status(401).json({ uzenet: 'Hiányzó token' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(payload.id, {
      attributes: ['id','email','nev','szerep']
    })
    if (!user) return res.status(401).json({ uzenet: 'Felhasználó nem található' })
    res.json(user)
  } catch (e) {
    console.warn('ME hiba:', e?.message)
    res.status(401).json({ uzenet: 'Érvénytelen vagy lejárt token' })
  }
})

// --- REGISZTRÁCIÓ: küldjön üdvözlő e-mailt
router.post('/register', async (req, res) => {
  try {
    const { nev, email, jelszo } = req.body
    if (!nev || !email || !jelszo) return res.status(400).json({ uzenet: 'Hiányzó mezők' })

    const letezik = await User.findOne({ where: { email } })
    if (letezik) return res.status(409).json({ uzenet: 'Ezzel az emaillel már van fiók' })

    const jelszo_hash = await bcrypt.hash(jelszo, 12)
    const uj = await User.create({ nev, email, jelszo_hash })

    // e-mail (nem kritikus – ha elhasal, a reg akkor is sikeres)
    try {
      await kuldEmail({
        to: email,
        subject: 'Sikeres regisztráció – Raktár',
        html: welcomeEmailHtml(nev),
        text: `Üdv ${nev}! A regisztrációd sikeres volt.`,
      })
    } catch (e) {
      console.warn('Üdv e-mail küldési hiba:', e?.message)
    }

    res.status(201).json({ id: uj.id, email: uj.email, nev: uj.nev })
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba' })
  }
})

// --- BEJELENTKEZÉS
router.post('/login', async (req, res) => {
  try {
    const { email, jelszo } = req.body
    const user = await User.findOne({ where: { email, aktiv: true } })
    if (!user) return res.status(401).json({ uzenet: 'Hibás email vagy jelszó' })

    const ok = await bcrypt.compare(jelszo, user.jelszo_hash)
    if (!ok) return res.status(401).json({ uzenet: 'Hibás email vagy jelszó' })

    const token = jwt.sign({ id: user.id, email: user.email, szerep: user.szerep }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.json({ token, felhasznalo: { id: user.id, email: user.email, nev: user.nev, szerep: user.szerep } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba' })
  }
})

// --- ELFELEJTETT JELSZÓ: token generálás + e-mail
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ where: { email, aktiv: true } })

    // Nem áruljuk el, hogy létezik-e az e-mail
    const tokenTtlMin = Number(process.env.RESET_TOKEN_EXPIRES_MIN || 30)

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex')
      const hash = crypto.createHash('sha256').update(rawToken).digest('hex')
      const lejar = new Date(Date.now() + tokenTtlMin * 60 * 1000)

      await user.update({ reset_token_hash: hash, reset_token_lejar: lejar })

      const link = `${process.env.FRONTEND_URL}/reset?token=${rawToken}`
      try {
        await kuldEmail({
          to: email,
          subject: 'Jelszó visszaállítás – Raktár',
          html: resetEmailHtml(user.nev, link),
          text: `Nyisd meg a linket ${tokenTtlMin} percen belül: ${link}`,
        })
      } catch (e) {
        console.warn('Reset e-mail küldési hiba:', e?.message)
      }
    }

    res.json({ uzenet: 'Ha létezett ez az e-mail, elküldtük a visszaállító linket.' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba' })
  }
})

// --- JELSZÓ RESET: token ellenőrzés + jelszó csere
router.post('/reset', async (req, res) => {
  try {
    const { token, ujJelszo } = req.body
    if (!token || !ujJelszo) return res.status(400).json({ uzenet: 'Hiányzó mezők' })

    const hash = crypto.createHash('sha256').update(token).digest('hex')
    const most = new Date()

    const user = await User.findOne({
      where: {
        reset_token_hash: hash,
        reset_token_lejar: { [User.sequelize.Op.gt]: most },
      },
    })
    if (!user) return res.status(400).json({ uzenet: 'Érvénytelen vagy lejárt link' })

    const jelszo_hash = await bcrypt.hash(ujJelszo, 12)
    await user.update({ jelszo_hash, reset_token_hash: null, reset_token_lejar: null })

    res.json({ uzenet: 'Jelszó frissítve. Most jelentkezz be az új jelszóval.' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba' })
  }
})

export default router
