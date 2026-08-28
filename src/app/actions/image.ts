"use server"

import { api } from "@/lib/api"

export interface UploadImageResponse {
  id?: string
  url: string
  key?: string
  folder?: string
  file_name?: string
  file_size?: number
  mime_type?: string
}

export type UploadImageActionResult =
  | { success: true; data: UploadImageResponse }
  | { success: false; error: string }

export async function uploadImageR2(formData: FormData): Promise<UploadImageActionResult> {
  try {
    const res = await api.images.uploadR2<UploadImageResponse>(formData)

    if (!res?.success || !res.data) {
      return {
        success: false,
        error: res?.message || "Failed to upload image",
      }
    }

    return {
      success: true,
      data: res.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to upload image",
    }
  }
}
