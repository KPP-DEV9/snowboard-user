"use client"

import { useState } from "react"
import { createEnrollment } from "@/app/actions/enrollment"
import { useRouter } from "next/navigation"
import { Toast } from "@/components/Ui/Toast/Toast"
import { Spinner } from "@/components/Ui/Loading/Spinner"

interface PaymentButtonProps {
  courseId: string
  method: string
}

export function PaymentButton({ courseId, method }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)
  const router = useRouter()

  const handleCreateEnrollment = async () => {
    try {
      setLoading(true)
      const { success, error } = await createEnrollment({
        course_id: courseId,
        round_id: "",
        adult_count: 1,
        child_count: 0,
        total_amount: 0,
      })
      if (!success) {
        console.error(error)
        setToast({ message: error || "การชำระเงินล้มเหลว", type: "error" })
      } else {
        setToast({ message: "การชำระเงินสำเร็จ! กำลังพาท่านไปยังหน้าหลัก...", type: "success" })
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <button
        onClick={handleCreateEnrollment}
        disabled={loading}
        className={`w-full bg-gold hover:bg-gold-hover text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold/20 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" color="border-black" />
            <span>กำลังดำเนินการ...</span>
          </div>
        ) : (
          <span>ยืนยันการชำระเงิน</span>
        )}
      </button>
    </>
  )
}
