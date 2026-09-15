import { Enrollment, EnrollmentStatus } from "./enrollment"

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

export interface PaymentTransactions {
  admin_id: string
  amount: string
  created_at: string
  currency: string
  enrollment_id: string
  enrollment_status: EnrollmentStatus
  id: string
  name: string
  payment_method: PaymentMethod
  raw_response: string
  ref_id: string
  remark: string
  slip_url: string
  status: PaymentTransactionsStatus
  updated_at: string
}

export enum PaymentTransactionsStatus {
  PendingReview = "pending_review", // กำลังรอการตรวจสอบ
  InvalidSlip = "invalid_slip", // สลิปหลักฐานการโอนเงินไม่ถูกต้อง หรือใช้งานไม่ได้
  WrongAmount = "wrong_amount", // ยอดเงินโอนไม่ตรงกับยอดที่ต้องชำระ
  Rejected = "rejected", // ปฏิเสธการชำระเงิน (ทั่วไป)
  Refunded = "refunded", // คืนเงินแล้ว
  Verified = "verified", // ตรวจสอบแล้ว
  GatewayPending = "gateway_pending", // กำลังรอทำรายการผ่าน Gateway / รอ Callback
  GatewaySuccess = "gateway_success", // ชำระเงินผ่าน Gateway สำเร็จ
  GatewayFailed = "gateway_failed", // ชำระเงินผ่าน Gateway ไม่สำเร็จ / ถูกปฏิเสธ
  GatewayTimeout = "gateway_timeout", // หมดเวลาทำรายการ / เกินกำหนดเวลา (Timeout)
}
