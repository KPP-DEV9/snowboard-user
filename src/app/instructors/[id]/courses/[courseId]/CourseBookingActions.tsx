"use client"

import { useState } from "react"
import Link from "next/link"
import { Toast } from "@/components/Ui/Toast/Toast"
import { Inv } from "@/utils/Inv"
import { PaymentMethodData } from "@/utils/PaymentMethodRender"

interface Props {
  courseId: string
  coursePrice: number
}

export default function CourseBookingActions({ courseId, coursePrice }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<
    "credit" | "cash" | "credit_card" | "bank_transfer" | "qr" | null
  >(null)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)

  return (
    <div className="mt-auto flex flex-col gap-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-col gap-3">
        <label className="text-[18px] flex items-center gap-2">
          ยอดชำระเงิน : <span className="text-gold font-bold">{Inv(coursePrice)} </span>{" "}
          <span className="text-muted text-xs">Inc.Vat</span>
        </label>
        <div className="grid grid-cols-1 gap-3">
          <p className="text-[12px] font">เลือกช่องทางการชำระ</p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {PaymentMethodData.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                  paymentMethod === method.id
                    ? "border-gold bg-gold/10 text-gold font-bold"
                    : "border-card-border/50 text-text-muted hover:border-gold/50"
                }`}
              >
                <p className="text-[12px]">{method.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Link
        href={paymentMethod ? `/payment/?course_id=${courseId}&method=${paymentMethod}` : "#"}
        onClick={(e) => {
          if (!paymentMethod) {
            e.preventDefault()
            setToast({ message: "กรุณาชำระเงินก่อนจองคอร์ส", type: "warning" })
          }
        }}
        className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
          paymentMethod
            ? "bg-gold hover:bg-gold-hover text-black shadow-gold/20"
            : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
        }`}
      >
        <span>ซื้อคอร์สเรียนนี้</span>
      </Link>
    </div>
  )
}
