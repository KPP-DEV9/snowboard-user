import { th } from "date-fns/locale"
import { Card } from "../Card/Card"
import { format, isSameMonth, isSameDay, isToday } from "date-fns"
import { Rounds } from "@/types/rounds"

interface Props {
  currentMonth: Date
  selectedDate: Date | null
  handleDateSelect: (date: Date) => void
  nextMonth: () => void
  prevMonth: () => void
  calendarDays: Date[]
  rounds: Rounds[]
}

export default function MyCalendar({
  currentMonth,
  selectedDate,
  handleDateSelect,
  nextMonth,
  prevMonth,
  calendarDays,
  rounds,
}: Props) {
  return (
    <Card className="py-5 px-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={prevMonth} className="w-6 h-6 flex items-center justify-center text-gold">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="text-[16px] font-bold">
          {format(currentMonth, "MMMM yyyy", { locale: th })}
        </div>
        <button onClick={nextMonth} className="w-6 h-6 flex items-center justify-center text-gold">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 text-center mb-4">
        {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day) => (
          <div key={day} className="text-[12px] text-text-subtle">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 gap-x-1">
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth)

          if (!isCurrentMonth) {
            return <div key={idx} className="aspect-square"></div>
          }

          const dayRounds = rounds.filter((r) => isSameDay(new Date(r.start_date), day))
          const hasRound = dayRounds.length > 0
          const isFullyBooked = hasRound && dayRounds.every((r) => r.total === 0)

          const isPastDate = day < new Date(new Date().setHours(0, 0, 0, 0))
          const isUnavailable = !hasRound || isPastDate
          const isAvailable = hasRound && !isPastDate

          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false

          let btnClass =
            "aspect-square flex items-center justify-center text-[14px] rounded-lg text-foreground transition-colors "

          if (isUnavailable) btnClass += "text-text-subtle opacity-50 "

          if (isSelected) btnClass += "bg-gold text-[#111] font-bold "
          else if (isToday(day)) btnClass += "border border-gold text-gold "

          return (
            <button
              key={idx}
              disabled={isUnavailable}
              onClick={() => handleDateSelect(day)}
              className={btnClass}
            >
              <div className="flex flex-col items-center">
                <span className={isFullyBooked ? "line-through opacity-50" : ""}>
                  {format(day, "d")}
                </span>
                {isAvailable && !isFullyBooked && (
                  <span className="w-1 h-1 bg-gold rounded-full mt-1"></span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
