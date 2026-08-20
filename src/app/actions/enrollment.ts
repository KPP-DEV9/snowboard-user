"use server"

import { api } from "@/lib/api"
import { CreateEnrollmentRequest, Enrollment } from "@/types/enrollment"
import { revalidatePath } from "next/cache"

export async function createEnrollment(data: CreateEnrollmentRequest) {
  try {
    const res = await api.enrollment.create<Enrollment>(data)

    if (!res?.success) {
      return {
        success: false,
        error: res.message || "Failed to create enrollment",
      }
    }
    revalidatePath("/", "layout")
    return {
      success: true,
      data: res.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create enrollment",
    }
  }
}

export async function updateEnrollment(
  id: string,
  data: Partial<CreateEnrollmentRequest> & {
    status?: string
    deposit_amount?: number
    total_amount?: number
  },
) {
  try {
    const res = await api.enrollment.update<Enrollment>(id, data)

    if (!res?.success) {
      return {
        success: false,
        error: res.message || "Failed to update enrollment",
      }
    }
    revalidatePath("/", "layout")
    revalidatePath("/mytrip", "page")
    return {
      success: true,
      data: res.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update enrollment",
    }
  }
}

export async function getEnrollmentByUserID(page: number = 1, limit: number = 10) {
  try {
    const res = await api.enrollment.getByUserID<Enrollment[]>()

    if (!res.success || !res.data) {
      return {
        success: false,
        data: {
          data: [],
          total_pages: 1,
        },
        error: res.message || "Failed to fetch enrollments",
      }
    }

    const allEnrollments = Array.isArray(res.data) ? res.data : []
    const sortedEnrollments = allEnrollments.sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(),
    )
    const totalPages = Math.ceil(sortedEnrollments.length / limit) || 1
    const paginatedEnrollments = sortedEnrollments.slice((page - 1) * limit, page * limit)

    return {
      success: true,
      data: {
        data: paginatedEnrollments,
        total_pages: totalPages,
      },
    }
  } catch (error: any) {
    return {
      success: false,
      data: {
        data: [],
        total_pages: 1,
      },
      error: error.message || "Failed to fetch enrollments",
    }
  }
}

export async function getEnrollmentById(id: string) {
  try {
    const res = await api.enrollment.getById<Enrollment>(id)
    if (!res.success || !res.data) {
      return {
        success: false,
        error: res.message || "Failed to fetch enrollment",
      }
    }
    return {
      success: true,
      data: res.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch enrollment",
    }
  }
}

export async function getEnrollmentByIdForBooking(enrollmentId: string) {
  try {
    const res = await api.enrollment.getByIdForBooking<Enrollment>(enrollmentId)
    if (!res.success || !res.data) {
      return {
        success: false,
        error: res.message || "Failed to fetch enrollment",
      }
    }
    return {
      success: true,
      data: res.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch enrollment",
    }
  }
}
