import api from './api'

// Lista szűrőkkel
export async function listazItems({ q, category, exp_before, page = 1, limit = 12 } = {}) {
  const { data } = await api.get('/items', { params: { q, category, exp_before, page, limit } })
  return data
}

// Egy elem
export async function egyItem(id) {
  const { data } = await api.get(`/items/${id}`)
  return data
}

// Létrehozás (form-data a képpel)
export async function letrehozItem(formObj) {
  const fd = new FormData()
  Object.entries(formObj).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v)
  })
  const { data } = await api.post('/items', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  return data
}

// Módosítás (kép optional)
export async function modositItem(id, formObj) {
  const fd = new FormData()
  Object.entries(formObj).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v)
  })
  const { data } = await api.put(`/items/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  return data
}

// Darabszám változtatás
export async function novelDarabszam(id, amount) {
  const { data } = await api.patch(`/items/${id}/increment`, { amount })
  return data
}

// Törlés
export async function torolItem(id) {
  const { data } = await api.delete(`/items/${id}`)
  return data
}
