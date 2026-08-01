import { getSession } from "@/app/actions/auth"
import { getEvents } from "@/app/actions/event"
import Breadcrumbs from "@/components/Breadcrumbs"
import { notFound } from "next/navigation"
import { Pagination } from "@/components/Ui/Pagination"
import { Event } from "@/types/event"
import RenderEvent from "@/components/Events/RenderEvent"

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EventsPage({ searchParams }: Props) {
  const session = await getSession()
  if (!session?.user) {
    return notFound()
  }

  const resolvedSearchParams = await searchParams
  const page =
    typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1
  const limit = 10

  const res = await getEvents(page, limit)

  if (!res.success) {
    return (
      <div className="p-6 flex flex-col min-h-screen animate-fade-in">
        <Breadcrumbs title={"กิจกรรมทั้งหมด"} step={"EVENTS"} urlBack={`/dashboard`} />
        <div className="flex-1 flex items-center justify-center text-text-muted">
          ไม่สามารถโหลดกิจกรรมได้
        </div>
      </div>
    )
  }

  let events: Event[] = []
  let totalPages = 1

  if (res.data) {
    if (Array.isArray(res.data)) {
      events = res.data
    } else if ("data" in res.data && Array.isArray((res.data as any).data)) {
      events = (res.data as any).data
      totalPages = (res.data as any).total_pages || 1
    }
  }

  return (
    <div className="p-6 flex flex-col min-h-screen animate-fade-in pb-[100px]">
      <Breadcrumbs title={"กิจกรรมทั้งหมด"} step={"EVENTS"} urlBack={`/dashboard`} />

      <h1 className="text-[24px] font-bold text-foreground mb-6">กิจกรรมที่น่าสนใจ</h1>

      <div className="flex flex-col gap-4">
        {events.length === 0 && (
          <div className="text-center py-10 text-text-muted text-[14px]">
            ยังไม่มีกิจกรรมในขณะนี้
          </div>
        )}

        {/* Event render */}
        <RenderEvent events={events} />

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination totalPages={totalPages} currentPage={page} baseUrl="/events" />
          </div>
        )}
      </div>
    </div>
  )
}
