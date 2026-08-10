"use client"

import { useState } from "react"
import { Card } from "../Ui/Card/Card"
import { isToday } from "date-fns"
import { Booking } from "@/types/booking"

interface Props {
  summary: []
}

export default function BookingList({ summary }: Props) {
  const [filter, setFilter] = useState<"TODAY" | "ALL">("TODAY")

  return (
    <Card interactive className="overflow-hidden p-0">
      <div className="flex border-b border-card-border/50">
        <button
          onClick={() => setFilter("TODAY")}
          className={`flex-1 pb-3 text-[12px] font-medium transition-colors relative ${
            filter === "TODAY" ? "text-gold" : "text-text-muted hover:text-foreground"
          }`}
        >
          TODAY
          {filter === "TODAY" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
          )}
        </button>
        <button
          onClick={() => setFilter("ALL")}
          className={`flex-1 pb-3 text-[12px] font-medium transition-colors relative ${
            filter === "ALL" ? "text-gold" : "text-text-muted hover:text-foreground"
          }`}
        >
          ALL
          {filter === "ALL" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />}
        </button>
      </div>

      <div className="flex flex-col p-1 gap-2">
        {(() => {
          const allPhases =
            summary?.reduce((acc, curr) => {
              return acc.concat(curr || [])
            }, [] as any[]) || []

          let filtered: Booking[] = allPhases.filter((e) => {
            if (filter === "TODAY") {
              return e.round?.start_date &&
                (e.status === "INS_CONFIRM" || e.status === "INPROGRESS" || e.status === "COMPLETE")
                ? isToday(new Date(e.round.start_date))
                : false
            }
            return true
          })

          if (!filtered || filtered.length === 0) {
            return (
              <div className="text-center py-6 text-text-muted text-[12px]">
                {filter === "TODAY" ? "ยังไม่มีตารางเรียนในวันนี้" : "ไม่มีการจอง"}
              </div>
            )
          }

          // return filtered
          //   .sort((a, b) => {
          //     if (a.round?.start_date && b.round?.start_date) {
          //       return (
          //         new Date(a.round.start_date).getTime() - new Date(b.round.start_date).getTime()
          //       )
          //     }
          //     if (a.round?.start_date) return -1
          //     if (b.round?.start_date) return 1
          //     return Number(a.classes?.order) - Number(b.classes?.order)
          //   })
          //   .map((item) => {
          //     const courseSummary = summary?.find((s) => s.course.id === item.classes?.course?.id)
          //     const classes = allPhases.filter(
          //       (d) => d.classes?.course?.id === item.classes?.course?.id,
          //     )
          //     const indexInCourse = classes.findIndex((d) => d.id === item.id)
          //     let past = (courseSummary?.count_past || 0) + indexInCourse + 1
          //     let total = courseSummary?.total || 0
          //     if (past > total) past = total

          //     return (
          //       <div
          //         className="flex items-center gap-3 py-1.5 border-b border-card-border/30 last:border-0"
          //         key={item.id}
          //       >
          //         {item.status.toUpperCase() === "WAIT_BOOKING" ? (
          //           <div className="text-center pr-3 border-r border-card-border/50">
          //             <Calendar className="w-5 h-5 text-text-muted mx-auto" />
          //           </div>
          //         ) : (
          //           <div className="text-center pr-3 border-r border-card-border/50">
          //             <div className="text-[10px] text-gold font-bold uppercase leading-none mb-0.5">
          //               {item?.round?.start_date &&
          //                 RenderDate(new Date(item.round.start_date), "MMM")}
          //             </div>
          //             <div className="text-[18px] font-bold text-foreground leading-none">
          //               {item?.round?.start_date &&
          //                 RenderDate(new Date(item.round.start_date), "d")}
          //             </div>
          //           </div>
          //         )}

          //         <div className="flex-1">
          //           <div className="text-[10px] text-text-muted mb-0.5">
          //             {item.status.toUpperCase() === "WAIT_BOOKING" ? (
          //               "กรุณาเลือกวันและเวลาสำหรับเรียน"
          //             ) : (
          //               <>
          //                 {item?.round?.start_date &&
          //                   RenderDate(new Date(item.round.start_date), "HH:mm")}{" "}
          //                 -{" "}
          //                 {item?.round?.end_date &&
          //                   RenderDate(new Date(item.round.end_date), "HH:mm")}
          //               </>
          //             )}
          //           </div>
          //           <div className="text-[12px] font-bold text-foreground leading-tight mb-0.5">
          //             <span className="text-gold mx-1">•</span>
          //           </div>
          //           <div className="text-[12px] font-bold text-foreground leading-tight truncate max-w-[200px] mb-0.5">
          //             {item?.classes?.title}
          //           </div>
          //           <div className="text-[10px] text-text-muted">
          //             ครั้งที่ {item.classes?.order} จาก {courseSummary?.total}
          //           </div>
          //         </div>

          //         <StatusBtn status={item.status as any} id={item.id} />
          //       </div>
          //     )
          //   })
        })()}
      </div>
    </Card>
  )
}
