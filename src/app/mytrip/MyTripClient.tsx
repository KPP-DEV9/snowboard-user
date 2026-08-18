"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, CalendarDays, ChevronDown } from "lucide-react"
import { RenderDate } from "@/lib/date"
import numeral from "numeral"
import { Enrollment } from "@/types/enrollment"

interface MyTripClientProps {
  enrollments: Enrollment[]
}

export default function MyTripClient({ enrollments }: MyTripClientProps) {
  const router = useRouter()
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
                <div className="fixed inset-0 z-40" onClick={() => setIsTypeDropdownOpen(false)} />
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
              const totalAmount = enrollment.total_amount || course?.price || 55372.5
              const depositAmount = enrollment.deposit_amount || totalAmount * 0.3
              const remainingAmount = totalAmount - depositAmount

              const isSki = course?.course_type?.toLowerCase()?.includes("ski")
              const programType = isSki ? "Ski" : "Snowboard"
              const badgeBg = isSki ? "bg-[#E67E22]" : "bg-[#0066FF]"

              // Generate clean code matching AE0342349-E032 format
              // const shortId = enrollment.id
              //   ? enrollment.id.replace(/-/g, "").substring(0, 4).toUpperCase()
              //   : "E032"
              // const itemCode = `AE0342349-${shortId}`

              const statusLower = (enrollment.status || "").toLowerCase()
              const isPaid =
                statusLower === "paid" ||
                statusLower === "completed" ||
                statusLower.includes("ชำระแล้ว") ||
                statusLower.includes("ชำระสำเร็จ")
              const isCancelled =
                statusLower === "cancelled" ||
                statusLower === "canceled" ||
                statusLower.includes("ยกเลิก")
              const isDepositPaid =
                statusLower === "deposit_paid" || statusLower.includes("มัดจำแล้ว")

              // Determine payment link
              const paymentUrl = `/payment/?course_id=${course?.id || enrollment.course_id}&round_id=${enrollment.round_id || ""}&enrollment_id=${enrollment.id}&adults=${enrollment.adult_count || 1}&children=${enrollment.child_count || 0}`

              return (
                <div
                  key={enrollment.id}
                  onClick={() => router.push(`/mytrip/${enrollment.id}`)}
                  className="bg-white rounded-[1.75rem] p-5 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer text-black"
                >
                  {/* Top Row: Badge + Code */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`${badgeBg} text-white text-[11px] font-bold px-2.5 py-0.5 rounded-[5px] tracking-wide`}
                    >
                      {programType}
                    </span>
                    {/* <span className="text-gray-400 text-[13px] font-medium">
                      เลขที่รายการ {itemCode}
                    </span> */}
                  </div>

                  {/* Title */}
                  <h3 className="text-gray-900 font-extrabold text-[16px] leading-snug mb-2 line-clamp-2">
                    {course?.title || "ทริปสโนว์บอร์ด โตเกียว สำหรับผู้เริ่มต้น 6 วัน 5 คืน"}
                  </h3>

                  {/* Location & Date */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[13px] font-medium">
                      <MapPin size={15} className="text-gray-400 shrink-0" />
                      <span>
                        {course?.district ? `${course.district}, ` : ""}
                        {course?.province || "โตเกียว, ญี่ปุ่น"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-[13px] font-medium">
                      <CalendarDays size={15} className="text-gray-400 shrink-0" />
                      <span>{formatDateRange(course?.start_date, course?.end_date)}</span>
                    </div>
                  </div>

                  {/* Pricing Breakdown & Status Rows */}
                  <div className="border-t border-gray-100 pt-3 space-y-1.5 text-[13px]">
                    {/* Scenario 3: Fully Paid */}
                    {isPaid ? (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">ยอดทั้งหมด</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-bold">
                            ฿ {numeral(totalAmount).format("0,0.00")}
                          </span>
                          <span className="bg-[#DCFCE7] text-[#16A34A] px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold">
                            ชำระสำเร็จ
                          </span>
                        </div>
                      </div>
                    ) : isCancelled ? (
                      /* Scenario 4: Cancelled */
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">ยอดทั้งหมด</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-bold">
                            ฿ {numeral(totalAmount).format("0,0.00")}
                          </span>
                          <span className="bg-[#FEE2E2] text-[#EF4444] px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold">
                            ยกเลิก
                          </span>
                        </div>
                      </div>
                    ) : isDepositPaid ? (
                      /* Scenario 1: Deposit Paid, Balance Pending */
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">ยอดทั้งหมด</span>
                          <span className="text-gray-900 font-bold">
                            ฿ {numeral(totalAmount).format("0,0.00")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">ยอดมัดจำ</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-bold">
                              ฿ {numeral(depositAmount).format("0,0.00")}
                            </span>
                            <span className="bg-[#DCFCE7] text-[#16A34A] px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold">
                              มัดจำแล้ว
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">ยอดคงเหลือ</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-bold">
                              ฿ {numeral(remainingAmount).format("0,0.00")}
                            </span>
                            <span className="bg-[#FEF3C7] text-[#D97706] px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold">
                              รอชำระ
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              router.push(paymentUrl)
                            }}
                            className="bg-[#C84323] hover:bg-[#B93816] text-white px-7 py-2 rounded-xl font-bold text-[13px] shadow-sm transition-colors cursor-pointer"
                          >
                            ชำระเงิน
                          </button>
                        </div>
                      </>
                    ) : (
                      /* Scenario 2: Deposit Pending (Default Pending) */
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">ยอดทั้งหมด</span>
                          <span className="text-gray-900 font-bold">
                            ฿ {numeral(totalAmount).format("0,0.00")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">ยอดมัดจำ</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-bold">
                              ฿ {numeral(depositAmount).format("0,0.00")}
                            </span>
                            {/* <span className="bg-[#FEF3C7] text-[#D97706] px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold">
                              รอชำระ
                            </span> */}
                          </div>
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              router.push(paymentUrl)
                            }}
                            className="bg-[#C84323] hover:bg-[#B93816] text-white px-7 py-2 rounded-xl font-bold text-[13px] shadow-sm transition-colors cursor-pointer"
                          >
                            ชำระเงิน
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
