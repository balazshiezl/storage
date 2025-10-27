import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { jelszoReset } from '../services/authService'
import AuthLayout from '../components/AuthLayout'
import Kartya from '../components/Kartya'
import Mezo from '../components/Mezo'
import Gomb from '../components/Gomb'

export default function JelszoReset() {
  const [sp] = useSearchParams()
  const token = sp.get('token') || ''
  const [jelszo, setJelszo] = useState('')
  const [hiba, setHiba] = useState('')
  const [ok, setOk] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) setHiba('Hiányzó vagy érvénytelen link.')
  }, [token])

  async function kuldes(e) {
    e.preventDefault()
    setHiba(''); setOk('')
    try {
      const res = await jelszoReset(token, jelszo)
      setOk(res.uzenet || 'Siker! Jelentkezz be az új jelszóval.')
      setTimeout(()=> navigate('/login'), 1500)
    } catch (err) {
      setHiba(err.response?.data?.uzenet || 'Érvénytelen vagy lejárt link.')
    }
  }

  return (
    <AuthLayout>
      <Kartya cim="Új jelszó" leiras="Állítsd be az új jelszót">
        <form onSubmit={kuldes} className="space-y-3">
          <Mezo cimke="Új jelszó" type="password" value={jelszo} onChange={e=>setJelszo(e.target.value)} required minLength={6}/>
          {ok && <p className="text-emerald-400 text-sm">{ok}</p>}
          {hiba && <p className="text-rose-400 text-sm">{hiba}</p>}
          <Gomb gyerek="Jelszó mentése" type="submit" />
          <p className="text-sm text-neutral-300 text-center">
            <Link className="text-indigo-300 hover:underline" to="/login">Vissza a bejelentkezéshez</Link>
          </p>
        </form>
      </Kartya>
    </AuthLayout>
  )
}
