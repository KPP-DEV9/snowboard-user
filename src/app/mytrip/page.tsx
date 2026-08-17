import { getEnrollmentByUserID } from "@/app/actions/enrollment"
import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, CalendarDays, ChevronDown } from "lucide-react"
import { RenderDate } from "@/lib/date"
import numeral from "numeral"
import { Enrollment } from "@/types/enrollment"
import { Card } from "@/components/Ui/Card/Card"
import LayoutPage from "@/components/Layout"

export default async function MyTripPage() {
  const user = await getUser()
  if (!user) {
    redirect("/signin")
  }

  const { success, data } = await getEnrollmentByUserID(1, 10) // fetch up to 100 for now
  const enrollments: Enrollment[] = success && Array.isArray(data?.data) ? data.data : []

  // Status mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_payment":
        return (
          <div className="bg-[#FFF4E5] text-[#F04E23] px-3 py-1 rounded-md text-[11px] font-bold">
            รอชำระ
          </div>
        )
      case "paid":
        return (
          <div className="bg-[#E5F0FF] text-[#0056D2] px-3 py-1 rounded-md text-[11px] font-bold">
            ชำระแล้ว
          </div>
        )
      case "cancelled":
        return (
          <div className="bg-[#FFE5E5] text-[#F04E23] px-3 py-1 rounded-md text-[11px] font-bold">
            ยกเลิก
          </div>
        )
      default:
        return null
    }
  }

  return (
    <LayoutPage isLicense={false}>
      <div className="min-h-screen bg-[#304B65] pb-32 font-sans selection:bg-[#568759]/30">
        <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-6 max-w-5xl">
          {/* Header */}
          <div className="relative flex items-center justify-center mb-8">
            <Link
              href="/profile"
              className="absolute left-0 text-white font-bold flex items-center gap-2 hover:opacity-80 transition-opacity text-sm md:text-base"
            >
              <ArrowLeft size={20} className="stroke-[3]" /> ย้อนกลับ
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-white">ทริปของฉัน</h1>
          </div>

          {/* Tabs / Filters */}
          <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <button className="flex items-center gap-2 bg-white text-[#798E75] px-4 py-2 rounded-full text-sm font-bold shadow-sm whitespace-nowrap">
              ทริปทั้งหมด <ChevronDown size={16} />
            </button>
            <button className="bg-black/20 text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap hover:bg-black/30 transition-colors">
              เร็วๆ นี้
            </button>
            <button className="bg-black/20 text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap hover:bg-black/30 transition-colors">
              ทริปที่ผ่านมา
            </button>
          </div>

          {/* Trip Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {enrollments.length === 0 ? (
              <div className="col-span-full text-center py-12 text-white/80 bg-black/10 rounded-2xl font-medium mt-4">
                ยังไม่มีประวัติทริป
              </div>
            ) : (
              enrollments.map((enrollment) => {
                const course = enrollment.course || ({} as any)
                const totalAmount = course?.price || 0

                const programType = course?.course_type?.toLowerCase()?.includes("ski")
                  ? "Ski"
                  : "Snowboard"
                const tagColor = programType === "Ski" ? "bg-[#F59E0B]" : "bg-[#304B65]"
                const enrollmentCode = enrollment?.id
                  ? (enrollment.id.includes("-")
                      ? enrollment.id.split("-")[0]
                      : enrollment.id
                    ).toUpperCase()
                  : "-"

                return (
                  <Link
                    key={enrollment.id}
                    href={`/mytrip/${enrollment.id}`}
                    className="block group"
                  >
                    <Card className="bg-white rounded-[1.5rem] p-5 shadow-md border-none flex flex-col justify-between hover:shadow-xl transition-all duration-200 h-full">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`${tagColor} text-white text-[10px] font-bold px-2 py-0.5 rounded`}
                          >
                            {programType}
                          </span>
                          <span className="text-gray-400 text-xs font-medium">
                            เลขที่รายการ {enrollmentCode}
                          </span>
                        </div>

                        <h3 className="text-gray-900 font-bold text-lg leading-snug mb-3 group-hover:text-[#F04E23] transition-colors">
                          {course?.title || "คอร์สเรียน"}
                        </h3>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-gray-500 text-[13px] font-medium">
                            <MapPin size={16} /> {course?.district || "-"}, {course?.province || "-"}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-[13px] font-medium">
                            <CalendarDays size={16} /> {RenderDate(course?.start_date, "d MMMM yyyy")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        <div className="text-[11px] text-gray-400 font-medium">
                          {enrollment.status === "pending_payment" ? (
                            <>
                              ยอดชำระ {numeral(totalAmount).format("0,0.00")} | ชำระก่อน{" "}
                              {RenderDate(course.start_date, "d MMMM yyyy")}
                            </>
                          ) : (
                            <>&nbsp;</>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <div className="text-[10px] text-gray-400 font-medium text-right mb-[-4px]">
                            ราคาทริปทั้งหมด
                          </div>
                          <div className="text-[#798E75] font-bold text-[19px] md:text-xl">
                            <span className="text-[#798E75] text-sm md:text-base mr-0.5">฿</span>
                            {numeral(totalAmount).format("0,0.00")}
                          </div>
                          {getStatusBadge(enrollment.status)}
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </div>
    </LayoutPage>
  )
}
