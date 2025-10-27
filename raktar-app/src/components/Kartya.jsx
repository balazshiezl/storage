// Üveges kártya konténer
export default function Kartya({ cim, leiras, gyerek }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6">
        {cim && <h1 className="text-3xl font-semibold tracking-tight">{cim}</h1>}
        {leiras && <p className="text-sm text-neutral-300 mt-1">{leiras}</p>}
        <div className="mt-6">{gyerek}</div>
      </div>
    </div>
  )
}
