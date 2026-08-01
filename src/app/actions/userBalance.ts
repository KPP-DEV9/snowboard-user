import { api } from "@/lib/api"
import { UserBalance } from "@/types/userBalance"

export async function getUserBalance() {
  const res = await api.userBalances.getMyBalances<UserBalance[]>()
  if (!res.success) {
    return {
      success: false,
      error: res.message || "Failed to fetch user balances",
    }
  }
  return { success: true, data: res.data }
}
