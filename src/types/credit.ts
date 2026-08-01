export type Credit = {
  id: string
  user_id: string
  balance: number
  used: number
  total_earned: number
  is_active: boolean
  last_updated: string
}

export type TagLabel = "POPULAR" | "NEW" | "SALE" | "NONE"

export interface CreditPackage {
  id: string
  name: string
  price: string
  credit_amount: string
  tag: TagLabel
  features: string[]
  created_at: string
  updated_at: string
}
