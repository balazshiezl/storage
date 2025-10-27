import { useState } from 'react'
import { bejelentkezes } from '../services/authService'
import { useNavigate, Link } from 'react-router-dom'
import Kartya from '../components/Kartya'
import Mezo from '../components/Mezo'
import Gomb from '../components/Gomb'
import AuthLayout from '../components/AuthLayout'

export default function Bejelentkezes() {
  const [email, setEmail] = useState('')
  const [jelszo, setJelszo] = useState('')
  const [hiba, setHiba] = useState('')
  const navigate = useNavigate()

  async function kezelBelepes(e) {
    e.preventDefault()
    setHiba('')
    try {
      await bejelentkezes(email, jelszo)
      navigate('/')
    } catch (err) {
      setHiba(err.response?.data?.uzenet || 'Bejelentkezés sikertelen')
    }
  }

  return (
    <AuthLayout>
      <Kartya cim="Bejelentkezés" gyerek={
        <form onSubmit={kezelBelepes} className="space-y-3">
          <Mezo cimke="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <Mezo cimke="Jelszó" type="password" value={jelszo} onChange={e=>setJelszo(e.target.value)} required />
          {hiba && <p className="text-rose-400 text-sm">{hiba}</p>}
          <Gomb gyerek="Belépés" type="submit" />
            <p className="text-sm text-neutral-300 text-center">
                <Link className="text-indigo-300 hover:underline" to="/forgot">Elfelejtett jelszó?</Link>
            </p>

          <p className="text-sm text-neutral-300 text-center">
            Nincs fiókod? <Link className="text-indigo-300 hover:underline" to="/register">Regisztráció</Link>
          </p>
        </form>
      }/>
    </AuthLayout>
  )
}
