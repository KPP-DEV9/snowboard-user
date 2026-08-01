import Link from "next/link"
import { getEvents } from "@/app/actions/event"
import { Event } from "@/types/event"
import numeral from "numeral"

import { RenderDate } from "@/lib/date"
import RenderEvent from "./RenderEvent"
import RenderEventSlide from "./RenderEventSlide"

export default async function Events() {
  const res = await getEvents()

  let events: Event[] = []

  if (res && res.success && res.data) {
    if (Array.isArray(res.data)) {
      events = res.data
    } else if ("data" in res.data && Array.isArray((res.data as any).data)) {
      events = (res.data as any).data
    }
  }

  if (events.length === 0) return null

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] tracking-[2px] text-gold font-bold uppercase">Events</span>
        <Link href="/events" className="text-[12px] text-text-muted">
          ดูทั้งหมด &rsaquo;
        </Link>
      </div>

      <div
        className={`flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${events.length === 1 ? "justify-center" : ""}`}
      >
        <RenderEventSlide events={events} />
        {/* {events.map((event) => (
          <Link href={`/events/${event.id}`} key={event.id} className="snap-center shrink-0">
            <div className="w-[280px] h-[160px] rounded-2xl relative overflow-hidden group border border-card-border shadow-md transition-transform hover:border-gold/30">
              <img
                src={
                  event.images?.[0]
                    ? event.images[0].replace(/[\["\\]/g, "").trim()
                    : "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=500&auto=format&fit=crop"
                }
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 w-full flex flex-col gap-1">
                <span className="text-[10px] text-gold font-semibold block drop-shadow-sm">
                  {event.start_date
                    ? RenderDate(event.start_date, "dd MMM yyyy")
                    : "เร็วๆนี้"}
                </span>
                <h3 className="text-[14px] font-bold text-white truncate drop-shadow-sm">
                  {event.title}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-text-muted flex items-center gap-1">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
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
          </Link>
        ))} */}
      </div>
    </div>
  )
}
