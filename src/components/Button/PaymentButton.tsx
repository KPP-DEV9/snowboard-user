"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Toast } from "@/components/Ui/Toast/Toast"
import { X, ChevronRight, Smartphone, Building2 } from "lucide-react"

interface PaymentButtonProps {
  courseId: string
  method: string
}

interface BankOption {
  id: string
  name: string
  appName: string
  scheme: string
  color: string
  textColor: string
  logoText: string
  badgeBg: string
}

const BANKS: BankOption[] = [
  {
    id: "kbank",
    name: "ธนาคารกสิกรไทย",
    appName: "K PLUS",
    scheme: "kplus://",
    color: "#138F2D",
    textColor: "#FFFFFF",
    logoText: "K+",
    badgeBg: "bg-[#138F2D]",
  },
  {
    id: "scb",
    name: "ธนาคารไทยพาณิชย์",
    appName: "SCB EASY",
    scheme: "scbeasy://",
    color: "#4E2E7F",
    textColor: "#FFFFFF",
    logoText: "SCB",
    badgeBg: "bg-[#4E2E7F]",
  },
  {
    id: "ktb",
    name: "ธนาคารกรุงไทย",
    appName: "Krungthai NEXT",
    scheme: "ktbnext://",
    color: "#00A4E4",
    textColor: "#FFFFFF",
    logoText: "NEXT",
    badgeBg: "bg-[#00A4E4]",
  },
  {
    id: "ttb",
    name: "ธนาคารทหารไทยธนชาต",
    appName: "ttb touch",
    scheme: "ttbtouch://",
    color: "#002D63",
    textColor: "#FFFFFF",
    logoText: "ttb",
    badgeBg: "bg-[#002D63]",
  },
  {
    id: "bay",
    name: "ธนาคารกรุงศรีอยุธยา",
    appName: "KMA Krungsri",
    scheme: "kma://",
    color: "#FDB913",
    textColor: "#2B2B2B",
    logoText: "KMA",
    badgeBg: "bg-[#FDB913]",
  },
  {
    id: "bbl",
    name: "ธนาคารกรุงเทพ",
    appName: "Bualuang mBanking",
    scheme: "bualuangmbanking://",
    color: "#1E3A8A",
    textColor: "#FFFFFF",
    logoText: "BBL",
    badgeBg: "bg-[#1E3A8A]",
  },
]

export function PaymentButton({ courseId, method }: PaymentButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)
  const router = useRouter()

  const handleOpenBankApp = (bank: BankOption) => {
    // Open deep link URL scheme
    window.location.href = bank.scheme

    setToast({
      message: `กำลังเปิด ${bank.appName}...`,
      type: "success",
    })
  }

  const handleFinishPayment = () => {
    setIsModalOpen(false)
    setToast({
      message: "กำลังพาท่านไปยังหน้ารายการทริป...",
      type: "success",
    })
    setTimeout(() => {
      router.push("/mytrip")
    }, 1200)
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-[#F04E23] hover:bg-[#D4411C] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-black/10 cursor-pointer text-base"
      >
        <span>ยืนยันการชำระเงิน</span>
      </button>

      {/* Bank App Selector Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden relative text-black">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FFF4E5] text-[#F04E23] flex items-center justify-center">
                  <Smartphone size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-[17px] text-gray-900 leading-tight">
                    เลือกแอปธนาคาร
                  </h3>
                  <p className="text-[12px] text-gray-400">แตะเพื่อเปิดแอป Mobile Banking</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Bank List */}
            <div className="p-5 space-y-2.5 max-h-[380px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {BANKS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleOpenBankApp(bank)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50/80 transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-[13px] shadow-sm tracking-tight ${bank.badgeBg}`}
                      style={{ color: bank.textColor }}
                    >
                      {bank.logoText}
                    </div>
                    <div>
                      <div className="font-bold text-[15px] text-gray-900 group-hover:text-[#F04E23] transition-colors">
                        {bank.appName}
                      </div>
                      <div className="text-[12px] text-gray-400">{bank.name}</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center text-gray-400 group-hover:text-[#F04E23] transition-colors border border-gray-100">
                    <ChevronRight size={16} />
                  </div>
                </button>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-5 pt-3 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2">
              <button
                onClick={handleFinishPayment}
                className="w-full bg-[#304B65] hover:bg-[#22364a] text-white py-3 rounded-xl font-bold text-sm transition-colors text-center shadow-sm cursor-pointer"
              >
                ชำระเงิน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
