"use client"

import { interestUserEvent } from "@/app/actions/event"
import { RenderDate } from "@/lib/date"
import { Event } from "@/types/event"
import numeral from "numeral"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react"

interface RenderEventProps {
  events: Event[]
}

export default function RenderEventSlide({ events }: RenderEventProps) {
  const router = useRouter()

  const handelInterestUserEvent = async (event_id: string) => {
    await interestUserEvent(event_id)
    router.push(`/events/${event_id}`)
  }

  return (
    <>
      {events.map((event) => (
        <div key={event.id} onClick={() => handelInterestUserEvent(event.id)}>
          <div className="w-[280px] h-[160px] rounded-2xl relative overflow-hidden group border border-card-border shadow-md transition-transform hover:border-gold/30">
            <img
              src={
                event.images?.[0]
                  ? event.images[0].replace(/[\[\]"\\]/g, "").trim()
                  : "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=500&auto=format&fit=crop"
              }
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 w-full flex flex-col gap-1">
              <span className="text-[10px] text-gold font-semibold block drop-shadow-sm">
                {event.start_date ? RenderDate(event.start_date, "dd MMM yyyy") : "เร็วๆนี้"}
              </span>
              <h3 className="text-[14px] font-bold text-white truncate drop-shadow-sm">
                {event.title}
              </h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-text-muted flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {event.limit_player
                    ? `${numeral(event.limit_player).format("0,0")} ท่าน`
                    : "ไม่จำกัด"}
                </span>
                <span className="text-[10px] font-bold text-gold bg-gold/10 px-1.5 py-0.5 rounded-sm">
                  {event.application_fee && Number(event.application_fee) > 0
                    ? `฿${numeral(event.application_fee).format("0,0")}`
                    : "ฟรี"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
