"use server"

import { api, PaginatedData } from "@/lib/api"

export interface OptionMaster {
  id: string
  category: string
  name: string
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getOptionMasters() {
  try {
    const res = await api.optionMasters.getAll<PaginatedData<OptionMaster>>(1, 100)

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch option masters",
      }
    }

    return { success: true, data: res.data?.data || [] }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch option masters",
    }
  }
}
