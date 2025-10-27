import { useEffect, useState } from 'react'
import { enProfilom, kijelentkezes } from '../services/authService'
import { useNavigate, Link } from 'react-router-dom'

export default function Kezdolap() {
  const [profil, setProfil] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    enProfilom().then(setProfil).catch(() => navigate('/login'))
  }, [navigate])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Raktár Dashboard</h1>
        <div className="flex gap-2">
          <Link
            to="/items"
            className="px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white"
          >
            Készlet megnyitása
          </Link>
          <button
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10"
            onClick={() => { kijelentkezes(); navigate('/login') }}
          >
            Kijelentkezés
          </button>
        </div>
      </div>

      {profil && (
        <div className="rounded-2xl border border-white/10 p-4 bg-white/5 backdrop-blur-md">
          <p className="text-neutral-300">
            Üdv, <span className="font-medium text-white">{profil.nev}</span> ({profil.email})
          </p>
        </div>
      )}
    </div>
  )
}
