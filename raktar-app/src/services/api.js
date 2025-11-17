// src/services/api.js
import axios from 'axios'

const api = axios.create({
  // Cloudflare + Vite proxy miatt relatív útvonal:
  baseURL: import.meta.env.VITE_API_BASE ?? '/api',
  // withCredentials: true, // ha sütit használsz
})

api.interceptors.request.use((config) => {
  const wid = localStorage.getItem('warehouseId')
  if (wid) config.headers['x-warehouse-id'] = wid

  const token = localStorage.getItem('jwt_token')
  if (token) config.headers.Authorization = `Bearer ${token}`

  return config
})

export default api
