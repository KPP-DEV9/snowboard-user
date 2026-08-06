"use client"

import { useState } from "react"
import { Button } from "@/components/Ui/Button/Button"
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
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    nickname: user.nickname || "",
    email: user.email || "",
    telephone: user.telephone || "",
    sex: user.sex || "",
    image_profile: user.profile_image || user.student_profile?.image_profile || "",
    id_card: "", // Placeholder for design
    nationality: "", // Placeholder for design
    birth_date: "", // Placeholder for design
    level: user.level || "Level 1",
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
        first_name: formData.first_name,
        last_name: formData.last_name,
        nickname: formData.nickname,
        telephone: formData.telephone,
        sex: formData.sex,
        image_profile: formData.image_profile,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pb-16">
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
            {/* Profile Image URL */}
            {/* <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">รูปโปรไฟล์ (URL)</label>
              <input
                type="text"
                name="image_profile"
                value={formData.image_profile}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all"
                placeholder="https://example.com/image.jpg"
              />
            </div> */}

            {/* ID Card */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-900">เลขบัตรประชาชน/เลขพาสปอร์ต</label>
              <div className="relative">
                <input
                  type="text"
                  name="id_card"
                  value={formData.id_card}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 pr-10 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all placeholder:text-gray-400"
                  placeholder="เลขบัตรประชาชน/เลขพาสปอร์ต"
                />
                <ScanLine className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
              </div>
            </div>

            {/* Nationality & Birth Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-900">สัญชาติ</label>
                <select
                  name="nationality"
                  value={formData.nationality}
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
                <label className="text-sm font-bold text-gray-900">ชื่อเล่น</label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-900">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-400 focus:outline-none focus:border-[#4F7354] focus:ring-1 focus:ring-[#4F7354] transition-all"
                  placeholder="080xxxxxxx"
                />
              </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-900">ระดับผู้เล่น</label>
                <input
                  type="text"
                  value={formData.level}
                  disabled
                  className="w-full bg-gray-200/60 border border-transparent rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 my-2" />

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
