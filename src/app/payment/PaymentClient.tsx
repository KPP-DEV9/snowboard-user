"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import numeral from "numeral"
import { Toast } from "@/components/Ui/Toast/Toast"
import { Spinner } from "@/components/Ui/Loading/Spinner"
import { Course } from "@/types/course"
import { Enrollment } from "@/types/enrollment"
import { updateEnrollment } from "@/app/actions/enrollment"

interface PaymentClientProps {
  course: Course
  enrollment?: Enrollment | null
  roundId?: string
  adultsCount: number
  childrenCount: number
}

export default function PaymentClient({
  course,
  enrollment,
  roundId,
  adultsCount,
  childrenCount,
}: PaymentClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)

  // Check if deposit was already paid
  const isDepositAlreadyPaid = Boolean(
    (enrollment?.deposit_amount && enrollment.deposit_amount > 0) ||
    enrollment?.status === "deposit_paid" ||
    enrollment?.status?.toLowerCase()?.includes("มัดจำ"),
  )

  const [paymentType, setPaymentType] = useState<"deposit" | "full">(
    isDepositAlreadyPaid ? "full" : "deposit",
  )

  // Calculate prices
  const baseCoursePrice = (course.price || 0) - (course.discount || 0)
  const baseChildPrice = (course.child_price || 0) - (course.discount || 0)

  // 1. Adults trip cost
  const adultSubtotal = baseCoursePrice * (adultsCount || 1)

  // 2. Children trip cost
  const childSubtotal = baseChildPrice * (childrenCount || 0)

  // 3. Extra items (Requirement Transactions)
  const extrasSubtotal =
    enrollment?.requirement_transactions && enrollment.requirement_transactions.length > 0
      ? enrollment.requirement_transactions.reduce((sum, item) => {
          const price =
            item.requirement_type === "ASSET"
              ? Number(item.asset_master?.price) || 0
              : Number(item.option_master?.price) || 0
          return sum + price
        }, 0)
      : Number(enrollment?.req_total) || 0

  // รายการทั้งหมด (Subtotal = sum of all listed items)
  const subtotal = adultSubtotal + childSubtotal + extrasSubtotal

  // ภาษี Vat 7%
  const vatAmount = subtotal * 0.07

  // ยอดทั้งหมด (Grand Total)
  const totalAmount = subtotal + vatAmount

  // มัดจำ 30% ของยอดทั้งหมด
  const depositAmount =
    enrollment?.deposit_amount && enrollment.deposit_amount > 0
      ? enrollment.deposit_amount
      : totalAmount * 0.3

  // ยอดคงเหลือ
  const remainingAmount = Math.max(0, totalAmount - depositAmount)

  const currentPayAmount = isDepositAlreadyPaid
    ? remainingAmount
    : paymentType === "deposit"
      ? depositAmount
      : totalAmount

  const handleConfirmPayment = async () => {
    try {
      setLoading(true)

      const isDeposit = !isDepositAlreadyPaid && paymentType === "deposit"
      const chosenDepositAmount = isDeposit
        ? depositAmount
        : isDepositAlreadyPaid
          ? depositAmount
          : 0
      const newStatus = isDeposit ? "deposit_paid" : "paid"

      const effectiveAdults = Number(enrollment?.adult_count || adultsCount || 1)
      const effectiveChildren = Number(enrollment?.child_count ?? childrenCount ?? 0)

      if (enrollment?.id) {
        const res = await updateEnrollment(enrollment.id, {
          course_id: enrollment.course_id || course.id,
          round_id: enrollment.round_id || roundId || "",
          adult_count: effectiveAdults,
          child_count: effectiveChildren,
          deposit_amount: chosenDepositAmount,
          status: newStatus,
          total_amount: totalAmount,
        })
        if (!res.success) {
          setToast({
            message: res.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูลการชำระเงิน",
            type: "error",
          })
          return
        }
      } else {
        setToast({
          message: "ไม่พบข้อมูลการจอง!",
          type: "error",
        })
        router.push(backUrl)
      }

      setToast({
        message: "การชำระเงินสำเร็จ! กำลังพาท่านไปยังหน้ารายการทริป...",
        type: "success",
      })

      setTimeout(() => {
        router.push("/mytrip")
      }, 1000)
    } catch (err: any) {
      setToast({
        message: err?.message || "เกิดข้อผิดพลาดในการชำระเงิน",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const backUrl = `/booking/?enrollment_id=${enrollment?.id}&course_id=${course.id}&round_id=${roundId}&adults=${adultsCount}&children=${childrenCount}`

  return (
    <div className="min-h-screen bg-[#2D455D] pb-32 font-sans selection:bg-[#568759]/30">
      <div className="w-full px-4 mx-auto pt-6 max-w-lg">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-8">
          <Link
            href={backUrl}
            className="absolute left-0 text-white p-1 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={24} className="stroke-[2.5]" />
          </Link>
          <h1 className="text-xl font-bold text-white tracking-wide">ชำระเงิน</h1>
        </div>

        {/* Course Title & Price Summary */}
        <div className="mb-6">
          <h2 className="text-white font-extrabold text-[17px] md:text-[19px] leading-snug mb-4">
            {course.title}
          </h2>

          <div className="space-y-2 text-[14px] md:text-[15px]">
            {/* 1. Base trip cost for adults */}
            <div className="flex justify-between items-center text-white/95">
              <span className="font-normal">ค่าทริปผู้ใหญ่ ({adultsCount} ท่าน)</span>
              <span className="font-medium">฿ {numeral(adultSubtotal).format("0,0.00")}</span>
            </div>

            {/* 2. Base trip cost for children if any */}
            {childrenCount > 0 && (
              <div className="flex justify-between items-center text-white/95">
                <span className="font-normal">ค่าทริปเด็ก ({childrenCount} ท่าน)</span>
                <span className="font-medium">฿ {numeral(childSubtotal).format("0,0.00")}</span>
              </div>
            )}

            {/* 3. Extra items (Requirement Transactions) */}
            {enrollment?.requirement_transactions &&
              enrollment.requirement_transactions.map((item, idx) => {
                const isAsset = item.requirement_type === "ASSET"
                const name = isAsset
                  ? `${item.asset_master?.name || "เช่าอุปกรณ์"}${
                      item.asset_master?.size ? ` (${item.asset_master.size})` : ""
                    }`
                  : item.option_master?.name || "บริการเพิ่มเติม"
                const price = isAsset
                  ? item.asset_master?.price || 0
                  : item.option_master?.price || 0

                return (
                  <div
                    key={item.id || idx}
                    className="flex justify-between items-center text-white/95"
                  >
                    <span className="font-normal truncate max-w-[270px]">• {name}</span>
                    <span className="font-medium shrink-0">
                      ฿ {numeral(price).format("0,0.00")}
                    </span>
                  </div>
                )
              })}

            {/* Divider */}
            <div className="border-t border-white/20 pt-2.5 mt-2 space-y-2">
              <div className="flex justify-between items-center text-white">
                <span className="font-normal text-white/90">รายการทั้งหมด</span>
                <span className="font-medium">฿ {numeral(subtotal).format("0,0.00")}</span>
              </div>

              <div className="flex justify-between items-center text-white">
                <span className="font-normal text-white/90">ภาษี Vat 7%</span>
                <span className="font-medium">฿ {numeral(vatAmount).format("0,0.00")}</span>
              </div>

              <div className="flex justify-between items-center text-white pt-1">
                <span className="font-normal text-white/90">ยอดทั้งหมด</span>
                <span className="font-bold text-lg">฿ {numeral(totalAmount).format("0,0.00")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* White Payment Card */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col text-black">
          {/* Radio Options Header */}
          <h3 className="text-gray-900 font-bold text-base mb-3.5">เลือกรูปแบบชำระเงิน</h3>

          {/* Radio Options List */}
          <div className="space-y-2.5">
            {/* If deposit is NOT paid yet, show "ชำระมัดจำ" option */}
            {!isDepositAlreadyPaid && (
              <label className="flex items-center justify-between cursor-pointer py-1">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentType"
                    value="deposit"
                    checked={paymentType === "deposit"}
                    onChange={() => setPaymentType("deposit")}
                    className="w-4 h-4 text-[#0066FF] border-gray-300 focus:ring-[#0066FF] cursor-pointer"
                  />
                  <span className="text-gray-900 font-medium text-sm">ชำระมัดจำ</span>
                </div>
                <span className="text-gray-900 font-medium text-sm">
                  ฿ {numeral(depositAmount).format("0,0.00")}
                </span>
              </label>
            )}

            {/* Full Amount / Remaining Amount Option */}
            <label className="flex items-center justify-between cursor-pointer py-1">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentType"
                  value="full"
                  checked={paymentType === "full" || isDepositAlreadyPaid}
                  onChange={() => setPaymentType("full")}
                  className="w-4 h-4 text-[#0066FF] border-gray-300 focus:ring-[#0066FF] cursor-pointer"
                />
                <span className="text-gray-900 font-medium text-sm">ชำระเต็มจำนวน</span>
              </div>
              <span className="text-gray-900 font-medium text-sm">
                ฿ {numeral(isDepositAlreadyPaid ? remainingAmount : totalAmount).format("0,0.00")}
              </span>
            </label>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Deposit Instructions (Only shown when "ชำระมัดจำ" is selected and deposit not yet paid) */}
          {!isDepositAlreadyPaid && paymentType === "deposit" && (
            <div className="text-center py-2 mb-4">
              <div className="text-gray-900 font-bold text-sm mb-1.5">
                ชำระเงินเพื่อยืนยันการจอง 30% ของราคาทริป
              </div>

              <div className="text-gray-400 text-[11px] md:text-xs leading-relaxed space-y-0.5 font-normal">
                <p>โดยส่วนที่เหลือจะต้องชำระก่อนวันเดินทาง 30 วัน โดยระบบ</p>
                <p>จะทำการแจ้งเตือนให้ชำระเงินผ่าน Line</p>
                <p className="pt-0.5">**กรณียกเลิกขอสงวนสิทธิ์ในการคืนมัดจำ</p>
              </div>
            </div>
          )}

          {/* Pay Amount Row */}
          <div className="flex items-center justify-between my-3">
            <span className="text-gray-900 font-bold text-sm">ยอดชำระ:</span>
            <span className="text-gray-900 font-extrabold text-2xl md:text-[28px] tracking-tight">
              ฿ {numeral(currentPayAmount).format("0,0.00")}
            </span>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmPayment}
            disabled={loading}
            className={`w-full bg-[#D4411C] hover:bg-[#B93816] text-white py-3.5 rounded-2xl font-bold text-base transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-3 ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Spinner size="sm" color="border-white" />
                <span>กำลังดำเนินการ...</span>
              </>
            ) : (
              <span>ยืนยันชำระเงิน</span>
            )}
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
