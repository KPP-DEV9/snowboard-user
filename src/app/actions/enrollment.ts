"use server"

import { api } from "@/lib/api"
import { CreateEnrollmentRequest, Enrollment } from "@/types/enrollment"
import { revalidatePath } from "next/cache"

export async function createEnrollment(
  course_id: string,
  remaining_slots: number = 1,
  payment_method: string,
) {
  try {
    const res = await api.enrollment.create<CreateEnrollmentRequest>(
      course_id,
      remaining_slots,
      payment_method.toUpperCase(),
    )

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
      error: error.message || "Failed to fetch enrollments",
    }
  }
}

export async function getEnrollmentByUserID(page: number = 1, limit: number = 10) {
  try {
    const res = await api.enrollment.getByUserID<Enrollment[]>()
    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch enrollments",
      }
    }

    const allEnrollments = res.data || []
    const sortedEnrollments = allEnrollments.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
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
      error: error.message || "Failed to fetch enrollments",
    }
  }
}

export async function getEnrollmentByUserIDCountStatus(userId: string, status: string) {
  try {
    const res = await api.enrollment.getByUserIDCountStatus<number>(userId, status)
    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch enrollments",
      }
    }
    return {
      success: true,
      data: res.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch enrollments",
    }
  }
}
