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
            : ((((course as any).course_hotels || (course as any).course_hotel || []) as any[])
                .map((ch: any) => ch.hotel)
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

export async function getHotelById(id: string): Promise<{
  success: boolean
  data?: HotelsMaster | null
  relatedCourses?: Course[]
}> {
  try {
    const coursesRes = await getCourses({ limit: 100 })
    if (coursesRes.success && coursesRes.data) {
      const courses: Course[] = Array.isArray(coursesRes.data.data)
        ? coursesRes.data.data
        : Array.isArray(coursesRes.data)
          ? coursesRes.data
          : []

      let foundHotel: HotelsMaster | null = null
      const relatedCourses: Course[] = []
      const targetId = decodeURIComponent(id).trim()

      courses.forEach((course) => {
        const hList: HotelsMaster[] =
          course.hotels && course.hotels.length > 0
            ? course.hotels
            : ((((course as any).course_hotels || (course as any).course_hotel || []) as any[])
                .map((ch: any) => ch.hotel)
                .filter(Boolean) as HotelsMaster[])

        hList.forEach((h) => {
          if (
            h &&
            (h.id === id ||
              h.id === targetId ||
              h.name === targetId ||
              h.name.toLowerCase() === targetId.toLowerCase())
          ) {
            if (!foundHotel) {
              foundHotel = h
            }
            if (!relatedCourses.some((c) => c.id === course.id)) {
              relatedCourses.push(course)
            }
          }
        })
      })

      return {
        success: Boolean(foundHotel),
        data: foundHotel,
        relatedCourses,
      }
    }
  } catch (error) {
    console.error("Failed to load hotel by id:", error)
  }

  return { success: false, data: null, relatedCourses: [] }
}
