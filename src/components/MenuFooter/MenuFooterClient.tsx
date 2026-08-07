"use client"

import { Briefcase, Headset, Home, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function MenuFooterClient() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "หน้าแรก", icon: Home },
    { href: "/mytrip", label: "ทริปของฉัน", icon: Briefcase },
    { href: "/contact", label: "ติดต่อเจ้าหน้าที่", icon: Headset },
    { href: "/profile", label: "โปรไฟล์", icon: User },
  ]

  return (
    <div className="fixed -bottom-1 left-0 right-0 max-w-[480px] lg:max-w-[700px] mx-auto bg-footer rounded-t-3xl px-6 py-4 flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.1)] z-50">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <Icon
              size={24}
              className={`transition-colors ${
                isActive ? "text-[#4F7354]" : "text-gray-400 group-hover:text-gray-300"
              }`}
            />
            <span
              className={`text-[10px] font-medium transition-colors ${
                isActive ? "text-[#4F7354]" : "text-gray-400 group-hover:text-gray-300"
              }`}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
