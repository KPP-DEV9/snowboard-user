"use server"

import { api } from "@/lib/api"

export async function getRoundByClassesID(id: string, date: string) {
  try {
    const start_date = date
    const res = await api.rounds.getRoundByClassesID<any>(id, start_date)
    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch rounds",
      }
    }

    return {
      success: true,
      data: res.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch rounds",
    }
  }
}
