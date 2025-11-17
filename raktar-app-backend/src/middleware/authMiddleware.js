import jwt from 'jsonwebtoken'

export function authKotelezett(req, res, next) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(401).json({ uzenet: 'Hiányzó token' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.felhasznalo = payload  // { id, email, szerep }
    next()
  } catch {
    res.status(401).json({ uzenet: 'Érvénytelen vagy lejárt token' })
  }
}
