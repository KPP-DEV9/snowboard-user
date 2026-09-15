"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
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

export default function CalendarCourseRoundsFilter({ course }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const defaultDate = searchParams.get("date")

  const rounds = course?.rounds || []

  const roundStartDates = rounds
    .map((r) => new Date(r.start_date))
    .filter((d) => !isNaN(d.getTime()))

  const minRoundDate =
    roundStartDates.length > 0
      ? new Date(Math.min(...roundStartDates.map((d) => d.getTime())))
      : course?.start_date && !isNaN(new Date(course.start_date).getTime())
        ? new Date(course.start_date)
        : null

  const maxRoundDate =
    roundStartDates.length > 0
      ? new Date(Math.max(...roundStartDates.map((d) => d.getTime())))
      : minRoundDate

  const initialDate = defaultDate
    ? new Date(defaultDate)
    : minRoundDate || (course?.start_date ? new Date(course.start_date) : new Date())

  const [currentMonth, setCurrentMonth] = useState(initialDate)

  const isPrevDisabled = minRoundDate
    ? startOfMonth(currentMonth).getTime() <= startOfMonth(minRoundDate).getTime()
    : false

  const isNextDisabled = maxRoundDate
    ? startOfMonth(currentMonth).getTime() >= startOfMonth(maxRoundDate).getTime()
    : false

  const handleDateSelect = (date: Date) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("date", format(date, "yyyy-MM-dd"))
    router.push(`${pathname}?${params.toString()}`)
  }

  const nextMonth = () => {
    if (!isNextDisabled) {
      setCurrentMonth((prev) => addMonths(prev, 1))
    }
  }

  const prevMonth = () => {
    if (!isPrevDisabled) {
      setCurrentMonth((prev) => subMonths(prev, 1))
    }
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className="w-full">
      <MyCalendar
        currentMonth={currentMonth}
        selectedDate={defaultDate ? new Date(defaultDate) : null}
        handleDateSelect={handleDateSelect}
        nextMonth={nextMonth}
        prevMonth={prevMonth}
        calendarDays={calendarDays}
        rounds={rounds as any}
        prevDisabled={isPrevDisabled}
        nextDisabled={isNextDisabled}
      />
    </div>
  )
}
