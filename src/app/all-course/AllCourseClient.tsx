"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import HomeFilters, { SearchOverrides } from "@/components/HomeFilters"
import CourseBox from "@/components/CourseBox"
import { Course } from "@/types/model"
import { getCourses } from "@/app/actions/course"

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
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("50000")

  const handleSearch = async (
    _targetPage = 1,
    _type?: any,
    overrides?: SearchOverrides,
  ) => {
    const effNation = overrides?.nationID !== undefined ? overrides.nationID : nationID
    const effProvince = overrides?.province !== undefined ? overrides.province : province
    const effLevel = overrides?.courseLevel !== undefined ? overrides.courseLevel : courseLevel
    const effPriceEnabled =
      overrides?.isPriceEnabled !== undefined ? overrides.isPriceEnabled : isPriceEnabled
    const effMinPrice = overrides?.minPrice !== undefined ? overrides.minPrice : minPrice
    const effMaxPrice = overrides?.maxPrice !== undefined ? overrides.maxPrice : maxPrice

    try {
      const res = await getCourses({
        page: 1,
        limit: 50,
        nationID: effNation !== "ทั้งหมด" ? effNation : undefined,
        province: effProvince.length > 0 ? effProvince : undefined,
        courseLevel: effLevel !== "ทั้งหมด" ? effLevel : undefined,
        minPrice: effPriceEnabled ? effMinPrice.replace(/,/g, "") : undefined,
        maxPrice: effPriceEnabled ? effMaxPrice.replace(/,/g, "") : undefined,
      })
      if (res.success && res.data) {
        const courseList = (
          Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
        ) as Course[]
        setCourses(courseList)
      } else {
        setCourses([])
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      setCourses([])
    }
    setIsFilterOpen(false)
  }

  return (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full text-center py-12 text-white/80 bg-black/10 rounded-2xl font-medium mt-4">
            ไม่พบข้อมูลทริป
          </div>
        ) : (
          courses.map((item, i) => (
            <CourseBox key={item.id || i} course={item} className="w-full" />
          ))
        )}
      </div>
    </div>
  )
}
