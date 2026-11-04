"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, CalendarDays, ChevronDown, Clock } from "lucide-react"
import { RenderDate } from "@/lib/date"
import numeral from "numeral"
import { Enrollment } from "@/types/model"
import { PaymentTransactionsStatus } from "@/types/model"
import { getTransactionStatusBadge, getEnrollmentStatusLabel } from "@/lib/payment"
import { getLocationName } from "@/constants/location"
import SlideImg from "@/components/Ui/SlideImg"

interface MyTripClientProps {
  enrollments: Enrollment[]
}

export default function MyTripClient({ enrollments }: MyTripClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<
    "all" | "pending_payment" | "pending_review" | "completed" | "cancelled"
  >("all")
  const [typeFilter, setTypeFilter] = useState<"all" | "snowboard" | "ski">("all")
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)

  // Filter enrollments based on tab and type
  const filteredEnrollments = enrollments.filter((item) => {
    const course = item.course
    const courseType = (course?.course_type || "").toLowerCase()
    // Type filter
    if (typeFilter === "snowboard" && !courseType.includes("snowboard")) return false
    if (typeFilter === "ski" && !courseType.includes("ski")) return false

    // Status tab filter
    if (activeTab === "pending_payment") {
      return item.status === "pending_payment"
    }
    if (activeTab === "pending_review") {
      return item.status === "deposit_paid" || item.status === "paid"
    }
    if (activeTab === "completed") {
      return item.status === "completed"
    }
    if (activeTab === "cancelled") {
      return item.status === "cancelled"
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
        if (startDate.getDate() === endDate.getDate()) {
          return RenderDate(start, "d MMMM yyyy")
        }
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
    return "All"
  }

  return (
    <div className="min-h-screen pb-32 font-sans selection:bg-[#568759]/30">
      <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-6 md:pt-10 max-w-6xl">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-6 md:mb-8">
          <Link
            href="/profile"
            className="absolute left-0 text-white font-bold flex items-center gap-2 hover:opacity-80 transition-opacity text-sm md:text-base p-1"
          >
            <ArrowLeft size={22} className="stroke-[2.5]" />
            <span className="hidden sm:inline">ย้อนกลับ</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">ทริปของฉัน</h1>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 mb-6 md:mb-8 overflow-visible flex-nowrap">
          {/* Dropdown for Trip Type */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] md:text-sm whitespace-nowrap transition-all border ${
                activeTab === "all"
                  ? "bg-white text-gray-900 border-white font-bold shadow-sm hover:bg-gray-50"
                  : "bg-[#22384C] text-white border-[#476077] font-medium hover:bg-[#2A445C]"
              }`}
            >
              <span>{getTypeLabel()}</span>
              <ChevronDown
                size={15}
                className={`stroke-[2.5] ${activeTab === "all" ? "text-gray-700" : "text-white"}`}
              />
            </button>

            {isTypeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsTypeDropdownOpen(false)} />
                <div className="absolute left-0 top-full mt-2 w-36 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setTypeFilter("all")
                      setActiveTab("all")
                      setIsTypeDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-gray-50 transition-colors ${
                      typeFilter === "all" && activeTab === "all"
                        ? "text-[#0066FF]"
                        : "text-gray-700"
                    }`}
                  >
                    All
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

          {/* Status Filter Buttons */}
          <button
            onClick={() =>
              setActiveTab(activeTab === "pending_payment" ? "all" : "pending_payment")
            }
            className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] md:text-sm font-medium whitespace-nowrap transition-all border ${
              activeTab === "pending_payment"
                ? "bg-white text-gray-900 border-white font-bold shadow-sm"
                : "bg-[#22384C] text-white border-[#476077] hover:bg-[#2A445C]"
            }`}
          >
            รอชำระ
          </button>

          <button
            onClick={() => setActiveTab(activeTab === "pending_review" ? "all" : "pending_review")}
            className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] md:text-sm font-medium whitespace-nowrap transition-all border ${
              activeTab === "pending_review"
                ? "bg-white text-gray-900 border-white font-bold shadow-sm"
                : "bg-[#22384C] text-white border-[#476077] hover:bg-[#2A445C]"
            }`}
          >
            รอตรวจสอบ
          </button>

          <button
            onClick={() => setActiveTab(activeTab === "completed" ? "all" : "completed")}
            className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] md:text-sm font-medium whitespace-nowrap transition-all border ${
              activeTab === "completed"
                ? "bg-white text-gray-900 border-white font-bold shadow-sm"
                : "bg-[#22384C] text-white border-[#476077] hover:bg-[#2A445C]"
            }`}
          >
            สำเร็จ
          </button>

          <button
            onClick={() => setActiveTab(activeTab === "cancelled" ? "all" : "cancelled")}
            className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] md:text-sm font-medium whitespace-nowrap transition-all border ${
              activeTab === "cancelled"
                ? "bg-white text-gray-900 border-white font-bold shadow-sm"
                : "bg-[#22384C] text-white border-[#476077] hover:bg-[#2A445C]"
            }`}
          >
            ยกเลิก
          </button>
        </div>

        {/* Trips List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredEnrollments.length === 0 ? (
            <div className="col-span-full text-center py-16 text-white/80 bg-black/15 rounded-3xl font-medium">
              ไม่พบรายการทริป
            </div>
          ) : (
            filteredEnrollments.map((enrollment) => {
              const course = enrollment.course
              const adultCount = Number(enrollment.adult_count) || 1
              const childCount = Number(enrollment.child_count) || 0
              const courseBasePrice =
                (Number(course?.price) || Number(enrollment.course_amount) || 0) -
                (Number(course?.discount) || 0)
              const courseChildPrice = Number(course?.child_price) || 0
              const courseSubtotal =
                courseBasePrice * adultCount + courseChildPrice * childCount > 0
                  ? courseBasePrice * adultCount + courseChildPrice * childCount
                  : Number(course?.price) || Number(enrollment.course_amount) || 0

              const requirementTransactions = enrollment.requirement_transactions || []
              const extrasSubtotal =
                requirementTransactions.length > 0
                  ? requirementTransactions.reduce((sum, item: any) => {
                      const price =
                        item.requirement_type === "ASSET"
                          ? Number(item.asset_master?.price) || Number(item.price) || 0
                          : Number(item.option_master?.price) || Number(item.price) || 0
                      return sum + price
                    }, 0)
                  : Number(enrollment.req_total) ||
                    (Number(enrollment.option_amount) || 0) + (Number(enrollment.asset_amount) || 0)

              const rawCoursePrice =
                courseSubtotal > 0 ? courseSubtotal : Number(enrollment.total_amount) || 0
              const rawTotal = rawCoursePrice + extrasSubtotal
              const totalAmount = rawTotal * 1.07
              const displayTotal = totalAmount
              const depositAmount = enrollment.deposit_amount
                ? Number(enrollment.deposit_amount) * 1.07
                : totalAmount * 0.3

              const transactions = enrollment.payment_transactions || []

              const verifiedTransactions = transactions.filter(
                (tx) =>
                  tx.status === PaymentTransactionsStatus.Verified ||
                  tx.status === PaymentTransactionsStatus.GatewaySuccess,
              )
              const verifiedTotal = verifiedTransactions.reduce(
                (sum, tx) => sum + (Number(tx.amount) || 0) * 1.07,
                0,
              )

              const statusLower = (enrollment.status || "").toLowerCase()
              const isPaid =
                statusLower === "paid" ||
                statusLower === "completed" ||
                statusLower.includes("ชำระแล้ว") ||
                statusLower.includes("ชำระสำเร็จ")
              const isCancelled = statusLower === "cancelled" || statusLower.includes("ยกเลิก")
              const isRejected =
                statusLower === "rejected" ||
                statusLower.includes("ปฏิเสธ") ||
                (enrollment.payment_status || "").toLowerCase() === "rejected" ||
                (transactions.length > 0 &&
                  transactions.some(
                    (tx) =>
                      (tx.status || "").toLowerCase() === "rejected" ||
                      tx.status === PaymentTransactionsStatus.Rejected,
                  ))

              const isSubmittedOrPaid = (s?: PaymentTransactionsStatus) =>
                s === PaymentTransactionsStatus.Verified ||
                s === PaymentTransactionsStatus.GatewaySuccess ||
                s === PaymentTransactionsStatus.PendingReview

              const isDepositTx = (tx: (typeof transactions)[0]) => {
                const name = (tx.name || "").toLowerCase()
                return (
                  name.includes("มัดจำ") ||
                  name.includes("deposit") ||
                  tx.enrollment_status === "deposit_paid"
                )
              }

              // มีรายการมัดจำ
              const hasDepositPaid =
                statusLower === "deposit_paid" ||
                statusLower.includes("มัดจำ") ||
                (transactions.length > 0 &&
                  transactions.some((tx) => isDepositTx(tx) && isSubmittedOrPaid(tx.status)))

              const isDepositPaid = hasDepositPaid

              // มีรายการชำระยอดคงเหลือ
              const hasRemainingPaid =
                transactions.length > 0 &&
                transactions.some((tx) => !isDepositTx(tx) && isSubmittedOrPaid(tx.status))

              // กรณี 1: มัดจำ && ชำระยอดคงเหลือ
              const hasDepositAndRemaining = hasDepositPaid && hasRemainingPaid

              // กรณี 2: ชำระเต็มจำนวน
              const isFullPaid =
                (isPaid && !hasDepositPaid) ||
                (transactions.length === 1 &&
                  !isDepositTx(transactions[0]) &&
                  isSubmittedOrPaid(transactions[0].status)) ||
                (!hasDepositPaid &&
                  transactions.length > 0 &&
                  transactions.every((tx) => isSubmittedOrPaid(tx.status)) &&
                  verifiedTotal >= displayTotal - 1)

              const remainingAmount = Math.max(
                0,
                verifiedTotal > 0 ? displayTotal - verifiedTotal : displayTotal - depositAmount,
              )

              // ไม่แสดงปุ่มจ่ายเงินในกรณี:
              // - มัดจำ && ชำระยอดคงเหลือ
              // - ชำระเต็มจำนวน
              // - ยกเลิก
              // นอกเหนือจากนี้ต้องแสดงปุ่มจ่ายเงิน
              const canPay = !isCancelled && !hasDepositAndRemaining && !isFullPaid && !isRejected

              const isSki = course?.course_type?.toLowerCase()?.includes("ski")
              const programType = isSki ? "Ski" : "Snowboard"
              const badgeBg = isSki ? "bg-[#E67E22]" : "bg-[#0066FF]"

              const { provinceName, districtName } = getLocationName(
                course?.province,
                course?.district,
                course?.nation,
              )

              const bookedRound = enrollment?.bookings?.find((r) => r.id)

              // Determine payment link
              const paymentUrl = `/payment/?course_id=${course?.id || enrollment.course_id}&round_id=${enrollment.round_id || ""}&enrollment_id=${enrollment.id}&adults=${enrollment.adult_count || 1}&children=${enrollment.child_count || 0}`

              return (
                <div
                  key={enrollment.id}
                  onClick={() => router.push(`/mytrip/${enrollment.id}`)}
                  className="bg-white rounded-[1.75rem] p-5 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer text-black overflow-hidden flex flex-col justify-between group"
                >
                  <div className="flex flex-col flex-1">
                    {/* Course Images */}
                    {course?.image_urls && course.image_urls.length > 0 && (
                      <div className="relative w-full h-[180px] sm:h-[190px] overflow-hidden rounded-2xl mb-3.5 shadow-xs">
                        <SlideImg images={course.image_urls} alt={course.title} />
                      </div>
                    )}

                    {/* Top Row: Badge + Code */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`${badgeBg} text-white text-[11px] font-bold px-2.5 py-0.5 rounded-[5px] tracking-wide`}
                      >
                        {programType}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-gray-900 font-extrabold text-[16px] leading-snug mb-2 line-clamp-2 group-hover:text-[#2D455D] transition-colors">
                      {course?.title || "ทริปสโนว์บอร์ด โตเกียว สำหรับผู้เริ่มต้น 6 วัน 5 คืน"}
                    </h3>

                    {/* Location & Date */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-1.5 text-gray-500 text-[13px] font-medium">
                        <MapPin size={15} className="text-gray-400 shrink-0" />
                        <span className="truncate">
                          {districtName ? `${districtName}, ` : ""}
                          {provinceName || "โตเกียว, ญี่ปุ่น"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-[13px] font-medium">
                        <CalendarDays size={15} className="text-gray-400 shrink-0" />
                        <span>
                          {bookedRound?.round && (
                            <>
                              {formatDateRange(
                                bookedRound.round.start_date,
                                bookedRound.round.end_date,
                              )}{" "}
                              ({RenderDate(bookedRound.round.start_date, "HH:mm")} -{" "}
                              {RenderDate(bookedRound.round.end_date, "HH:mm")})
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown & Status Rows */}
                  <div className="border-t border-gray-100 pt-3 space-y-1.5 text-[13px] mt-auto">
                    {transactions.length > 0 ? (
                      <>
                        {/* Summary / Total Row (when multiple transactions or deposit paid with balance) */}
                        {transactions.length > 1 || (isDepositPaid && remainingAmount > 0) ? (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">ยอดทั้งหมด</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 font-bold">
                                ฿ {numeral(displayTotal).format("0,0.00")}
                              </span>
                              {/* {isCancelled ? (
                                <span className="bg-[#FEE2E2] text-[#EF4444] px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold">
                                  ยกเลิก
                                </span>
                              ) : allPaid ? (
                                <span className="bg-[#DCFCE7] text-[#16A34A] px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold">
                                  ชำระสำเร็จ
                                </span>
                              ) : null} */}
                            </div>
                          </div>
                        ) : null}

                        {/* Each Transaction Row */}
                        {transactions.map((tx, idx) => {
                          const badge = getTransactionStatusBadge(
                            tx.status,
                            tx.name,
                            tx.enrollment_status,
                          )
                          return (
                            <div
                              key={tx.id || `${tx.name}-${idx}`}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-gray-700 font-medium">
                                  {getEnrollmentStatusLabel(tx.enrollment_status) ||
                                    tx.name ||
                                    "ยอดชำระ"}
                                </span>
                                <span
                                  className={`${
                                    isCancelled ? "bg-[#FEE2E2] text-[#EF4444]" : badge.className
                                  } px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold`}
                                >
                                  {isCancelled ? "ยกเลิก" : badge.label}
                                </span>
                              </div>
                              <span className="text-gray-900 font-bold">
                                ฿ {numeral(Number(tx.amount) * 1.07).format("0,0.00")}
                              </span>
                            </div>
                          )
                        })}

                        {/* If only deposit transaction exists in list and remaining balance still due */}
                        {transactions.length === 1 && isDepositPaid && remainingAmount > 0 && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-700 font-medium">ยอดคงเหลือ</span>
                              <span className="bg-[#FEF3C7] text-[#D97706] px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold">
                                รอชำระ
                              </span>
                            </div>
                            <span className="text-gray-900 font-bold">
                              ฿ {numeral(Number(remainingAmount)).format("0,0.00")}
                            </span>
                          </div>
                        )}

                        {/* Payment Button */}
                        {canPay && (
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
                        )}
                      </>
                    ) : /* Fallback for enrollments without payment_transactions */
                    isPaid ? (
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
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">ยอดทั้งหมด</span>
                          <span className="text-gray-900 font-bold">
                            ฿ {numeral(totalAmount).format("0,0.00")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">ยอดมัดจำ</span>
                            <span className="bg-[#DCFCE7] text-[#16A34A] px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold">
                              มัดจำแล้ว
                            </span>
                          </div>
                          <span className="text-gray-900 font-bold">
                            ฿ {numeral(depositAmount).format("0,0.00")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">ยอดคงเหลือ</span>
                            <span className="bg-[#FEF3C7] text-[#D97706] px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold">
                              รอชำระ
                            </span>
                          </div>
                          <span className="text-gray-900 font-bold">
                            ฿ {numeral(remainingAmount).format("0,0.00")}
                          </span>
                        </div>
                        {canPay && (
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
                        )}
                      </>
                    ) : (
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
                          </div>
                        </div>
                        {canPay && (
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
                        )}
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
