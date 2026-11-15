"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import HomeFilters, { SearchOverrides } from "@/components/HomeFilters"
import CourseBox from "@/components/CourseBox"
import { Course } from "@/types/model"
import { getCourses } from "@/app/actions/course"

interface AllCourseClientProps {
  initialCourses: Course[]
  initialParams?: Record<string, any>
}

export default function AllCourseClient({
  initialCourses,
  initialParams,
}: AllCourseClientProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [nationID, setNationID] = useState("ทั้งหมด")
  const [province, setProvince] = useState<string[]>([])
  const [courseLevel, setCourseLevel] = useState("ทั้งหมด")
  const [isPriceEnabled, setIsPriceEnabled] = useState(false)
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("50000")

  useEffect(() => {
    setCourses(initialCourses)
  }, [initialCourses])

  const getCategoryTitle = () => {
    if (initialParams?.program_type === "TRIP") return "Trips"
    if (initialParams?.program_type === "CLASS") return "Classes & Training"
    switch (initialParams?.category) {
      case "trips":
        return "Trips"
      case "classes_training":
        return "Classes & Training"
      case "ski_resorts":
        return "Ski Resorts"
      case "hotels":
        return "Hotels"
      default:
        return "ทริปทั้งหมด"
    }
  }

  const handleSearch = async (
    _targetPage = 1,
    _type?: any,
    overrides?: SearchOverrides,
  ) => {
    const effNation = overrides?.nationID !== undefined ? overrides.nationID : nationID
    const effProvince = overrides?.province !== undefined ? overrides.province : province
    const effLevel = overrides?.courseLevel !== undefined ? overrides.courseLevel : courseLevel
    const effType =
      overrides?.courseType !== undefined
        ? overrides.courseType
        : initialParams?.courseType
    const effProgramType =
      overrides?.program_type !== undefined
        ? overrides.program_type
        : initialParams?.program_type
    const effSearch = overrides?.search !== undefined ? overrides.search : undefined
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
        ...initialParams,
        ...(effType && effType !== "ทั้งหมด" ? { courseType: effType } : {}),
        ...(effProgramType && effProgramType !== "ทั้งหมด"
          ? { program_type: effProgramType }
          : {}),
        ...(effSearch && effSearch.trim() ? { search: effSearch.trim() } : {}),
      })
      if (res.success && res.data) {
        let courseList = (
          Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
        ) as Course[]

        if (effSearch && effSearch.trim()) {
          const q = effSearch.trim().toLowerCase()
          courseList = courseList.filter(
            (c) =>
              c.title?.toLowerCase().includes(q) ||
              c.description?.toLowerCase().includes(q) ||
              c.detail?.toLowerCase().includes(q),
          )
        }

        if (overrides?.availability && overrides.availability !== "ทั้งหมด") {
          if (overrides.availability === "available") {
            courseList = courseList.filter(
              (c) => c.is_active && (!c.max_students || c.total_user < c.max_students),
            )
          } else if (overrides.availability === "full") {
            courseList = courseList.filter(
              (c) => c.max_students && c.total_user >= c.max_students,
            )
          }
        }

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
        <h1 className="text-xl md:text-2xl font-bold text-white">
          {getCategoryTitle()}
        </h1>
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
