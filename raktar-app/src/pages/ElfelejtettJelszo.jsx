import { useState } from 'react'
import { elfelejtettJelszo } from '../services/authService'
import AuthLayout from '../components/AuthLayout'
import Kartya from '../components/Kartya'
import Mezo from '../components/Mezo'
import Gomb from '../components/Gomb'
import { Link } from 'react-router-dom'

export default function ElfelejtettJelszo() {
  const [email, setEmail] = useState('')
  const [uzenet, setUzenet] = useState('')
  const [hiba, setHiba] = useState('')

  async function kuldes(e) {
    e.preventDefault()
    setHiba(''); setUzenet('')
    try {
      const res = await elfelejtettJelszo(email)
      setUzenet(res.uzenet || 'Ha létezik ez az e-mail, elküldtük a linket.')
    } catch (err) {
      setHiba('Valami hiba történt.')
    }
  }

  return (
    <AuthLayout>
      <Kartya cim="Elfelejtett jelszó" leiras="Add meg az e-mail címed">
        <form onSubmit={kuldes} className="space-y-3">
          <Mezo cimke="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          {uzenet && <p className="text-emerald-400 text-sm">{uzenet}</p>}
          {hiba && <p className="text-rose-400 text-sm">{hiba}</p>}
          <Gomb gyerek="Visszaállító link küldése" type="submit" />
          <p className="text-sm text-neutral-300 text-center">
            <Link className="text-indigo-300 hover:underline" to="/login">Vissza a bejelentkezéshez</Link>
          </p>
        </form>
      </Kartya>
    </AuthLayout>
  )
}
