import { EnrollmentStatus } from "@/types/enrollment"
import { PaymentTransactionsStatus } from "@/types/payment"

export const getTransactionStatusBadge = (
  status?: PaymentTransactionsStatus,
  name?: string,
  enrollmentStatus?: EnrollmentStatus,
) => {
  const isDeposit =
    name?.toLowerCase().includes("มัดจำ") ||
    name?.toLowerCase().includes("deposit") ||
    enrollmentStatus === "deposit_paid"

  switch (status) {
    case PaymentTransactionsStatus.Verified:
    case PaymentTransactionsStatus.GatewaySuccess:
      return {
        label: isDeposit ? "มัดจำแล้ว" : "ชำระสำเร็จ",
        className: "bg-[#DCFCE7] text-[#16A34A]",
      }
    case PaymentTransactionsStatus.PendingReview:
      return {
        label: "รอตรวจสอบ",
        className: "bg-[#FEF3C7] text-[#D97706]",
      }
    case PaymentTransactionsStatus.GatewayPending:
      return {
        label: "รอชำระ",
        className: "bg-[#FEF3C7] text-[#D97706]",
      }
    case PaymentTransactionsStatus.InvalidSlip:
      return {
        label: "สลิปไม่ถูกต้อง",
        className: "bg-[#FEE2E2] text-[#EF4444]",
      }
    case PaymentTransactionsStatus.WrongAmount:
      return {
        label: "ยอดเงินไม่ตรง",
        className: "bg-[#FEE2E2] text-[#EF4444]",
      }
    case PaymentTransactionsStatus.Rejected:
      return {
        label: "ปฏิเสธ",
        className: "bg-[#FEE2E2] text-[#EF4444]",
      }
    case PaymentTransactionsStatus.Refunded:
      return {
        label: "คืนเงินแล้ว",
        className: "bg-gray-100 text-gray-600",
      }
    case PaymentTransactionsStatus.GatewayFailed:
      return {
        label: "ไม่สำเร็จ",
        className: "bg-[#FEE2E2] text-[#EF4444]",
      }
    case PaymentTransactionsStatus.GatewayTimeout:
      return {
        label: "หมดเวลา",
        className: "bg-[#FEE2E2] text-[#EF4444]",
      }
    default:
      return {
        label: "รอชำระ",
        className: "bg-[#FEF3C7] text-[#D97706]",
      }
  }
}

export const getEnrollmentStatusLabel = (status?: EnrollmentStatus): string => {
  switch (status) {
    case "pending_payment":
      return "รอชำระ"
    case "deposit_paid":
      return "มัดจำแล้ว"
    case "paid":
      return "ชำระแล้ว"
    case "cancelled":
      return "ยกเลิก"
    default:
      return status || ""
  }
}
