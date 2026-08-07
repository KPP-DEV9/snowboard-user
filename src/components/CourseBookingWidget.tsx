"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus } from "lucide-react"
import Link from "next/link"
import numeral from "numeral"

interface CourseBookingWidgetProps {
  courseId: string
  adultPrice: number
  childPrice: number
  discount: number
}

export default function CourseBookingWidget({
  courseId,
  adultPrice,
  childPrice,
  discount,
}: CourseBookingWidgetProps) {
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const router = useRouter()

  const finalAdultPrice = Math.max(0, adultPrice - discount)
  // Assuming child price is childPrice (not discounted, or discounted similarly).
  // Let's match the logic from before, if discount applies:
  const finalChildPrice = Math.max(0, childPrice)

  const adultTotal = adults * finalAdultPrice
  const childTotal = children * finalChildPrice
  const totalPrice = adultTotal + childTotal

  const handleConfirm = () => {
    // Navigate to rounds selection with query params for adults and children
    router.push(`/course/${courseId}/rounds?adults=${adults}&children=${children}`)
  }

  return (
    <div className="bg-trd rounded-t-[3rem] p-6 md:p-8 lg:p-10 w-full mt-6 shadow-xl flex flex-col gap-6">
      <h2 className="text-center text-xl md:text-2xl font-bold text-white mb-2">ระบุจำนวนผู้จอง</h2>

      {/* Adult Section */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="font-bold text-white text-[17px] md:text-lg">
            ผู้ใหญ่{" "}
            <span className="font-normal text-sm text-white/80 ml-2">
              ฿ {numeral(finalAdultPrice).format("0,0")} / คน
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-3 bg-white rounded-[10px] px-1 py-1 shadow-sm w-fit">
            <button
              onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
              className="w-7 h-7 rounded-lg bg-white text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <Minus size={16} className="stroke-[3]" />
            </button>
            <div className="font-bold w-6 text-center text-[15px] text-black">{adults}</div>
            <button
              onClick={() => setAdults((prev) => prev + 1)}
              className="w-7 h-7 rounded-lg bg-white text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <Plus size={16} className="stroke-[3]" />
            </button>
          </div>
          <div className="text-[#E7E298] font-bold text-[15px]">
            ฿ {numeral(adultTotal).format("0,0")}
          </div>
        </div>
      </div>

      {/* Children Section */}
      <div className="flex items-start justify-between pt-4 border-t border-white/20">
        <div className="flex flex-col">
          <div className="font-bold text-white text-[17px] md:text-lg">
            เด็ก{" "}
            <span className="font-normal text-sm text-white/80 ml-2">
              ฿ {numeral(finalChildPrice).format("0,0")} / คน
            </span>
          </div>
          <div className="text-white/60 text-[12px] mt-0.5">อายุน้อยกว่า 12 ปี</div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-3 bg-white rounded-[10px] px-1 py-1 shadow-sm w-fit">
            <button
              onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
              className="w-7 h-7 rounded-lg bg-white text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <Minus size={16} className="stroke-[3]" />
            </button>
            <div className="font-bold w-6 text-center text-[15px] text-black">{children}</div>
            <button
              onClick={() => setChildren((prev) => prev + 1)}
              className="w-7 h-7 rounded-lg bg-white text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <Plus size={16} className="stroke-[3]" />
            </button>
          </div>
          <div className="text-[#E7E298] font-bold text-[15px]">
            ฿ {numeral(childTotal).format("0,0")}
          </div>
        </div>
      </div>

      {/* Total Section */}
      <div className="flex items-center justify-between pt-6 border-t border-white/20 mt-2">
        <div className="font-bold text-white text-lg">ราคารวม</div>
        <div className="font-bold text-[#E7E298] text-[22px] md:text-3xl">
          ฿ {numeral(totalPrice).format("0,0")}
        </div>
      </div>

      <div className="text-center text-white/60 text-[13px] font-medium -mt-2">
        มัดจำ 20% ยอดชำระเต็ม
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        className="w-full bg-[#F04E23] hover:bg-[#D4411C] text-white py-4 rounded-xl font-bold text-[17px] transition-colors mt-2 shadow-md flex items-center justify-center gap-2"
      >
        จองทริป &gt;
      </button>

      {/* Back Link */}
      <div className="text-center mt-3">
        <Link
          href="/"
          className="text-white/80 hover:text-white underline text-sm transition-colors"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  )
}
