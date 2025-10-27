import { useEffect, useState } from 'react'
import { egyItem, modositItem } from '../services/inventoryService'
import { useParams, useNavigate } from 'react-router-dom'

const ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:4000'

export default function ItemReszletek() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [hiba, setHiba] = useState('')
  const [ujPreview, setUjPreview] = useState('')
  const navigate = useNavigate()

  async function betolt() {
    try {
      setItem(await egyItem(id))
    } catch {
      setHiba('Nem található tétel')
    }
  }
  useEffect(() => {
    betolt()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function mentes(e) {
    e.preventDefault()
    setHiba('')
    const fd = new FormData(e.target)
    const obj = Object.fromEntries(fd.entries())
    if (!obj.image || (obj.image && obj.image.size === 0)) delete obj.image
    try {
      await modositItem(id, obj)
      await betolt()
      alert('Mentve')
    } catch (err) {
      setHiba(err.response?.data?.uzenet || 'Mentési hiba')
    }
  }

  if (!item) return <div className="p-6">{hiba || 'Betöltés...'}</div>

  const img = ujPreview || (item.image_path ? `${ORIGIN}${item.image_path}` : 'https://placehold.co/200x150?text=No+Image')

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
      >
        ← Vissza
      </button>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex gap-4">
          <img
            src={img}
            alt={item.name}
            className="w-60 h-40 object-cover rounded-xl border border-white/10"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{item.name}</h1>
            <p className="text-sm text-neutral-300">
              {item.category || '—'} • {item.location || '—'}
            </p>
            <p className="mt-2">{item.description || '—'}</p>
            {item.expiration_date && (
              <p className="text-sm mt-2">
                Lejár: {new Date(item.expiration_date).toLocaleDateString()}
              </p>
            )}
            {item.manufacture_date && (
              <p className="text-sm">Gyártva: {new Date(item.manufacture_date).toLocaleDateString()}</p>
            )}
            <p className="mt-2">
              <b>Készlet:</b> {item.quantity} {item.unit} (min: {item.min_quantity})
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">Szerkesztés</h2>
        <form onSubmit={mentes} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            Név
            <input
              name="name"
              defaultValue={item.name}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
            />
          </label>
          <label className="text-sm">
            Kategória
            <input
              name="category"
              defaultValue={item.category || ''}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
            />
          </label>
          <label className="text-sm">
            Darabszám
            <input
              type="number"
              name="quantity"
              defaultValue={item.quantity}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
            />
          </label>
          <label className="text-sm">
            Egység
            <input
              name="unit"
              defaultValue={item.unit}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
            />
          </label>
          <label className="text-sm">
            Min. készlet
            <input
              type="number"
              name="min_quantity"
              defaultValue={item.min_quantity}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
            />
          </label>
          <label className="text-sm">
            Hely
            <input
              name="location"
              defaultValue={item.location || ''}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
            />
          </label>
          <label className="text-sm">
            Lejárat
            <input
              type="date"
              name="expiration_date"
              defaultValue={item.expiration_date || ''}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
            />
          </label>
          <label className="text-sm">
            Gyártás
            <input
              type="date"
              name="manufacture_date"
              defaultValue={item.manufacture_date || ''}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
            />
          </label>
          <label className="md:col-span-2 text-sm">
            Leírás
            <textarea
              name="description"
              defaultValue={item.description || ''}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
              rows={3}
            />
          </label>
          <label className="md:col-span-2 text-sm">
            Kép csere
            <input
              type="file"
              name="image"
              accept="image/*"
              className="block mt-1"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) setUjPreview(URL.createObjectURL(f))
              }}
            />
          </label>
          {hiba && <p className="md:col-span-2 text-rose-300">{hiba}</p>}
          <div className="md:col-span-2 flex justify-end">
            <button className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white">
              Mentés
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
