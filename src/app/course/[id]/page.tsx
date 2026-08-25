import { getCourseById } from "@/app/actions/course"
import { notFound } from "next/navigation"
import { MapPin, CalendarDays, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { RenderDate } from "@/lib/date"
import CourseBookingWidget from "@/components/CourseBookingWidget"
import LayoutPage from "@/components/Layout"
import { getLocationName } from "@/constants/location"
import SlideImg from "@/components/Ui/SlideImg"

interface CourseDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const { success, data: course } = await getCourseById(id, 0)

  if (!success || !course) {
    return notFound()
  }

  const { provinceName, districtName } = getLocationName(
    course.province,
    course.district,
    course.nation,
  )

  return (
    <LayoutPage isLicense={false}>
      <div className="min-h-screen font-sans bg-white pb-16">
        {/* Header Image Strip */}
        <div className="relative w-full h-[400px] md:h-[400px] p-4">
          {/* Background Navy at the top half */}
          <div className="absolute top-0 left-0 right-0 h-[80%] bg-[#304B65]" />

          <div className="relative w-full h-full overflow-hidden rounded-[1rem]">
            <SlideImg
              images={
                course.image_urls && course.image_urls.length > 0
                  ? course.image_urls
                  : [
                      "https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=1200&auto=format&fit=crop",
                    ]
              }
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>

          {/* Back Button */}
          <Link
            href="/"
            className="absolute top-6 left-4 md:left-8 flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity z-10 w-10 h-10"
          >
            <ArrowLeft size={28} className="stroke-[3]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="w-full px-6 md:px-8 lg:px-12 mx-auto pt-6 max-w-3xl">
            <div className="flex flex-col w-full">
              {/* Title */}
              <h1 className="text-[22px] md:text-3xl font-extrabold text-gray-900 mb-5 leading-tight">
                {course.title}
              </h1>

              {/* Info Details */}
              <div className="space-y-2.5 mb-6">
                <div className="flex items-center gap-3 text-gray-600 font-medium text-[15px]">
                  <MapPin size={18} className="text-gray-500 shrink-0" />
                  <span>
                    {districtName} {provinceName ? `, ${provinceName}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 font-medium text-[15px]">
                  <CalendarDays size={18} className="text-gray-500 shrink-0" />
                  <span>
                    {RenderDate(course.start_date, "dd MMM yyyy")} -{" "}
                    {RenderDate(course.end_date, "dd MMM yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 font-medium text-[15px]">
                  <User size={18} className="text-gray-500 shrink-0" />
                  <span>{course.course_level || "Beginer"}</span>
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-5">
                <h2 className="text-[14px] font-bold text-gray-400 mb-1">รายละเอียด</h2>
                <div className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                  {course.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                </div>
              </div>

              {/* Booking Conditions Section */}
              <div className="mb-2">
                <h2 className="text-[14px] font-bold text-gray-400 mb-1">เงื่อนไขการจอง</h2>
                <div className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                  ชำระเงินเพื่อยืนยันการจอง 20% ของราคาทริป โดยส่วนที่เหลือจะต้องชำระก่อนวันเดินทาง
                  30 วัน โดยระบบจะทำการแจ้งเตือนให้ชำระเงินผ่าน Line Application
                  <br />
                  <span className="text-gray-600">**กรณีงดเดินทางขอสงวนสิทธิ์ในการคืนมัดจำ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Widget (Full Width at Bottom) */}
          <div className="w-full max-w-3xl mx-auto px-2">
            <CourseBookingWidget
              courseId={course.id}
              adultPrice={course.price}
              childPrice={course.child_price}
              discount={course.discount || 0}
            />
          </div>
        </div>
      </div>
    </LayoutPage>
  )
}
