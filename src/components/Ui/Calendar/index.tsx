import { th } from "date-fns/locale"
import { Card } from "../Card/Card"
import { format, isSameMonth, isSameDay, isToday } from "date-fns"
import { Course, ProgramType, Round } from "@/types/model"

interface Props {
  currentMonth: Date
  selectedDate: Date | null
  handleDateSelect: (date: Date) => void
  nextMonth: () => void
  prevMonth: () => void
  calendarDays: Date[]
  rounds: Round[]
  prevDisabled?: boolean
  nextDisabled?: boolean
  programType?: ProgramType
  course?: Course
}

function isParkFreestyle(round?: Round, course?: Course): boolean {
  const roundAny = round as any
  const courseAny = (round?.course || course) as any

  const candidates = [
    roundAny?.name,
    roundAny?.title,
    roundAny?.type,
    roundAny?.round_type,
    roundAny?.class_type,
    roundAny?.category,
    courseAny?.course_type_master?.name,
    courseAny?.title,
    courseAny?.level_custom,
    courseAny?.description,
  ]

  const text = candidates.filter(Boolean).join(" ").toLowerCase()

  return text.includes("park") || text.includes("freestyle")
}

export default function MyCalendar({
  currentMonth,
  selectedDate,
  handleDateSelect,
  nextMonth,
  prevMonth,
  calendarDays,
  rounds,
  prevDisabled,
  nextDisabled,
  programType,
  course,
}: Props) {
  const isSpecialProgram =
    programType === "PRIVATE_COACHING" || programType === "PARK_AND_FREESTYLE"

  return (
    <div className="w-full">
      <Card className="py-5 px-4 text-black">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevMonth}
            disabled={prevDisabled}
            className={`w-6 h-6 flex items-center justify-center transition-opacity ${
              prevDisabled ? "opacity-20 cursor-not-allowed" : "text-gray-700 hover:text-black"
            }`}
          >
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
          <button
            onClick={nextMonth}
            disabled={nextDisabled}
            className={`w-6 h-6 flex items-center justify-center transition-opacity ${
              nextDisabled ? "opacity-20 cursor-not-allowed" : "text-gray-700 hover:text-black"
            }`}
          >
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

            const dayRounds = rounds?.filter((r) => isSameDay(new Date(r.start_date), day))
            const hasRound = dayRounds?.length > 0
            const isFullyBooked = hasRound && dayRounds?.every((r) => r.total === 0)

            const isPastDate = day < new Date(new Date().setHours(0, 0, 0, 0))
            const isUnavailable = !hasRound || isPastDate
            const isAvailable = hasRound && !isPastDate

            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false

            const hasPark =
              isSpecialProgram &&
              (programType === "PARK_AND_FREESTYLE" ||
                dayRounds?.some((r) => isParkFreestyle(r, course)))
            const hasPrivate =
              isSpecialProgram &&
              (programType === "PRIVATE_COACHING"
                ? dayRounds?.some((r) => !isParkFreestyle(r, course)) || true
                : dayRounds?.some((r) => !isParkFreestyle(r, course)) &&
                  programType !== "PARK_AND_FREESTYLE")

            const getDayStyle = () => {
              if (isSpecialProgram) {
                if (isUnavailable) {
                  return isToday(day) ? "border border-gold text-gold" : "text-gray-400"
                }

                let colorClasses = ""
                if (hasPark && !hasPrivate) {
                  colorClasses = "bg-[#F6E6CF] text-gray-800 font-semibold shadow-xs"
                } else if (hasPrivate && !hasPark) {
                  colorClasses = "bg-[#7B8B6E] text-white font-semibold shadow-xs"
                } else {
                  colorClasses =
                    programType === "PARK_AND_FREESTYLE"
                      ? "bg-[#F6E6CF] text-gray-800 font-semibold shadow-xs"
                      : "bg-[#7B8B6E] text-white font-semibold shadow-xs"
                }

                if (isSelected) {
                  return `${colorClasses} ring-2 ring-offset-2 ring-[#38485F] font-bold shadow-md scale-105`
                }
                return `${colorClasses} hover:opacity-90`
              }

              if (isSelected) {
                return "bg-[#4F7354] text-white font-bold shadow-sm"
              }
              if (isUnavailable) {
                return "text-gray-400"
              }
              if (isToday(day)) {
                return "border border-gold text-gold"
              }
              return "text-gray-700 hover:bg-gray-100"
            }

            return (
              <button
                key={idx}
                disabled={isUnavailable}
                onClick={() => handleDateSelect(day)}
                className="flex flex-col items-center justify-center aspect-square transition-all"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center ${
                    isSpecialProgram ? "rounded-lg" : "rounded-full"
                  } text-[14px] transition-all ${getDayStyle()}`}
                >
                  <span className={isFullyBooked ? "line-through opacity-50" : ""}>
                    {format(day, "d")}
                  </span>
                </div>
                <div className="h-1.5 mt-1 flex items-center justify-center gap-1">
                  {isAvailable &&
                    !isFullyBooked &&
                    (isSpecialProgram ? (
                      <>
                        {hasPrivate && (
                          <span className="w-1.5 h-1.5 bg-[#7B8B6E] rounded-full"></span>
                        )}
                        {hasPark && <span className="w-1.5 h-1.5 bg-[#E2BA88] rounded-full"></span>}
                        {!hasPrivate && !hasPark && (
                          <span className="w-1.5 h-1.5 bg-[#7B8B6E] rounded-full"></span>
                        )}
                      </>
                    ) : (
                      <span className="w-1.5 h-1.5 bg-[#4F7354] rounded-full"></span>
                    ))}
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {isSpecialProgram && (
        <div className="w-full mt-4 flex flex-row justify-center gap-2.5 px-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#7B8B6E] shrink-0 shadow-sm" />
            <span className="text-white text-xs md:text-sm font-semibold tracking-wider uppercase">
              PRIVATE CLASS
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#F6E6CF] shrink-0 shadow-sm" />
            <span className="text-white text-xs md:text-sm font-semibold tracking-wider uppercase">
              PARK & FREESTYLE
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
