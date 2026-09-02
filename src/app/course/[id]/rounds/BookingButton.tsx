"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X, CalendarDays, Clock } from "lucide-react"
import { Course } from "@/types/course"
import { RenderDate } from "@/lib/date"

interface BookingButtonProps {
  course: Course
  roundId: string
  adultPrice: number
  childPrice: number
  // availableSeats: number
}

export default function BookingButton({
  course,
  roundId,
  adultPrice,
  childPrice,
}: BookingButtonProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const adultsQuery = searchParams.get("adults")
  const childrenQuery = searchParams.get("children")

  const [isOpen, setIsOpen] = useState(false)

  const adults = Number(adultsQuery || 1)
  const children = Number(childrenQuery || 0)

  const selectedRound = course.rounds?.find((r) => r.id === roundId)

  const totalPrice = adults * adultPrice + children * childPrice

  const handleConfirm = () => {
    if (course?.id) {
      router.push(
        `/course/${course.id}/terms?round_id=${roundId}&adults=${adults}&children=${children}`,
      )
    }
  }

  // router.push(
  //   `/booking?course_id=${courseId}&round_id=${roundId}&adults=${adults}&children=${children}`,
  // )

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

            <div className="p-6 md:p-8 flex flex-col gap-5">
              <div className="text-center mt-1">
                <h2 className="text-[19px] font-bold text-black">ยืนยันการจองรอบ</h2>
                {selectedRound && (
                  <div className="mt-2.5 text-xs md:text-[13px] text-gray-600 space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-gray-800">
                      <CalendarDays size={15} className="text-[#304B65]" />
                      <span>วันที่ {RenderDate(selectedRound.start_date, "d MMMM yyyy")}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 font-bold text-[#798E75]">
                      <Clock size={15} />
                      <span>
                        เวลา {RenderDate(selectedRound.start_date, "HH:mm")} -{" "}
                        {RenderDate(selectedRound.end_date, "HH:mm")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Adult */}
              {adults > 0 && (
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-bold text-black text-[17px]">ผู้ใหญ่</div>
                    <div className="text-gray-400 text-[13px]">
                      ฿ {adultPrice.toLocaleString()} / ท่าน
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-full px-1 py-1 border border-gray-100">
                    <div className="font-bold w-4 text-center text-[15px] text-black">{adults}</div>
                  </div>
                </div>
              )}

              {/* Children */}
              {children > 0 && (
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
                    <div className="font-bold w-4 text-center text-[15px] text-black">
                      {children}
                    </div>
                  </div>
                </div>
              )}

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
                className="w-full bg-[#F04E23] hover:bg-[#D4411C] text-white py-3.5 rounded-2xl font-bold text-[17px] transition-colors mt-2 shadow-sm flex items-center justify-center gap-2"
              >
                <span>ยืนยัน</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
