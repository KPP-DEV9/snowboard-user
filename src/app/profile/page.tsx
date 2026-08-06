import { getUser } from "@/app/actions/auth"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Logo from "@/components/Logo"
import ProfileMenuClient from "./ProfileMenuClient"
import LevelBadge from "@/components/LevelBadge"

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) return null

  const fullName = user.first_name
    ? `${user.first_name} ${user.last_name || ""}`
    : user.nickname || "ผู้ใช้ไม่ทราบชื่อ"

  return (
    <div className="min-h-screen relative flex items-center overflow-x-hidden font-sans">
      {/* Background Image with Tint */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center md:bg-right mix-blend-multiply opacity-50 bg-[#859877]"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=1200&auto=format&fit=crop")',
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-[#859877]/80"></div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 z-10 relative flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24 pt-12 pb-32">
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start text-white w-full">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold mb-2 hover:opacity-80 transition-opacity text-sm md:text-base"
          >
            <ArrowLeft size={20} className="stroke-[3]" /> ย้อนกลับ
          </Link>

          <div className="mb-4">
            <Logo />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6 mb-2">Snowvibes Travel</h1>
          <h2 className="text-xl md:text-2xl font-medium text-white/90 mb-4">
            Ski & Snowboard Trip
          </h2>
          <p className="text-white/80">ทริปสุดพิเศษต้อง SnowVibes</p>
        </div>

        {/* Right Content - Profile Menu Card */}
        <div className="flex-1 w-full max-w-md">
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl md:text-2xl font-bold text-[#357948]">โปรไฟล์ของฉัน</h3>
              <LevelBadge level={user?.level} />
            </div>
            <p className="text-gray-500 text-sm md:text-base font-medium mb-8">
              ข้อมูลของคุณ{fullName}
            </p>

            <ProfileMenuClient user={user} />

            <div className="mt-16 text-center text-[10px] md:text-xs text-gray-400 font-medium">
              Snowvibes Co., Ltd. • Snowwhite by Snowvibes
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
