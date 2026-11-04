"use client"

import CourseTypeTabs from "@/components/CourseTypeTabs"
import { MapPin, CalendarDays, User, ChevronLeft, ChevronRight } from "lucide-react"
import SlideImg from "@/components/Ui/SlideImg"
import Logo from "@/components/Logo"
import HomeFilters from "@/components/HomeFilters"
import CourseBox from "@/components/CourseBox"
import { getCourses } from "./actions/course"
import { RenderDate } from "@/lib/date"
import numeral from "numeral"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { Course } from "@/types/model"
import LayoutPage from "@/components/Layout"
import { getLocationName } from "@/constants/location"

export type CategoryType = "SNOWBOARD" | "SKI"

export interface SearchOverrides {
  nationID?: string
  province?: string[]
  courseLevel?: string
  type?: CategoryType
  isPriceEnabled?: boolean
  minPrice?: string
  maxPrice?: string
}

export default function MainPage() {
  const [course, setCourse] = useState<Course[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const upcomingSliderRef = useRef<HTMLDivElement>(null)

  const [nationID, setNationID] = useState("ทั้งหมด")
  const [province, setProvince] = useState<string[]>([])
  const [courseLevel, setCourseLevel] = useState("ทั้งหมด")
  const [courseType, setCourseType] = useState<CategoryType>("SNOWBOARD") // Placeholder if needed in future
  const [isPriceEnabled, setIsPriceEnabled] = useState(false)
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("50000")

  const scrollUpcoming = (direction: "left" | "right") => {
    if (upcomingSliderRef.current) {
      const scrollAmount = 350
      upcomingSliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleSearch = async (targetPage = 1, type?: CategoryType, overrides?: SearchOverrides) => {
    const effNation = overrides?.nationID !== undefined ? overrides.nationID : nationID
    const effProvince = overrides?.province !== undefined ? overrides.province : province
    const effLevel = overrides?.courseLevel !== undefined ? overrides.courseLevel : courseLevel
    const effType = overrides?.type !== undefined ? overrides.type : type || courseType
    const effPriceEnabled =
      overrides?.isPriceEnabled !== undefined ? overrides.isPriceEnabled : isPriceEnabled
    const effMinPrice = overrides?.minPrice !== undefined ? overrides.minPrice : minPrice
    const effMaxPrice = overrides?.maxPrice !== undefined ? overrides.maxPrice : maxPrice

    try {
      const res = await getCourses({
        page: targetPage,
        limit: 10,
        nationID: effNation !== "ทั้งหมด" ? effNation : undefined,
        province: effProvince.length > 0 ? effProvince : undefined,
        courseLevel: effLevel !== "ทั้งหมด" ? effLevel : undefined,
        courseType: effType ? effType : undefined,
        minPrice: effPriceEnabled ? effMinPrice.replace(/,/g, "") : undefined,
        maxPrice: effPriceEnabled ? effMaxPrice.replace(/,/g, "") : undefined,
      })
      const courseList = (
        Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
      ) as Course[]

      setCourse(courseList)
      setTotalPages(res?.data?.total_pages || (res as any)?.total_pages || 1)
      setPage(res?.data?.page || (res as any)?.page || 1)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      setCourse([])
    }
    setIsFilterOpen(false)
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <LayoutPage>
      <div className="min-h-screen pb-28 font-sans">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 mx-auto pt-6 md:pt-8 relative max-w-6xl">
          {/* Header Section */}
          <div className="relative flex flex-col items-center justify-center mb-8 md:mb-10 gap-4 md:gap-5 w-full">
            {/* Centered Logo */}
            <div className="flex items-center justify-center">
              <Link href="/" className="cursor-pointer hover:opacity-90 transition-opacity">
                <Logo />
              </Link>
            </div>

            {/* Greeting Text */}
            <h2 className="text-white text-base md:text-lg lg:text-xl font-bold drop-shadow-md text-center">
              สวัสดี, เตรียมตัวให้พร้อมสำหรับทริปสุดพิเศษของคุณ
            </h2>

            {/* Category Tabs */}
            <CourseTypeTabs setCourseType={setCourseType} handleSearch={handleSearch} page={page} />

            {/* Filters */}
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

          {/* Upcoming Trips Section */}
          <div className="bg-[#0A1A28]/20 backdrop-blur-sm border border-white/15 rounded-[2rem] p-6 md:p-8 shadow-xl w-full mb-10 relative">
            <div className="flex items-center justify-center mb-6">
              <h3 className="text-white text-base md:text-lg font-bold tracking-wide">
                ทริปที่กำลังจะถึง..
              </h3>
            </div>

            <div className="relative">
              {/* Slider Arrow Navigation Buttons */}
              {course && course.length > 2 && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollUpcoming("left")}
                    aria-label="Previous trip"
                    className="absolute -left-10 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#0A1A28]/90 hover:bg-[#122232] text-white border border-white/20 shadow-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollUpcoming("right")}
                    aria-label="Next trip"
                    className="absolute -right-10 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#0A1A28]/90 hover:bg-[#122232] text-white border border-white/20 shadow-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <div
                ref={upcomingSliderRef}
                className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {course?.length === 0 ? (
                  <div className="col-span-full w-full text-center py-8 text-white/80 font-medium">
                    ไม่พบข้อมูลทริป
                  </div>
                ) : (
                  course?.map((item, i) => (
                    <CourseBox key={item.id || i} course={item} courseType={courseType} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* CourseType Trips Section */}
          <div className="w-full flex flex-col mb-8">
            <div className="flex justify-between items-end mb-4 px-1">
              <h3 className="text-white text-xl md:text-2xl font-bold tracking-wide">
                ทริป {courseType === "SKI" ? "Ski" : "Snowboard"}
              </h3>
              <Link
                href="/all-course"
                className="text-[#86EFAC] font-bold hover:underline transition-colors text-sm md:text-base"
              >
                ทั้งหมด
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course?.length === 0 ? (
                <div className="col-span-full text-center py-12 text-white/80 bg-black/10 rounded-2xl font-medium">
                  ไม่พบข้อมูลทริป {courseType === "SKI" ? "Ski" : "Snowboard"}
                </div>
              ) : (
                course?.map((item, i) => {
                  const { provinceName, districtName } = getLocationName(
                    item.province,
                    item.district,
                    item.nation,
                  )
                  const price = Number(item.price || 0)
                  const discount = Number(item.discount || 0)
                  const finalPrice = price - discount

                  return (
                    <Link
                      href={`/course/${item.id}`}
                      key={i}
                      className="bg-white rounded-[1.5rem] p-3.5 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 flex gap-4 cursor-pointer group"
                    >
                      <div className="relative w-[130px] sm:w-[150px] md:w-[160px] h-[120px] sm:h-[130px] shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                        {item.image_urls && item.image_urls.length > 0 ? (
                          <SlideImg images={item.image_urls} alt={item.title || "Course"} />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                            ไม่มีรูปภาพ
                          </div>
                        )}
                        <div className="absolute top-2.5 left-2.5 bg-[#1E5BB1] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm z-10">
                          {courseType === "SKI" ? "Ski" : "Snowboard"}
                        </div>
                      </div>

                      <div className="flex overflow-hidden flex-col py-0.5 flex-1 h-full justify-between min-w-0">
                        <div>
                          <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1 truncate group-hover:text-[#4F7354] transition-colors">
                            {item?.title}
                          </h4>
                          <div className="space-y-1 mb-2">
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                              <MapPin size={13} className="text-gray-400 shrink-0" />
                              <span className="truncate">
                                {districtName} {provinceName ? `, ${provinceName}` : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                              <CalendarDays size={13} className="text-gray-400 shrink-0" />
                              <span>
                                {RenderDate(item.start_date, "dd MMM yyyy")} {" - "}
                                {RenderDate(item.end_date, "dd MMM yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                              <User size={13} className="text-gray-400 shrink-0" />
                              <span>{item.course_level || "Beginner"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-1 mt-auto">
                          <span className="text-gray-900 font-extrabold text-base md:text-lg">
                            ฿ {numeral(finalPrice).format("0,0")}
                          </span>
                          <span className="text-gray-500 text-xs font-medium">/คน</span>
                        </div>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10 md:mt-12">
                <button
                  onClick={() => handleSearch(page - 1)}
                  disabled={page <= 1}
                  className="px-6 py-2.5 rounded-xl bg-[#6C7A5E] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5F6A56] transition-colors font-bold shadow-md"
                >
                  ก่อนหน้า
                </button>
                <span className="text-white font-bold bg-[#6C7A5E]/40 px-4 py-2 rounded-lg text-sm md:text-base">
                  หน้า {page} จาก {totalPages}
                </span>
                <button
                  onClick={() => handleSearch(page + 1)}
                  disabled={page >= totalPages}
                  className="px-6 py-2.5 rounded-xl bg-[#6C7A5E] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5F6A56] transition-colors font-bold shadow-md"
                >
                  ถัดไป
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutPage>
  )
}
