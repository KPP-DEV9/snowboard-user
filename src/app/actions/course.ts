"use server"

import { Course } from "@/types/course"
import { api, PaginatedData } from "@/lib/api"

export interface GetCoursesParams {
  page?: number
  limit?: number
  instructorId?: string
  province?: string | string[]
  nationID?: string
  courseLevel?: string
  courseType?: string
  minPrice?: string | number
  maxPrice?: string | number
}

export async function getCourses(params: GetCoursesParams = {}) {
  const { page = 1, limit = 10, instructorId, ...filters } = params

  try {
    const res = await api.course.getAll<any>(page, limit, filters)

    console.log("res ==================> ", res)

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch courses",
      }
    }

    let paginatedData: PaginatedData<Course>

    if (Array.isArray(res.data)) {
      paginatedData = {
        data: res.data,
        total_items: (res as any).total_items ?? res.data.length,
        total_pages: (res as any).total_pages ?? 1,
        page: (res as any).page ?? page,
        limit: (res as any).limit ?? limit,
      }
    } else if (res.data && Array.isArray((res.data as any).data)) {
      paginatedData = res.data as PaginatedData<Course>
    } else {
      paginatedData = {
        data: [],
        total_items: 0,
        total_pages: 1,
        page: page,
        limit: limit,
      }
    }

    return { success: true, data: paginatedData }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch courses",
    }
  }
}

export async function getCourseById(id: string, total_user = 0) {
  try {
    const res = await api.course.getCourseById<Course>(id, total_user)

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

// export async function getUserClassesByUserID(id: string) {
//   try {
//     const res = await api.booking.getUserClassesByUserID<UserClasses>(id)
//     if (!res.success) {
//       return {
//         success: false,
//         error: res.message || "Failed to fetch user schedule",
//       }
//     }
//     return {
//       success: true,
//       data: res?.data,
//     }
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error.message || "Failed to fetch user schedule",
//     }
//   }
// }

// export async function getUserClassesSummary(id: string) {
//   try {
//     const res = await api.booking.getUserClassesSummary<SumaryCourse[]>(id)

//     if (!res.success) {
//       return {
//         success: false,
//         error: res.message || "Failed to fetch user schedule",
//       }
//     }
//     return {
//       success: true,
//       data: res?.data,
//     }
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error.message || "Failed to fetch user schedule",
//     }
//   }
// }

// export async function getUserClassesById(id: string) {
//   try {
//     const res = await api.booking.getById<UserClasses>(id)

//     if (!res.success) {
//       return {
//         success: false,
//         error: res.message || "Failed to fetch course phase",
//       }
//     }
//     return {
//       success: true,
//       data: res.data,
//     }
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error.message || "Failed to fetch course phase",
//     }
//   }
// }

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
