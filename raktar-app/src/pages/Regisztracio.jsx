import { useState } from 'react'
import { regisztracio } from '../services/authService'
import { Link, useNavigate } from 'react-router-dom'
import Kartya from '../components/Kartya'
import Mezo from '../components/Mezo'
import Gomb from '../components/Gomb'
import AuthLayout from '../components/AuthLayout'

export default function Regisztracio() {
  const [nev, setNev] = useState('')
  const [email, setEmail] = useState('')
  const [jelszo, setJelszo] = useState('')
  const [hiba, setHiba] = useState('')
  const navigate = useNavigate()

  async function kezelReg(e) {
    e.preventDefault()
    setHiba('')
    try {
      await regisztracio(nev, email, jelszo)
      navigate('/login')
    } catch (err) {
      setHiba(err.response?.data?.uzenet || 'Regisztráció sikertelen')
    }
  }

  return (
    <AuthLayout>
      <Kartya cim="Regisztráció" leiras="Hozz létre felhasználót a raktárhoz" gyerek={
        <form onSubmit={kezelReg} className="space-y-3">
          <Mezo cimke="Név" value={nev} onChange={e=>setNev(e.target.value)} required />
          <Mezo cimke="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <Mezo cimke="Jelszó" type="password" value={jelszo} onChange={e=>setJelszo(e.target.value)} required minLength={6} />
          {hiba && <p className="text-rose-400 text-sm">{hiba}</p>}
          <Gomb gyerek="Fiók létrehozása" type="submit" />
          <p className="text-sm text-neutral-300 text-center">
            Van már fiókod? <Link className="text-indigo-300 hover:underline" to="/login">Bejelentkezés</Link>
          </p>
        </form>
      }/>
    </AuthLayout>
  )
}
