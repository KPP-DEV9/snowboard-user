import { format, addHours } from "date-fns"
import { th } from "date-fns/locale"

/**
 * ฟังก์ชันสำหรับแสดงวันเวลา
 * - SSR (Server-Side Rendering): บวก 7 ชั่วโมง
 * - CSR (Client-Side Rendering): ไม่บวก แสดงได้เลย
 */
export function RenderDate(
  date: Date | string | number | undefined | null,
  formatStr: string = "HH:mm",
) {
  if (!date) return "-"

  let d = new Date(date)
  if (isNaN(d.getTime())) {
    if (typeof date === "string" && date.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
      if (formatStr === "HH:mm") {
        return date.substring(0, 5)
      }
      return date
    }
    return "-"
  }

  if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
    // Server-side (production only)
    d = addHours(d, 7)
  }

  return format(d, formatStr, { locale: th })
}

export function DateTime(date: Date | string | number | undefined | null) {
  if (date) {
    const dateTime = new Date(date || "").toLocaleDateString("th-TH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Bangkok",
    })
    return dateTime
  } else {
    return null
  }
}
