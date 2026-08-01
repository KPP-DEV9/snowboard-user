import Breadcrumbs from "@/components/Breadcrumbs"
import { getUser } from "@/app/actions/auth"
import { Card } from "@/components/Ui/Card/Card"
import { Button } from "@/components/Ui/Button/Button"
import Link from "next/link"
import { EditProfileButton } from "@/components/Profile/EditProfileButton"
import { RenderDate } from "@/lib/date"

import { Mail, Contact, User, Phone, Star, CheckCircle, LogOut } from "lucide-react"

export default async function ProfilePage() {
  const user = await getUser()
  if (!user) return null

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col min-h-screen pb-[100px] gap-6 animate-fade-in">
      <Breadcrumbs title={"โปรไฟล์ของคุณ"} step={"PROFILE"} />

      {/* Hero Section */}
      <Card className="flex flex-col md:flex-row items-center p-8 gap-8 relative overflow-hidden bg-gradient-to-br from-card-bg to-background border-gold/20 shadow-lg shadow-gold/5 group">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110"></div>

        {/* Avatar */}
        <div className="relative z-10 shrink-0">
          <div className="relative">
            {user.student_profile?.image_profile ? (
              <img
                src={user.student_profile.image_profile}
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gold/80 object-cover shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gold/80 flex items-center justify-center bg-card-bg/80 text-gold text-5xl font-bold shadow-[0_0_25px_rgba(212,175,55,0.4)] backdrop-blur-sm transition-transform duration-300 hover:scale-105">
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="Profile"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gold/80 object-cover shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <>{user.first_name?.[0] || user.nickname?.[0] || "U"}</>
                )}
              </div>
            )}
            <div className="absolute inset-0 rounded-full ring-1 ring-gold/20 inset-ring"></div>
          </div>
        </div>

        {/* User Info */}
        <div className="text-center md:text-left z-10 flex-1">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight drop-shadow-md">
            {user.first_name
              ? `${user.first_name} ${user.last_name || ""}`
              : user.nickname || "ผู้ใช้ไม่ทราบชื่อ"}
          </h2>
          <p className="text-gold/80 text-lg mt-2 font-medium flex items-center justify-center md:justify-start gap-2">
            <Mail />
            {user.email}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              สถานะ: {user.is_active ? "ใช้งานปกติ" : "ไม่ได้เปิดใช้งาน"}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Contact Info Card */}
        <Card className="p-6 relative overflow-hidden backdrop-blur-md bg-card-bg/90 border-card-border hover:border-gold/30 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gold mb-6 flex items-center gap-2 drop-shadow-sm">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Contact className="w-5 h-5" />
            </div>
            ข้อมูลการติดต่อ
          </h3>

          <div className="flex flex-col gap-4">
            <div className="group flex flex-col p-4 rounded-xl bg-background/40 border border-card-border/50 hover:bg-background/60 hover:border-gold/30 transition-all">
              <label className="text-xs text-text-muted font-medium mb-1 uppercase tracking-wider">
                ชื่อเล่น
              </label>
              <div className="flex items-center gap-3">
                <User className="w-[18px] h-[18px] text-gold/60" />
                <p className="text-base text-foreground font-semibold">{user.nickname || "-"}</p>
              </div>
            </div>

            <div className="group flex flex-col p-4 rounded-xl bg-background/40 border border-card-border/50 hover:bg-background/60 hover:border-gold/30 transition-all">
              <label className="text-xs text-text-muted font-medium mb-1 uppercase tracking-wider">
                เบอร์โทรศัพท์
              </label>
              <div className="flex items-center gap-3">
                <Phone className="w-[18px] h-[18px] text-gold/60" />
                <p className="text-base text-foreground font-semibold">{user.telephone || "-"}</p>
              </div>
            </div>
            <div className="group flex flex-col p-4 rounded-xl bg-background/40 border border-card-border/50 hover:bg-background/60 hover:border-gold/30 transition-all">
              <label className="text-xs text-text-muted font-medium mb-1 uppercase tracking-wider">
                เพศ
              </label>
              <div className="flex items-center gap-3">
                <User className="w-[18px] h-[18px] text-gold/60" />
                <p className="text-base text-foreground font-semibold">
                  {user.sex === "male"
                    ? "ชาย"
                    : user.sex === "female"
                      ? "หญิง"
                      : user.sex === "other"
                        ? "อื่นๆ"
                        : "-"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Student/Professional Profile */}
        <Card className="p-6 relative overflow-hidden backdrop-blur-md bg-card-bg/90 border-card-border hover:border-gold/30 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gold mb-6 flex items-center gap-2 drop-shadow-sm">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
            ข้อมูลเชิงลึก
          </h3>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="group flex flex-col p-4 rounded-xl bg-background/40 border border-card-border/50 hover:bg-background/60 hover:border-gold/30 transition-all">
                <label className="text-xs text-text-muted font-medium mb-1 uppercase tracking-wider">
                  วันที่สมัคร
                </label>
                <p className="text-xl ">
                  {user.student_profile?.created_at
                    ? `${RenderDate(user.student_profile.created_at, "dd MMM yyyy")}`
                    : "-"}
                </p>
              </div>
              <div className="group flex flex-col p-4 rounded-xl bg-background/40 border border-card-border/50 hover:bg-background/60 hover:border-gold/30 transition-all">
                <label className="text-xs text-text-muted font-medium mb-1 uppercase tracking-wider">
                  ประสบการณ์
                </label>
                <p className="text-xl text-foreground ">
                  {user.student_profile?.experience_years
                    ? `${user.student_profile.experience_years} ปี`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="group flex flex-col p-4 rounded-xl bg-background/40 border border-card-border/50 hover:bg-background/60 hover:border-gold/30 transition-all">
              <label className="text-xs text-text-muted font-medium mb-1 uppercase tracking-wider">
                ความเชี่ยวชาญ
              </label>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-[18px] h-[18px] text-gold/60 shrink-0" />
                <p className="text-base text-foreground font-semibold">
                  {user.student_profile?.speciality || "ไม่ได้ระบุ"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <EditProfileButton user={user} />

      <div className="mt-3 flex justify-center">
        <Link href="/signout" passHref className="w-full md:w-auto min-w-[200px]">
          <Button
            variant="outline"
            className="w-full text-red-400 border-red-500/30 bg-red-500/5 hover:bg-red-500/15 hover:border-red-500/60 hover:text-red-300 transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] rounded-xl py-6"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-semibold text-base">ออกจากระบบ</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
