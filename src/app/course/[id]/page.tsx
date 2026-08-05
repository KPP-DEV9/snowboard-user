import { getCourseById } from "@/app/actions/course"
import { notFound } from "next/navigation"
import numeral from "numeral"
import { MapPin, CalendarDays, ArrowLeft, ArrowRight, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { RenderDate } from "@/lib/date"
import { getSession } from "@/app/actions/auth"
import LevelBadge from "@/components/LevelBadge"

interface CourseDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const session = await getSession()
  const resolvedParams = await params
  const { id } = resolvedParams

  const { success, data: course } = await getCourseById(id)

  if (!success || !course) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-[#859877] pb-24 font-sans selection:bg-[#568759]/30">
      {/* Header Image Strip */}
      <div className="relative w-full h-[180px] md:h-[400px]">
        <Image
          src={
            "https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=1200&auto=format&fit=crop"
          }
          alt="Course cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-6 max-w-7xl">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-bold mb-6 hover:opacity-80 transition-opacity w-fit text-lg"
        >
          <ArrowLeft size={22} className="stroke-[3]" /> ย้อนกลับ
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Content (Left Card) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col w-full">
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-xl flex-1">
              {/* Chips */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="bg-[#1877F2] text-white text-[11px] md:text-xs font-bold px-3 py-1.5 rounded shadow-sm">
                  {course.course_type?.name || "Progression camp"}
                </div>

                <LevelBadge level={course.course_level} />
              </div>

              {/* Title */}
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 leading-snug">
                {course.title}
              </h1>

              {/* Info Details */}
              <div className="space-y-3.5 mb-8">
                <div className="flex items-center gap-2.5 text-gray-500 font-medium text-sm md:text-base">
                  <MapPin size={18} className="text-gray-400 shrink-0" />
                  <span>
                    {course.district?.name}, {course.province?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-500 font-medium text-sm md:text-base">
                  <CalendarDays size={18} className="text-gray-400 shrink-0" />
                  <span>
                    {RenderDate(course.start_date, "dd MMM yyyy")} -{" "}
                    {RenderDate(course.end_date, "dd MMM yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-500 font-medium text-sm md:text-base">
                  <User size={18} className="text-gray-400 shrink-0" />
                  <span>{course.course_level || "Beginer"}</span>
                </div>
              </div>

              {/* Description Section */}
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                รายละเอียด
              </h2>
              <div className="text-gray-500 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                {course.description || "ไม่มีรายละเอียดเพิ่มเติม"}
              </div>
            </div>
          </div>

          {/* Sidebar / Booking (Right Card) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col w-full lg:sticky lg:top-6">
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-xl w-full">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">ข้อมูลการจอง</h3>

              <div className="space-y-3.5 mb-8">
                <div className="flex justify-between items-center text-[15px] font-medium">
                  <span className="text-gray-500">ระดับผู้เรียน</span>
                  <span className="text-gray-400">{course.course_level || "-"}</span>
                </div>
                <div className="flex justify-between items-center text-[15px] font-medium">
                  <span className="text-gray-500">ระยะเวลา (วัน)</span>
                  <span className="text-gray-400">{course.total_days || "-"} วัน</span>
                </div>
                <div className="flex justify-between items-center text-[15px] font-medium">
                  <span className="text-gray-500">รับจำนวน</span>
                  <span className="text-gray-400">{course.max_students || "-"} คน</span>
                </div>
              </div>

              <div className="font-bold text-lg md:text-xl text-gray-900 mb-4">
                ราคาทริป <span className="text-sm font-bold text-gray-900">/ ท่าน</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <div className="text-[13px] md:text-sm text-gray-500 mb-1 font-medium">
                    ราคาผู้ใหญ่
                  </div>
                  <div className="text-2xl md:text-[28px] font-extrabold text-[#D94C2B] leading-none mb-1">
                    ฿ {numeral(course.adult_price - (course.discount || 0)).format("0,0")}
                  </div>
                  {(course.discount || 0) > 0 && (
                    <div className="text-gray-400 line-through font-bold text-sm">
                      ฿ {numeral(course.adult_price).format("0,0")}
                    </div>
                  )}
                </div>

                {course.child_price > 0 && (
                  <div>
                    <div className="text-[13px] md:text-sm text-gray-500 mb-1 font-medium">
                      ราคาเด็ก
                    </div>
                    <div className="text-2xl md:text-[28px] font-extrabold text-gray-900 leading-none">
                      <span className="text-[#4F7354]">฿</span>{" "}
                      {numeral(course.child_price).format("0,0")}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={
                  !session?.user
                    ? `/signin?pathname=/course/${course.id}/rounds`
                    : `/course/${course.id}/rounds`
                }
                className="w-full flex items-center justify-center gap-2 bg-[#D94C2B] hover:bg-[#b03c20] text-white py-3.5 md:py-4 rounded-[1rem] font-bold text-[17px] transition-colors shadow-sm mt-8"
              >
                จองทริป <ArrowRight size={20} className="stroke-[3]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
