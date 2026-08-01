"use client"

import { useState } from "react"
import { Button } from "@/components/Ui/Button/Button"
import { User } from "@/types/user"
import { EditProfileModal } from "./EditProfileModal"
import { Edit } from "lucide-react"

interface EditProfileButtonProps {
  user: User
}

export function EditProfileButton({ user }: EditProfileButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        className="bg-background/50 backdrop-blur border-card-border hover:bg-background/80 flex gap-2 items-center text-sm font-semibold rounded-full px-4"
        onClick={() => setIsModalOpen(true)}
      >
        <Edit className="w-3.5 h-3.5" />
        แก้ไขโปรไฟล์
      </Button>

      <EditProfileModal user={user} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
