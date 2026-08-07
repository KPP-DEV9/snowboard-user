export default function Label({ text }: { text: string }) {
  return (
    <div className="absolute top-4 left-4 bg-label text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm">
      {text}
    </div>
  )
}
