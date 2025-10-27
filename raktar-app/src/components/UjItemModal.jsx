import { useState, useRef } from 'react'
import { letrehozItem } from '../services/inventoryService'

export default function UjItemModal({ nyitva, bezar, onCreated }) {
  const [form, setForm] = useState({
    name: '', description: '', category: '',
    quantity: 0, unit: 'db', min_quantity: 0,
    expiration_date: '', manufacture_date: '', location: '',
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [hiba, setHiba] = useState('')
  const inputRef = useRef(null)

  if (!nyitva) return null

  function valtoztat(k, v) { setForm(p => ({ ...p, [k]: v })) }

  function onPick(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function onDrop(e) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function kuldes(e) {
    e.preventDefault()
    setHiba('')
    try {
      await letrehozItem({ ...form, image: file || undefined })
      onCreated?.()
      bezar()
    } catch (err) {
      setHiba(err.response?.data?.uzenet || 'Mentési hiba')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/10 backdrop-blur-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Új raktár tétel</h2>
          <button onClick={bezar} className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20">Bezár</button>
        </div>

        <form onSubmit={kuldes} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">Név
            <input className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
                   required value={form.name} onChange={e=>valtoztat('name', e.target.value)} />
          </label>
          <label className="text-sm">Kategória
            <input className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
                   value={form.category} onChange={e=>valtoztat('category', e.target.value)} />
          </label>
          <label className="text-sm">Darabszám
            <input type="number" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
                   value={form.quantity} onChange={e=>valtoztat('quantity', e.target.value)} />
          </label>
          <label className="text-sm">Egység
            <input className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
                   value={form.unit} onChange={e=>valtoztat('unit', e.target.value)} />
          </label>
          <label className="text-sm">Minimum készlet
            <input type="number" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
                   value={form.min_quantity} onChange={e=>valtoztat('min_quantity', e.target.value)} />
          </label>
          <label className="text-sm">Hely
            <input className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
                   value={form.location} onChange={e=>valtoztat('location', e.target.value)} />
          </label>
          <label className="text-sm">Lejárati dátum
            <input type="date" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
                   value={form.expiration_date} onChange={e=>valtoztat('expiration_date', e.target.value)} />
          </label>
          <label className="text-sm">Gyártási dátum
            <input type="date" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
                   value={form.manufacture_date} onChange={e=>valtoztat('manufacture_date', e.target.value)} />
          </label>
          <label className="md:col-span-2 text-sm">Leírás
            <textarea className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10"
                      rows={3} value={form.description}
                      onChange={e=>valtoztat('description', e.target.value)} />
          </label>

          {/* Drag & drop zóna + előnézet */}
          <div
            className="md:col-span-2 rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-center"
            onDragOver={(e)=>e.preventDefault()}
            onDrop={onDrop}
          >
            {preview ? (
              <img src={preview} alt="Előnézet"
                   className="mx-auto h-40 object-contain rounded-lg border border-white/10" />
            ) : (
              <p className="text-neutral-300">
                Húzd ide a képet, vagy{' '}
                <button type="button" className="text-indigo-300 underline"
                        onClick={()=>inputRef.current?.click()}>
                  válaszd ki
                </button>.
              </p>
            )}
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
          </div>

          {hiba && <p className="md:col-span-2 text-rose-300">{hiba}</p>}
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={bezar} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">Mégse</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white">Mentés</button>
          </div>
        </form>
      </div>
    </div>
  )
}
