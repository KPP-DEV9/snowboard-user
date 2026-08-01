"use client"

import { useState, useEffect, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { updateUserClassesBooking } from "@/app/actions/course"
import { Toast } from "@/components/Ui/Toast/Toast"
import { Spinner } from "@/components/Ui/Loading/Spinner"
import { useCalendar } from "@/hooks/useCalendar"
import { format } from "date-fns"
import { Rounds } from "@/types/rounds"
import MyCalendar from "@/components/Ui/Calendar"
import { getRoundByClassesID } from "@/app/actions/round"
import { RenderDate } from "@/lib/date"
import numeral from "numeral"

interface Props {
  classes_id: string
}

export function BookingFormRange({ classes_id }: Props) {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)
  const router = useRouter()
  const calendar = useCalendar()
  const pathname = usePathname()
  const user_classes_id = pathname.split("/")[2]

  const [rounds, setRounds] = useState<Rounds[]>([])
  const [isLoadingRounds, setIsLoadingRounds] = useState(false)

  const fetchRounds = async () => {
    setIsLoadingRounds(true)
    try {
      const dateStr = format(calendar.currentMonth, "yyyy-MM-dd")
      const { success, data } = await getRoundByClassesID(classes_id, dateStr)
      if (success && data) {
        setRounds(data)
      } else {
        setRounds([])
      }
    } finally {
      setIsLoadingRounds(false)
    }
  }

  useEffect(() => {
    fetchRounds()
  }, [classes_id, calendar.currentMonth])

  const [roundId, setRoundID] = useState<string>("")
  const selectedDateRounds = calendar.selectedDate
    ? rounds.filter(
        (r) =>
          format(new Date(r.start_date), "yyyy-MM-dd") ===
          format(calendar.selectedDate!, "yyyy-MM-dd"),
      )
    : []

  const handleConfirm = async () => {
    if (!calendar.selectedDate || !roundId) {
      setToast({ message: "กรุณาระบุวันและเวลา", type: "warning" })
      return
    }
    try {
      setLoading(true)
      const { success, error } = await updateUserClassesBooking(user_classes_id, roundId)
      if (!success) {
        setToast({ message: error || "เกิดข้อผิดพลาดในการบันทึก", type: "error" })
      } else {
        setToast({ message: "บันทึกเวลาเรียนสำเร็จ!", type: "success" })
        setTimeout(() => {
          router.push("/dashboard") // Refresh the server component to load new status
        }, 1500)
      }
    } finally {
      setLoading(false)
    }
  }

  const selectedRound = useMemo(() => rounds.find((r) => r.id === roundId), [rounds, roundId])
  const totalHour = selectedRound?.classes.hour || 0

  return (
    <div className="flex flex-col gap-4 w-full">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <MyCalendar
        currentMonth={calendar.currentMonth}
        selectedDate={calendar.selectedDate}
        handleDateSelect={calendar.handleDateSelect}
        nextMonth={calendar.nextMonth}
        prevMonth={calendar.prevMonth}
        calendarDays={calendar.calendarDays}
        rounds={rounds}
      />

      <div className="flex flex-col">
        <h3 className="text-[14px] font-bold text-gold mb-4 tracking-wider flex items-center gap-2 uppercase">
          เวลาว่าง · {calendar?.selectedDate && RenderDate(calendar?.selectedDate, "d MMM")}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {isLoadingRounds ? (
            <div className="col-span-2 flex flex-col justify-center items-center py-8">
              <Spinner size="md" color="border-gold" />
              <p className="mt-4 text-text-muted text-[14px]">กำลังโหลดเวลาว่าง...</p>
            </div>
          ) : selectedDateRounds?.length > 0 ? (
            selectedDateRounds
              .sort((a, b) => {
                if (a.start_date && b.start_date) {
                  return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
                }
                if (a.start_date) return -1
                if (b.start_date) return 1
                return 0
              })
              .map((item: Rounds) => {
                const isSelected = item.id === roundId
                const isPast = new Date(item.start_date).getTime() < new Date().getTime()
                const isDisabled = item.total === 0 || isPast

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setRoundID(item.id)
                    }}
                    disabled={isDisabled}
                    className={`py-4 px-2 rounded-xl text-[16px] font-mono tracking-wider transition-all border grid items-center justify-center ${
                      isSelected
                        ? "bg-[#C4A052] text-black border-[#C4A052] font-bold shadow-lg shadow-gold/20"
                        : isDisabled
                          ? "bg-[#1A1A1A] text-gray-600 line-through border-[#2A2A2A] cursor-not-allowed"
                          : "bg-[#1A1A1A] text-white border-[#2A2A2A] hover:border-gold/50"
                    }`}
                  >
                    <p className="text-xl font-mono">
                      {RenderDate(item.start_date, "HH:mm")} - {RenderDate(item.end_date, "HH:mm")}
                    </p>
                    <p className="text-lg font-mono">
                      {" "}
                      {isPast
                        ? "ผ่านไปแล้ว"
                        : item.total > 0
                          ? `ว่าง ${numeral(item.total).format("0,0")}`
                          : "เต็ม"}
                    </p>
                  </button>
                )
              })
          ) : (
            <p className="text-center col-span-2 mt-4 text-text-muted">ยังไม่มีรอบเรียน</p>
          )}
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={loading || !calendar.selectedDate || !roundId}
        className={`w-full bg-gold hover:bg-gold-hover text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold/20 ${
          loading || !calendar.selectedDate || !roundId ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <>
            <Spinner size="sm" color="border-black" />
            <span>กำลังบันทึก...</span>
          </>
        ) : (
          <span>ยืนยันการจองเวลา</span>
        )}
      </button>
    </div>
  )
}
