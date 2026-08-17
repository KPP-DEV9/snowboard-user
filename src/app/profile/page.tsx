import { getUser } from "@/app/actions/auth"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Logo from "@/components/Logo"
import ProfileMenuClient from "./ProfileMenuClient"
import LevelBadge from "@/components/LevelBadge"
import LayoutPage from "@/components/Layout"

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) return null

  const fullName =
    user?.user_profile?.first_name || user.nickname + " " + user?.user_profile?.last_name || "-"

  return (
    <LayoutPage isLicense={false}>
      <div className="flex items-center overflow-x-hidden font-sans">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 z-10 relative flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24 pt-12 pb-32">
          {/* Left Content */}
          <div className="flex-1 flex flex-col items-start text-black w-full text-white">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold mb-2 hover:opacity-80 transition-opacity text-sm md:text-base"
            >
              <ArrowLeft size={20} className="stroke-[3]" /> ย้อนกลับ
            </Link>
            <Logo />
          </div>

          {/* Right Content - Profile Menu Card */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl md:text-2xl font-bold text-[#798E75]">โปรไฟล์ของฉัน</h3>
                <LevelBadge level={user?.user_profile?.level} />
              </div>
              <p className="text-gray-500 text-sm md:text-base font-medium mb-8">
                ข้อมูลของคุณ {fullName}
              </p>

              <ProfileMenuClient user={user} />

              <div className="mt-16 text-center text-[10px] md:text-xs text-gray-400 font-medium">
                Snowvibes Co., Ltd. • Snowwhite by Snowvibes
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutPage>
  )
}
