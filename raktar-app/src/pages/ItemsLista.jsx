import { useEffect, useState } from 'react'
import { listazItems } from '../services/inventoryService'
import ItemKartya from '../components/ItemKartya'
import UjItemModal from '../components/UjItemModal'
import { Link } from 'react-router-dom'

export default function ItemsLista() {
  const [adat, setAdat] = useState({ items: [], total: 0, page: 1, pages: 1 })
  const [q, setQ] = useState('')
  const [nyitva, setNyitva] = useState(false)

  async function betolt(page = 1) {
    const res = await listazItems({ q, page })
    setAdat(res)
  }

  useEffect(() => { betolt(1) }, []) // első betöltés

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between gap-2 mb-6">
        <a href="/" class="text-3xl font-semibold">Főoldal</a>

        <div className="flex items-center gap-2">
          <input
            placeholder="Keresés név / kategória / hely"
            className="px-3 py-2 rounded-xl bg-white/10 border border-white/10"
            value={q}
            onChange={e=>setQ(e.target.value)}
            onKeyDown={e=>e.key==='Enter' && betolt(1)}
          />
          <button onClick={()=>betolt(1)} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">Keres</button>
          <button onClick={()=>setNyitva(true)} className="px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white">Új tétel</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adat.items.map(it => (
          <ItemKartya key={it.id} item={it} onChange={()=>betolt(adat.page)} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        <button disabled={adat.page<=1} onClick={()=>betolt(adat.page-1)} className="px-3 py-1 rounded-lg bg-white/10 disabled:opacity-50">‹</button>
        <span>{adat.page} / {adat.pages}</span>
        <button disabled={adat.page>=adat.pages} onClick={()=>betolt(adat.page+1)} className="px-3 py-1 rounded-lg bg-white/10 disabled:opacity-50">›</button>
      </div>

      <UjItemModal nyitva={nyitva} bezar={()=>setNyitva(false)} onCreated={()=>betolt(1)} />
    </div>
  )
}
