import { useState } from 'react'
import axios from 'axios'

export default function WarehouseLogin({ onSuccess }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const { data } = await axios.post('http://localhost:4000/api/warehouse/login', {
        name,
        password,
      })
      localStorage.setItem('warehouseId', String(data.warehouseId))
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Hibás adatok')
    }
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-4">Raktár belépés</h2>
      <form onSubmit={handleLogin}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Raktár neve"
          className="w-full mb-2 p-2 rounded bg-white/10 border border-gray-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Raktár jelszó"
          className="w-full mb-2 p-2 rounded bg-white/10 border border-gray-500"
        />
        {error && <p className="text-red-400 mb-2">{error}</p>}
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Belépés</button>
      </form>
    </div>
  )
}
