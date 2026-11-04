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
    <div className="fixed bottom-4 left-0 right-0 max-w-[360px] md:max-w-[420px] mx-auto bg-[#141F29]/90 backdrop-blur-md rounded-2xl md:rounded-3xl px-6 py-2.5 flex justify-between items-center shadow-2xl border border-white/10 z-50">
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
              size={20}
              className={`transition-colors ${
                isActive ? "text-[#38BDF8]" : "text-gray-400 group-hover:text-gray-200"
              }`}
            />
            <span
              className={`text-[10px] font-medium transition-colors ${
                isActive ? "text-[#38BDF8]" : "text-gray-400 group-hover:text-gray-200"
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
