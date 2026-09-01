"use client"

import { useState } from "react"
import { User } from "@/types/user"
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
          className="flex items-center justify-between py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-xl px-2 -mx-2"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EAF3EA] flex items-center justify-center shrink-0">
              <UserIcon size={20} className="text-[#798E75]" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-900 text-[15px] mb-0.5">แก้ไขข้อมูลส่วนตัว</div>
              <div className="text-gray-400 text-sm">เบอร์โทร, อีเมล, น้ำหนัก, ส่วนสูง</div>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-between py-5 hover:bg-gray-50 transition-colors rounded-xl px-2 -mx-2"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <LogOut size={20} className="text-gray-400" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-900 text-[15px] mb-0.5">ออกจากระบบ</div>
              <div className="text-gray-400 text-sm">Logout ออกจากบัญชีนี้</div>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      <EditProfileModal user={user} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
