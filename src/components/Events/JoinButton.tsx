"use client"

import { useState } from "react"
import { joinEvent } from "@/app/actions/event"

interface Props {
  userId: string
  eventId: string
  fee: number
}

export default function JoinButton({ userId, eventId, fee }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleJoin = async () => {
    setLoading(true)
    setError(null)
    const res = await joinEvent(userId, eventId)
    setLoading(false)
    if (res.success) {
      setSuccess(true)
    } else {
      setError(res.error || "คุณได้เข้าร่วมกิจกรรมนี้ไปแล้ว หรือเกิดข้อผิดพลาด")
    }
  }

  if (success) {
    return (
      <div className="w-full bg-line-green/10 text-line-green text-center py-4 rounded-xl font-bold border border-line-green/30">
        ✅ ลงทะเบียนเข้าร่วมเรียบร้อยแล้ว
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="text-red-500 text-[12px] text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full bg-gold hover:opacity-90 disabled:opacity-50 text-[#0F172A] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
      >
        {loading ? "กำลังดำเนินการ..." : fee > 0 ? `สมัครเข้าร่วมกิจกรรม` : "เข้าร่วมฟรี"}
      </button>
    </div>
  )
}
