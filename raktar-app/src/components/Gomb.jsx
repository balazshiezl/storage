// Primer gomb
export default function Gomb({ gyerek, className = '', ...props }) {
  return (
    <button
      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl
                  bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-500 text-white font-medium
                  transition shadow-lg shadow-indigo-950/30 ${className}`}
      {...props}
    >
      {gyerek}
    </button>
  )
}
