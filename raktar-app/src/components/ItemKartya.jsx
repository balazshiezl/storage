import { useState } from 'react'
import { novelDarabszam, torolItem } from '../services/inventoryService'
import { Link } from 'react-router-dom'

const ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:4000'

export default function ItemKartya({ item, onChange }) {
  const [menny, setMenny] = useState(1)
  const alacsony = item.quantity <= (item.min_quantity || 0)

  async function hozzaad() {
    await novelDarabszam(item.id, menny)
    onChange?.()
  }
  async function elvesz() {
    await novelDarabszam(item.id, -menny)
    onChange?.()
  }
  async function torles() {
    if (confirm('Biztos törlöd?')) {
      await torolItem(item.id)
      onChange?.()
    }
  }

  const img = item.image_path
    ? `${ORIGIN}${item.image_path}`
    : 'https://placehold.co/160x120?text=No+Image'

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 flex gap-4">
      <img
        src={img}
        alt={item.name}
        className="w-40 h-28 object-cover rounded-xl border border-white/10 bg-black/30"
      />
      <div className="flex-1">
        <div className="flex items-start justify-content gap-10">
          <div>
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-sm text-neutral-300">
              {item.category || 'Nincs kategória'} • {item.location || 'Nincs hely'}
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded-lg text-sm ${
              alacsony ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {item.quantity} {item.unit}
          </span>
        </div>

        {item.expiration_date && (
          <p className="text-xs mt-1 text-neutral-300">
            Lejár: {new Date(item.expiration_date).toLocaleDateString()}
          </p>
        )}

        <p className="text-sm mt-2 line-clamp-2">{item.description || '—'}</p>

{/* ELSŐ SOR: input, -, + (nincs wrap) */}
<div className="flex items-center gap-2 mt-3">
  <input
    type="number"
    min={1}
    className="w-20 h-9 px-2 rounded-lg bg-white/10 border border-white/10"
    value={menny}
    onChange={(e) => setMenny(Number(e.target.value))}
  />
  <button
    onClick={elvesz}
    className="h-9 px-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10"
  >
    -
  </button>
  <button
    onClick={hozzaad}
    className="h-9 px-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white"
  >
    +
  </button>
</div>

{/* MÁSODIK SOR: linkek (külön sor, jobbra igazítva) */}
<div className="mt-2 flex items-center gap-4 justify-end">
  <Link to={`/items/${item.id}`} className="text-indigo-300 hover:underline">
    Részletek
  </Link>
  <button onClick={torles} className="text-rose-300 hover:underline">
    Törlés
  </button>
</div>


      </div>
    </div>
  )
}
