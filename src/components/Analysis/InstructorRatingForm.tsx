"use client"

import { useState, useEffect } from "react"
import { Star, MessageSquare, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/Ui/Button/Button"
import { Card } from "@/components/Ui/Card/Card"
import { api } from "@/lib/api"
import { Toast } from "@/components/Ui/Toast/Toast"
import { Rating } from "@/types/rating"

interface InstructorRatingFormProps {
  instructorName?: string
  bookingId?: string
  instructorId?: string
  userId?: string
}

export function InstructorRatingForm({
  instructorName = "ผู้ฝึกสอน",
  bookingId,
  instructorId,
  userId,
}: InstructorRatingFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)

  useEffect(() => {
    const fetchExistingFeedback = async () => {
      if (!instructorId || !userId || !bookingId) {
        setIsLoading(false)
        return
      }
      try {
        const response = await api.ratings.checkExisting<Rating>(instructorId, userId, bookingId)
        if (response.success && response.data?.id) {
          const feedback = response.data
          setRating(feedback.score)
          setComment(feedback.comment || "")
          setIsReadOnly(true)
          setIsSubmitted(true)
        }
      } catch (error) {
        console.error("Failed to fetch existing rating", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchExistingFeedback()
  }, [instructorId, userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || isReadOnly) return

    setIsSubmitting(true)

    if (instructorId && userId) {
      const payload = {
        instructor_id: instructorId,
        user_id: userId,
        booking_id: bookingId,
        score: rating,
        comment: comment || null,
      }

      const res = await api.ratings.create(payload)
      if (res.success) {
        setToast({ message: "ส่งผลการประเมินเรียบร้อยแล้ว", type: "success" })
        setIsSubmitted(true)
        setIsReadOnly(true)
      } else {
        // console.log("Failed to submit rating:", res.message)
        setToast({ message: "เกิดข้อผิดพลาดในการส่งผลประเมิน กรุณาลองใหม่อีกครั้ง", type: "error" })
      }
    }

    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <Card className="bg-[#1a1d24] rounded-2xl border border-gray-800 p-8 flex justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
      </Card>
    )
  }

  if (isSubmitted && isReadOnly) {
    return (
      <Card className="bg-[#1a1d24] rounded-2xl border border-emerald-500/20 p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shrink-0">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
              ให้คะแนน {instructorName} แล้ว
            </h3>
            <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${rating >= star ? "fill-gold text-gold" : "text-gray-700"}`}
                />
              ))}
            </div>
            {comment && (
              <p className="text-sm text-gray-300 italic bg-[#0f1115] p-3 rounded-lg border border-gray-800">
                "{comment}"
              </p>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Card className="bg-[#1a1d24] rounded-2xl border border-gray-800 p-6 md:p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors duration-700"></div>

        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Star className="w-5 h-5 text-gold" />
            </div>
            ประเมินการสอนของ {instructorName}
          </h3>
          <p className="text-sm text-gray-400 mb-6 ml-[44px]">
            กรุณาให้คะแนนและข้อเสนอแนะเกี่ยวกับการวิเคราะห์วงสวิงครั้งนี้
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Star Rating */}
            <div className="flex flex-col items-center sm:items-start gap-3 bg-[#0f1115]/50 p-6 rounded-xl border border-gray-800/50">
              <label className="text-sm font-medium text-gray-300">ให้คะแนนความพึงพอใจ</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={isReadOnly}
                    onMouseEnter={() => !isReadOnly && setHoveredRating(star)}
                    onMouseLeave={() => !isReadOnly && setHoveredRating(0)}
                    onClick={() => !isReadOnly && setRating(star)}
                    className={`p-1 transition-all duration-200 ${isReadOnly ? "cursor-default" : "hover:scale-110 focus:outline-none"}`}
                  >
                    <Star
                      className={`w-10 h-10 md:w-12 md:h-12 ${
                        (hoveredRating || rating) >= star
                          ? "fill-gold text-gold drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                          : "text-gray-700"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-gold text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                  {["", "ควรปรับปรุง", "พอใช้", "ปานกลาง", "ดี", "ดีเยี่ยม"][rating]}
                </p>
              )}
            </div>

            {/* Comment Area */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="comment"
                className="text-sm font-medium text-gray-300 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-gray-400" />
                ความคิดเห็นเพิ่มเติม (ถ้ามี)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isReadOnly}
                placeholder="บอกเราว่าคุณประทับใจสิ่งใด หรือมีส่วนใดที่ควรปรับปรุง..."
                className="w-full bg-[#0f1115] border border-gray-700/50 rounded-xl p-4 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all resize-none min-h-[120px] disabled:opacity-70"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all border-none ${
                  rating > 0 && !isSubmitting
                    ? "bg-gold text-black hover:bg-gold-hover hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>กำลังบันทึก...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="font-semibold text-base">ส่งแบบประเมิน</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </>
  )
}
