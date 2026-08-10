export default function History({ summary }: { summary: [] }) {
  if (!summary) return null

  const sumCountPast = summary

  if (sumCountPast?.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      {sumCountPast?.map((i) => {
        return (
          <div key={i} className="bg-black/20 p-3 rounded-lg">
            <div className="text-[16px] font-bold text-gold">
              <span className="text-[12px] text-text-muted font-normal ml-1">ครั้ง</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
