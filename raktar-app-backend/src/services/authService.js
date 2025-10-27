import api from './api'

export async function bejelentkezes(email, jelszo) {
  const { data } = await api.post('/auth/login', { email, jelszo })
  localStorage.setItem('jwt_token', data.token)
  return data.felhasznalo
}

export async function regisztracio(nev, email, jelszo) {
  const { data } = await api.post('/auth/register', { nev, email, jelszo })
  return data
}

export async function enProfilom() {
  const { data } = await api.get('/auth/me')
  return data
}

export function kijelentkezes() {
  localStorage.removeItem('jwt_token')
}

// 🔽 ÚJ
export async function elfelejtettJelszo(email) {
  const { data } = await api.post('/auth/forgot', { email })
  return data
}

export async function jelszoReset(token, ujJelszo) {
  const { data } = await api.post('/auth/reset', { token, ujJelszo })
  return data
}
