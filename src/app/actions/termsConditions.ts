"use server"

import { api } from "@/lib/api"
import { getUser } from "./auth"
import { CreateTermsConditionsRequest, TermsConditions } from "@/types/termsConditions"

export async function createTermsConditions(items: CreateTermsConditionsRequest[]) {
  try {
    const user = await getUser()
    const userId = user?.id

    const promises = items.map((item) =>
      api.terms_conditions.create<TermsConditions>({
        user_id: item.user_id || userId,
        terms_conditions_master_id: item.terms_conditions_master_id,
        accept: item.accept,
        enrollment_id: item.enrollment_id,
      }),
    )

    const results = await Promise.all(promises)
    const failed = results.find((res) => !res.success)
    if (failed) {
      return {
        success: false,
        error: failed.message || "Failed to save terms & conditions",
      }
    }

    return {
      success: true,
      data: results.map((r) => r.data),
    }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save terms & conditions",
    }
  }
}
