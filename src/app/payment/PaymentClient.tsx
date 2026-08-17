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

  // Calculate prices
  const baseCoursePrice = (course.price || 0) - (course.discount || 0)
  const baseChildPrice = (course.child_price || 0) - (course.discount || 0)
  const fallbackTotal =
    baseCoursePrice * (adultsCount || 1) + baseChildPrice * (childrenCount || 0)

  const totalAmount = enrollment?.total_amount || (fallbackTotal > 0 ? fallbackTotal : 55372.5)
  const subtotal = totalAmount / 1.07
  const vatAmount = totalAmount - subtotal
  const depositAmount = totalAmount * 0.3

  const handleConfirmPayment = async () => {
    try {
      setLoading(true)
      // Simulate/trigger payment processing
      await new Promise((resolve) => setTimeout(resolve, 800))

      setToast({
        message: "การชำระเงินสำเร็จ! กำลังพาท่านไปยังหน้ารายการทริป...",
        type: "success",
      })

      setTimeout(() => {
        router.push("/mytrip")
      }, 1200)
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
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col items-center text-center">
          {/* Deposit Tag */}
          <div className="bg-[#FFF4E5] text-[#D4411C] px-6 py-2 rounded-full text-[15px] font-extrabold mb-6 inline-block tracking-wide">
            ชำระเงินมัดจำ
          </div>

          {/* Deposit Amount */}
          <div className="text-[34px] md:text-[38px] font-extrabold text-gray-900 tracking-tight mb-6">
            ฿ {numeral(depositAmount).format("0,0.00")}
          </div>

          {/* Description / Instructions */}
          <div className="text-gray-900 font-bold text-[15px] md:text-[16px] mb-2">
            ชำระเงินเพื่อยืนยันการจอง 30% ของราคาทริป
          </div>

          <div className="text-gray-400 text-[12px] md:text-[13px] leading-relaxed mb-8 max-w-xs space-y-0.5 font-normal">
            <p>โดยส่วนที่เหลือจะต้องชำระก่อนวันเดินทาง 30 วัน โดยระบบ</p>
            <p>จะทำการแจ้งเตือนให้ชำระเงินผ่าน Line</p>
            <p className="pt-0.5">**กรณียกเลิกขอสงวนสิทธิ์ในการคืนมัดจำ</p>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmPayment}
            disabled={loading}
            className={`w-full bg-[#D4411C] hover:bg-[#B93816] text-white py-4 rounded-2xl font-extrabold text-lg transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer ${
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
