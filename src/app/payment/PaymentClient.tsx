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
import { createEnrollment, updateEnrollment } from "@/app/actions/enrollment"

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
  const [paymentType, setPaymentType] = useState<"deposit" | "full">("deposit")
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)

  // Calculate prices
  const baseCoursePrice = (course.price || 0) - (course.discount || 0)
  const baseChildPrice = (course.child_price || 0) - (course.discount || 0)
  const fallbackTotal =
    baseCoursePrice * (adultsCount || 1) + baseChildPrice * (childrenCount || 0)

  const totalAmount = enrollment?.total_amount || (fallbackTotal > 0 ? fallbackTotal : 55372.5)
  const subtotal = totalAmount / 1.07
  const vatAmount = totalAmount - subtotal
  const depositAmount = totalAmount * 0.3

  const currentPayAmount = paymentType === "deposit" ? depositAmount : totalAmount

  const handleConfirmPayment = async () => {
    try {
      setLoading(true)

      const isDeposit = paymentType === "deposit"
      const chosenDepositAmount = isDeposit ? depositAmount : 0
      const newStatus = isDeposit ? "deposit_paid" : "paid"

      if (enrollment?.id) {
        const res = await updateEnrollment(enrollment.id, {
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
        const res = await createEnrollment({
          course_id: course.id,
          round_id: roundId || "",
          adult_count: adultsCount || 1,
          child_count: childrenCount || 0,
          total_amount: totalAmount,
          deposit_amount: chosenDepositAmount,
        })

        if (!res.success) {
          setToast({
            message: res.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูลการชำระเงิน",
            type: "error",
          })
          return
        }
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

  const backUrl = enrollment?.id
    ? `/booking?course_id=${course.id}&round_id=${roundId || ""}&adults=${adultsCount}&children=${childrenCount}`
    : `/course/${course.id}/rounds?adults=${adultsCount}&children=${childrenCount}`

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
          <h2 className="text-white font-extrabold text-[17px] md:text-[19px] leading-snug mb-5">
            {course.title}
          </h2>

          <div className="space-y-2 text-[15px]">
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
              <span className="font-bold">฿ {numeral(totalAmount).format("0,0.00")}</span>
            </div>
          </div>
        </div>

        {/* White Payment Card */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col text-black">
          {/* Radio Options Header */}
          <h3 className="text-gray-900 font-bold text-base mb-3.5">เลือกรูปแบบชำระเงิน</h3>

          {/* Radio Options List */}
          <div className="space-y-2.5">
            {/* Option 1: Deposit */}
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

            {/* Option 2: Full Amount */}
            <label className="flex items-center justify-between cursor-pointer py-1">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentType"
                  value="full"
                  checked={paymentType === "full"}
                  onChange={() => setPaymentType("full")}
                  className="w-4 h-4 text-[#0066FF] border-gray-300 focus:ring-[#0066FF] cursor-pointer"
                />
                <span className="text-gray-900 font-medium text-sm">ชำระเต็มจำนวน</span>
              </div>
              <span className="text-gray-900 font-medium text-sm">
                ฿ {numeral(totalAmount).format("0,0.00")}
              </span>
            </label>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Deposit Instructions (Only shown when "ชำระมัดจำ" is selected) */}
          {paymentType === "deposit" && (
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
