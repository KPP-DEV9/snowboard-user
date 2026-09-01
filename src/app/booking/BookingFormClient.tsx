"use client"

import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react"
import { Course, HotelsMaster, RoomMaster } from "@/types/course"
import { RenderDate } from "@/lib/date"
import { useRouter, useSearchParams } from "next/navigation"
import { User } from "@/types/user"

import { AssetMaster } from "@/app/actions/assetMaster"
import { OptionMaster } from "../actions/optionMaster"
import { updateEnrollment } from "@/app/actions/enrollment"
import { CreateEnrollmentRequest, Enrollment } from "@/types/enrollment"
import { Toast } from "@/components/Ui/Toast/Toast"
import { Spinner } from "@/components/Ui/Loading/Spinner"
import { format } from "date-fns"
import { getLocationName } from "@/constants/location"
import { NATIONALITIES, normalizeNationality } from "@/constants/nationality"

interface BookingFormClientProps {
  course: Course
  roundId: string
  adultsCount: number
  childrenCount: number
  user?: User
  assets: AssetMaster[]
  options: OptionMaster[]
  enrollment?: Enrollment | null
}

interface ParticipantData {
  id: string
  type: "adult" | "child"
  index: number
  lineId?: string
  level?: string
  idCard: string
  passportNo: string
  nationality: string
  birthDate: string
  firstName: string
  lastName: string
  gender: string
  telephone: string
  email: string
  hasDisease: boolean
  diseaseDetail: string
  hasAllergy: boolean
  allergyDetail: string
  weight: string
  height: string
  hatSize: string
  gloveSize: string
  shoeSize: string
  rentedAssets: Record<string, boolean>
  rentedOptions: Record<string, boolean>
  extraInsurance3: boolean
  extraInsurance1: boolean
  extraPhoto: boolean
}

