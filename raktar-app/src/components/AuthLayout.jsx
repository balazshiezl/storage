import { Link } from 'react-router-dom'

// Középre rendezett auth layout, fejléccel és lábléccel
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="px-6 py-4">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-indigo-500 inline-block" />
          <span className="font-semibold text-lg">Raktár</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>

      <footer className="text-center text-xs text-neutral-400 py-6">
        © {new Date().getFullYear()} Raktár alkalmazás
      </footer>
    </div>
  )
}
