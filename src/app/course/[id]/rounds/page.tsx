import { getCourseById } from "@/app/actions/course"
import { notFound } from "next/navigation"
import { Card } from "@/components/Ui/Card/Card"
import { CalendarDays, MapPin, ArrowLeft, Users, User, Clock } from "lucide-react"
import { RenderDate } from "@/lib/date"
import Link from "next/link"
import CalendarCourseRoundsFilter from "./CalendarCourseRoundsFilter"
import { format } from "date-fns"
import LevelBadge from "@/components/LevelBadge"
import BookingButton from "./BookingButton"
import LayoutPage from "@/components/Layout"

interface CourseRoundsPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ date?: string; adults?: string; children?: string }>
}

export default async function CourseRoundsPage({ params, searchParams }: CourseRoundsPageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const resolvedSearchParams = await searchParams
  const filterDate = resolvedSearchParams.date
  const adultsQuery = resolvedSearchParams.adults
  const childrenQuery = resolvedSearchParams.children

  const total_user = Number(adultsQuery) + Number(childrenQuery)

  const { success, data: course } = await getCourseById(id, 0)

  if (!success || !course) {
    return notFound()
  }

  return (
    <LayoutPage isLicense={false}>
      <div className="min-h-screen bg-[#304B65] pb-24 font-sans selection:bg-[#568759]/30">
        <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-10 max-w-7xl">
          {/* Header */}
          <div className="relative flex items-center justify-center mb-10">
            <Link
              href={`/course/${id}`}
              className="absolute left-0 text-white font-bold flex items-center gap-2 hover:opacity-80 transition-opacity text-sm md:text-base"
            >
              <ArrowLeft size={20} className="stroke-[3]" /> ย้อนกลับ
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Course Info & Calendar */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col w-full">
              <div className="mb-2 space-y-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-white leading-snug truncate">
                  {course.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#304B65] text-white font-bold rounded shadow-sm">
                    {course.course_type}
                  </span>
                  <LevelBadge level={course.course_level} />
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/90 text-sm md:text-[15px] font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={18} /> {course.district}, {course.province}
                  </div>
                  <div className="hidden md:block text-white/50">|</div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={18} /> {RenderDate(course.start_date, "d MMMM yyyy")} -{" "}
                    {RenderDate(course.end_date, "d MMMM yyyy")}
                  </div>
                </div>
              </div>

              {/* Calendar Filter */}
              <div className="w-full mt-4 lg:pr-8">
                <CalendarCourseRoundsFilter course={course} />
              </div>
            </div>

            {/* Right Column: Rounds List */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col w-full">
              {/* Rounds List Header */}
              <div className="flex items-center gap-2 text-white mb-6">
                <Clock size={22} className="stroke-[2.5]" />
                <h3 className="text-lg md:text-xl font-bold">เลือกรอบที่เปิดจอง</h3>
              </div>

              {!course?.rounds || course?.rounds?.length === 0 ? (
                <div className="text-center py-10 text-white/80 bg-black/10 rounded-2xl font-medium">
                  ไม่พบรอบในขณะนี้
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {(() => {
                    const displayRounds =
                      course?.rounds?.filter((round) => {
                        if (!filterDate) return true
                        return format(new Date(round?.start_date), "yyyy-MM-dd") === filterDate
                      }) || []

                    if (displayRounds.length === 0) {
                      return (
                        <div className="text-center py-10 text-white/80 bg-black/10 rounded-2xl font-medium">
                          ไม่พบรอบ{filterDate ? `ในวันที่ ${filterDate}` : "ในขณะนี้"}
                        </div>
                      )
                    }

                    return displayRounds.map((round) => (
                      <Card
                        key={round.id}
                        className="p-5 flex flex-row justify-between items-center bg-white rounded-2xl md:rounded-[1.5rem] border-none shadow-md"
                      >
                        <div className="space-y-1.5">
                          <div className="text-[#798E75] font-bold text-[17px] md:text-[19px]">
                            เวลา {RenderDate(round.start_date, "HH:mm")}-
                            {RenderDate(round.end_date, "HH:mm")}
                          </div>
                          <div className="flex items-center gap-2 text-gray-800 font-medium text-xs md:text-sm">
                            <CalendarDays size={16} className="text-gray-700" /> วันที่{" "}
                            {RenderDate(round.start_date, "d MMMM yyyy")}
                          </div>
                          <div className="flex items-center gap-2 text-gray-800 font-medium text-xs md:text-sm">
                            <Users size={16} className="text-gray-700" /> จำนวนที่รับ {round.total}{" "}
                            คน
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 md:gap-4">
                          <div className="bg-[#EAF3EA] text-[#798E75] px-3 py-1 rounded-full text-[11px] md:text-xs font-bold border border-[#798E75]/20">
                            เหลือ {round.total_user} ที่นั่ง
                          </div>

                          {total_user < round?.total_user && (
                            <BookingButton
                              courseId={course.id}
                              roundId={round.id}
                              adultPrice={course.price - (course.discount || 0)}
                              childPrice={course.child_price - (course.discount || 0)}
                              availableSeats={round.total}
                            />
                          )}
                        </div>
                      </Card>
                    ))
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutPage>
  )
}
