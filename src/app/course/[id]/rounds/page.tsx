import { getCourseById } from "@/app/actions/course"
import { notFound } from "next/navigation"
import { Card } from "@/components/Ui/Card/Card"
import { CalendarDays, MapPin, ArrowLeft, Users, User } from "lucide-react"
import { RenderDate } from "@/lib/date"
import Link from "next/link"
import CourseRoundsFilter from "./CourseRoundsFilter"
import { format } from "date-fns"

interface CourseRoundsPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ date?: string }>
}

export default async function CourseRoundsPage({ params, searchParams }: CourseRoundsPageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const resolvedSearchParams = await searchParams
  const filterDate = resolvedSearchParams.date

  const { success, data: course } = await getCourseById(id)

  if (!success || !course) {
    return notFound()
  }

  const shortId = course.id.split("-")[0]?.toUpperCase()

  return (
    <div className="min-h-screen pb-24 font-sans">
      <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-8 max-w-xl">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-8">
          <Link href={`/course/${id}`} className="absolute left-0 text-white">
            <ArrowLeft size={28} />
          </Link>
          <h1 className="text-xl font-bold text-white">รอบที่เปิดจอง</h1>
        </div>

        {/* Course Info */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-[#0056D2] text-white text-xs font-bold px-3 py-1 rounded-md">
              {course.course_type?.name || "Snowboard"}
            </span>
            <span className="text-white/80 text-sm">{shortId}</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4 leading-snug">{course.title}</h2>

          <div className="space-y-2 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <MapPin size={18} /> {course.district?.name}, {course.province?.name}
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={18} /> {RenderDate(course.start_date, "d MMMM yyyy")} -{" "}
              {RenderDate(course.end_date, "d MMMM yyyy")}
            </div>
            <div className="flex items-center gap-2">
              <User size={18} /> {course.course_level}
            </div>
          </div>
        </div>

        {/* Calendar Filter */}
        <CourseRoundsFilter course={course} />

        {/* Rounds List Header */}
        <h3 className="text-xl font-bold text-white mt-8 mb-4">เลือกรอบที่เปิดจอง</h3>

        {/* Rounds List */}
        <div className="space-y-4">
          {(() => {
            const displayRounds =
              course.rounds?.filter((round) => {
                if (!filterDate) return true
                return format(new Date(round.start_date), "yyyy-MM-dd") === filterDate
              }) || []

            if (displayRounds.length === 0) {
              return (
                <div className="text-center py-10 text-white/80 bg-black/10 rounded-2xl">
                  ไม่พบรอบ{filterDate ? `ในวันที่ ${filterDate}` : "ในขณะนี้"}
                </div>
              )
            }

            return displayRounds.map((round) => (
              <Card
                key={round.id}
                className="p-5 flex flex-row justify-between items-center bg-white rounded-3xl border-none shadow-md"
              >
                <div className="space-y-2">
                  <div className="text-gray-700 font-medium mb-1">
                    เวลา{" "}
                    <span className="text-[#357948] text-2xl font-bold ml-1">
                      {RenderDate(round.start_date, "HH:mm")}-{RenderDate(round.end_date, "HH:mm")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-800 font-medium text-sm">
                    <CalendarDays size={18} className="text-gray-700" /> วันที่{" "}
                    {RenderDate(round.start_date, "d MMMM yyyy")}
                  </div>
                  <div className="flex items-center gap-2 text-gray-800 font-medium text-sm">
                    <Users size={18} className="text-gray-700" /> จำนวนที่รับ {round.total} คน
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center gap-4">
                  <div className="bg-[#EAF3EA] text-[#357948] px-3 py-1.5 rounded-md text-xs font-bold">
                    เหลือ {round.total} ที่นั่ง
                  </div>
                  <Link
                    href={`/payment/?course_id=${course.id}&round_id=${round.id}`}
                    className="bg-[#CD4B2B] hover:bg-[#b03c20] text-white px-8 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
                  >
                    เลือก
                  </Link>
                </div>
              </Card>
            ))
          })()}
        </div>
      </div>
    </div>
  )
}
