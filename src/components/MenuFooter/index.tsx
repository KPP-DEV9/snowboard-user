import { Briefcase, Headset, Home, User } from "lucide-react"
import Link from "next/link"
import { getUser } from "@/app/actions/auth"

export default async function MenuFooter() {
  const user = await getUser()

  if (!user) return null

  return (
    <div className="fixed -bottom-1 left-0 right-0 max-w-[480px] lg:max-w-[700px] mx-auto bg-[#1A1C18] rounded-t-3xl px-6 py-4 flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.1)] z-50">
      <Link href="/" className="flex flex-col items-center gap-1 cursor-pointer group">
        <Home size={24} className="text-[#4F7354]" />
        <span className="text-[#4F7354] text-[10px] font-medium">หน้าแรก</span>
      </Link>
      <Link href="/mytrip" className="flex flex-col items-center gap-1 cursor-pointer group">
        <Briefcase
          size={24}
          className="text-gray-400 group-hover:text-gray-300 transition-colors"
        />
        <span className="text-gray-400 text-[10px] font-medium group-hover:text-gray-300 transition-colors">
          ทริปของฉัน
        </span>
      </Link>
      <Link href="/contact" className="flex flex-col items-center gap-1 cursor-pointer group">
        <Headset size={24} className="text-gray-400 group-hover:text-gray-300 transition-colors" />
        <span className="text-gray-400 text-[10px] font-medium group-hover:text-gray-300 transition-colors">
          ติดต่อเจ้าหน้าที่
        </span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-1 cursor-pointer group">
        <User size={24} className="text-gray-400 group-hover:text-gray-300 transition-colors" />
        <span className="text-gray-400 text-[10px] font-medium group-hover:text-gray-300 transition-colors">
          โปรไฟล์
        </span>
      </Link>
    </div>
  )
}
