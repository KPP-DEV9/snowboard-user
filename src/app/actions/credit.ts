import { api, PaginatedData } from "@/lib/api"
import { Credit, CreditPackage } from "@/types/credit"

export async function getCredit(userId: string) {
  if (userId) {
    const res = await api.credit.get<Credit>()
    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch credits",
      }
    }
    return { success: true, data: res.data }
  } else {
    return { success: false, error: "User ID is required" }
  }
}

export async function getAllCreditPackages(userId: string, page: number = 1, limit: number = 10) {
  if (userId) {
    const res = await api.creditPackages.getAll(page, limit)
    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch credit packages",
      }
    }

    return { success: true, data: res.data as unknown as PaginatedData<CreditPackage> }
  } else {
    return { success: false, error: "User ID is required" }
  }
}

export async function getCreditPackageById(id: string) {
  const res = await api.creditPackages.getById<CreditPackage>(id)
  if (!res.success) {
    return {
      success: false,
      error: res.message || "Failed to fetch credit package",
    }
  }
  return { success: true, data: res.data }
}

export async function PurchasePackage(user_id: string, package_id: string) {
  const res = await api.creditPackages.PurchasePackage({ user_id, package_id })
  if (!res.success) {
    return {
      success: false,
      error: res.message || "Failed to purchase credit package",
    }
  }
  return { success: true, data: res.data }
}
