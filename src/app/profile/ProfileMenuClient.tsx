"use client"

import { useState } from "react"
import { User } from "@/types/model"
import { EditProfileModal } from "@/components/Profile/EditProfileModal"
import { User as UserIcon, LogOut, ChevronRight } from "lucide-react"

interface ProfileMenuClientProps {
  user: User
}

export default function ProfileMenuClient({ user }: ProfileMenuClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLogout = () => {
    window.location.href = "/signout"
  }

  return (
    <>
      <div className="flex flex-col">
        {/* Edit Profile Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-between py-4 border-b border-white/10 hover:bg-white/5 transition-colors rounded-xl px-2 -mx-2 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
              <UserIcon size={20} className="text-[#86EFAC]" />
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-[16px] mb-0.5">แก้ไขข้อมูลส่วนตัว</div>
              <div className="text-white/60 text-xs md:text-sm">เบอร์โทร, อีเมล, น้ำหนัก, ส่วนสูง</div>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/40" />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-between py-4 hover:bg-white/5 transition-colors rounded-xl px-2 -mx-2 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
              <LogOut size={20} className="text-[#E86034]" />
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-[16px] mb-0.5">ออกจากระบบ</div>
              <div className="text-white/60 text-xs md:text-sm">Logout ออกจากบัญชีนี้</div>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/40" />
        </button>
      </div>

      <EditProfileModal user={user} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
