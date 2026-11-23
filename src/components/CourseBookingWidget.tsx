"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus } from "lucide-react"
import Link from "next/link"
import numeral from "numeral"

import { Vat } from "@/utils/Inv"
import { VatType } from "@/types/model"

interface CourseBookingWidgetProps {
  courseId: string
  adultPrice: number
  childPrice: number
  discount: number
  vat?: VatType
  className?: string
}

export default function CourseBookingWidget({
  courseId,
  adultPrice,
  childPrice,
  discount,
  vat,
  className,
}: CourseBookingWidgetProps) {
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const router = useRouter()

  const isVatIncluded = vat === "INCLUDE"

  const finalAdultPrice = Math.max(0, adultPrice - discount)
  const finalChildPrice = Math.max(0, childPrice)

  const adultTotal = adults * finalAdultPrice
  const childTotal = children * finalChildPrice
  const totalPrice = adultTotal + childTotal

  const handleConfirm = () => {
    router.push(`/course/${courseId}/rounds?adults=${adults}&children=${children}`)
  }

  return (
    <div
      className={`bg-[#798E75] rounded-[1.5rem] p-5 md:p-6 w-full shadow-lg flex flex-col gap-4 ${className || ""}`}
    >
      <h2 className="text-center text-base md:text-lg font-bold text-white">ระบุจำนวนผู้จอง</h2>

      {/* Adult Section */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-xs sm:text-sm font-medium text-white">
            ผู้ใหญ่{" "}
            <span className="text-[11px] text-white/80 ml-1">
              ฿ {numeral(finalAdultPrice).format("0,0")} / คน
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 bg-white rounded-lg px-1 py-0.5 shadow-sm">
            <button
              onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
              className="w-6 h-6 rounded bg-white text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Minus size={14} className="stroke-[3]" />
            </button>
            <div className="font-bold w-5 text-center text-xs text-black">{adults}</div>
            <button
              onClick={() => setAdults((prev) => prev + 1)}
              className="w-6 h-6 rounded bg-white text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Plus size={14} className="stroke-[3]" />
            </button>
          </div>
          <div className="text-white font-bold text-[11px]">
            ฿ {numeral(adultTotal).format("0,0")} / คน
          </div>
        </div>
      </div>

      {/* Children Section */}
      {finalChildPrice > 0 && (
        <div className="flex items-center justify-between pt-3 border-t border-white/20">
          <div className="flex flex-col">
            <div className="text-xs sm:text-sm font-medium text-white">
              เด็ก{" "}
              <span className="text-[11px] text-white/80 ml-1">
                ฿ {numeral(finalChildPrice).format("0,0")} / คน
              </span>
            </div>
            <div className="text-white/60 text-[10px]">อายุน้อยกว่า 12 ปี</div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 bg-white rounded-lg px-1 py-0.5 shadow-sm">
              <button
                onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                className="w-6 h-6 rounded bg-white text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Minus size={14} className="stroke-[3]" />
              </button>
              <div className="font-bold w-5 text-center text-xs text-black">{children}</div>
              <button
                onClick={() => setChildren((prev) => prev + 1)}
                className="w-6 h-6 rounded bg-white text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus size={14} className="stroke-[3]" />
              </button>
            </div>
            <div className="text-white font-bold text-[11px]">
              ฿ {numeral(childTotal).format("0,0")}
            </div>
          </div>
        </div>
      )}

      {/* Total Section */}
      <div className="flex flex-col gap-1.5 pt-3 border-t border-white/20">
        <div className="flex items-center justify-between text-xs sm:text-sm text-white">
          <span>ราคา</span>
          <span className="font-bold">฿ {numeral(totalPrice).format("0,0")}</span>
        </div>

        {!isVatIncluded && (
          <div className="flex items-center justify-between text-xs sm:text-sm text-white">
            <span className="font-bold">ราคา (รวม vat7%)</span>
            <span className="font-extrabold text-sm sm:text-base">
              ฿ {numeral(totalPrice * Vat).format("0,0.00")}
            </span>
          </div>
        )}
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        className="w-full bg-[#F04E23] hover:bg-[#D4411C] text-white py-3 rounded-xl font-bold text-sm md:text-base transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
      >
        จองทริป &gt;
      </button>

      {/* Back Link */}
      <div className="text-center">
        <Link
          href="/"
          className="text-white/80 hover:text-white underline text-xs transition-colors"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  )
}
