"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  format,
} from "date-fns"
import MyCalendar from "@/components/Ui/Calendar"
import { Course } from "@/types/course"

interface Props {
  course: Course
}

export default function CourseRoundsFilter({ course }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultDate = searchParams.get("date")

  const [currentMonth, setCurrentMonth] = useState(
    defaultDate ? new Date(defaultDate) : new Date(course.start_date || new Date()),
  )

  const handleDateSelect = (date: Date) => {
    router.push(`?date=${format(date, "yyyy-MM-dd")}`)
  }

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const validStartDate = course.start_date || new Date().toISOString()

  const rounds = course?.rounds

  return (
    <div className="mb-6 w-full">
      <MyCalendar
        currentMonth={currentMonth}
        selectedDate={defaultDate ? new Date(defaultDate) : null}
        handleDateSelect={handleDateSelect}
        nextMonth={nextMonth}
        prevMonth={prevMonth}
        calendarDays={calendarDays}
        rounds={rounds as any}
      />
    </div>
  )
}
