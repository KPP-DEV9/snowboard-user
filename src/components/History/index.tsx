import { SumaryCourse } from "@/types/course"

export default function History({ summary }: { summary: SumaryCourse[] }) {
  if (!summary) return null

  const sumCountPast = summary

  if (sumCountPast?.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      {sumCountPast?.map((item) => {
        return (
          <div key={item?.course?.id} className="bg-black/20 p-3 rounded-lg">
            <div className="text-[16px] font-bold text-gold">
              {item?.count_past}{" "}
              <span className="text-[12px] text-text-muted font-normal ml-1">ครั้ง</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
