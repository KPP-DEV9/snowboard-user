import { Enrollment } from "./enrollment"

export enum PaymentMethod {
  PromptPay = "PROMPTPAY",
  Hour = "HOUR",
  HourCard = "HOUR_CARD",
  TrueMoney = "TRUE_MONEY",
  MobileBanking = "MOBILE_BANKING",
}

export interface Payment {
  id: string
  enrollment_id: string
  enrollment?: Enrollment
  gateway: string
  payment_method: PaymentMethod
  gateway_ref_id: string
  amount: number
  currency: string
  status: string
  raw_response?: string | null
  paid_at?: string | Date | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at?: string | Date | null
}
