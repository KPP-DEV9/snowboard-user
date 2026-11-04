import Link from "next/link"
import { MapPin, CalendarDays } from "lucide-react"
import SlideImg from "@/components/Ui/SlideImg"
import { RenderDate } from "@/lib/date"
import numeral from "numeral"
import { Course } from "@/types/model"
import { getLocationName } from "@/constants/location"

export interface CourseBoxProps {
  course: Course
  courseType?: string
  className?: string
}

export default function CourseBox({ course, courseType, className = "" }: CourseBoxProps) {
  const { provinceName, districtName } = getLocationName(
    course.province,
    course.district,
    course.nation,
  )

  const price = Number(course.price || 0)
  const discount = Number(course.discount || 0)
  const finalPrice = price - discount

  const effectiveType = courseType || course.course_types || course.course_type
  const typeBadgeLabel =
    effectiveType === "SKI"
      ? "Ski"
      : effectiveType === "SNOWBOARD"
        ? "Snowboard"
        : effectiveType || "Snowboard"

  const widthClasses =
    className && /\bw-/.test(className)
      ? ""
      : "w-[280px] sm:w-[320px] md:w-[335px] shrink-0 snap-start"

  const baseClasses =
    "bg-white rounded-[1.75rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"

  const combinedClasses = [widthClasses, baseClasses, className].filter(Boolean).join(" ")

  return (
    <Link href={`/course/${course.id}`} className={combinedClasses}>
      <div className="relative h-[165px] md:h-[180px] w-full overflow-hidden bg-gray-100">
        {course.image_urls && course.image_urls.length > 0 ? (
          <SlideImg images={course.image_urls} alt={course.title || "Course"} />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            ไม่มีรูปภาพ
          </div>
        )}
        <div className="absolute top-3 left-3 bg-[#1E5BB1] text-white text-[11px] font-semibold px-3 py-0.5 rounded-full shadow-sm z-10 pointer-events-none">
          {typeBadgeLabel}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="font-bold text-sm md:text-base text-gray-900 mb-2 truncate group-hover:text-[#4F7354] transition-colors">
            {course.title}
          </h4>
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
              <MapPin size={14} className="text-gray-400 shrink-0" />
              <span className="truncate">
                {districtName ? `${districtName} , ` : ""}
                {provinceName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
              <CalendarDays size={14} className="text-gray-400 shrink-0" />
              <span className="truncate">
                {RenderDate(course.start_date, "dd MMM yyyy")} {" - "}
                {RenderDate(course.end_date, "dd MMM yyyy")}
              </span>
            </div>
          </div>
        </div>

        {discount > 0 ? (
          <div className="flex items-baseline gap-2 pt-3 border-t border-gray-100 mt-auto">
            <span className="text-[#DC2626] font-bold text-base md:text-lg">
              ฿ {numeral(finalPrice).format("0,0")}
            </span>
            <span className="text-gray-400 text-xs sm:text-sm line-through decoration-gray-400">
              ฿ {numeral(price).format("0,0")}
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1 pt-3 border-t border-gray-100 mt-auto">
            <span className="text-[#DC2626] font-bold text-base md:text-lg">
              ฿ {numeral(finalPrice).format("0,0")}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
