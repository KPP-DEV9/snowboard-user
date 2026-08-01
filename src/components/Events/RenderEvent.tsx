"use client"

import { interestUserEvent } from "@/app/actions/event"
import { RenderDate } from "@/lib/date"
import { Event } from "@/types/event"
import { Card } from "../Ui/Card/Card"
import numeral from "numeral"
import { Users } from "lucide-react"
import { useRouter } from "next/navigation"

interface RenderEventProps {
  events: Event[]
}

export default function RenderEvent({ events }: RenderEventProps) {
  const router = useRouter()

  const handelInterestUserEvent = async (event_id: string) => {
    await interestUserEvent(event_id)
    router.push(`/events/${event_id}`)
  }

  return (
    <>
      {events.map((event) => (
        <Card
          key={event.id}
          onClick={() => handelInterestUserEvent(event.id)}
          className="flex flex-col overflow-hidden bg-card-bg/80 backdrop-blur-sm border-card-border/50 !p-0 transition-transform hover:scale-[1.02] cursor-pointer"
        >
          <div className="h-[200px] relative w-full">
            <img
              src={
                event.images && event.images.length > 0
                  ? event.images[0].replace(/[\["\\]/g, "").trim()
                  : "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=500&auto=format&fit=crop"
              }
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[12px] text-gold font-bold mb-1 block drop-shadow-md">
                {event.start_date
                  ? RenderDate(new Date(event.start_date), "dd MMM yyyy")
                  : "เร็วๆนี้"}
              </span>
              <h2 className="text-[18px] font-bold text-white leading-tight drop-shadow-md">
                {event.title}
              </h2>
            </div>
          </div>
          {event.description && (
            <div className="p-4 pt-3">
              <p className="text-[14px] text-text-muted line-clamp-3">{event.description}</p>
            </div>
          )}
          <div className="px-4 py-3 border-t border-card-border/30 flex justify-between items-center bg-card-bg/50">
            <div className="flex items-center gap-1.5 text-text-muted text-[12px]">
              <Users className="w-3 h-3" />
              {event.limit_player
                ? `รับ ${numeral(event.limit_player).format("0,0")} ท่าน`
                : "ไม่จำกัดจำนวน"}
            </div>
            <div className="text-[14px] font-bold text-gold">
              {event.application_fee && Number(event.application_fee) > 0
                ? `${numeral(event.application_fee).format("0,0")} บาท`
                : "เข้าร่วมฟรี"}
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}
