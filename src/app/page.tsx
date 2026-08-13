"use client"

import CourseTypeTabs from "@/components/CourseTypeTabs"
import { MapPin, CalendarDays, User, Zap } from "lucide-react"
import SlideImg from "@/components/Ui/SlideImg"
import Logo from "@/components/Logo"
import HomeFilters from "@/components/HomeFilters"
import { getCourses } from "./actions/course"
import { RenderDate } from "@/lib/date"
import numeral from "numeral"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Course } from "@/types/course"
import LayoutPage from "@/components/Layout"
import Label from "@/components/Ui/Label"
import { Provinces } from "@/constants/location"

export type CategoryType = "SNOWBOARD" | "SKI"

export default function MainPage() {
  const [course, setCourse] = useState<Course[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [nationID, setNationID] = useState("ทั้งหมด")
  const [province, setProvince] = useState<string[]>([])
  const [courseLevel, setCourseLevel] = useState("ทั้งหมด")
  const [courseType, setCourseType] = useState<CategoryType>("SNOWBOARD") // Placeholder if needed in future
  const [isPriceEnabled, setIsPriceEnabled] = useState(false)
  const [minPrice, setMinPrice] = useState("20000")
  const [maxPrice, setMaxPrice] = useState("50000")

  const handleSearch = async (targetPage = 1, type: CategoryType = courseType) => {
    try {
      const res = await getCourses({
        page: targetPage,
        limit: 5,
        nationID: nationID !== "ทั้งหมด" ? nationID : undefined,
        province: province.length > 0 ? province : undefined,
        courseLevel: courseLevel !== "ทั้งหมด" ? courseLevel : undefined,
        courseType: type ? type : courseType,
        minPrice: isPriceEnabled ? minPrice.replace(/,/g, "") : undefined,
        maxPrice: isPriceEnabled ? maxPrice.replace(/,/g, "") : undefined,
      })
      setCourse(res?.data?.data as Course[])
      setTotalPages(res?.data?.total_pages || 1)
      setPage(res?.data?.page || 1)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    }
    setIsFilterOpen(false)
  }

  useEffect(() => {
    handleSearch()
  }, [])

  const getLocationName = (provinceCode?: string, districtCode?: string) => {
    const provinceData = Provinces.find((p) => p.code === provinceCode)
    const provinceName = provinceData?.name_th || provinceCode
    const districtData = provinceData?.cities?.find((c) => c.code === districtCode)
    const districtName = districtData?.name_th || districtCode
    return { provinceName, districtName }
  }

  return (
    <LayoutPage>
      <div className="min-h-screen pb-24 font-sans">
        <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-8 lg:pt-12 max-w-7xl">
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center mb-6 gap-6">
            {/* Logo */}
            <Logo />

            {/* Greeting Text */}
            <h2 className="text-white text-xl md:text-2xl font-bold drop-shadow-sm text-center">
              ทริปครั้งนี้ของคุณคือ...?
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
          <div className="bg-sec rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-xl w-full mb-12">
            <div className="flex items-center justify-center mb-8">
              <Zap className="w-6 h-6 mr-2 text-neon" />
              <h3 className="text-neon text-xl md:text-2xl font-bold tracking-wide">
                ทริปที่กำลังจะถึง
              </h3>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 snap-x scrollbar-hide">
              {course?.map((item, i) => {
                const { provinceName, districtName } = getLocationName(item.province, item.district)
                return (
                  <Link
                    href={`/course/${item.id}`}
                    key={i}
                    className="bg-white rounded-[1.5rem] overflow-hidden min-w-[280px] md:min-w-0 md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start shrink-0 shadow-md hover:shadow-2xl transition-all duration-300 group flex flex-col cursor-pointer"
                  >
                    <div className="relative h-[180px] lg:h-[200px] w-full bg-blue-100 overflow-hidden">
                      <SlideImg
                        images={
                          item.image_urls && item.image_urls.length > 0
                            ? item.image_urls
                            : [
                                "https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=400&auto=format&fit=crop",
                              ]
                        }
                        alt="Indoor snowpark"
                      />
                      {item?.course_level && <Label text={item.course_level} />}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="font-bold text-lg md:text-xl text-gray-900 mb-3 leading-tight group-hover:text-[#4F7354] transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="space-y-2 mb-4 flex-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                          <MapPin size={16} className="text-[#4F7354] shrink-0" />
                          <span className="truncate">
                            {districtName} {provinceName ? `, ${provinceName}` : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                          <CalendarDays size={16} className="text-[#4F7354] shrink-0" />
                          <span>
                            {RenderDate(item.start_date, "dd MMM yyyy")} {" - "}
                            {RenderDate(item.end_date, "dd MMM yyyy")}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-gray-400 text-sm line-through decoration-gray-400 font-medium">
                            ฿ {numeral(item.price).format("0,0")}
                          </div>
                          <div className="text-[#E03131] font-extrabold text-xl md:text-2xl">
                            ฿ {numeral(item.price - (item.discount || 0)).format("0,0")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Snowboard Trips Section */}
          <div className="w-full flex flex-col">
            <div className="flex justify-between items-end mb-6 px-2">
              <h3 className="text-white text-2xl font-bold tracking-wide">ทริป Snowboard</h3>
              <Link
                href="/all-course"
                className="text-[#B3C8A4] font-bold hover:text-white transition-colors text-lg"
              >
                ทั้งหมด
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {course?.map((item, i) => {
                const { provinceName, districtName } = getLocationName(item.province, item.district)
                return (
                  <Link
                    href={`/course/${item.id}`}
                    key={i}
                    className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 shadow-xl hover:shadow-2xl transition-shadow flex gap-4 md:gap-6 group cursor-pointer border border-transparent hover:border-[#4F7354]/30"
                  >
                    <div className="relative w-[130px] md:w-[180px] h-[150px] md:h-[180px] shrink-0 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden bg-blue-100">
                      <SlideImg
                        images={
                          item.image_urls && item.image_urls.length > 0
                            ? item.image_urls
                            : [
                                "https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=400&auto=format&fit=crop",
                              ]
                        }
                        alt="Changbaishan snow"
                      />
                      {item?.course_level && <Label text={item.course_level} />}
                    </div>
                    <div className="flex flex-col py-2 pr-2 md:pr-4 flex-1 h-full">
                      <h4 className="font-bold text-base md:text-lg text-gray-900 mb-2 md:mb-3 leading-tight line-clamp-2 group-hover:text-[#4F7354] transition-colors">
                        {item?.title}
                      </h4>
                      <div className="space-y-1 md:space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm font-medium">
                          <MapPin size={16} className="text-gray-400 shrink-0" />
                          <span className="truncate">
                            {districtName} {provinceName ? `, ${provinceName}` : ""}
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
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => handleSearch(page - 1)}
                  disabled={page <= 1}
                  className="px-6 py-2.5 rounded-xl bg-[#6C7A5E] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5F6A56] transition-colors font-bold shadow-md"
                >
                  ก่อนหน้า
                </button>
                <span className="text-white font-bold bg-[#6C7A5E]/40 px-4 py-2 rounded-lg">
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
