import { getCourseById } from "@/app/actions/course"
import { notFound } from "next/navigation"
import { MapPin, CalendarDays, ArrowLeft, Award } from "lucide-react"
import Link from "next/link"
import CourseBookingWidget from "@/components/CourseBookingWidget"
import LayoutPage from "@/components/Layout"
import { getLocationName } from "@/constants/location"
import { NATIONALITIES, getCountryTh } from "@/constants/nationality"
import SlideImg from "@/components/Ui/SlideImg"
import { HotelsMaster } from "@/types/model"
import PackageInclusions from "./PackageInclusions"
import PackageExclusions from "./PackageExclusions"

interface CourseDetailsPageProps {
  params: Promise<{ id: string }>
}

const defaultInclusions = [
  "ที่พัก 5 คืน",
  "Breakfast + Dinner",
  "Free Shuttle Bus จาก JR Iiyama Station",
  "Coaching ตามโปรแกรม",
  "Group Lesson (ฟรี)",
  "Ride & Learn (ฟรี)",
  "การดูแลจากทีม Coach & SNOWVIBES ตลอดทริป",
]

const defaultExclusions = [
  "ตั๋วเครื่องบินไป-กลับญี่ปุ่น",
  "ค่าเดินทางนอกเหนือจากที่ระบุในโปรแกรม",
  "ค่าเช่าอุปกรณ์ Snowboard",
  "ค่า Lift Pass",
  "ค่า Private Lesson ที่มีค่าใช้จ่ายเพิ่มเติม",
  "อาหารและเครื่องดื่มนอกเหนือจากที่ระบุ",
  "ประกันการเดินทาง",
]

function parsePackageItems(raw?: string, defaults: string[] = []): string[] {
  if (!raw || !raw.trim()) return defaults
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(String)
  } catch {}
  const lines = raw
    .split("\n")
    .map((s) => s.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean)
  return lines.length > 0 ? lines : defaults
}

