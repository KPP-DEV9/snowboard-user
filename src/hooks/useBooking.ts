import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";

export function useBooking() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(
    "09:00 - 10:00",
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const timeslots = [
    { time: "09:00 - 10:00", status: "available" },
    { time: "10:00 - 11:00", status: "available" },
    { time: "11:00 - 12:00", status: "unavailable" },
    { time: "13:00 - 14:00", status: "available" },
  ];

  return {
    currentMonth,
    selectedDate,
    selectedTime,
    setSelectedTime,
    handleDateSelect,
    nextMonth,
    prevMonth,
    calendarDays,
    timeslots,
  };
}
