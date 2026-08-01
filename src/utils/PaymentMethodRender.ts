export const PaymentMethodRender = (paymentMethod: string): string => {
  switch (paymentMethod.toUpperCase()) {
    case "CASH":
      return "เงินสด"
    case "QR":
      return "คิวอาร์โค้ด"
    case "CREDIT_CARD":
      return "บัตรเครดิต"
    case "BANK_TRANSFER":
      return "โอนเงิน"
    default:
      return ""
  }
}

export const PaymentMethodData = [
  { id: "CASH", label: "เงินสด" },
  { id: "QR", label: "คิวอาร์โค้ด" },
  { id: "CREDIT_CARD", label: "บัตรเครดิต" },
  { id: "BANK_TRANSFER", label: "โอนเงิน" },
]
