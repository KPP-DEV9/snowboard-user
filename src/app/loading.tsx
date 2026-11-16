export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1D2633] border border-white/10 rounded-2xl px-8 py-6 shadow-2xl flex flex-col items-center gap-3.5 min-w-[180px]">
        <div className="w-9 h-9 border-[3px] border-white/20 border-t-[#C75D33] rounded-full animate-spin" />
        <span className="text-white text-sm font-semibold tracking-wide">
          กำลังโหลด...
        </span>
      </div>
    </div>
  )
}
