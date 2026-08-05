"use client"

import { useState } from "react"
import { Button } from "@/components/Ui/Button/Button"
import { User } from "@/types/user"
import { updateUserProfile } from "@/app/actions/userProfile"
import { X } from "lucide-react"

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
    speciality: user.student_profile?.speciality || "",
    hourly_rate: user.student_profile?.hourly_rate || 0,
    experience_years: user.student_profile?.experience_years || 0,
    image_profile: user.student_profile?.image_profile || "",
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
      const res = await updateUserProfile(formData)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pb-20">
      <div className="bg-card-bg w-full max-w-md rounded-2xl border border-card-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-card-border/50">
          <h2 className="text-lg font-bold text-foreground">แก้ไขโปรไฟล์</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-foreground transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="edit-profile-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              {formData.image_profile && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={formData.image_profile}
                    alt="Profile Preview"
                    className="w-24 h-24 object-cover rounded-full border-2 border-gold/50"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/150?text=Invalid+Image"
                    }}
                  />
                </div>
              )}
              <label className="text-sm font-medium text-text-muted">รูปโปรไฟล์ (URL)</label>
              <input
                type="text"
                name="image_profile"
                value={formData.image_profile}
                onChange={handleChange}
                className="w-full bg-background/50 border border-card-border/50 rounded-lg p-3 text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">ชื่อจริง</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full bg-background/50 border border-card-border/50 rounded-lg p-3 text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                placeholder="ชื่อจริง"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">นามสกุล</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full bg-background/50 border border-card-border/50 rounded-lg p-3 text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                placeholder="นามสกุล"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">ชื่อเล่น</label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full bg-background/50 border border-card-border/50 rounded-lg p-3 text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                placeholder="ชื่อเล่น"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">อีเมล</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-background/50 border border-card-border/50 rounded-lg p-3 text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                placeholder="อีเมล"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full bg-background/50 border border-card-border/50 rounded-lg p-3 text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                placeholder="เบอร์โทรศัพท์"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-muted">เพศ</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sex: e.target.value }))}
                  className="w-full bg-background/50 border border-card-border/50 rounded-lg p-3 text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all appearance-none"
                >
                  <option value="" disabled>
                    เลือกเพศ
                  </option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-muted">ประสบการณ์ (ปี)</label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  className="w-full bg-background/50 border border-card-border/50 rounded-lg p-3 text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">
                ความเชี่ยวชาญพิเศษ (Speciality)
              </label>
              <textarea
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                rows={8}
                className="w-full bg-background/50 border border-card-border/50 rounded-lg p-3 text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all resize-none"
                placeholder="เช่น การพัตต์, ไดร์ฟเวอร"
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-card-border/50 bg-background/30 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            form="edit-profile-form"
            className="flex-1 bg-gold text-black hover:bg-gold-hover border-none"
            disabled={isLoading}
          >
            {isLoading ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </div>
      </div>
    </div>
  )
}
