"use client"

import { useEffect, useState } from "react"
import { useWebSocketContext } from "@/contexts/WebSocketContext"
import { useRouter } from "next/navigation"

interface PaymentWatcherProps {
  packageName: string
  creditAmount: string
}

export default function PaymentWatcher({ packageName, creditAmount }: PaymentWatcherProps) {
  const { onMessage, isConnected } = useWebSocketContext()
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    onMessage((data) => {
      if (data?.topic === "PAYMENT_SUCCESS") {
        setPaymentSuccess(true)
      }
    })
  }, [onMessage])

  // Auto-redirect after showing success for 3 seconds
  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        router.push("/dashboard")
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [paymentSuccess, router])

  if (!paymentSuccess) {
    return (
      <div className="flex items-center justify-center gap-2 mt-4">
        <div
          className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]"} animate-pulse`}
        />
        <span className="text-[12px] text-text-muted">
          {isConnected ? "รอการชำระเงิน..." : "กำลังเชื่อมต่อ..."}
        </span>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Success Card */}
      <div className="relative z-10 w-[85%] max-w-[360px] bg-card rounded-3xl p-8 flex flex-col items-center shadow-2xl shadow-gold/20 border border-gold/30 animate-scale-up">
        {/* Glow ring */}
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-3xl bg-gradient-to-br from-gold/20 via-transparent to-emerald-400/20 blur-sm -z-10" />

        {/* Checkmark Circle */}
        <div className="relative w-20 h-20 mb-6">
          {/* Outer ring animation */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping" />
          {/* Inner circle */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <svg
              className="w-10 h-10 text-white animate-check-draw"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" className="check-path" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[20px] font-bold text-foreground mb-1">ชำระเงินสำเร็จ!</h2>
        <p className="text-[13px] text-text-muted mb-6">การชำระเงินของคุณเสร็จสมบูรณ์</p>

        {/* Details */}
        <div className="w-full bg-background/50 rounded-xl p-4 mb-6 space-y-3 border border-card-border/30">
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-text-muted">แพ็กเกจ</span>
            <span className="text-[13px] font-semibold text-foreground truncate max-w-[180px]">
              {packageName}
            </span>
          </div>
          <div className="h-px bg-card-border/30" />
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-text-muted">เครดิตที่ได้รับ</span>
            <span className="text-[13px] font-bold text-gold">{creditAmount} เครดิต</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-1 rounded-full bg-text-muted animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-1 h-1 rounded-full bg-text-muted animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-1 h-1 rounded-full bg-text-muted animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
          <span className="text-[11px] text-text-muted ml-1">กำลังเปลี่ยนหน้า...</span>
        </div>
      </div>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes check-draw {
          from {
            stroke-dashoffset: 30;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-scale-up {
          animation: scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-check-draw {
          stroke-dasharray: 30;
          animation: check-draw 0.6s ease-out 0.3s forwards;
          stroke-dashoffset: 30;
        }
      `}</style>
    </div>
  )
}
