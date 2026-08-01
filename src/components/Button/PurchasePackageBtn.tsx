"use client"

import { useState } from "react"
import { createEnrollment } from "@/app/actions/enrollment"
import { useRouter } from "next/navigation"
import { Toast } from "@/components/Ui/Toast/Toast"
import { Spinner } from "@/components/Ui/Loading/Spinner"
import { PurchasePackage } from "@/app/actions/credit"

interface PurchasePackageProps {
  package_id: string
  user_id: string
}

export function PurchasePackageBtn({ user_id, package_id }: PurchasePackageProps) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)

  const handleCreateEnrollment = async () => {
    try {
      setLoading(true)
      const { success, error } = await PurchasePackage(user_id, package_id)
      if (!success) {
        console.error(error)
        setToast({ message: error || "การชำระเงินล้มเหลว", type: "error" })
      } else {
        setToast({ message: "การชำระเงินสำเร็จ! กำลังพาท่านไปยังหน้าหลัก...", type: "success" })
        setTimeout(() => {
          router.push(`/credit-package/${package_id}`)
        }, 1000)
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
          <span>Purchase Package</span>
        )}
      </button>
    </>
  )
}
