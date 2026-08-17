"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X, Minus, Plus } from "lucide-react"
import { createEnrollment } from "@/app/actions/enrollment"
import { Toast } from "@/components/Ui/Toast/Toast"
import { Spinner } from "@/components/Ui/Loading/Spinner"

interface BookingButtonProps {
  courseId: string
  roundId: string
  adultPrice: number
  childPrice: number
  availableSeats: number
}

export default function BookingButton({
  courseId,
  roundId,
  adultPrice,
  childPrice,
  availableSeats,
}: BookingButtonProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const adultsQuery = searchParams.get("adults")
  const childrenQuery = searchParams.get("children")

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)
  const [adults, setAdults] = useState(Number(adultsQuery || 1))
  const [children, setChildren] = useState(Number(childrenQuery || 0))

  const totalPrice = adults * adultPrice + children * childPrice

  const handleConfirm = async () => {
    try {
      setLoading(true)
      const payload = {
        course_id: courseId,
        round_id: roundId,
        adult_count: adults,
        child_count: children,
        total_amount: totalPrice,
        deposit_amount: 0,
        ski_equipment: false,
        snowboard_equipment: false,
        participants: [],
      }

      const { success, error } = await createEnrollment(payload)

      if (!success) {
        setToast({ message: error || "เกิดข้อผิดพลาดในการจอง", type: "error" })
        return
      }

      setToast({ message: "จองสำเร็จแล้ว! กำลังพาท่านไปยังรายการทริป...", type: "success" })
      setTimeout(() => {
        router.push("/mytrip")
      }, 1500)
    } catch (err: any) {
      setToast({ message: err?.message || "เกิดข้อผิดพลาดในการจอง", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#F04E23] hover:bg-[#D4411C] text-white px-7 md:px-8 py-2 md:py-2.5 rounded-[10px] md:rounded-xl font-bold text-sm md:text-[15px] transition-colors shadow-sm"
      >
        เลือก
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>

            <div className="p-6 md:p-8 flex flex-col gap-6">
              <h2 className="text-center text-[19px] font-bold text-black mt-2">
                คอนเฟิร์มจำนวนผู้จอง
              </h2>

              {/* Adult */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-bold text-black text-[17px]">ผู้ใหญ่</div>
                  <div className="text-gray-400 text-[13px]">
                    ฿ {adultPrice.toLocaleString()} / ท่าน
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-1 py-1 border border-gray-100">
                  <button
                    onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <Minus size={16} className="stroke-[3]" />
                  </button>
                  <div className="font-bold w-4 text-center text-[15px] text-black">{adults}</div>
                  <button
                    onClick={() => setAdults((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <Plus size={16} className="stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between py-2 border-t border-gray-100 pt-6">
                <div>
                  <div className="font-bold text-black text-[17px]">
                    เด็ก{" "}
                    <span className="text-gray-400 text-[12px] font-medium ml-1">
                      อายุน้อยกว่า 12 ปี
                    </span>
                  </div>
                  <div className="text-gray-400 text-[13px]">
                    ฿ {childPrice.toLocaleString()} / ท่าน
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-1 py-1 border border-gray-100">
                  <button
                    onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <Minus size={16} className="stroke-[3]" />
                  </button>
                  <div className="font-bold w-4 text-center text-[15px] text-black">{children}</div>
                  <button
                    onClick={() => setChildren((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <Plus size={16} className="stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex items-center justify-between py-2 border-t border-gray-100 pt-6">
                <div className="font-bold text-black text-[17px]">ราคารวม</div>
                <div className="font-bold text-[#448651] text-[22px]">
                  ฿ {totalPrice.toLocaleString()}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`w-full bg-[#F04E23] hover:bg-[#D4411C] text-white py-3.5 rounded-2xl font-bold text-[17px] transition-colors mt-2 shadow-sm flex items-center justify-center gap-2 ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" color="border-white" />
                    <span>กำลังดำเนินการ...</span>
                  </>
                ) : (
                  <span>ยืนยัน</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
