"use server"

import { api } from "@/lib/api"

export interface ProgramTypeCategory {
  id: string | number
  name: string
}

function isProgramTypeCategory(value: unknown): value is ProgramTypeCategory {
  if (typeof value !== "object" || value === null) return false

  const category = value as Record<string, unknown>
  const hasId =
    (typeof category.id === "string" && category.id.length > 0) ||
    (typeof category.id === "number" && Number.isFinite(category.id))

  return hasId && typeof category.name === "string"
}

export async function getProgramTypeCategories() {
  try {
    const res = await api.programTypeCategory.getAll<unknown>()

    if (!res.success) {
      return {
        success: false as const,
        error: res.message || "Failed to fetch program type categories",
      }
    }

    const data =
      Array.isArray(res.data)
        ? res.data
        : typeof res.data === "object" &&
            res.data !== null &&
            "data" in res.data &&
            Array.isArray(res.data.data)
          ? res.data.data
          : null

    if (!data || !data.every(isProgramTypeCategory)) {
      return {
        success: false as const,
        error: "Invalid program type category response",
      }
    }

    return { success: true as const, data }
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch program type categories",
    }
  }
}
