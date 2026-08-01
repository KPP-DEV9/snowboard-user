"use server"

import { api } from "@/lib/api"
import { Classes } from "@/types/course"

export async function getClassesByCourseId(courseId: string) {
  try {
    const res = await api.classes.getByCourseId<{ data: Classes[] }>(courseId)
    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch classes",
      }
    }
    return {
      success: true,
      data: res.data?.data || [],
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch classes",
    }
  }
}
