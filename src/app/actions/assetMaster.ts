"use server"

import { api, PaginatedData } from "@/lib/api"

export interface AssetMaster {
  id: string
  name: string
  size: string
  price: number
  course_type: string
  status: string
  created_at: string
  updated_at: string
}

export async function getAssetMasters(courseType: string) {
  try {
    const res = await api.assetMasters.getAll<PaginatedData<AssetMaster>>(1, 10, courseType)

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch asset masters",
      }
    }

    return { success: true, data: res.data?.data || [] }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch asset masters",
    }
  }
}
