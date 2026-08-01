import { getSession } from "@/app/actions/auth"
import { getMyEvents } from "@/app/actions/event"
import Breadcrumbs from "@/components/Breadcrumbs"
import { Card } from "@/components/Ui/Card/Card"
import numeral from "numeral"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Pagination } from "@/components/Ui/Pagination"
import { MapPin } from "lucide-react"

export default async function MyEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession()
  if (!session?.user) {
    return notFound()
  }

  const resolvedSearchParams = await searchParams
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1
  const limit = 10

  const res = await getMyEvents(session.user.id, page, limit)

  if (!res.success) {
    return (
      <div className="p-6 flex flex-col min-h-screen animate-fade-in">
        <Breadcrumbs title={"กิจกรรมของฉัน"} step={"MY EVENTS"} urlBack={`/dashboard`} />
        <div className="flex-1 flex items-center justify-center text-text-muted">
          ไม่สามารถโหลดกิจกรรมของคุณได้
        </div>
      </div>
    )
  }

  let userEvents: any[] = []
  let totalPages = 1

  if (res.data) {
    if (Array.isArray(res.data)) {
      userEvents = res.data
    } else if ("data" in res.data && Array.isArray((res.data as any).data)) {
      userEvents = (res.data as any).data
      totalPages = (res.data as any).total_pages || 1
    }
  }

  return (
    <div className="p-6 flex flex-col min-h-screen animate-fade-in pb-[100px]">
      <Breadcrumbs title={"กิจกรรมของฉัน"} step={"MY EVENTS"} urlBack={`/dashboard`} />

      <h1 className="text-[24px] font-bold text-foreground mb-6">กิจกรรมที่เข้าร่วมแล้ว</h1>

      <div className="flex flex-col gap-4">
        {userEvents.length === 0 && (
          <div className="text-center py-10 text-text-muted text-[14px]">
            คุณยังไม่ได้เข้าร่วมกิจกรรมใดๆ
          </div>
        )}

        {userEvents.map((userEvent) => {
          const event = userEvent.event;
          if (!event) return null;

          return (
            <Link href={`/events/${event.id}`} key={userEvent.id}>
              <Card
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
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-line-green text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
                      ลงทะเบียนแล้ว
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[12px] text-gold font-bold mb-1 block drop-shadow-md">
                      {event.date || event.start_date
                        ? format(new Date((event.date || event.start_date) as string), "dd MMM yyyy", {
                            locale: th,
                          })
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
                    <MapPin width={14} height={14} className="text-gold" />
                    {event.location || "ไม่ได้ระบุสถานที่"}
                  </div>
                  <div className="text-[12px] text-text-muted">
                    เข้าร่วมเมื่อ {format(new Date(userEvent.created_at), "dd MMM yyyy", { locale: th })}
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination totalPages={totalPages} currentPage={page} baseUrl="/my-events" />
          </div>
        )}
      </div>
    </div>
  )
}
