import { useEffect, useState } from 'react'
import { enProfilom, kijelentkezes } from '../services/authService'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Kezdolap() {
  const [profil, setProfil] = useState(null)
  const [showWarehouseModal, setShowWarehouseModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false) // ⬅️ váltó: új vagy meglévő raktár
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [hiba, setHiba] = useState('')
  const navigate = useNavigate()

  // felhasználó profil betöltése
  useEffect(() => {
    enProfilom().then(setProfil).catch(() => navigate('/login'))
  }, [navigate])

  // warehouseId ellenőrzés
  useEffect(() => {
    const wid = localStorage.getItem('warehouseId')
    if (!wid) setShowWarehouseModal(true)
  }, [])

// Raktár belépés / létrehozás
async function handleWarehouseAction(e) {
  e.preventDefault()
  setHiba('')
  try {
    if (isCreating) {
      // 🔹 új raktár létrehozása
      const { data } = await axios.post('http://localhost:4000/api/warehouse/create', {
        name,
        password,
      })
      localStorage.setItem('warehouseId', String(data.id))
      setShowWarehouseModal(false)
    } else {
      // 🔹 meglévőbe belépés
      const { data } = await axios.post('http://localhost:4000/api/warehouse/login', {
        name,
        password,
      })
      localStorage.setItem('warehouseId', String(data.warehouseId))
      setShowWarehouseModal(false)
    }
  } catch (err) {
    setHiba(err.response?.data?.message || 'Hibás név vagy jelszó')
  }
}


  // kijelentkezés (felhasználó + raktár)
  function handleLogout() {
    kijelentkezes()
    localStorage.removeItem('warehouseId')
    navigate('/login')
  }

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
            onClick={handleLogout}
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

      {/* 🔹 Raktár belépő / létrehozó modál */}
      {showWarehouseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-neutral-900 p-6 rounded-2xl border border-white/10 w-[340px]">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {isCreating ? 'Új raktár létrehozása' : 'Raktár belépés'}
            </h2>
            <form onSubmit={handleWarehouseAction}>
              <input
                type="text"
                placeholder="Raktár neve"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-3 p-2 rounded bg-white/10 text-white border border-white/10"
              />
              <input
                type="password"
                placeholder="Raktár jelszó"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-3 p-2 rounded bg-white/10 text-white border border-white/10"
              />
              {hiba && <p className="text-red-400 text-sm mb-3">{hiba}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-medium"
              >
                {isCreating ? 'Raktár létrehozása' : 'Belépés'}
              </button>
            </form>

            <div className="text-sm text-neutral-400 mt-4 text-center">
              {isCreating ? (
                <>
                  Már van raktárad?{' '}
                  <button
                    onClick={() => setIsCreating(false)}
                    className="text-indigo-400 hover:underline"
                  >
                    Lépj be
                  </button>
                </>
              ) : (
                <>
                  Nincs még raktárad?{' '}
                  <button
                    onClick={() => setIsCreating(true)}
                    className="text-indigo-400 hover:underline"
                  >
                    Hozz létre egyet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
