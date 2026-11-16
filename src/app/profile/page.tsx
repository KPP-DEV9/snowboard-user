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
    [user?.user_profile?.first_name, user?.user_profile?.last_name].filter(Boolean).join(" ") ||
    user.nickname ||
    "-"

  return (
    <LayoutPage isLicense={false}>
      <div className="min-h-screen pb-32 font-sans selection:bg-[#568759]/30 flex flex-col items-center">
        {/* Header Logo & Back Button */}
        <div className="pt-12 md:pt-16 pb-8 flex flex-col items-center justify-center w-full relative max-w-md px-4">
          <div className="w-full flex items-center mb-4">
            <Link
              href="/"
              className="text-white flex items-center gap-2 font-bold hover:opacity-80 transition-opacity text-sm md:text-base"
            >
              <ArrowLeft size={20} className="stroke-[3]" /> ย้อนกลับ
            </Link>
          </div>
          <Logo />
        </div>

        {/* Profile Menu Card */}
        <div className="w-full max-w-md px-4">
          <div className="bg-[#0A1A28]/40 backdrop-blur-md border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">โปรไฟล์ของฉัน</h3>
              <LevelBadge level={user?.user_profile?.level} />
            </div>
            <p className="text-white/70 text-sm md:text-base font-medium mb-6">
              ข้อมูลของคุณ {fullName}
            </p>

            <ProfileMenuClient user={user} />

            <div className="mt-12 pt-4 border-t border-white/10 text-center text-[11px] text-white/40 font-medium">
              Snowvibes Co., Ltd. • Snowwhite by Snowvibes
            </div>
          </div>
        </div>
      </div>
    </LayoutPage>
  )
}
