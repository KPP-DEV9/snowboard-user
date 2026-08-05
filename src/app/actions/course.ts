"use server"

import { Course, SumaryCourse, UserClasses, UserClassesSummary } from "@/types/course"
import { api, PaginatedData } from "@/lib/api"

export async function getCourses(page = 1, limit = 10, instructorId?: string) {
  try {
    const res = await api.course.getAll<PaginatedData<Course>>(page, limit, instructorId)

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch courses",
      }
    }

    return { success: true, data: res.data as PaginatedData<Course> }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch courses",
    }
  }
}

export async function getCourseById(id: string) {
  try {
    const res = await api.course.getCourseById<Course>(id)

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch course",
      }
    }

    return { success: true, data: res.data as Course }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch course",
    }
  }
}

// export async function getCourseByInstructorId(id: string) {
//   try {
//     const res = await api.course.getCourseByInstructorId<Course>(id)

//     if (!res.success) {
//       return {
//         success: false,
//         error: res.message || "Failed to fetch course",
//       }
//     }

//     return { success: true, data: res.data }
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error.message || "Failed to fetch course",
//     }
//   }
// }

export async function getUserClassesByUserID(id: string) {
  try {
    const res = await api.booking.getUserClassesByUserID<UserClasses>(id)
    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch user schedule",
      }
    }
    return {
      success: true,
      data: res?.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch user schedule",
    }
  }
}

export async function getUserClassesSummary(id: string) {
  try {
    const res = await api.booking.getUserClassesSummary<SumaryCourse[]>(id)

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch user schedule",
      }
    }
    return {
      success: true,
      data: res?.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch user schedule",
    }
  }
}

export async function getUserClassesById(id: string) {
  try {
    const res = await api.booking.getById<UserClasses>(id)

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch course phase",
      }
    }
    return {
      success: true,
      data: res.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch course phase",
    }
  }
}

export async function updateUserClassesBooking(booking_id: string, round_id: string) {
  try {
    const res = await api.booking.updateUserClassesBooking<any>(booking_id, {
      round_id: round_id,
      status: "CUS_CONFIRM",
    })
    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to update booking",
      }
    }

    return {
      success: true,
      data: res.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update booking",
    }
  }
}

// export async function getUserClassesPast(id: string) {
//   try {
//     const res = await api.booking.getUserClassesPast<UserClasses>(id)

//     if (!res.success) {
//       return {
//         success: false,
//         error: res.message || "Failed to fetch user course phase",
//       }
//     }
//     return {
//       success: true,
//       data: res.data,
//     }
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error.message || "Failed to fetch user course phase",
//     }
//   }
// }
