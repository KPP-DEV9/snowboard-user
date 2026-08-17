"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react"
import { Course, HotelsMaster, RoomMaster } from "@/types/course"
import { RenderDate } from "@/lib/date"
import { useRouter } from "next/navigation"
import { User } from "@/types/user"

import { AssetMaster } from "@/app/actions/assetMaster"
import { OptionMaster } from "../actions/optionMaster"
import { format } from "date-fns"

interface BookingFormClientProps {
  course: Course
  roundId: string
  adultsCount: number
  childrenCount: number
  user?: any // Use 'any' or import 'User' type if possible. I'll import User from '@/types/user'
  assets: AssetMaster[]
  options: OptionMaster[]
}

// Interfaces for form state
interface ParticipantData {
  id: string
  type: "adult" | "child"
  index: number
  lineId?: string
  level?: string
  idCard: string
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

interface RoomData {
  id: string
  roomIndex: number
  selectedOption: string
  extraBed: boolean
}

export default function BookingFormClient({
  course,
  roundId,
  adultsCount,
  childrenCount,
  user,
  assets,
  options,
}: BookingFormClientProps) {
  const router = useRouter()
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

  // Primary hotel name
  const primaryHotel = hotelsList[0] || course.course_rooms?.[0]?.room_master?.hotel
  const hotelName = primaryHotel?.name || "โรงแรม Steigenberger"
  const defaultOption = availableRooms[0]?.id || ""

  // Initialize participants
  const [participants, setParticipants] = useState<ParticipantData[]>(() => {
    const list: ParticipantData[] = []
    for (let i = 1; i <= adultsCount; i++) {
      list.push(createEmptyParticipant("adult", i, i === 1 ? user : undefined))
    }
    for (let i = 1; i <= childrenCount; i++) {
      list.push(createEmptyParticipant("child", i))
    }
    return list
  })

  // (Removed useEffect to prevent HMR weirdness, we rely entirely on initial state)

  // Initialize rooms (start with 1)
  const [rooms, setRooms] = useState<RoomData[]>([
    { id: "r1", roomIndex: 1, selectedOption: defaultOption, extraBed: false },
  ])

  // Accordion state (first one open)
  const [openParticipantId, setOpenParticipantId] = useState<string>(participants[0]?.id || "")

  const handleParticipantChange = (id: string, field: keyof ParticipantData, value: any) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleRoomChange = (id: string, field: keyof RoomData, value: any) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const addRoom = () => {
    setRooms((prev) => [
      ...prev,
      {
        id: `r${prev.length + 1}_${Date.now()}`,
        roomIndex: prev.length + 1,
        selectedOption: defaultOption,
        extraBed: false,
      },
    ])
  }

  const removeRoom = (id: string) => {
    if (rooms.length <= 1) return
    setRooms((prev) =>
      prev
        .filter((r) => r.id !== id)
        .map((r, idx) => ({
          ...r,
          roomIndex: idx + 1,
        })),
    )
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

    rooms.forEach((r) => {
      const selected = availableRooms.find((rm) => rm.id === r.selectedOption)
      if (selected) {
        extrasTotal += Number(selected.base_price) || 0
        if (r.extraBed) {
          extrasTotal += Number(selected.extra_price) || 500
        }
      } else if (r.extraBed) {
        extrasTotal += 500
      }
    })

    return extrasTotal
  }

  const grandTotal = baseTotal + calculateExtras()

  const handleNext = () => {
    // Collect all data, possibly save to context or local storage, then push to payment page
    router.push(`/payment/?course_id=${course.id}&round_id=${roundId}&method=credit`)
  }

  return (
    <div className="w-full max-w-lg mx-auto pt-6 px-4 pb-32">
      {/* Header */}
      <div className="relative flex items-center justify-center mb-8">
        <Link
          href={`/course/${course.id}/rounds`}
          className="absolute left-0 text-white font-bold flex items-center gap-2 hover:opacity-80 transition-opacity text-sm"
        >
          <ArrowLeft size={20} className="stroke-[3]" />
        </Link>
        <h1 className="text-xl font-bold text-white">สรุปการจอง</h1>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#304B65] text-white text-[11px] font-bold px-3 py-1 rounded shadow-sm">
            {course.course_type}
          </span>
          <span className="text-white/60 text-xs">AE0342349</span>
        </div>
        <h2 className="text-2xl font-bold text-white leading-snug">{course.title}</h2>
        <div className="flex flex-col gap-1.5 text-white/90 text-sm font-medium">
          <div className="flex items-center gap-2">
            <MapPin size={16} /> {course.district || ""}, {course.province || ""}
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
            <Edit size={16} className="text-blue-500 cursor-pointer" />
          </div>
        </div>
        {/* <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">ผู้ใหญ่ ({adultsCount} คน)</span>
            <span className="font-medium">฿ {adultsTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">เด็ก ({childrenCount} คน)</span>
            <span className="font-medium">฿ {childrenTotal.toLocaleString()}</span>
          </div>
        </div> */}
        <div className="flex justify-between font-bold text-[#448651] text-lg border-t border-gray-100 pt-4">
          <span>ราคารวม</span>
          <span>฿ {baseTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Participant Accordions */}
      <div className="space-y-3 mb-6">
        {participants.map((p) => {
          const title = p.type === "adult" ? `ผู้ใหญ่คนที่ ${p.index}` : `เด็กคนที่ ${p.index}`
          const isOpen = openParticipantId === p.id

          return (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenParticipantId(isOpen ? "" : p.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="font-bold text-gray-900">
                  {isOpen ? `ข้อมูลผู้จอง (${title})` : `ผู้ร่วมทริป (${title})`}
                </div>
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

      {/* Hotel Selection */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-24 text-black">
        <div className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-2">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M3 21h18M5 21V7l8-4v18M13 3l8 4v14M7 11h2M7 15h2M15 11h2M15 15h2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          เลือกห้องพัก
        </div>
        <div className="flex justify-between text-sm mb-6">
          <span className="font-bold text-gray-900">{hotelName}</span>
          <span className="text-[#798E75] font-bold">
            ผู้ใหญ่ {adultsCount}, เด็ก {childrenCount}
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          กรุณาเลือกห้องพักของคุณ โดยทางที่พักสามารถพักได้สูงสุด 2 ท่านต่อห้อง
          (กรณีต้องการเพิ่มเตียงเสริม สามารถระบุได้ในตัวเลือก)
        </p>

        <div className="space-y-6 text-black">
          {rooms.map((r) => {
            const selectedRoom = availableRooms.find((rm) => rm.id === r.selectedOption)
            const extraBedPrice = selectedRoom?.extra_price ? selectedRoom.extra_price : 500

            return (
              <div key={r.id} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center font-bold text-gray-900 mb-3 text-sm">
                  <span>เลือกห้องพัก ห้องที่ {r.roomIndex}</span>
                  {rooms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoom(r.id)}
                      className="text-red-500 text-xs font-normal hover:underline"
                    >
                      ลบห้องพัก
                    </button>
                  )}
                </div>

                {availableRooms.length === 0 ? (
                  <div className="text-sm text-gray-400 py-2">ไม่มีข้อมูลห้องพัก</div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {availableRooms.map((room) => (
                      <label
                        key={room.id}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`room-option-${r.id}`}
                            value={room.id}
                            checked={r.selectedOption === room.id}
                            onChange={() => handleRoomChange(r.id, "selectedOption", room.id)}
                            className="text-blue-500"
                          />
                          <span className="text-sm text-gray-800">
                            {room.room_type}
                            {room.bed_type ? `, ${room.bed_type}` : ""}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {room.base_price > 0 ? `฿${room.base_price.toLocaleString()}` : "฿0"}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                <div className="font-bold text-sm text-gray-900 mb-2">
                  ต้องการเตียงเสริมหรือไม่ ?
                </div>
                <label className="flex items-center justify-between cursor-pointer mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={r.extraBed}
                      onChange={(e) => handleRoomChange(r.id, "extraBed", e.target.checked)}
                      className="text-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-800">เพิ่มเตียง</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ฿ {extraBedPrice.toLocaleString()}
                  </span>
                </label>
              </div>
            )
          })}

          <button
            type="button"
            onClick={addRoom}
            className="text-[#798E75] font-bold text-sm w-full text-left flex items-center justify-between mt-2 hover:opacity-80"
          >
            เพิ่มห้องพัก <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-transparent p-4 z-40 max-w-lg mx-auto">
        <button
          onClick={handleNext}
          className="w-full bg-[#F04E23] hover:bg-[#D4411C] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-black/20 flex justify-center items-center gap-2"
        >
          สรุปการจอง &rarr;
        </button>
      </div>
    </div>
  )
}

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
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-800">
          <span className="text-red-500">*</span>เลขบัตรประชาชน/เลขพาสปอร์ต
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.idCard}
            onChange={(e) => onChange("idCard", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
            placeholder="1234567890123"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50">
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
            <option value="ไทย">ไทย</option>
            <option value="อื่นๆ">อื่นๆ</option>
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
            placeholder="พัชราภา"
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
            placeholder="ภิรมย์ภักดี"
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
              ♂ ชาย
            </button>
            <button
              onClick={() => onChange("gender", "female")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-1 ${data.gender === "female" ? "bg-[#354359] text-white border-[#354359]" : "border-gray-200 text-black"}`}
            >
              ♀ หญิง
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
        <label className="text-xs font-bold text-gray-800">
          <span className="text-red-500">*</span>อีเมล์
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900"
          placeholder="patcharapa1992@gmail.com"
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
              <option value="65">65</option>
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
              <option value="171">171</option>
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
              <option value="8.5">8.5</option>
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
              <option value="8">8</option>
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
              <option value="7">7</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Rental */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-bold text-gray-900">
            เช่าอุปกรณ์
            {/* {assets?.[0]?.course_type} */}
          </h4>
          {/* <span className="text-xs font-bold text-[#798E75]">(฿ 1,040)</span> */}
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
                <span className="text-sm text-black">
                  {asset.name} (size: {asset.size})
                </span>
              </div>
              <span className="text-sm font-medium text-black">
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
            <label key={option.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!data.rentedOptions?.[option.id]}
                  onChange={(e) => {
                    const newRented = { ...data.rentedOptions, [option.id]: e.target.checked }
                    onChange("rentedOptions", newRented)
                  }}
                  className="text-blue-500"
                />{" "}
                <span className="text-sm text-black">{option.name}</span>
              </div>
              <span className="text-sm font-medium text-black">
                ฿{option.price.toLocaleString()}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

function createEmptyParticipant(
  type: "adult" | "child",
  index: number,
  user?: User,
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

  return {
    id: `${type}-${index}`,
    type,
    index,
    lineId: user?.line_user_id || "",
    level: profile?.level || "",
    idCard: profile?.id_card || profile?.passport_no || "",
    nationality: profile?.nation || "",
    birthDate,
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    gender: profile?.sex === "Male" ? "male" : profile?.sex === "Female" ? "female" : "",
    telephone: profile?.telephone || "",
    email: profile?.email || "",
    hasDisease: !!profile?.underlying_disease,
    diseaseDetail: profile?.underlying_disease || "",
    hasAllergy: !!profile?.food_allergies,
    allergyDetail: profile?.food_allergies || "",
    weight: profile?.weight?.toString() || "0",
    height: profile?.height?.toString() || "0",
    hatSize: profile?.head_size || "",
    gloveSize: profile?.glove_size || "",
    shoeSize: profile?.shoe_size || "0",
    rentedAssets: {},
    rentedOptions: {},
    extraInsurance3: false,
    extraInsurance1: false,
    extraPhoto: false,
  }
}
