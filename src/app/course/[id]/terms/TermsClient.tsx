"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  Square,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react"
import { Course } from "@/types/course"
import { User } from "@/types/user"
import { getLocationName } from "@/constants/location"
import { RenderDate } from "@/lib/date"
import LevelBadge from "@/components/LevelBadge"
import { createTermsConditions } from "@/app/actions/termsConditions"
import { createEnrollment } from "@/app/actions/enrollment"
import { Toast, ToastType } from "@/components/Ui/Toast/Toast"
import { Spinner } from "@/components/Ui/Loading/Spinner"

interface TermsClientProps {
  course: Course
  roundId: string
  adults: string
  childrenCount: string
  user?: User | null
}

export default function TermsClient({
  course,
  roundId,
  adults,
  childrenCount,
  user,
}: TermsClientProps) {
  const router = useRouter()
  const terms = course.terms_conditions_master || []
  const [agreedIds, setAgreedIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const { provinceName, districtName } = getLocationName(
    course.province,
    course.district,
    course.nation,
  )

  const selectedRound = course.rounds?.find((r) => r.id === roundId)

  const isAllAgreed = terms.length > 0 && terms.every((t) => agreedIds.includes(t.id))

  const toggleAgree = (id: string) => {
    setAgreedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const ENROLLMENT_STORAGE_KEY = `pending_enrollment_${course.id}_${roundId}`

  const handleAgreeAll = () => {
    if (isAllAgreed) {
      setAgreedIds([])
    } else {
      setAgreedIds(terms.map((t) => t.id))
    }
  }

  const handleCreateEnrollment = async (): Promise<string | null> => {
    if (typeof window !== "undefined") {
      const savedEnrollmentId = localStorage.getItem(ENROLLMENT_STORAGE_KEY)
      if (savedEnrollmentId) {
        return savedEnrollmentId
      }
    }

    const adultPrice = Math.max(0, (course.price || 0) - (course.discount || 0))
    const childPrice = Math.max(0, (course.child_price || 0) - (course.discount || 0))
    const totalAmount = Number(adults) * adultPrice + Number(childrenCount) * childPrice

    const enrollmentRes = await createEnrollment({
      course_id: course.id,
      round_id: roundId,
      adult_count: Number(adults) || 1,
      child_count: Number(childrenCount) || 0,
      total_amount: totalAmount,
      deposit_amount: 0,
      ski_equipment: false,
      snowboard_equipment: false,
      req_total: 0,
      participants: [],
    })

    if (!enrollmentRes.success || !enrollmentRes.data?.id) {
      setToast({
        message: enrollmentRes.error || "เกิดข้อผิดพลาดในการสร้างข้อมูลการจอง",
        type: "error",
      })
      return null
    }

    const enrollmentId = enrollmentRes.data.id

    if (typeof window !== "undefined") {
      localStorage.setItem(ENROLLMENT_STORAGE_KEY, enrollmentId)
    }

    return enrollmentId
  }

  const handleCreateTermsConditions = async (enrollmentId: string): Promise<boolean> => {
    if (terms.length === 0) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(ENROLLMENT_STORAGE_KEY)
      }
      return true
    }

    const payload = terms.map((t) => ({
      user_id: user?.id,
      terms_conditions_master_id: t.id,
      accept: agreedIds.includes(t.id),
      enrollment_id: enrollmentId,
    }))

    const termsRes = await createTermsConditions(payload)
    if (!termsRes.success) {
      setToast({
        message: termsRes.error || "เกิดข้อผิดพลาดในการบันทึกข้อตกลงและเงื่อนไข",
        type: "error",
      })
      return false
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem(ENROLLMENT_STORAGE_KEY)
    }

    return true
  }

  const handleProceed = async () => {
    if (!isAllAgreed && terms.length > 0) return
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const enrollmentId = await handleCreateEnrollment()
      if (!enrollmentId) {
        setIsSubmitting(false)
        return
      }

      const termsSuccess = await handleCreateTermsConditions(enrollmentId)
      if (!termsSuccess) {
        setIsSubmitting(false)
        return
      }

      router.push(
        `/booking?enrollment_id=${enrollmentId}&course_id=${course.id}&round_id=${roundId}&adults=${adults}&children=${childrenCount}`,
      )
    } catch (error: unknown) {
      setToast({
        message: error instanceof Error ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        type: "error",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-8 max-w-4xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Back Button */}
      <div className="relative flex items-center justify-between mb-6">
        <Link
          href={`/course/${course.id}/rounds?adults=${adults}&children=${childrenCount}`}
          className="text-white font-bold flex items-center gap-2 hover:opacity-80 transition-opacity text-sm md:text-base"
        >
          <ArrowLeft size={20} className="stroke-[3]" /> เลือกรอบใหม่
        </Link>
      </div>

      {/* Course Summary Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-6 text-white border border-white/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded font-bold">
                {course.course_type}
              </span>
              <LevelBadge level={course.course_level} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-white/80 text-xs md:text-sm">
              <div className="flex items-center gap-1">
                <MapPin size={15} /> {districtName ? `${districtName}, ` : ""}
                {provinceName}
              </div>
              <div>•</div>
              <div className="flex items-center gap-1">
                <CalendarDays size={15} /> {RenderDate(course.start_date, "d MMM")} -{" "}
                {RenderDate(course.end_date, "d MMM yyyy")}
              </div>
            </div>
          </div>

          {selectedRound && (
            <div className="bg-white/10 rounded-xl p-3 text-xs md:text-sm flex flex-col gap-1 border border-white/10 shrink-0">
              <div className="text-white/70">รอบเวลาที่เลือก:</div>
              <div className="font-bold text-[#E7E298]">
                {RenderDate(selectedRound.start_date, "d MMM yyyy")} (
                {RenderDate(selectedRound.start_date, "HH:mm")} -{" "}
                {RenderDate(selectedRound.end_date, "HH:mm")})
              </div>
              <div className="text-white/80 flex items-center gap-1.5 mt-0.5">
                <Users size={14} /> ผู้ใหญ่ {adults} ท่าน
                {Number(childrenCount) > 0 ? `, เด็ก ${childrenCount} ท่าน` : ""}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terms & Conditions Container */}
      <div className="bg-white rounded-2xl md:rounded-[1.5rem] shadow-xl p-6 md:p-8 space-y-6">
        {/* Title */}
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-[#304B65] mb-1">
            <ShieldCheck size={26} className="text-[#F04E23]" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">ข้อตกลงและเงื่อนไข</h2>
          </div>
          <p className="text-gray-500 text-xs md:text-sm">
            กรุณาอ่านและกดทำเครื่องหมายยอมรับข้อตกลงและเงื่อนไขทั้งหมดด้านล่างก่อนดำเนินการจอง
          </p>
        </div>

        {/* Agree All Toggle */}
        <div
          onClick={handleAgreeAll}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleAgreeAll()
            }
          }}
          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            isAllAgreed
              ? "bg-[#FFF4F0] border-[#F04E23] text-[#F04E23]"
              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {isAllAgreed ? (
            <CheckSquare size={22} className="text-[#F04E23] shrink-0" />
          ) : (
            <Square size={22} className="text-gray-400 shrink-0" />
          )}
          <span className="font-bold text-sm md:text-base">
            ยอมรับข้อตกลงและเงื่อนไขทั้งหมด ({agreedIds.length}/{terms.length})
          </span>
        </div>

        {/* Terms List */}
        <div className="space-y-3">
          {terms.map((term, index) => {
            const isChecked = agreedIds.includes(term.id)
            return (
              <div
                key={term.id}
                onClick={() => toggleAgree(term.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    toggleAgree(term.id)
                  }
                }}
                className={`p-4 md:p-5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isChecked
                    ? "bg-[#FFF8F6] border-[#F04E23]/50 shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckSquare size={20} className="text-[#F04E23]" />
                  ) : (
                    <Square size={20} className="text-gray-300 hover:text-gray-400" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-bold text-gray-400">ข้อที่ {index + 1}</div>
                  <div className="text-gray-800 text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                    {term.conditions}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress & Confirm Button */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs md:text-sm font-medium">
            <span className="text-gray-500">สถานะการยอมรับเงื่อนไข</span>
            <span className={`font-bold ${isAllAgreed ? "text-[#448651]" : "text-[#F04E23]"}`}>
              ยอมรับแล้ว {agreedIds.length} / {terms.length} ข้อ
            </span>
          </div>

          <button
            type="button"
            disabled={!isAllAgreed || isSubmitting}
            onClick={handleProceed}
            className={`w-full py-4 rounded-xl font-bold text-base md:text-[17px] transition-all flex items-center justify-center gap-2 shadow-md ${
              isAllAgreed && !isSubmitting
                ? "bg-[#F04E23] hover:bg-[#D4411C] text-white cursor-pointer shadow-orange-500/20"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                <span>กำลังบันทึกข้อมูล...</span>
              </>
            ) : (
              <>
                <span>ยอมรับและดำเนินการต่อ</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
