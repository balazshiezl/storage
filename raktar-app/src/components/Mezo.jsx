// Egységes input mező
export default function Mezo({ cimke, type='text', value, onChange, ...props }) {
  return (
    <label className="block space-y-1 mb-4">
      <span className="block text-sm text-neutral-300">{cimke}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-neutral-400 focus:border-white/20"

        {...props}
      />
    </label>
  )
}
