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
  initialPage?: number
  initialTotalPages?: number
}

export default function AllCourseClient({
  initialCourses,
  initialParams,
  initialPage = 1,
  initialTotalPages = 1,
}: AllCourseClientProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [loading, setLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [nationID, setNationID] = useState("ทั้งหมด")
  const [province, setProvince] = useState<string[]>([])
  const [courseLevel, setCourseLevel] = useState("ทั้งหมด")
  const [searchFilter, setSearchFilter] = useState(
    () => (typeof initialParams?.search === "string" ? initialParams.search : ""),
  )
  const [programTypeCategoryFilter, setProgramTypeCategoryFilter] = useState<string | undefined>(
    () =>
      typeof initialParams?.program_type === "string" ? initialParams.program_type : undefined,
  )
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "full">(
    () => {
      const value = initialParams?.availability
      return value === "available" || value === "full" ? value : "all"
    },
  )
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
    const targetPage =
      typeof _targetPage === "number" && !isNaN(_targetPage) && _targetPage > 0
        ? _targetPage
        : 1
    setLoading(true)
    const effNation = overrides?.nationID !== undefined ? overrides.nationID : nationID
    const effProvince = overrides?.province !== undefined ? overrides.province : province
    const effLevel = overrides?.courseLevel !== undefined ? overrides.courseLevel : courseLevel
    const effType =
      overrides?.courseType !== undefined
        ? overrides.courseType
        : initialParams?.courseType
    const hasProgramTypeOverride = Boolean(overrides && "program_type" in overrides)
    const rawProgramType = hasProgramTypeOverride
      ? overrides?.program_type
      : programTypeCategoryFilter
    const effProgramType =
      typeof rawProgramType === "string" ? rawProgramType : undefined

    if (hasProgramTypeOverride) {
      setProgramTypeCategoryFilter(effProgramType)
    }
    const hasSearchOverride = Boolean(overrides && "search" in overrides)
    const rawSearch = hasSearchOverride ? overrides?.search : searchFilter
    const effSearch = typeof rawSearch === "string" ? rawSearch : undefined

    if (hasSearchOverride) {
      setSearchFilter(effSearch || "")
    }
    const effPriceEnabled =
      overrides?.isPriceEnabled !== undefined ? overrides.isPriceEnabled : isPriceEnabled
    const effMinPrice = overrides?.minPrice !== undefined ? overrides.minPrice : minPrice
    const effMaxPrice = overrides?.maxPrice !== undefined ? overrides.maxPrice : maxPrice
    const hasAvailabilityOverride = Boolean(overrides && "availability" in overrides)
    const rawAvailability = hasAvailabilityOverride
      ? overrides?.availability
      : availabilityFilter
    const effAvailability =
      rawAvailability === "available" || rawAvailability === "full" ? rawAvailability : "all"

    if (hasAvailabilityOverride) {
      setAvailabilityFilter(
        rawAvailability === "available" || rawAvailability === "full"
          ? rawAvailability
          : "all",
      )
    }

    const hasDateOverride = Boolean(overrides && "date" in overrides)
    const rawDate = hasDateOverride ? overrides?.date : undefined
    const effDate = (() => {
      if (!rawDate || rawDate === "ทั้งหมด") return undefined
      if (rawDate === "soon") {
        const d = new Date()
        const yyyy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, "0")
        return `${yyyy}-${mm}`
      }
      if (/^\d{4}-\d{2}/.test(rawDate)) {
        return rawDate.slice(0, 7)
      }
      return rawDate
    })()

    const payload = {
      page: targetPage,
      limit: 12,
      nationID: effNation !== "ทั้งหมด" ? effNation : undefined,
      province: effProvince.length > 0 ? effProvince : undefined,
      courseLevel: effLevel !== "ทั้งหมด" ? effLevel : undefined,
      date: effDate,
      minPrice: effPriceEnabled ? effMinPrice.replace(/,/g, "") : undefined,
      maxPrice: effPriceEnabled ? effMaxPrice.replace(/,/g, "") : undefined,
      ...initialParams,
      courseType: effType && effType !== "ทั้งหมด" ? effType : "all",
      program_type:
        effProgramType && effProgramType !== "ทั้งหมด" ? effProgramType : undefined,
      ...(effSearch && effSearch.trim() ? { search: effSearch.trim() } : {}),
      availability: effAvailability,
    }

    console.log("[AllCourseClient Filter Payload]:", payload)

    try {
      const res = await getCourses(payload)
      if (res.success && res.data) {
        let courseList = (
          Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
        ) as Course[]

        if (effSearch && effSearch.trim()) {
          const q = effSearch.trim().toLowerCase()
          courseList = courseList.filter(
            (c: any) =>
              c.title?.toLowerCase().includes(q) ||
              c.description?.toLowerCase().includes(q) ||
              c.detail?.toLowerCase().includes(q),
          )
        }

        setCourses(courseList)
        setTotalPages(res?.data?.total_pages || (res as any)?.total_pages || 1)
        setPage(res?.data?.page || (res as any)?.page || targetPage)
      } else {
        setCourses([])
        setTotalPages(1)
        setPage(1)
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      setCourses([])
      setTotalPages(1)
    } finally {
      setLoading(false)
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
          courseType={
            typeof initialParams?.courseType === "string" ? initialParams.courseType : "all"
          }
          handleSearch={handleSearch}
        />
      </div>

      {/* Trips List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-white/80 bg-black/10 rounded-2xl font-medium mt-4">
            กำลังดึงข้อมูล...
          </div>
        ) : courses.length === 0 ? (
          <div className="col-span-full text-center py-12 text-white/80 bg-black/10 rounded-2xl font-medium mt-4">
            ไม่พบข้อมูลทริป
          </div>
        ) : (
          courses.map((item, i) => (
            <CourseBox key={item.id || i} course={item} className="w-full" />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 md:gap-3 mt-10 mb-8 select-none">
          <button
            type="button"
            onClick={() => {
              if (page > 1) {
                handleSearch(page - 1)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            }}
            disabled={page <= 1 || loading}
            className="px-4 py-2 rounded-xl bg-[#6C7A5E] hover:bg-[#5F6A56] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold text-xs md:text-sm shadow-md active:scale-95 cursor-pointer"
          >
            ก่อนหน้า
          </button>

          <div className="flex items-center gap-1 md:gap-2">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - page) <= 1,
              )
              .reduce<(number | string)[]>((acc, curr, index, arr) => {
                if (index > 0 && curr - (arr[index - 1] as number) > 1) {
                  acc.push("...")
                }
                acc.push(curr)
                return acc
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`dots-${idx}`} className="text-white/60 px-1 font-bold">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${item}`}
                    type="button"
                    onClick={() => {
                      if (item !== page) {
                        handleSearch(Number(item))
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    }}
                    disabled={loading}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center cursor-pointer ${
                      item === page
                        ? "bg-white text-[#131F2E] shadow-lg scale-105"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (page < totalPages) {
                handleSearch(page + 1)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            }}
            disabled={page >= totalPages || loading}
            className="px-4 py-2 rounded-xl bg-[#6C7A5E] hover:bg-[#5F6A56] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold text-xs md:text-sm shadow-md active:scale-95 cursor-pointer"
          >
            ถัดไป
          </button>
        </div>
      )}
    </div>
  )
}
