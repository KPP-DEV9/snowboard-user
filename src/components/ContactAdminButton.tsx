"use client"

import { useEffect, useState } from "react"
import { getUser } from "@/app/actions/auth"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Headset } from "lucide-react"
import { User as UserType } from "@/types/user"

interface ContactAdminButtonProps {
  initialUser?: UserType | null
}

export default function ContactAdminButton({ initialUser }: ContactAdminButtonProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<UserType | null>(initialUser ?? null)

  useEffect(() => {
    if (initialUser !== undefined) {
      setUser(initialUser)
    }
  }, [initialUser])

  useEffect(() => {
    getUser()
      .then((u) => {
        setUser(u as UserType | null)
      })
      .catch(() => {})
  }, [pathname])

  // ไม่แสดงถ้ามีการล็อกอินแล้ว หรืออยู่ในหน้า /contact อยู่แล้ว
  if (user || pathname === "/contact") {
    return null
  }

  return (
    <Link
      href="/contact"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#4F7354] hover:bg-[#3f5d44] text-white px-4 py-3 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_30px_rgba(79,115,84,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 group border border-white/20 backdrop-blur-sm cursor-pointer"
      title="ติดต่อแอดมิน"
      aria-label="ติดต่อแอดมิน"
    >
      <div className="relative flex items-center justify-center">
        <Headset size={22} className="text-white" />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#4F7354] rounded-full" />
      </div>
      <span className="text-sm font-bold tracking-wide">ติดต่อแอดมิน</span>
    </Link>
  )
}
