import { getCourseById } from "@/app/actions/course"
import { notFound } from "next/navigation"
import numeral from "numeral"
import { MapPin, CalendarDays, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { RenderDate } from "@/lib/date"
import { getSession } from "@/app/actions/auth"

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
    <div className="min-h-screen bg-[#859877] pb-24 font-sans">
      {/* Header Image */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=1200&auto=format&fit=crop"
          alt="Course cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <Link
          href="/"
          className="absolute top-6 left-4 md:left-8 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div className="absolute bottom-6 left-4 md:left-8 right-4 md:right-8">
          <div className="bg-[#1877F2] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm w-fit mb-3">
            {course.course_type?.name || "COURSE"}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">
            {course.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base font-medium drop-shadow-sm">
            <div className="flex items-center gap-1.5">
              <MapPin size={18} />
              <span>
                {course.district?.name} {course.province?.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays size={18} />
              <span>
                {RenderDate(course.start_date, "dd MMM yyyy")} -{" "}
                {RenderDate(course.end_date, "dd MMM yyyy")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#4F7354] rounded-full"></div>
                รายละเอียด
              </h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {course.description || "ไม่มีรายละเอียดเพิ่มเติม"}
              </div>
            </div>
          </div>

          {/* Sidebar / Booking */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">ข้อมูลการจอง</h3>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-gray-500">ระดับผู้เรียน</span>
                  <span className="text-gray-600">{course.course_level || "-"}</span>
                </div>
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-gray-500">ระยะเวลา (วัน)</span>
                  <span className="text-gray-600">{course.total_days || "-"} วัน</span>
                </div>
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-gray-500">รับจำนวน</span>
                  <span className="text-gray-600">{course.max_students || "-"} คน</span>
                </div>
              </div>

              <div className="font-bold text-lg text-gray-900 mb-4">
                ราคาทริป <span className="text-sm font-normal text-gray-900">/ ท่าน</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-[13px] text-gray-500 mb-1">ราคาผู้ใหญ่</div>
                  <div className="text-[26px] font-bold text-[#D94C2B] leading-none mb-1">
                    ฿ {numeral(course.adult_price - (course.discount || 0)).format("0,0")}
                  </div>
                  {(course.discount || 0) > 0 && (
                    <div className="text-gray-400 line-through font-medium text-sm">
                      ฿ {numeral(course.adult_price).format("0,0")}
                    </div>
                  )}
                </div>

                {course.child_price > 0 && (
                  <div>
                    <div className="text-[13px] text-gray-500 mb-1">ราคาเด็ก</div>
                    <div className="text-[26px] font-bold text-gray-900 leading-none">
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
                className="w-full flex items-center justify-center gap-2 bg-[#D94C2B] hover:bg-[#b03c20] text-white py-3.5 rounded-[12px] font-bold text-[17px] transition-colors shadow-sm mt-4"
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
