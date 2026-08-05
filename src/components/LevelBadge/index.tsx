export default function LevelBadge({ level }: { level: string }) {
  return (
    <div className="bg-gray-100 text-gray-600 text-[11px] md:text-xs font-bold px-3 py-1.5 rounded shadow-sm">
      {level}
    </div>
  )
}