function formatThaiDate(dateStr?: string | Date): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ""
  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ]
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const { success, data: course } = await getCourseById(id, 0)

  if (!success || !course) {
    return notFound()
  }

  const { provinceName, districtName, nationName } = getLocationName(
    course.province,
    course.district,
    course.nation,
  )
  const countryTh = getCountryTh(course.nation) || nationName

  const courseAny = course as any

  const hotelsList: HotelsMaster[] =
    course.hotels && course.hotels.length > 0
      ? course.hotels
      : (((courseAny.course_hotels || courseAny.course_hotel || []) as any[])
          .map((ch) => ch.hotel)
          .filter(Boolean) as HotelsMaster[])

  const hotelImages = hotelsList.flatMap((h) => h.images || [])
  const roomImages = [
    ...hotelsList.flatMap((h) => h.rooms?.flatMap((r) => r.images || []) || []),
    ...(courseAny.course_rooms?.flatMap((cr: any) => cr.room_master?.images || []) || []),
  ]

  const allImages = Array.from(
    new Set([...(course.image_urls || []), ...hotelImages, ...roomImages]),
  ).filter(Boolean)

  // Dates & Duration
  const startDateStr = formatThaiDate(course.start_date)
  const endDateStr = formatThaiDate(course.end_date)

  let days = course.total_days || 0
  let nights = Math.max(0, days - 1)
  if (!days && course.start_date && course.end_date) {
    const start = new Date(course.start_date).getTime()
    const end = new Date(course.end_date).getTime()
    if (!isNaN(start) && !isNaN(end)) {
      days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1)
      nights = Math.max(0, days - 1)
    }
  }
  const durationText = days > 0 ? `${days} วัน / ${nights} คืน` : ""

  const inclusions = parsePackageItems(courseAny.include_package, defaultInclusions)
  const exclusions = parsePackageItems(courseAny.exclude_package, defaultExclusions)

  return (
    <LayoutPage isLicense={false}>
      <div className="w-full min-h-screen pb-28">
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-6">
          {/* Header Navigation */}
          <div className="relative flex items-center justify-center mb-6">
            <Link
              href="/"
              className="absolute left-0 text-white font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity text-sm md:text-base group"
              aria-label="ย้อนกลับ"
            >
              <div className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <ArrowLeft size={20} className="stroke-[2.5] text-white" />
              </div>
            </Link>
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide drop-shadow-md">
              รายละเอียดทริป
            </h1>
          </div>

          {/* Hero Slider */}
          <div className="relative w-full aspect-[920/474] rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-lg mb-5 bg-gray-900">
            {allImages.length > 0 ? (
              <SlideImg images={allImages} alt={course.title} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
                ไม่มีรูปภาพ
              </div>
            )}
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (Main Info & Hotels) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Title & Location Card */}
              <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm">
                <h2 className="text-lg md:text-xl font-extrabold text-gray-900 mb-2 leading-snug">
                  {course.title}
                </h2>
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500 font-medium">
                  <MapPin size={15} className="text-[#E86034] shrink-0" />
                  <span>
                    {[districtName, provinceName, countryTh]
                      .filter(Boolean)
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .join(", ")}
                  </span>
                </div>
              </div>

              {/* Info Row (2 cards) */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* Trip Date Card */}
                <div className="bg-white rounded-[1.25rem] p-4 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E86034] flex items-center justify-center shrink-0">
                    <CalendarDays size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] sm:text-xs text-gray-400 font-medium">
                      วันเดินทาง
                    </span>
                    <div className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      {startDateStr && endDateStr ? (
                        <>
                          <span className="block md:inline">{startDateStr} -</span>{" "}
                          <span className="block md:inline">{endDateStr}</span>
                        </>
                      ) : (
                        "เร็วๆ นี้"
                      )}
                    </div>
                    {durationText && (
                      <span className="text-[11px] font-bold text-[#E86034] mt-0.5">
                        {durationText}
                      </span>
                    )}
                  </div>
                </div>

                {/* Level & Suitable For Card */}
                <div className="bg-white rounded-[1.25rem] p-4 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <Award size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] sm:text-xs text-gray-400 font-medium">
                      เหมาะสำหรับ
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {course.course_level || "Beginer"}
                    </span>
                    <span className="text-[11px] font-medium text-gray-500 mt-0.5 truncate">
                      {courseAny.program_type_category_detail?.name ||
                        courseAny.program_type_category ||
                        course.program_type ||
                        "Park & Freestyle"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Card */}
              <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-400 mb-3 tracking-wide">รายละเอียด</h3>
                <div className="text-xs sm:text-sm md:text-[14px] text-gray-700 leading-relaxed font-normal whitespace-pre-line max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
                  {course.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                </div>
              </div>

              {/* Inclusions & Exclusions for Mobile (lg:hidden) */}
              <div className="flex flex-col gap-4 lg:hidden">
                <PackageInclusions inclusions={inclusions} />
                <PackageExclusions exclusions={exclusions} />
              </div>

              {/* Hotels / Accommodations */}
              {hotelsList.length > 0 && (
                <div className="flex flex-col gap-4">
                  {hotelsList.map((hotel, idx) => {
                    const allHotelImages = Array.from(
                      new Set([
                        ...(hotel.images || []),
                        ...(hotel.rooms?.flatMap((r) => r.images || []) || []),
                      ]),
                    ).filter(Boolean)

                    return (
                      <div
                        key={hotel.id || idx}
                        className="bg-white rounded-[1.5rem] p-5 shadow-sm"
                      >
                        <h4 className="text-xs font-bold text-gray-400 mb-3">ที่พัก / โรงแรม</h4>

                        {allHotelImages.length > 0 && (
                          <div className="relative w-full h-[180px] sm:h-[220px] rounded-xl overflow-hidden mb-3.5 bg-gray-100">
                            <SlideImg images={allHotelImages} alt={hotel.name} />
                          </div>
                        )}

                        <Link
                          href={`/hotels/${hotel.id || encodeURIComponent(hotel.name)}`}
                          className="font-extrabold text-sm sm:text-base text-gray-900 hover:text-[#C75D33] transition-colors block mb-1.5"
                        >
                          {hotel.name.toUpperCase()}
                        </Link>

                        {hotel.rooms && hotel.rooms.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 mt-2">
                            <span className="text-[11px] font-medium text-gray-400 mr-1">
                              รูปแบบห้อง:
                            </span>
                            {hotel.rooms.map((room, rIdx) => (
                              <span
                                key={room.id || rIdx}
                                className="bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-medium px-2 py-0.5 rounded-md"
                              >
                                {room.name || room.room_type || "Standard"}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Mobile Booking Widget (at bottom on mobile) */}
              <div className="lg:hidden mt-2">
                <CourseBookingWidget
                  courseId={course.id}
                  adultPrice={course.price}
                  childPrice={course.child_price}
                  discount={course.discount || 0}
                  vat={course.vat}
                />
              </div>
            </div>

            {/* Right Column (Desktop only: Booking Widget & Inclusions/Exclusions) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 sticky top-36">
              <CourseBookingWidget
                courseId={course.id}
                adultPrice={course.price}
                childPrice={course.child_price}
                discount={course.discount || 0}
                vat={course.vat}
              />
              <PackageInclusions inclusions={inclusions} />
              <PackageExclusions exclusions={exclusions} />
            </div>
          </div>
        </div>
      </div>
    </LayoutPage>
  )
}
