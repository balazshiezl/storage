import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export default function AuthProvider({ children }) {
  const [felhasznalo, setFelhasznalo] = useState(null)
  const [toltes, setToltes] = useState(true)

  useEffect(() => {
    // induláskor próbáljuk lekérni a /me-t
    api.get('/auth/me').then(res => {
      setFelhasznalo(res.data.felhasznalo || null)
    }).catch(() => setFelhasznalo(null))
      .finally(() => setToltes(false))
  }, [])

  const bejelentkezes = async (email, jelszo) => {
    const res = await api.post('/auth/login', { email, jelszo })
    // a token sütiben jön; itt elég a usert eltárolni
    const me = await api.get('/auth/me')
    setFelhasznalo(me.data.felhasznalo)
  }

  const kijelentkezes
