"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, CalendarDays, User, BadgeCheck } from "lucide-react"
import { RenderDate } from "@/lib/date"
import numeral from "numeral"
import SlideImg from "@/components/Ui/SlideImg"
import HomeFilters from "@/components/HomeFilters"
import { Course } from "@/types/course"
import { getCourses } from "@/app/actions/course"
import { getLocationName } from "@/constants/location"

interface AllCourseClientProps {
  initialCourses: Course[]
}

export default function AllCourseClient({ initialCourses }: AllCourseClientProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [nationID, setNationID] = useState("ทั้งหมด")
  const [province, setProvince] = useState<string[]>([])
  const [courseLevel, setCourseLevel] = useState("ทั้งหมด")
  const [isPriceEnabled, setIsPriceEnabled] = useState(false)
  const [minPrice, setMinPrice] = useState("20000")
  const [maxPrice, setMaxPrice] = useState("50000")

  const handleSearch = async () => {
    try {
      const res = await getCourses({
        page: 1,
        limit: 50,
        nationID: nationID !== "ทั้งหมด" ? nationID : undefined,
        province: province.length > 0 ? province : undefined,
        courseLevel: courseLevel !== "ทั้งหมด" ? courseLevel : undefined,
        minPrice: isPriceEnabled ? minPrice.replace(/,/g, "") : undefined,
        maxPrice: isPriceEnabled ? maxPrice.replace(/,/g, "") : undefined,
      })
      if (res.success && res.data) {
        setCourses(res.data.data as Course[])
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    }
    setIsFilterOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#304B65] pb-32 font-sans selection:bg-[#568759]/30">
      <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-6 max-w-5xl">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-6">
          <Link
            href="/"
            className="absolute left-0 text-white font-bold flex items-center gap-2 hover:opacity-80 transition-opacity text-sm md:text-base"
          >
            <ArrowLeft size={20} className="stroke-[3]" /> ย้อนกลับ
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-white">ทริปทั้งหมด</h1>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <HomeFilters
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            nationID={nationID}
            setNationID={setNationID}
            province={province}
            setProvince={setProvince}
            courseLevel={courseLevel}
            setCourseLevel={setCourseLevel}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            isPriceEnabled={isPriceEnabled}
            setIsPriceEnabled={setIsPriceEnabled}
            handleSearch={handleSearch}
          />
        </div>

        {/* Trips List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-12 text-white/80 bg-black/10 rounded-2xl font-medium mt-4">
              ไม่พบข้อมูลทริป
            </div>
          ) : (
            courses.map((item, i) => {
              const { provinceName, districtName } = getLocationName(
                item.province,
                item.district,
                item.nation,
              )

              return (
                <Link
                  href={`/course/${item.id}`}
                  key={i}
                  className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 shadow-xl hover:shadow-2xl transition-shadow flex gap-4 md:gap-6 group cursor-pointer border border-transparent hover:border-[#4F7354]/30"
                >
                  <div className="relative w-[130px] md:w-[180px] h-[150px] md:h-[180px] shrink-0 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden bg-blue-100">
                    {item.image_urls && (
                      <SlideImg images={item.image_urls} alt="Indoor snowpark" />
                    )}
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#304B65] text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded shadow-sm">
                      {item.course_type?.toLowerCase().includes("ski") ? "Ski" : "Snowboard"}
                    </div>
                  </div>
                  <div className="flex flex-col py-2 pr-2 md:pr-4 flex-1 h-full">
                    <h4 className="font-bold text-base md:text-lg text-gray-900 mb-2 md:mb-3 leading-tight line-clamp-2 group-hover:text-[#4F7354] transition-colors">
                      {item?.title}
                    </h4>
                    <div className="space-y-1 md:space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm font-medium">
                        <MapPin size={16} className="text-gray-400 shrink-0" />
                        <span className="truncate">
                          {districtName ? `${districtName}, ` : ""}
                          {provinceName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm font-medium">
                        <CalendarDays size={16} className="text-gray-400 shrink-0" />
                        <span>
                          {RenderDate(item.start_date, "dd MMM yyyy")} {" - "}
                          {RenderDate(item.end_date, "dd MMM yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm font-medium">
                        <User size={16} className="text-gray-400 shrink-0" />
                        <span>{item.course_level}</span>
                      </div>
                      {item?.course_type && (
                        <div className="flex items-center gap-2 text-[#D4AF37] text-xs md:text-sm font-medium">
                          <BadgeCheck
                            size={16}
                            className="text-[#D4AF37] shrink-0 fill-[#D4AF37] text-white"
                          />
                          <span>{item.course_type}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-[#798E75] font-bold text-base md:text-lg">฿</span>
                      <span className="text-[#798E75] font-extrabold text-lg md:text-xl">
                        {numeral(item.price).format("0,0")}
                      </span>
                      <span className="text-gray-900 text-xs md:text-sm font-medium ml-1">
                        /คน
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
