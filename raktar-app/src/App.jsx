import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Kezdolap from './pages/Kezdolap'
import Bejelentkezes from './pages/Bejelentkezes'
import Regisztracio from './pages/Regisztracio'
import ElfelejtettJelszo from './pages/ElfelejtettJelszo'
import JelszoReset from './pages/JelszoReset'
import ItemsLista from './pages/ItemsLista'
import ItemReszletek from './pages/ItemReszletek'
import VedettUt from './components/VedettUt'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Bejelentkezes />} />
        <Route path="/register" element={<Regisztracio />} />
        <Route path="/forgot" element={<ElfelejtettJelszo />} />
        <Route path="/reset" element={<JelszoReset />} />

        <Route path="/" element={<VedettUt><Kezdolap /></VedettUt>} />
        <Route path="/items" element={<VedettUt><ItemsLista /></VedettUt>} />
        <Route path="/items/:id" element={<VedettUt><ItemReszletek /></VedettUt>} />
      </Routes>
    </BrowserRouter>
  )
}
