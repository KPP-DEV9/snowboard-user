"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, CalendarDays, ChevronDown } from "lucide-react"
import { RenderDate } from "@/lib/date"
import numeral from "numeral"
import { Enrollment } from "@/types/enrollment"

interface MyTripClientProps {
  enrollments: Enrollment[]
}

export default function MyTripClient({ enrollments }: MyTripClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">("all")
  const [typeFilter, setTypeFilter] = useState<"all" | "snowboard" | "ski">("all")
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)

  // Filter enrollments based on tab and type
  const now = new Date()
  const filteredEnrollments = enrollments.filter((item) => {
    const course = item.course
    const courseType = (course?.course_type || "").toLowerCase()

    // Type filter
    if (typeFilter === "snowboard" && !courseType.includes("snowboard")) return false
    if (typeFilter === "ski" && !courseType.includes("ski")) return false

    // Tab filter (upcoming / past)
    if (activeTab === "upcoming") {
      if (course?.end_date) {
        return new Date(course.end_date) >= now
      }
      if (course?.start_date) {
        return new Date(course.start_date) >= now
      }
    } else if (activeTab === "past") {
      if (course?.end_date) {
        return new Date(course.end_date) < now
      }
      if (course?.start_date) {
        return new Date(course.start_date) < now
      }
    }

    return true
  })

  // Format date range e.g. "25-28 กรกฎาคม 2026"
  const formatDateRange = (start?: string | Date, end?: string | Date) => {
    if (!start) return "-"
    if (!end) return RenderDate(start, "d MMMM yyyy")

    try {
      const startDate = new Date(start)
      const endDate = new Date(end)
      if (
        !isNaN(startDate.getTime()) &&
        !isNaN(endDate.getTime()) &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear()
      ) {
        return `${RenderDate(start, "d")}-${RenderDate(end, "d MMMM yyyy")}`
      }
    } catch {
      // fallback
    }

    return `${RenderDate(start, "d MMM yyyy")} - ${RenderDate(end, "d MMM yyyy")}`
  }

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "paid" || s.includes("ชำระแล้ว")) {
      return (
        <span className="bg-[#E0F2FE] text-[#0284C7] px-3 py-1 rounded-[6px] text-[12px] font-bold inline-block">
          ชำระแล้ว
        </span>
      )
    }
    if (s === "cancelled" || s === "canceled" || s.includes("ยกเลิก")) {
      return (
        <span className="bg-[#FEE2E2] text-[#EF4444] px-3 py-1 rounded-[6px] text-[12px] font-bold inline-block">
          ยกเลิก
        </span>
      )
    }
    // pending / default
    return (
      <span className="bg-[#FEF3C7] text-[#D97706] px-3 py-1 rounded-[6px] text-[12px] font-bold inline-block">
        รอชำระ
      </span>
    )
  }

  const getTypeLabel = () => {
    if (typeFilter === "snowboard") return "Snowboard"
    if (typeFilter === "ski") return "Ski"
    return "ทริปทั้งหมด"
  }

  return (
    <div className="min-h-screen bg-[#2D455D] pb-32 font-sans selection:bg-[#568759]/30">
      <div className="w-full px-4 mx-auto pt-6 max-w-lg">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-6">
          <Link
            href="/profile"
            className="absolute left-0 text-white p-1 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={24} className="stroke-[2.5]" />
          </Link>
          <h1 className="text-xl font-bold text-white tracking-wide">ทริปของฉัน</h1>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5 mb-6 overflow-visible">
          {/* Dropdown for Trip Type */}
          <div className="relative">
            <button
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              className="flex items-center gap-1.5 bg-white text-gray-900 px-4 py-2 rounded-full text-[13px] font-bold shadow-sm whitespace-nowrap hover:bg-gray-50 transition-colors"
            >
              <span>{getTypeLabel()}</span>
              <ChevronDown size={16} className="text-gray-700 stroke-[2.5]" />
            </button>

            {isTypeDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsTypeDropdownOpen(false)}
                />
                <div className="absolute left-0 top-full mt-2 w-36 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setTypeFilter("all")
                      setIsTypeDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-gray-50 transition-colors ${
                      typeFilter === "all" ? "text-[#0066FF]" : "text-gray-700"
                    }`}
                  >
                    ทริปทั้งหมด
                  </button>
                  <button
                    onClick={() => {
                      setTypeFilter("snowboard")
                      setIsTypeDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-gray-50 transition-colors ${
                      typeFilter === "snowboard" ? "text-[#0066FF]" : "text-gray-700"
                    }`}
                  >
                    Snowboard
                  </button>
                  <button
                    onClick={() => {
                      setTypeFilter("ski")
                      setIsTypeDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-gray-50 transition-colors ${
                      typeFilter === "ski" ? "text-[#0066FF]" : "text-gray-700"
                    }`}
                  >
                    Ski
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Upcoming Tab Button */}
          <button
            onClick={() => setActiveTab(activeTab === "upcoming" ? "all" : "upcoming")}
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all border ${
              activeTab === "upcoming"
                ? "bg-white text-gray-900 border-white font-bold shadow-sm"
                : "bg-[#22384C] text-white border-[#476077] hover:bg-[#2A445C]"
            }`}
          >
            เร็วๆ นี้
          </button>

          {/* Past Tab Button */}
          <button
            onClick={() => setActiveTab(activeTab === "past" ? "all" : "past")}
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all border ${
              activeTab === "past"
                ? "bg-white text-gray-900 border-white font-bold shadow-sm"
                : "bg-[#22384C] text-white border-[#476077] hover:bg-[#2A445C]"
            }`}
          >
            ทริปที่ผ่านมา
          </button>
        </div>

        {/* Trips List */}
        <div className="flex flex-col gap-4">
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-16 text-white/80 bg-black/15 rounded-3xl font-medium">
              ไม่พบรายการทริป
            </div>
          ) : (
            filteredEnrollments.map((enrollment) => {
              const course = enrollment.course
              const totalAmount =
                enrollment.total_amount || course?.price || 0

              const isSki = course?.course_type?.toLowerCase()?.includes("ski")
              const programType = isSki ? "Ski" : "Snowboard"
              const badgeBg = isSki ? "bg-[#D97706]" : "bg-[#0066FF]"

              // Generate clean code matching AE0342349-E032 format
              const shortId = enrollment.id
                ? enrollment.id.replace(/-/g, "").substring(0, 4).toUpperCase()
                : "E032"
              const itemCode = `AE0342349-${shortId}`

              const isPending =
                !enrollment.status ||
                enrollment.status.toLowerCase() === "pending_payment" ||
                enrollment.status.toLowerCase() === "pending" ||
                enrollment.status.toLowerCase().includes("รอชำระ")

              return (
                <Link
                  key={enrollment.id}
                  href={`/mytrip/${enrollment.id}`}
                  className="block group cursor-pointer"
                >
                  <div className="bg-white rounded-[1.75rem] p-5 md:p-6 shadow-md hover:shadow-xl transition-all duration-200">
                    {/* Top Row: Badge + Code */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`${badgeBg} text-white text-[11px] font-bold px-2.5 py-0.5 rounded-[6px] tracking-wide`}
                      >
                        {programType}
                      </span>
                      <span className="text-gray-400 text-[13px] font-medium">
                        เลขที่รายการ {itemCode}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-gray-900 font-extrabold text-[17px] leading-snug mb-3 line-clamp-2">
                      {course?.title || "ทริปสโนว์บอร์ด"}
                    </h3>

                    {/* Location & Date */}
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center gap-2 text-gray-500 text-[13px] font-medium">
                        <MapPin size={16} className="text-gray-400 shrink-0" />
                        <span>
                          {course?.district ? `${course.district}, ` : ""}
                          {course?.province || "ญี่ปุ่น"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-[13px] font-medium">
                        <CalendarDays size={16} className="text-gray-400 shrink-0" />
                        <span>
                          {formatDateRange(course?.start_date, course?.end_date)}
                        </span>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="flex flex-col items-end mb-2">
                      <span className="text-[12px] text-gray-400 font-medium">
                        ราคาทริปทั้งหมด
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[#0066FF] font-extrabold text-[20px]">
                          ฿
                        </span>
                        <span className="text-gray-900 font-extrabold text-[22px] tracking-tight">
                          {numeral(totalAmount).format("0,0.00")}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Status / Due Info Row */}
                    <div className="flex items-center justify-between min-h-[28px] pt-1">
                      <div>
                        {isPending ? (
                          <div className="text-[12px] text-gray-800 font-medium">
                            ยอดชำระ: {numeral(totalAmount).format("0,0.00")} | ชำระก่อน{" "}
                            {RenderDate(course?.start_date, "d MMMM yyyy")}
                          </div>
                        ) : (
                          <span />
                        )}
                      </div>
                      <div>{getStatusBadge(enrollment.status)}</div>
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
