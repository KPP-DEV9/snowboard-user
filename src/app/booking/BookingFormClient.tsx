"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, CalendarDays, User, ChevronDown, ChevronUp, Edit } from "lucide-react"
import { Course } from "@/types/course"
import { RenderDate } from "@/lib/date"
import LevelBadge from "@/components/LevelBadge"
import { useRouter } from "next/navigation"

interface BookingFormClientProps {
  course: Course
  roundId: string
  adultsCount: number
  childrenCount: number
}

// Interfaces for form state
interface ParticipantData {
  id: string
  type: "adult" | "child"
  index: number
  lineId: string
  level: string
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
  rentSnowboard: boolean
  rentBoots: boolean
  rentKneePads: boolean
  rentPants: boolean
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
}: BookingFormClientProps) {
  const router = useRouter()
  const getPrice = (price: number | undefined) => (price || Number(course.price) || 0) - (course.discount || 0)
  const adultPrice = getPrice(course.adult_price)
  const childPrice = getPrice(course.child_price)
  
  // Base cost
  const adultsTotal = adultsCount * adultPrice
  const childrenTotal = childrenCount * childPrice
  const baseTotal = adultsTotal + childrenTotal

  // Initialize participants
  const [participants, setParticipants] = useState<ParticipantData[]>(() => {
    const list: ParticipantData[] = []
    for (let i = 1; i <= adultsCount; i++) {
      list.push(createEmptyParticipant("adult", i))
    }
    for (let i = 1; i <= childrenCount; i++) {
      list.push(createEmptyParticipant("child", i))
    }
    return list
  })

  // Initialize rooms (start with 1)
  const [rooms, setRooms] = useState<RoomData[]>([{ id: "r1", roomIndex: 1, selectedOption: "standard_twin", extraBed: false }])
  
  // Accordion state (first one open)
  const [openParticipantId, setOpenParticipantId] = useState<string>(participants[0]?.id || "")

  const handleParticipantChange = (id: string, field: keyof ParticipantData, value: any) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  const handleRoomChange = (id: string, field: keyof RoomData, value: any) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  const addRoom = () => {
    setRooms((prev) => [
      ...prev,
      { id: `r${prev.length + 1}`, roomIndex: prev.length + 1, selectedOption: "standard_twin", extraBed: false }
    ])
  }

  // Cost calculations
  const calculateExtras = () => {
    let extrasTotal = 0
    participants.forEach((p) => {
      if (p.rentSnowboard) extrasTotal += 0
      if (p.rentBoots) extrasTotal += 900
      if (p.rentKneePads) extrasTotal += 250
      if (p.rentPants) extrasTotal += 500
      if (p.extraInsurance3) extrasTotal += 0
      if (p.extraInsurance1) extrasTotal += 1250
      if (p.extraPhoto) extrasTotal += 3000
    })

    rooms.forEach((r) => {
      if (r.selectedOption === "deluxe_twin") extrasTotal += 2000
      if (r.selectedOption === "suite_single") extrasTotal += 4000
      if (r.extraBed) extrasTotal += 500
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
            {course.course_type?.name}
          </span>
          <span className="text-white/60 text-xs">AE0342349</span>
        </div>
        <h2 className="text-2xl font-bold text-white leading-snug">{course.title}</h2>
        <div className="flex flex-col gap-1.5 text-white/90 text-sm font-medium">
          <div className="flex items-center gap-2">
            <MapPin size={16} /> {course.district?.name || "โตเกียว"}, {course.province?.name || "ญี่ปุ่น"}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} /> {RenderDate(course.start_date, "d MMMM yyyy")} - {RenderDate(course.end_date, "d MMMM yyyy")}
          </div>
          <div className="flex items-center gap-2">
            <User size={16} /> {course.course_level || "Beginner"}
          </div>
        </div>
      </div>

      {/* Participants Summary Card */}
      <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <User size={20} /> จำนวนคน
          </div>
          <div className="flex items-center gap-2 font-bold text-gray-900">
            ผู้ใหญ่ {adultsCount}, เด็ก {childrenCount} <Edit size={16} className="text-blue-500 cursor-pointer" />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">ผู้ใหญ่ ({adultsCount} คน)</span>
            <span className="font-medium">฿ {adultsTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">เด็ก ({childrenCount} คน)</span>
            <span className="font-medium">฿ {childrenTotal.toLocaleString()}</span>
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
                {isOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
              </button>
              
              {isOpen && (
                <div className="p-5 pt-0">
                  <ParticipantForm data={p} onChange={(field, val) => handleParticipantChange(p.id, field, val)} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Hotel Selection */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-24">
        <div className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l8-4v18M13 3l8 4v14M7 11h2M7 15h2M15 11h2M15 15h2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          เลือกห้องพัก
        </div>
        <div className="flex justify-between text-sm mb-6">
          <span className="font-bold">โรงแรม Steigenberger</span>
          <span className="text-[#798E75] font-bold">ผู้ใหญ่ {adultsCount}, เด็ก {childrenCount}</span>
        </div>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          กรุณาเลือกห้องพักของคุณ โดยทางที่พักสามารถพักได้สูงสุด 2 ท่านต่อห้อง (กรณีต้องการเพิ่มเตียงเสริม สามารถระบุได้ในตัวเลือก)
        </p>

        <div className="space-y-6">
          {rooms.map((r, i) => (
            <div key={r.id}>
              <div className="flex justify-between items-center font-bold text-gray-900 mb-3 text-sm">
                <span>เลือกห้องพัก ห้องที่ {r.roomIndex}</span>
                <span className="text-[#798E75]">ปิดซ่อน <ChevronDown size={16} className="inline" /></span>
              </div>
              <div className="space-y-3 mb-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={r.selectedOption === "standard_twin"} onChange={() => handleRoomChange(r.id, "selectedOption", "standard_twin")} className="text-blue-500" />
                    <span className="text-sm">Standard, เตียงคู่</span>
                  </div>
                  <span className="text-sm font-medium">฿0</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={r.selectedOption === "standard_single"} onChange={() => handleRoomChange(r.id, "selectedOption", "standard_single")} className="text-blue-500" />
                    <span className="text-sm">Standard, เตียงเดี่ยว</span>
                  </div>
                  <span className="text-sm font-medium">฿0</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={r.selectedOption === "deluxe_twin"} onChange={() => handleRoomChange(r.id, "selectedOption", "deluxe_twin")} className="text-blue-500" />
                    <span className="text-sm">Deluxe, เตียงคู่</span>
                  </div>
                  <span className="text-sm font-medium">฿2,000</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={r.selectedOption === "suite_single"} onChange={() => handleRoomChange(r.id, "selectedOption", "suite_single")} className="text-blue-500" />
                    <span className="text-sm">Suite, เตียงเดี่ยว</span>
                  </div>
                  <span className="text-sm font-medium">฿4,000</span>
                </label>
              </div>
              
              <div className="font-bold text-sm text-gray-900 mb-2">ต้องการเตียงเสริมหรือไม่ ?</div>
              <label className="flex items-center justify-between cursor-pointer mb-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={r.extraBed} onChange={(e) => handleRoomChange(r.id, "extraBed", e.target.checked)} className="text-blue-500 rounded" />
                  <span className="text-sm">เพิ่มเตียง</span>
                </div>
                <span className="text-sm font-medium">฿ 500</span>
              </label>
            </div>
          ))}
          
          <button onClick={addRoom} className="text-[#798E75] font-bold text-sm w-full text-left flex items-center justify-between mt-2">
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

function ParticipantForm({ data, onChange }: { data: ParticipantData, onChange: (field: keyof ParticipantData, value: any) => void }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>Line Id</label>
          <input type="text" value={data.lineId} onChange={e => onChange("lineId", e.target.value)} className="bg-gray-100 border-none rounded-lg p-2.5 text-sm" placeholder="LineID0001" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>ระดับผู้เล่น</label>
          <select value={data.level} onChange={e => onChange("level", e.target.value)} className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
            <option value="Level 1">Level 1</option>
            <option value="Level 2">Level 2</option>
            <option value="Level 3">Level 3</option>
          </select>
        </div>
      </div>
      
      {/* Row 2 */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>เลขบัตรประชาชน/เลขพาสปอร์ต</label>
        <div className="relative">
          <input type="text" value={data.idCard} onChange={e => onChange("idCard", e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="1234567890123" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v2a3 3 0 1 1 0 6v2c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"></path></svg></div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>สัญชาติ</label>
          <select value={data.nationality} onChange={e => onChange("nationality", e.target.value)} className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
            <option value="ไทย">ไทย</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>วันเดือนปีเกิด</label>
          <input type="date" value={data.birthDate} onChange={e => onChange("birthDate", e.target.value)} className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm" />
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>ชื่อ</label>
          <input type="text" value={data.firstName} onChange={e => onChange("firstName", e.target.value)} className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="พัชราภา" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>นามสกุล</label>
          <input type="text" value={data.lastName} onChange={e => onChange("lastName", e.target.value)} className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="ภิรมย์ภักดี" />
        </div>
      </div>

      {/* Row 5 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>เพศ</label>
          <div className="flex gap-2">
            <button onClick={() => onChange("gender", "male")} className={`flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-1 ${data.gender === "male" ? "bg-[#354359] text-white border-[#354359]" : "border-gray-200"}`}>♂ ชาย</button>
            <button onClick={() => onChange("gender", "female")} className={`flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-1 ${data.gender === "female" ? "bg-[#354359] text-white border-[#354359]" : "border-gray-200"}`}>♀ หญิง</button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>เบอร์โทรศัพท์</label>
          <input type="tel" value={data.telephone} onChange={e => onChange("telephone", e.target.value)} className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="0899999999" />
        </div>
      </div>

      {/* Row 6 */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>อีเมล์</label>
        <input type="email" value={data.email} onChange={e => onChange("email", e.target.value)} className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="patcharapa1992@gmail.com" />
      </div>

      {/* Medical Info */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={data.hasDisease} onChange={e => onChange("hasDisease", e.target.checked)} className="text-[#798E75] rounded w-4 h-4" />
          <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>มีโรคประจำตัวหรือไม่ ?</label>
        </div>
        <input type="text" disabled={!data.hasDisease} value={data.diseaseDetail} onChange={e => onChange("diseaseDetail", e.target.value)} className={`border rounded-lg p-2 text-sm ${!data.hasDisease ? "bg-gray-100 border-transparent text-gray-400" : "bg-white border-gray-200"}`} placeholder="ระบุโรคประจำตัว..." />

        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" checked={data.hasAllergy} onChange={e => onChange("hasAllergy", e.target.checked)} className="text-[#798E75] rounded w-4 h-4" />
          <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>แพ้อาหารหรือไม่ ?</label>
        </div>
        <input type="text" disabled={!data.hasAllergy} value={data.allergyDetail} onChange={e => onChange("allergyDetail", e.target.value)} className={`border rounded-lg p-2 text-sm ${!data.hasAllergy ? "bg-gray-100 border-transparent text-gray-400" : "bg-white border-gray-200"}`} placeholder="ปลาหมึก, หอยนางรม" />
      </div>

      {/* Physical Info */}
      <div className="mt-4">
        <h4 className="text-sm font-bold text-[#798E75] mb-3">ข้อมูลอื่นๆ</h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>น้ำหนัก (kg)</label>
            <select value={data.weight} onChange={e => onChange("weight", e.target.value)} className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
              <option value="65">65</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>ส่วนสูง (cm)</label>
            <select value={data.height} onChange={e => onChange("height", e.target.value)} className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
              <option value="171">171</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>Size หมวก (us)</label>
            <select value={data.hatSize} onChange={e => onChange("hatSize", e.target.value)} className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
              <option value="8.5">8.5</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>Size ถุงมือ (us)</label>
            <select value={data.gloveSize} onChange={e => onChange("gloveSize", e.target.value)} className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
              <option value="8">8</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-800"><span className="text-red-500">*</span>Size รองเท้า (us)</label>
            <select value={data.shoeSize} onChange={e => onChange("shoeSize", e.target.value)} className="bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
              <option value="7">7</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Rental */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-bold text-gray-900">เช่าอุปกรณ์ Snowboard</h4>
          <span className="text-xs font-bold text-[#798E75]">(฿ 1,040)</span>
        </div>
        <p className="text-[11px] text-gray-400 mb-3">
          (การเช่าอุปกรณ์สามารถจ่ายได้ในวันเดินทาง และค่าอุปกรณ์ที่ระบุเป็นต่อชิ้น อาจมีการเปลี่ยนแปลง)
        </p>
        <div className="space-y-2">
          <label className="flex items-center justify-between">
            <div className="flex items-center gap-2"><input type="checkbox" checked={data.rentSnowboard} onChange={e => onChange("rentSnowboard", e.target.checked)} className="text-blue-500" /> <span className="text-sm">แผ่นสโนว์บอร์ด</span></div>
            <span className="text-sm font-medium">฿0</span>
          </label>
          <label className="flex items-center justify-between">
            <div className="flex items-center gap-2"><input type="checkbox" checked={data.rentBoots} onChange={e => onChange("rentBoots", e.target.checked)} className="text-blue-500" /> <span className="text-sm">รองเท้าบูท</span></div>
            <span className="text-sm font-medium">฿900</span>
          </label>
          <label className="flex items-center justify-between">
            <div className="flex items-center gap-2"><input type="checkbox" checked={data.rentKneePads} onChange={e => onChange("rentKneePads", e.target.checked)} className="text-blue-500" /> <span className="text-sm">กันกระแทกเข่า</span></div>
            <span className="text-sm font-medium">฿250</span>
          </label>
          <label className="flex items-center justify-between">
            <div className="flex items-center gap-2"><input type="checkbox" checked={data.rentPants} onChange={e => onChange("rentPants", e.target.checked)} className="text-blue-500" /> <span className="text-sm">กางเกงกันเปื้อน</span></div>
            <span className="text-sm font-medium">฿500</span>
          </label>
        </div>
      </div>

      {/* Extra Services */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-bold text-gray-900">ค่าบริการเพิ่มเติมอื่นๆ</h4>
          <span className="text-xs font-medium text-gray-400">(Optional)</span>
        </div>
        <div className="space-y-2">
          <label className="flex items-center justify-between">
            <div className="flex items-center gap-2"><input type="checkbox" checked={data.extraInsurance3} onChange={e => onChange("extraInsurance3", e.target.checked)} className="text-gray-400" /> <span className="text-sm">ทำประกันภัยชั้น 3</span></div>
            <span className="text-sm font-medium">฿0</span>
          </label>
          <label className="flex items-center justify-between">
            <div className="flex items-center gap-2"><input type="checkbox" checked={data.extraInsurance1} onChange={e => onChange("extraInsurance1", e.target.checked)} className="text-blue-500" /> <span className="text-sm">ทำประกันภัยชั้น 1</span></div>
            <span className="text-sm font-medium">฿1,250</span>
          </label>
          <label className="flex items-center justify-between">
            <div className="flex items-center gap-2"><input type="checkbox" checked={data.extraPhoto} onChange={e => onChange("extraPhoto", e.target.checked)} className="text-gray-400" /> <span className="text-sm">ช่างภาพถ่ายรูปตลอดทริป</span></div>
            <span className="text-sm font-medium">฿3,000</span>
          </label>
        </div>
      </div>
    </div>
  )
}

function createEmptyParticipant(type: "adult" | "child", index: number): ParticipantData {
  return {
    id: `${type}-${index}`,
    type,
    index,
    lineId: "",
    level: "Level 1",
    idCard: "",
    nationality: "ไทย",
    birthDate: "",
    firstName: "",
    lastName: "",
    gender: "male",
    telephone: "",
    email: "",
    hasDisease: false,
    diseaseDetail: "",
    hasAllergy: false,
    allergyDetail: "",
    weight: "65",
    height: "171",
    hatSize: "8.5",
    gloveSize: "8",
    shoeSize: "7",
    rentSnowboard: false,
    rentBoots: false,
    rentKneePads: false,
    rentPants: false,
    extraInsurance3: false,
    extraInsurance1: false,
    extraPhoto: false,
  }
}
