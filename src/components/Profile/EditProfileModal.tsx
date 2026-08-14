"use client"

import { useState } from "react"
import { User } from "@/types/user"
import { updateUserProfile } from "@/app/actions/userProfile"
import { X, CalendarDays, ScanLine } from "lucide-react"

interface EditProfileModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

export function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    // ข้อมูลจากระดับ User
    nickname: user?.nickname || "",
    image_profile: user?.profile_image || "",

    // ข้อมูลส่วนตัว / ข้อมูลติดต่อ
    first_name: user?.user_profile?.first_name || "",
    last_name: user?.user_profile?.last_name || "",
    email: user?.user_profile?.email || "",
    telephone: user?.user_profile?.telephone || "",
    sex: user?.user_profile?.sex || "Male",
    birth_date: user?.user_profile?.birth_date
      ? (user.user_profile.birth_date instanceof Date
          ? user.user_profile.birth_date.toISOString()
          : String(user.user_profile.birth_date)
        ).split("T")[0]
      : "",
    nation: user?.user_profile?.nation || "",

    // เอกสารประจำตัว & ข้อมูลภาษี/ที่อยู่ (เพิ่ม tax_id, address)
    id_card: user?.user_profile?.id_card || "",
    passport_no: user?.user_profile?.passport_no || "",
    tax_id: user?.user_profile?.tax_id || "",
    address: user?.user_profile?.address || "",

    // ทักษะ & ขนาดร่างกาย
    level: user?.user_profile?.level || "Beginner",
    weight: user?.user_profile?.weight || 0,
    height: user?.user_profile?.height || 0,
    head_size: user?.user_profile?.head_size || "",
    glove_size: user?.user_profile?.glove_size || "",
    shoe_size: user?.user_profile?.shoe_size || "",

    // ข้อมูลสุขภาพ / ประวัติแพ้
    has_disease: !!user?.user_profile?.underlying_disease,
    disease_detail: user?.user_profile?.underlying_disease || "",
    has_allergy: !!user?.user_profile?.food_allergies,
    allergy_detail: user?.user_profile?.food_allergies || "",
  })

  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // NOTE: We only send fields that are supported by the backend right now
      const payload = {
        // ข้อมูลส่วนตัว / ติดต่อ
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        telephone: formData.telephone,
        email: formData.email || null, // เพิ่ม
        sex: formData.sex,
        birth_date: formData.birth_date || null,
        nation: formData.nation,
        // เอกสารประจำตัว & ข้อมูลภาษี/ที่อยู่
        id_card: formData.id_card || null,
        passport_no: formData.passport_no || null,
        tax_id: formData.tax_id || null, // เพิ่ม
        address: formData.address || null, // เพิ่ม
        // ทักษะ & ไซส์ร่างกาย
        level: formData.level,
        weight: Number(formData.weight) || 0,
        height: Number(formData.height) || 0,
        head_size: formData.head_size,
        glove_size: formData.glove_size,
        shoe_size: formData.shoe_size,
        // ประวัติสุขภาพ / แพ้อาหาร (แมปให้ตรงกับ json tag ของ Go)
        underlying_disease: formData.has_disease ? formData.disease_detail : "",
        food_allergies: formData.has_allergy ? formData.allergy_detail : "",
      }

      const res = await updateUserProfile(payload)
      if (res.success) {
        onClose()
      } else {
        alert(res.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล")
      }
    } catch (error) {
      console.error(error)
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pb-16">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-xl font-bold text-[#4F7354]">แก้ไขข้อมูลโปรไฟล์</h2>
          <button
            onClick={onClose}
            className="bg-black text-white rounded-full p-1.5 hover:opacity-80 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          <form id="edit-profile-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* ID Card */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">เลขบัตรประชาชน</label>
              <div className="relative">
                <input
                  type="text"
                  name="id_card"
                  value={formData.id_card}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 pr-10 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all placeholder:text-gray-400"
                  placeholder="เลขบัตรประชาชน 13 หลัก"
                />
                <ScanLine className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
              </div>
            </div>

            {/* Passport No */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">เลขพาสปอร์ต</label>
              <input
                type="text"
                name="passport_no"
                value={formData.passport_no}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all placeholder:text-gray-400"
                placeholder="เลขพาสปอร์ต"
              />
            </div>

            {/* Tax ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">เลขประจำตัวผู้เสียภาษี</label>
              <input
                type="text"
                name="tax_id"
                value={formData.tax_id}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all placeholder:text-gray-400"
                placeholder="เลขประจำตัวผู้เสียภาษี 13 หลัก"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">ที่อยู่</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all placeholder:text-gray-400 resize-none"
                placeholder="บ้านเลขที่ หมู่ ซอย ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
              />
            </div>

            {/* Nationality & Birth Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-900">สัญชาติ</label>
                <select
                  name="nation"
                  value={formData.nation}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center]"
                >
                  <option value="" disabled>
                    เลือก
                  </option>
                  <option value="thai">ไทย</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-900">วันเดือนปีเกิด</label>
                <div className="relative">
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    onClick={(e) => {
                      try {
                        if ("showPicker" in HTMLInputElement.prototype) {
                          ;(e.target as HTMLInputElement).showPicker()
                        }
                      } catch (err) {}
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 pr-10 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-900">ชื่อ</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-900">นามสกุล</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all"
                />
              </div>
            </div>

            {/* Nickname & Telephone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-900">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all"
                  placeholder="080xxxxxxx"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-900">อีเมล์</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all placeholder:text-gray-400"
                  placeholder="อีเมล..."
                />
              </div>
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">เพศ</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, sex: "male" }))}
                  className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border ${
                    formData.sex === "male"
                      ? "bg-[#354359] text-white border-[#354359]"
                      : "bg-white text-gray-800 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg">♂</span> ชาย
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, sex: "female" }))}
                  className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border ${
                    formData.sex === "female"
                      ? "bg-[#354359] text-white border-[#354359]"
                      : "bg-white text-gray-800 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg">♀</span> หญิง
                </button>
              </div>
            </div>

            {/* Player Level */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">ระดับผู้เล่น</label>
              <div className="w-1/2 pr-2">
                <input
                  type="text"
                  value={formData.level}
                  disabled
                  className="w-full bg-gray-200/60 border border-transparent rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.has_disease}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, has_disease: e.target.checked }))
                    }
                    className="w-4 h-4 text-[#798E75] bg-white border-gray-300 rounded focus:ring-[#798E75] cursor-pointer"
                  />
                  <span>
                    <span className="text-red-500">*</span>มีโรคประจำตัวหรือไม่ ?
                  </span>
                </label>
                <input
                  type="text"
                  name="disease_detail"
                  value={formData.disease_detail}
                  onChange={handleChange}
                  disabled={!formData.has_disease}
                  className={`w-full border rounded-xl p-3 text-sm transition-all outline-none ${
                    !formData.has_disease
                      ? "bg-gray-200/60 border-transparent text-gray-500 cursor-not-allowed"
                      : "bg-white border-gray-200 text-gray-900 focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354]"
                  }`}
                  placeholder="ระบุโรคประจำตัว..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.has_allergy}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, has_allergy: e.target.checked }))
                    }
                    className="w-4 h-4 text-[#798E75] bg-white border-gray-300 rounded focus:ring-[#798E75] cursor-pointer"
                  />
                  <span>
                    <span className="text-red-500">*</span>แพ้อาหารหรือไม่ ?
                  </span>
                </label>
                <input
                  type="text"
                  name="allergy_detail"
                  value={formData.allergy_detail}
                  onChange={handleChange}
                  disabled={!formData.has_allergy}
                  className={`w-full border rounded-xl p-3 text-sm transition-all outline-none ${
                    !formData.has_allergy
                      ? "bg-gray-200/60 border-transparent text-gray-500 cursor-not-allowed"
                      : "bg-white border-gray-200 text-gray-900 focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354]"
                  }`}
                  placeholder="ระบุอาการแพ้..."
                />
              </div>
            </div>

            {/* Other Information Section */}
            <div className="mt-2">
              <h3 className="text-lg font-bold text-[#4F7354] mb-4">ข้อมูลอื่นๆ</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-900">น้ำหนัก (kg)</label>
                  <select
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center]"
                  >
                    <option value="00">00</option>
                    {Array.from({ length: 100 }, (_, i) => i + 30).map((w) => (
                      <option key={w} value={w.toString()}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-900">ส่วนสูง (cm)</label>
                  <select
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center]"
                  >
                    <option value="00">00</option>
                    {Array.from({ length: 100 }, (_, i) => i + 100).map((h) => (
                      <option key={h} value={h.toString()}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-900">Size หมวก (us)</label>
                  <select
                    name="head_size"
                    value={formData.head_size}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center]"
                  >
                    <option value="" disabled>
                      เลือก
                    </option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-900">Size ถุงมือ (us)</label>
                  <select
                    name="glove_size"
                    value={formData.glove_size}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center]"
                  >
                    <option value="" disabled>
                      เลือก
                    </option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-900">Size รองเท้า (us)</label>
                  <select
                    name="shoe_size"
                    value={formData.shoe_size}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center]"
                  >
                    <option value="" disabled>
                      เลือก
                    </option>
                    {Array.from({ length: 50 }, (_, i) => i + 10).map((size) => (
                      <option key={size} value={size.toString()}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 mt-6 mb-2" />

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#1C1F22] hover:bg-black transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#5D8E61] hover:bg-[#4F7354] transition-colors"
              >
                {isLoading ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
