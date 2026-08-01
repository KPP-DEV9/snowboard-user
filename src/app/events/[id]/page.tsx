import { getSession } from "@/app/actions/auth"
import { getEventById, getByUserEventID } from "@/app/actions/event"
import Breadcrumbs from "@/components/Breadcrumbs"
import { notFound } from "next/navigation"
import numeral from "numeral"
import JoinButton from "@/components/Events/JoinButton"
import MediaCarousel from "@/components/Events/MediaCarousel"
import { Calendar, Users, DollarSign, MapPin } from "lucide-react"
import { RenderDate } from "@/lib/date"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: Props) {
  const session = await getSession()
  if (!session?.user) {
    return notFound()
  }

  const resolvedParams = await params
  const id = resolvedParams.id

  const res = await getEventById(id)

  if (!res.success || !res.data) {
    return (
      <div className="p-6 flex flex-col min-h-screen animate-fade-in">
        <Breadcrumbs title={"รายละเอียดกิจกรรม"} step={"EVENT DETAIL"} urlBack={`/events`} />
        <div className="flex-1 flex items-center justify-center text-text-muted">
          ไม่พบข้อมูลกิจกรรม
        </div>
      </div>
    )
  }

  const event = res.data

  const res2 = await getByUserEventID(event.id)
  const alreadyJoined = ["COMPLETED", "REGISTERED"].includes(res2?.status)

  const images = (event.images || [])
    .map((img) => img.replace(/[\["\]\\]/g, "").trim())
    .filter(Boolean)

  const videos = (event.videos || [])
    .map((vid) => vid.replace(/[\["\]\\]/g, "").trim())
    .filter(Boolean)

  const allMedia: { type: "image" | "video"; url: string }[] = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...videos.map((url) => ({ type: "video" as const, url })),
  ]

  if (allMedia.length === 0) {
    allMedia.push({
      type: "image",
      url: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=500&auto=format&fit=crop",
    })
  }

  return (
    <div className="p-6 flex flex-col min-h-screen animate-fade-in pb-[100px]">
      <Breadcrumbs title={"รายละเอียดกิจกรรม"} step={"EVENT DETAIL"} urlBack={`/events`} />

      <div className="mt-4 bg-card-bg/80 backdrop-blur-sm border border-card-border/50 rounded-2xl overflow-hidden shadow-lg">
        <MediaCarousel media={allMedia} title={event.title} />

        <div className="p-5 flex flex-col gap-6">
          <div className="flex flex-col gap-4 bg-[#22202180]/50 p-4 rounded-xl border border-card-border/30">
            <div className="flex items-start gap-3">
              <Calendar className="text-gold" />
              <div className="flex flex-col">
                <span className="text-[12px] text-text-muted mb-0.5">วันที่จัดกิจกรรม</span>
                <span className="text-[14px] text-foreground font-semibold">
                  เริ่ม{" "}
                  {event.start_date
                    ? RenderDate(event.start_date, "dd MMMM yyyy เวลา HH:mm น.")
                    : "เร็วๆนี้"}
                </span>
                <span className="text-[14px] text-foreground font-semibold">
                  ถึง{" "}
                  {event.end_date
                    ? RenderDate(event.end_date, "dd MMMM yyyy เวลา HH:mm น.")
                    : "เร็วๆนี้"}
                </span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-card-border/30"></div>

            <div className="flex items-start gap-3">
              <Users className="text-gold" />
              <div className="flex flex-col">
                <span className="text-[12px] text-text-muted mb-0.5">จำนวนผู้เข้าร่วม</span>
                <span className="text-[14px] text-foreground font-semibold">
                  {event.limit_player
                    ? `สมัคร ${numeral(event.participant_count).format("0,0")} จำกัด ${numeral(event.limit_player).format("0,0")} ท่าน`
                    : "ไม่จำกัดจำนวน"}
                </span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-card-border/30"></div>

            <div className="flex items-start gap-3">
              <DollarSign className="text-gold" />
              <div className="flex flex-col">
                <span className="text-[12px] text-text-muted mb-0.5">ค่าสมัครเข้าร่วม</span>
                <span className="text-[14px] text-gold font-bold">
                  {event.application_fee && Number(event.application_fee) > 0
                    ? `${numeral(event.application_fee).format("0,0.00")} บาท`
                    : "เข้าร่วมฟรี"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-gold" />
              <div className="flex flex-col">
                <span className="text-[12px] text-text-muted mb-0.5">สถานที่จัดกิจกรรม</span>
                <span className="text-[14px] text-gold font-bold">{event.location}</span>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="flex flex-col gap-2 mt-2">
              <h3 className="text-[16px] font-bold text-foreground">รายละเอียดกิจกรรม</h3>
              <p className="text-[14px] text-text-muted whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {alreadyJoined ? (
        <div className="mt-8 mb-4 sticky bottom-24 z-10">
          <div className="w-full bg-line-green/10 text-line-green text-center py-4 rounded-xl font-bold border border-line-green/30">
            ✅ คุณลงทะเบียนเข้าร่วมกิจกรรมนี้แล้ว
          </div>
        </div>
      ) : (
        <div className="mt-8 mb-4 sticky bottom-24 z-10">
          <JoinButton
            userId={session.user.id}
            eventId={event.id}
            fee={Number(event.application_fee) || 0}
          />
        </div>
      )}
    </div>
  )
}
