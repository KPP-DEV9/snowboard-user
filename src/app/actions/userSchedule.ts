"use server"

import { api } from "@/lib/api"
import { UserSchedule } from "@/types/userSchedule"

export async function getUserScheduleByUserId(id: string) {
  try {
    const res = await api.user_schedule.getByUserID<UserSchedule>(id)
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
