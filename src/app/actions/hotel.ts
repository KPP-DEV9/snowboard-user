"use server"

import { HotelsMaster, Course, PaginatedHotelsMaster } from "@/types/model"
import { api } from "@/lib/api"
import { getCourses } from "./course"

function getCourseHotels(course: Course): HotelsMaster[] {
  if (course.hotels && course.hotels.length > 0) {
    return course.hotels
  }

  return [...(course.course_hotels || []), ...(course.course_hotel || [])]
    .map((courseHotel) => courseHotel.hotel)
    .filter((hotel): hotel is HotelsMaster => Boolean(hotel))
}

export async function getHotels(): Promise<
  | { success: true; data: HotelsMaster[] }
  | { success: false; data: []; error: string }
> {
  try {
    const res = await api.hotels.getAll<PaginatedHotelsMaster>()
    if (!res.success) {
      return {
        success: false,
        data: [],
        error: res.message || "Failed to fetch hotels",
      }
    }

    if (!Array.isArray(res.data?.data)) {
      return { success: false, data: [], error: "Invalid hotels response" }
    }

    return { success: true, data: res.data.data }
  } catch (error) {
    console.error("Failed to load hotels:", error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch hotels",
    }
  }
}

export async function getHotelById(id: string): Promise<{
  success: boolean
  data?: HotelsMaster | null
  relatedCourses?: Course[]
  error?: string
}> {
  try {
    const hotelsRes = await getHotels()
    if (!hotelsRes.success) {
      return { success: false, data: null, relatedCourses: [], error: hotelsRes.error }
    }

    const targetId = decodeURIComponent(id).trim()
    const foundHotel = hotelsRes.data.find(
      (hotel) =>
        hotel.id === id ||
        hotel.id === targetId ||
        hotel.name.toLowerCase() === targetId.toLowerCase(),
    )

    if (!foundHotel) {
      return { success: false, data: null, relatedCourses: [] }
    }

    const coursesRes = await getCourses({ limit: 100 })
    if (!coursesRes.success || !coursesRes.data) {
      console.error("Failed to load courses related to hotel:", coursesRes.error)
      return { success: true, data: foundHotel, relatedCourses: [] }
    }

    const courses: Course[] = Array.isArray(coursesRes.data.data)
      ? coursesRes.data.data
      : Array.isArray(coursesRes.data)
        ? coursesRes.data
        : []
    const relatedCourses = courses.filter((course) =>
      getCourseHotels(course).some(
        (hotel) =>
          hotel.id === foundHotel.id ||
          hotel.name.toLowerCase() === foundHotel.name.toLowerCase(),
      ),
    )

    return { success: true, data: foundHotel, relatedCourses }
  } catch (error) {
    console.error("Failed to load hotel by id:", error)
    return {
      success: false,
      data: null,
      relatedCourses: [],
      error: error instanceof Error ? error.message : "Failed to fetch hotel",
    }
  }
}