export default function BookingFormClient({
  course,
  roundId,
  adultsCount,
  childrenCount,
  user,
  assets,
  options,
  enrollment,
}: BookingFormClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const enrollmentIdParam = searchParams.get("enrollment_id")
  const currentEnrollmentId = enrollment?.id || enrollmentIdParam || undefined

  const { provinceName, districtName } = getLocationName(
    course.province,
    course.district,
    course.nation,
  )

  const getPrice = (price: number | undefined) =>
    (price || Number(course.price) || 0) - (course.discount || 0)
  const adultPrice = getPrice(course.price)
  const childPrice = getPrice(course.child_price)

  // Base cost
  const adultsTotal = adultsCount * adultPrice
  const childrenTotal = childrenCount * childPrice
  const baseTotal = adultsTotal + childrenTotal

  // Extract hotels and rooms from course
  const hotelsList: HotelsMaster[] =
    course.hotels && course.hotels.length > 0
      ? course.hotels
      : (course.course_hotels?.map((ch) => ch.hotel).filter(Boolean) as HotelsMaster[]) || []

  // Extract rooms available from hotels or course_rooms
  const availableRooms: RoomMaster[] = []
  if (hotelsList.length > 0) {
    hotelsList.forEach((h) => {
      if (h.rooms && h.rooms.length > 0) {
        availableRooms.push(...h.rooms)
      }
    })
  }
  if (availableRooms.length === 0 && course.course_rooms && course.course_rooms.length > 0) {
    course.course_rooms.forEach((cr) => {
      if (cr.room_master) {
        availableRooms.push(cr.room_master)
      }
    })
  }

  // Helper to build participants list
  const buildParticipantsList = (
    enroll?: Enrollment | null,
    targetAdults: number = adultsCount,
    targetChildren: number = childrenCount,
  ): ParticipantData[] => {
    const enrollParticipants = enroll?.participants || []
    if (enrollParticipants.length > 0) {
      const existingAdults = enrollParticipants.filter(
        (p) => (p.type || "").toUpperCase() === "ADULT",
      )
      const existingChildren = enrollParticipants.filter(
        (p) => (p.type || "").toUpperCase() === "CHILD",
      )

      const list: ParticipantData[] = []
      const effectiveAdultCount = Math.max(targetAdults, existingAdults.length, 1)
      for (let i = 1; i <= effectiveAdultCount; i++) {
        const existingP = existingAdults[i - 1]
        if (existingP) {
          list.push(
            convertEnrollmentParticipantToData(existingP, "adult", i, enroll, assets, options),
          )
        } else {
          list.push(
            createEmptyParticipant("adult", i, i === 1 ? user : undefined, enroll, assets, options),
          )
        }
      }

      const effectiveChildCount = Math.max(targetChildren, existingChildren.length)
      for (let i = 1; i <= effectiveChildCount; i++) {
        const existingP = existingChildren[i - 1]
        if (existingP) {
          list.push(
            convertEnrollmentParticipantToData(existingP, "child", i, enroll, assets, options),
          )
        } else {
          list.push(createEmptyParticipant("child", i, undefined, enroll, assets, options))
        }
      }
      return list
    }

    const list: ParticipantData[] = []
    for (let i = 1; i <= targetAdults; i++) {
      list.push(
        createEmptyParticipant("adult", i, i === 1 ? user : undefined, enroll, assets, options),
      )
    }
    for (let i = 1; i <= targetChildren; i++) {
      list.push(createEmptyParticipant("child", i, undefined, enroll, assets, options))
    }
    return list
  }

  // Initialize participants
  const [participants, setParticipants] = useState<ParticipantData[]>(() =>
    buildParticipantsList(enrollment, adultsCount, childrenCount),
  )

  // Synchronize participants when enrollment, adults/children count, or assets/options change
  useEffect(() => {
    if (enrollment) {
      setParticipants(buildParticipantsList(enrollment, adultsCount, childrenCount))
    }
  }, [enrollment, enrollmentIdParam, adultsCount, childrenCount, user, assets, options])

  // Accordion state (first one open)
  const [openParticipantId, setOpenParticipantId] = useState<string>(participants[0]?.id || "")

  const handleParticipantChange = (id: string, field: keyof ParticipantData, value: any) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  // Cost calculations
  const calculateExtras = () => {
    let extrasTotal = 0
    participants.forEach((p) => {
      // Dynamic asset calculation
      if (p.rentedAssets) {
        Object.entries(p.rentedAssets).forEach(([assetId, isRented]) => {
          if (isRented) {
            const asset = assets.find((a) => a.id === assetId)
            if (asset) {
              extrasTotal += asset.price
            }
          }
        })
      }
      // Dynamic options calculation
      if (p.rentedOptions) {
        Object.entries(p.rentedOptions).forEach(([optionId, isRented]) => {
          if (isRented) {
            const opt = options.find((o) => o.id === optionId)
            if (opt) {
              extrasTotal += opt.price
            }
          }
        })
      }
    })

    return extrasTotal
  }

  const grandTotal = baseTotal + calculateExtras()

  const [loading, setLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const isConfirmedRef = useRef(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)

  useEffect(() => {
    // Push dummy history entry so browser back button triggers popstate before leaving
    window.history.pushState({ bookingPage: true }, "", window.location.href)

    const handlePopState = () => {
      if (isConfirmedRef.current) return

      // Keep user on the page and open confirmation modal
      window.history.pushState({ bookingPage: true }, "", window.location.href)
      setShowCancelModal(true)
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isConfirmedRef.current) return
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("popstate", handlePopState)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  const handleConfirmLeave = () => {
    isConfirmedRef.current = true
    setShowCancelModal(false)
    router.push(`/course/${course.id}/rounds`)
  }

  const handleNext = async () => {
    try {
      setLoading(true)

      const formattedParticipants = participants.map((p) => {
        const asset_options: {
          asset_options_id: string
          requirement_type: string
          price?: number
        }[] = []
        if (p.rentedAssets) {
          Object.entries(p.rentedAssets).forEach(([assetId, isRented]) => {
            if (isRented) {
              const assetObj = assets.find((a) => a.id === assetId)
              asset_options.push({
                asset_options_id: assetId,
                requirement_type: "ASSET",
                price: assetObj?.price || 0,
              })
            }
          })
        }
        if (p.rentedOptions) {
          Object.entries(p.rentedOptions).forEach(([optionId, isRented]) => {
            if (isRented) {
              const optObj = options.find((o) => o.id === optionId)
              asset_options.push({
                asset_options_id: optionId,
                requirement_type: "OPTION",
                price: optObj?.price || 0,
              })
            }
          })
        }

        let dob: string | undefined = undefined
        if (p.birthDate) {
          try {
            const d = new Date(p.birthDate)
            if (!isNaN(d.getTime())) {
              dob = d.toISOString()
            }
          } catch {}
        }

        const reqTotal = asset_options.reduce((sum, item) => sum + (item.price || 0), 0)

        return {
          type: p.type === "adult" ? "ADULT" : "CHILD",
          line_id: p.lineId || undefined,
          id_card: p.idCard || undefined,
          passport_no: p.passportNo || undefined,
          nationality: p.nationality || "ไทย (Thai)",
          date_of_birth: dob,
          first_name: p.firstName || "",
          last_name: p.lastName || "",
          gender:
            p.gender?.toLowerCase() === "male"
              ? "MALE"
              : p.gender?.toLowerCase() === "female"
                ? "FEMALE"
                : p.gender?.toUpperCase() || undefined,
          phone_number: p.telephone || undefined,
          email: p.email || undefined,
          has_medical_condition: p.hasDisease,
          medical_condition_detail: p.hasDisease ? p.diseaseDetail : undefined,
          has_food_allergy: p.hasAllergy,
          food_allergy_detail: p.hasAllergy ? p.allergyDetail : undefined,
          weight_kg: p.weight && p.weight !== "0" ? parseFloat(p.weight) : undefined,
          height_cm: p.height && p.height !== "0" ? parseFloat(p.height) : undefined,
          helmet_size_us: p.hatSize || undefined,
          glove_size_us: p.gloveSize || undefined,
          shoe_size_us: p.shoeSize && p.shoeSize !== "0" ? p.shoeSize : undefined,
          asset_options: asset_options.length > 0 ? asset_options : undefined,
          req_total: reqTotal,
        }
      })

      const payload: CreateEnrollmentRequest = {
        course_id: course.id,
        round_id: roundId,
        adult_count: Number(adultsCount) || 1,
        child_count: Number(childrenCount) || 0,
        total_amount: grandTotal,
        deposit_amount: enrollment?.deposit_amount || 0,
        ski_equipment: false,
        snowboard_equipment: false,
        participants: formattedParticipants,
        req_total: formattedParticipants.reduce((sum, item) => sum + (item.req_total || 0), 0),
      }

      if (!currentEnrollmentId) {
        setToast({ message: "ไม่พบข้อมูลการจอง กรุณาทำรายการใหม่อีกครั้ง", type: "error" })
        return
      }

      const { success, error, data } = await updateEnrollment(currentEnrollmentId, {
        ...payload,
        status: enrollment?.status || "pending_payment",
        deposit_amount: enrollment?.deposit_amount || 0,
      })

      if (!success) {
        setToast({ message: error || "เกิดข้อผิดพลาดในการอัปเดตการจอง", type: "error" })
        return
      }

      isConfirmedRef.current = true
      const resultEnrollmentId = data?.id || currentEnrollmentId

      setToast({
        message: "อัปเดตการจองสำเร็จ! กำลังพาท่านไปยังหน้าชำระเงิน...",
        type: "success",
      })

      setTimeout(() => {
        if (resultEnrollmentId) {
          router.push(
            `/payment/?enrollment_id=${resultEnrollmentId}&course_id=${course.id}&round_id=${roundId}&adults=${adultsCount}&children=${childrenCount}&method=credit`,
          )
        }
      }, 1000)
    } catch (err: any) {
      isConfirmedRef.current = false
      setToast({ message: err?.message || "เกิดข้อผิดพลาดในการบันทึกการจอง", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto pt-6 px-4 pb-32">
      {/* Header */}
      <div className="relative flex items-center justify-center mb-8">
        <button
          type="button"
          onClick={() => setShowCancelModal(true)}
          className="absolute left-0 text-white font-bold flex items-center gap-2 hover:opacity-80 transition-opacity text-sm cursor-pointer"
        >
          <ArrowLeft size={20} className="stroke-[3]" />
        </button>
        <h1 className="text-xl font-bold text-white">สรุปการจอง</h1>
      </div>

      <div className="mb-6 space-y-3">
        <h2 className="text-2xl font-bold text-white leading-snug">{course.title}</h2>
        <div className="flex flex-col gap-1.5 text-white/90 text-sm font-medium">
          <div className="flex items-center gap-2">
            <MapPin size={16} /> {districtName ? `${districtName}, ` : ""}
            {provinceName}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} /> {RenderDate(course.start_date, "d MMMM yyyy")} -{" "}
            {RenderDate(course.end_date, "d MMMM yyyy")}
          </div>
          <div className="flex items-center gap-2">
            <UserIcon size={16} /> {course.course_level || "Beginner"}
          </div>
        </div>
      </div>

      {/* Participants Summary Card */}
      <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <UserIcon size={20} /> จำนวนคน
          </div>
          <div className="flex items-center gap-2 font-bold text-gray-900">
            ผู้ใหญ่ {adultsCount}, เด็ก {childrenCount}{" "}
          </div>
        </div>
        <div className="flex justify-between font-bold text-[#448651] text-lg border-t border-gray-100 pt-4">
          <span>ราคารวม</span>
          <span>฿ {baseTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Participant Accordions */}
      <div className="space-y-3 mb-6">
        {participants.map((p) => {
          const isBooker = p.type === "adult" && p.index === 1
          const title = isBooker
            ? "ข้อมูลผู้จอง (ตัวคุณ)"
            : p.type === "adult"
              ? `ผู้ร่วมทริป (ผู้ใหญ่คนที่ ${p.index})`
              : `ผู้ร่วมทริป (เด็กคนที่ ${p.index})`
          const isOpen = openParticipantId === p.id

          return (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenParticipantId(isOpen ? "" : p.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="font-bold text-gray-900">{title}</div>
                {isOpen ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>

              {isOpen && (
                <div className="p-5 pt-0">
                  <ParticipantForm
                    data={p}
                    onChange={(field, val) => handleParticipantChange(p.id, field, val)}
                    assets={assets}
                    options={options}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-2 right-2 bg-transparent p-4 z-40 max-w-lg mx-auto">
        <button
          onClick={handleNext}
          disabled={loading}
          className={`w-full bg-[#F04E23] hover:bg-[#D4411C] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-black/20 flex justify-center items-center gap-2 ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <Spinner size="sm" color="border-white" />
              <span>กำลังดำเนินการ...</span>
            </>
          ) : (
            <span>ยืนยันจองทริป &rarr;</span>
          )}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-[#F04E23] flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">ต้องการยกเลิกการจองหรือไม่?</h3>
            <p className="text-sm text-gray-500 mb-6">
              หากออกจากหน้านี้ ข้อมูลการจองที่คุณกรอกไว้จะไม่ได้รับการบันทึก
            </p>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                ทำรายการต่อ
              </button>
              <button
                type="button"
                onClick={handleConfirmLeave}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-[#F04E23] hover:bg-[#D4411C] text-white transition-colors cursor-pointer"
              >
                ยกเลิกการจอง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const WEIGHT_OPTIONS = Array.from({ length: 121 }, (_, i) => (i + 30).toString())
const HEIGHT_OPTIONS = Array.from({ length: 131 }, (_, i) => (i + 90).toString())
const HAT_SIZE_OPTIONS = ["S", "M", "L", "XL", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"]
const GLOVE_SIZE_OPTIONS = [
  "S",
  "M",
  "L",
  "XL",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
]
const SHOE_SIZE_OPTIONS = [
  "3",
  "3.5",
  "4",
  "4.5",
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
  "12.5",
  "13",
  "13.5",
  "14",
  "14.5",
  "15",
]

function ParticipantForm({
  data,
  onChange,
  assets,
  options,
}: {
  data: ParticipantData
  onChange: (field: keyof ParticipantData, value: any) => void
  assets: AssetMaster[]
  options: OptionMaster[]
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800">
            <span className="text-red-500">*</span>Line Id
          </label>
          <input
            type="text"
            value={data.lineId}
            onChange={(e) => onChange("lineId", e.target.value)}
            className="bg-gray-100 border-none rounded-lg p-2.5 text-sm text-gray-900"
            placeholder="LineID0001"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800">
            <span className="text-red-500">*</span>ระดับผู้เล่น
          </label>
          <select
            value={data.level}
            onChange={(e) => onChange("level", e.target.value)}
            className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
          >
            <option value="Level 1">Level 1</option>
            <option value="Level 2">Level 2</option>
            <option value="Level 3">Level 3</option>
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800">เลขบัตรประชาชน</label>
          <div className="relative">
            <input
              type="text"
              value={data.idCard}
              onChange={(e) => onChange("idCard", e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2.5 pr-8 text-sm text-gray-900"
              placeholder="เลขบัตรประชาชน 13 หลัก"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 7v2a3 3 0 1 1 0 6v2c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800">เลขพาสปอร์ต</label>
          <input
            type="text"
            value={data.passportNo}
            onChange={(e) => onChange("passportNo", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
            placeholder="เลขพาสปอร์ต"
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800">
            <span className="text-red-500">*</span>สัญชาติ
          </label>
          <select
            value={data.nationality}
            onChange={(e) => onChange("nationality", e.target.value)}
            className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
          >
            <option value="" disabled>
              เลือกสัญชาติ (Select Nationality)
            </option>
            {NATIONALITIES.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
            {data.nationality &&
              !NATIONALITIES.some((n) => n.value === data.nationality) && (
                <option value={data.nationality}>{data.nationality}</option>
              )}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800">
            <span className="text-red-500">*</span>วันเดือนปีเกิด
          </label>
          <input
            type="date"
            value={data.birthDate}
            onChange={(e) => onChange("birthDate", e.target.value)}
            className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
          />
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800">
            <span className="text-red-500">*</span>ชื่อ
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
            placeholder="ชื่อ"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800">
            <span className="text-red-500">*</span>นามสกุล
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
            placeholder="นามสกุล"
          />
        </div>
      </div>

      {/* Row 5 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800">
            <span className="text-red-500">*</span>เพศ
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onChange("gender", "male")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-1 ${data.gender === "male" ? "bg-[#354359] text-white border-[#354359]" : "border-gray-200 text-black"}`}
            >
              ชาย
            </button>
            <button
              onClick={() => onChange("gender", "female")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-1 ${data.gender === "female" ? "bg-[#354359] text-white border-[#354359]" : "border-gray-200 text-black"}`}
            >
              หญิง
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800">
            <span className="text-red-500">*</span>เบอร์โทรศัพท์
          </label>
          <input
            type="tel"
            value={data.telephone}
            onChange={(e) => onChange("telephone", e.target.value)}
            className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
            placeholder="0899999999"
          />
        </div>
      </div>

      {/* Row 6 */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-800">อีเมล์</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
          placeholder="email@gmail.com"
        />
      </div>

      {/* Medical Info */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.hasDisease}
            onChange={(e) => onChange("hasDisease", e.target.checked)}
            className="text-[#798E75] rounded w-4 h-4"
          />
          <label className="text-xs font-bold text-gray-800">
            <span className="text-red-500">*</span>มีโรคประจำตัวหรือไม่ ?
          </label>
        </div>
        <input
          type="text"
          disabled={!data.hasDisease}
          value={data.diseaseDetail}
          onChange={(e) => onChange("diseaseDetail", e.target.value)}
          className={`border rounded-lg p-2 text-sm text-gray-900 ${!data.hasDisease ? "bg-gray-100 border-transparent text-gray-400" : "bg-white border-gray-200"}`}
          placeholder="ระบุโรคประจำตัว..."
        />

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={data.hasAllergy}
            onChange={(e) => onChange("hasAllergy", e.target.checked)}
            className="text-[#798E75] rounded w-4 h-4"
          />
          <label className="text-xs font-bold text-gray-800">
            <span className="text-red-500">*</span>แพ้อาหารหรือไม่ ?
          </label>
        </div>
        <input
          type="text"
          disabled={!data.hasAllergy}
          value={data.allergyDetail}
          onChange={(e) => onChange("allergyDetail", e.target.value)}
          className={`border rounded-lg p-2 text-sm text-gray-900 ${!data.hasAllergy ? "bg-gray-100 border-transparent text-gray-400" : "bg-white border-gray-200"}`}
          placeholder="ปลาหมึก, หอยนางรม"
        />
      </div>

      {/* Physical Info */}
      <div className="mt-4">
        <h4 className="text-sm font-bold text-[#798E75] mb-3">ข้อมูลอื่นๆ</h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-800">
              <span className="text-red-500">*</span>น้ำหนัก (kg)
            </label>
            <select
              value={data.weight}
              onChange={(e) => onChange("weight", e.target.value)}
              className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
            >
              <option value="">เลือก</option>
              {data.weight && !WEIGHT_OPTIONS.includes(data.weight) && (
                <option value={data.weight}>{data.weight}</option>
              )}
              {WEIGHT_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-800">
              <span className="text-red-500">*</span>ส่วนสูง (cm)
            </label>
            <select
              value={data.height}
              onChange={(e) => onChange("height", e.target.value)}
              className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
            >
              <option value="">เลือก</option>
              {data.height && !HEIGHT_OPTIONS.includes(data.height) && (
                <option value={data.height}>{data.height}</option>
              )}
              {HEIGHT_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-800">
              <span className="text-red-500">*</span>Size หมวก (us)
            </label>
            <select
              value={data.hatSize}
              onChange={(e) => onChange("hatSize", e.target.value)}
              className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
            >
              <option value="">เลือก</option>
              {data.hatSize && !HAT_SIZE_OPTIONS.includes(data.hatSize) && (
                <option value={data.hatSize}>{data.hatSize}</option>
              )}
              {HAT_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-800">
              <span className="text-red-500">*</span>Size ถุงมือ (us)
            </label>
            <select
              value={data.gloveSize}
              onChange={(e) => onChange("gloveSize", e.target.value)}
              className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
            >
              <option value="">เลือก</option>
              {data.gloveSize && !GLOVE_SIZE_OPTIONS.includes(data.gloveSize) && (
                <option value={data.gloveSize}>{data.gloveSize}</option>
              )}
              {GLOVE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-800">
              <span className="text-red-500">*</span>Size รองเท้า (us)
            </label>
            <select
              value={data.shoeSize}
              onChange={(e) => onChange("shoeSize", e.target.value)}
              className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
            >
              <option value="">เลือก</option>
              {data.shoeSize && !SHOE_SIZE_OPTIONS.includes(data.shoeSize) && (
                <option value={data.shoeSize}>{data.shoeSize}</option>
              )}
              {SHOE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Rental */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-bold text-gray-900">เช่าอุปกรณ์</h4>
        </div>
        <p className="text-[11px] text-gray-400 mb-3">
          (การเช่าอุปกรณ์สามารถจ่ายได้ในวันเดินทาง และค่าอุปกรณ์ที่ระบุเป็นต่อชิ้น
          อาจมีการเปลี่ยนแปลง)
        </p>
        <div className="space-y-2">
          {assets.map((asset) => (
            <label key={asset.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!data.rentedAssets?.[asset.id]}
                  onChange={(e) => {
                    const newRented = { ...data.rentedAssets, [asset.id]: e.target.checked }
                    onChange("rentedAssets", newRented)
                  }}
                  className="text-blue-500"
                />{" "}
                <label
                  htmlFor={`opt-${asset.id}`}
                  className="block min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm text-black cursor-pointer select-none"
                >
                  {asset.name}
                </label>
              </div>

              {/* ฝั่งขวา: ราคาล็อกไม่ให้โดนเบียด */}
              <span className="text-sm font-medium text-black shrink-0 pl-2">
                ฿{asset.price.toLocaleString()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Extra Services */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-black">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-bold text-gray-900">ค่าบริการเพิ่มเติมอื่นๆ</h4>
          <span className="text-xs font-medium text-gray-400">(Optional)</span>
        </div>
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center justify-between gap-3 py-1.5 w-full">
              {/* ฝั่งซ้าย: จัดกรอบ Checkbox + ข้อความ */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <input
                  type="checkbox"
                  id={`opt-${option.id}`}
                  checked={!!data.rentedOptions?.[option.id]}
                  onChange={(e) => {
                    const newRented = { ...data.rentedOptions, [option.id]: e.target.checked }
                    onChange("rentedOptions", newRented)
                  }}
                  className="w-4 h-4 text-blue-500 rounded shrink-0 cursor-pointer"
                />

                {/* จุดสำคัญ: กล่อง Scroll ต้องเป็น Block และใส่ min-w-0 */}
                <label
                  htmlFor={`opt-${option.id}`}
                  className="block min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm text-black cursor-pointer select-none"
                >
                  {option.name}
                </label>
              </div>

              {/* ฝั่งขวา: ราคาล็อกไม่ให้โดนเบียด */}
              <span className="text-sm font-medium text-black shrink-0 pl-2">
                ฿{option.price.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function extractRentedRequirements(
  p?: any,
  _index: number = 1,
  enrollment?: Enrollment | null,
  _assets: AssetMaster[] = [],
  _options: OptionMaster[] = [],
) {
  const rentedAssets: Record<string, boolean> = {}
  const rentedOptions: Record<string, boolean> = {}

  // Collect requirement items from enrollment.requirement_transactions
  const reqItems: any[] = []

  // From participant level
  if (p) {
    if (Array.isArray(p.asset_options)) reqItems.push(...p.asset_options)
    if (Array.isArray(p.requirement_transactions)) reqItems.push(...p.requirement_transactions)
  }

  // From enrollment root level
  if (enrollment?.requirement_transactions && Array.isArray(enrollment.requirement_transactions)) {
    reqItems.push(...enrollment.requirement_transactions)
  }

  // Map: asset_options_id → rentedAssets (ASSET) or rentedOptions (OPTION)
  for (const item of reqItems) {
    if (!item) continue
    const id = item.asset_options_id
    if (!id) continue

    const type = String(item.requirement_type || "").toUpperCase()
    if (type === "ASSET") {
      rentedAssets[id] = true
    } else if (type === "OPTION") {
      rentedOptions[id] = true
    }
  }

  console.log(
    "[extractRentedRequirements] reqItems:",
    reqItems.length,
    "enrollment?.requirement_transactions:",
    enrollment?.requirement_transactions?.length,
    "rentedAssets:",
    rentedAssets,
    "rentedOptions:",
    rentedOptions,
  )

  return { rentedAssets, rentedOptions }
}

function createEmptyParticipant(
  type: "adult" | "child",
  index: number,
  user?: User,
  enrollment?: Enrollment | null,
  assets: AssetMaster[] = [],
  options: OptionMaster[] = [],
): ParticipantData {
  const profile = user?.user_profile

  let birthDate = ""
  if (profile?.birth_date) {
    try {
      const d = new Date(profile.birth_date)
      if (!isNaN(d.getTime())) {
        birthDate = format(d, "yyyy-MM-dd")
      }
    } catch {
      birthDate = ""
    }
  }

  const { rentedAssets, rentedOptions } = extractRentedRequirements(
    undefined,
    index,
    enrollment,
    assets,
    options,
  )

  return {
    id: `${type}-${index}`,
    type,
    index,
    lineId: user?.line_user_id || "",
    level: profile?.level || "Level 1",
    idCard: profile?.id_card || "",
    passportNo: profile?.passport_no || "",
    nationality: normalizeNationality(profile?.nation) || "ไทย (Thai)",
    birthDate,
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    gender: profile?.sex?.toLowerCase() === "female" ? "female" : "male",
    telephone: profile?.telephone || "",
    email: profile?.email || "",
    hasDisease: !!profile?.underlying_disease,
    diseaseDetail: profile?.underlying_disease || "",
    hasAllergy: !!profile?.food_allergies,
    allergyDetail: profile?.food_allergies || "",
    weight: profile?.weight?.toString() || "",
    height: profile?.height?.toString() || "",
    hatSize: profile?.head_size || "",
    gloveSize: profile?.glove_size || "",
    shoeSize: profile?.shoe_size || "",
    rentedAssets,
    rentedOptions,
    extraInsurance3: false,
    extraInsurance1: false,
    extraPhoto: false,
  }
}

function convertEnrollmentParticipantToData(
  p: any,
  type: "adult" | "child",
  index: number,
  enrollment?: Enrollment | null,
  assets: AssetMaster[] = [],
  options: OptionMaster[] = [],
): ParticipantData {
  let birthDate = ""
  const rawDob = p.date_of_birth || p.dateOfBirth || p.birth_date || p.birthDate
  if (rawDob) {
    try {
      const d = new Date(rawDob)
      if (!isNaN(d.getTime())) {
        birthDate = format(d, "yyyy-MM-dd")
      } else {
        birthDate = String(rawDob).slice(0, 10)
      }
    } catch {
      birthDate = String(rawDob).slice(0, 10)
    }
  }

  const { rentedAssets, rentedOptions } = extractRentedRequirements(
    p,
    index,
    enrollment,
    assets,
    options,
  )

  return {
    id: p.id || `${type}-${index}`,
    type,
    index,
    lineId: p.line_id || p.lineId || p.line_user_id || "",
    level: p.level || p.course_level || "Level 1",
    idCard: p.id_card || p.idCard || "",
    passportNo: p.passport_no || p.passportNo || "",
    nationality: normalizeNationality(p.nationality) || "ไทย (Thai)",
    birthDate,
    firstName: p.first_name || p.firstName || "",
    lastName: p.last_name || p.lastName || "",
    gender: (p.gender || "").toLowerCase() === "female" ? "female" : "male",
    telephone: p.phone_number || p.phoneNumber || p.telephone || p.phone || "",
    email: p.email || "",
    hasDisease: Boolean(
      p.has_medical_condition ||
      p.hasDisease ||
      p.medical_condition_detail ||
      p.diseaseDetail ||
      p.underlying_disease,
    ),
    diseaseDetail: p.medical_condition_detail || p.diseaseDetail || p.underlying_disease || "",
    hasAllergy: Boolean(
      p.has_food_allergy ||
      p.hasAllergy ||
      p.food_allergy_detail ||
      p.allergyDetail ||
      p.food_allergies,
    ),
    allergyDetail: p.food_allergy_detail || p.allergyDetail || p.food_allergies || "",
    weight:
      p.weight_kg != null ? p.weight_kg.toString() : p.weight != null ? p.weight.toString() : "",
    height:
      p.height_cm != null ? p.height_cm.toString() : p.height != null ? p.height.toString() : "",
    hatSize: p.helmet_size_us || p.hat_size || p.hatSize || p.helmet_size || p.head_size || "",
    gloveSize: p.glove_size_us || p.glove_size || p.gloveSize || "",
    shoeSize:
      p.shoe_size_us != null
        ? p.shoe_size_us.toString()
        : p.shoe_size != null
          ? p.shoe_size.toString()
          : p.shoeSize != null
            ? p.shoeSize.toString()
            : "",
    rentedAssets,
    rentedOptions,
    extraInsurance3: false,
    extraInsurance1: false,
    extraPhoto: false,
  }
}
