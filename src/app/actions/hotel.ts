"use server"

import { HotelsMaster, Course } from "@/types/model"
import { getCourses } from "./course"

export async function getHotels(): Promise<{ success: boolean; data: HotelsMaster[] }> {
  try {
    const coursesRes = await getCourses({ limit: 100 })
    if (coursesRes.success && coursesRes.data) {
      const courses: Course[] = Array.isArray(coursesRes.data.data)
        ? coursesRes.data.data
        : Array.isArray(coursesRes.data)
          ? coursesRes.data
          : []

      const hotelMap = new Map<string, HotelsMaster>()

      courses.forEach((course) => {
        const hList: HotelsMaster[] =
          course.hotels && course.hotels.length > 0
            ? course.hotels
            : (((course.course_hotels || course.course_hotel || []) as any[])
                .map((ch) => ch.hotel)
                .filter(Boolean) as HotelsMaster[])

        hList.forEach((h) => {
          if (h && (h.id || h.name)) {
            const key = h.id || h.name
            if (!hotelMap.has(key)) {
              hotelMap.set(key, h)
            }
          }
        })
      })

      return { success: true, data: Array.from(hotelMap.values()) }
    }
  } catch (error) {
    console.error("Failed to load hotels:", error)
  }

  return { success: true, data: [] }
}

