import { getEnrollmentById } from "@/app/actions/enrollment"
import { getUser } from "@/app/actions/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Clock,
  Users,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  User as UserIcon,
  ShieldAlert,
  Sparkles,
} from "lucide-react"
import { RenderDate } from "@/lib/date"
import numeral from "numeral"
import { Card } from "@/components/Ui/Card/Card"
import LayoutPage from "@/components/Layout"

interface MyTripDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function MyTripDetailPage({ params }: MyTripDetailPageProps) {
  const user = await getUser()
  if (!user) {
    redirect("/signin")
  }

  const resolvedParams = await params
  const { id } = resolvedParams

  if (!id) {
    return notFound()
  }

  const { success, data: enrollment } = await getEnrollmentById(id)

  if (!success || !enrollment) {
    return (
      <LayoutPage isLicense={false}>
        <div className="min-h-screen bg-[#304B65] pb-32 font-sans px-4 pt-10">
          <div className="max-w-3xl mx-auto text-center py-16 bg-white rounded-3xl p-8 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-2">ไม่พบข้อมูลทริป</h2>
            <p className="text-gray-500 text-sm mb-6">
              ไม่พบข้อมูลการจองหมายเลข {id} หรืออาจถูกลบไปแล้ว
            </p>
            <Link
              href="/mytrip"
              className="inline-flex items-center gap-2 bg-[#F04E23] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#D4411C] transition-colors text-sm"
            >
              <ArrowLeft size={16} /> กลับไปหน้ารายการทริป
            </Link>
          </div>
        </div>
      </LayoutPage>
    )
  }

  const course = enrollment.course
  const participants = enrollment.participants || []
  const adultCount = enrollment.adult_count ?? 1
  const childCount = enrollment.child_count ?? 0
  const totalAmount = enrollment.total_amount || course?.price || 0
  const depositAmount = enrollment.deposit_amount || 0

  const programType = course?.course_type?.toLowerCase()?.includes("ski") ? "Ski" : "Snowboard"
  const tagColor = programType === "Ski" ? "bg-[#F59E0B]" : "bg-[#304B65]"

  const enrollmentCode = enrollment.id
    ? (enrollment.id.includes("-") ? enrollment.id.split("-")[0] : enrollment.id).toUpperCase()
    : "-"

  const statusLower = (enrollment.status || "").toLowerCase()
  const isPendingPayment =
    !enrollment.status ||
    statusLower === "pending_payment" ||
    statusLower === "pending" ||
    statusLower.includes("pending") ||
    statusLower.includes("รอชำระ") ||
    statusLower.includes("รอการชำระ")

  const getStatusDisplay = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "paid" || s.includes("paid") || s.includes("ชำระแล้ว")) {
      return {
        title: "ชำระเงินเรียบร้อยแล้ว",
        badgeBg: "bg-[#E5F0FF] text-[#0056D2]",
        icon: <CheckCircle2 size={16} className="text-[#0056D2]" />,
      }
    }
    if (s === "cancelled" || s === "canceled" || s.includes("cancel") || s.includes("ยกเลิก")) {
      return {
        title: "ยกเลิกแล้ว",
        badgeBg: "bg-[#FFE5E5] text-[#F04E23]",
        icon: <XCircle size={16} className="text-[#F04E23]" />,
      }
    }
    return {
      title: "รอการชำระเงิน",
      badgeBg: "bg-[#FFF4E5] text-[#F04E23]",
      icon: <AlertCircle size={16} className="text-[#F04E23]" />,
    }
  }

  const statusInfo = getStatusDisplay(enrollment.status)

  return (
    <LayoutPage isLicense={false}>
      <div className="min-h-screen bg-[#304B65] pb-32 font-sans selection:bg-[#568759]/30">
        <div className="w-full px-4 md:px-8 mx-auto pt-6 max-w-4xl">
          {/* Top Header */}
          <div className="relative flex items-center justify-between mb-6">
            <Link
              href="/mytrip"
              className="text-white font-bold flex items-center gap-2 hover:opacity-80 transition-opacity text-sm md:text-base"
            >
              <ArrowLeft size={20} className="stroke-[3]" /> ย้อนกลับ
            </Link>
            <div className="text-white/80 text-xs md:text-sm font-medium">
              เลขที่รายการ: <span className="font-bold text-white">#{enrollmentCode}</span>
            </div>
          </div>

          {/* Main Course Info Card */}
          <Card className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-none mb-6 text-black">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className={`${tagColor} text-white text-xs font-bold px-3 py-1 rounded-md`}>
                  {programType}
                </span>
                {course?.course_level && (
                  <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-md">
                    {course.course_level}
                  </span>
                )}
              </div>
              <div
                className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold ${statusInfo.badgeBg}`}
              >
                {statusInfo.icon}
                <span>{statusInfo.title}</span>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-snug">
              {course?.title || "รายละเอียดการจองคอร์สเรียน"}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2.5">
                <MapPin size={18} className="text-[#F04E23] shrink-0" />
                <span>
                  {course?.district || "-"}, {course?.province || "-"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CalendarDays size={18} className="text-[#304B65] shrink-0" />
                <span>
                  {RenderDate(course?.start_date, "d MMMM yyyy")} -{" "}
                  {RenderDate(course?.end_date, "d MMMM yyyy")}
                </span>
              </div>
              {enrollment.round && (
                <div className="flex items-center gap-2.5">
                  <Clock size={18} className="text-[#798E75] shrink-0" />
                  <span>
                    เวลา {RenderDate(enrollment.round.start_date, "HH:mm")} -{" "}
                    {RenderDate(enrollment.round.end_date, "HH:mm")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <Users size={18} className="text-gray-500 shrink-0" />
                <span>
                  ผู้ใหญ่ {adultCount} ท่าน {childCount > 0 ? `, เด็ก ${childCount} ท่าน` : ""}
                </span>
              </div>
            </div>
          </Card>

          {/* Pricing & Payment Summary Card */}
          <Card className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-none mb-6 text-black">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-[#304B65]" />
              สรุปข้อมูลการชำระเงิน
            </h3>

            <div className="space-y-3 text-sm border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>จำนวนผู้จองทั้งหมด</span>
                <span className="font-bold text-gray-900">
                  {adultCount + childCount} ท่าน (ผู้ใหญ่ {adultCount}, เด็ก {childCount})
                </span>
              </div>
              {depositAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>ยอดมัดจำที่ชำระ</span>
                  <span className="font-bold text-gray-900">
                    ฿ {numeral(depositAmount).format("0,0.00")}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>สถานะ</span>
                <div
                  className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold ${statusInfo.badgeBg}`}
                >
                  <span>{statusInfo.title}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="font-bold text-gray-900 text-base">ราคารวมทั้งหมด</span>
              <span className="font-bold text-[#448651] text-2xl">
                ฿ {numeral(totalAmount).format("0,0.00")}
              </span>
            </div>

            {/* Pending Payment Action */}
            {isPendingPayment && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  href={`/payment/?course_id=${enrollment.course_id}&round_id=${enrollment.round_id || ""}&enrollment_id=${enrollment.id}&adults=${adultCount}&children=${childCount}`}
                  className="w-full bg-[#F04E23] hover:bg-[#D4411C] text-white py-3.5 rounded-2xl font-bold text-[16px] transition-colors shadow-md flex items-center justify-center gap-2 text-center"
                >
                  <CreditCard size={18} />
                  ชำระเงิน
                </Link>
              </div>
            )}
          </Card>

          {/* Participants Detail Card */}
          {participants.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="text-white font-bold text-lg px-1 flex items-center gap-2">
                <Users size={20} /> รายชื่อผู้ร่วมทริป ({participants.length} ท่าน)
              </h3>

              {participants.map((p, idx) => (
                <Card
                  key={idx}
                  className="bg-white rounded-3xl p-6 shadow-md border-none text-black space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <span className="font-bold text-gray-900 text-base">
                        {p.first_name} {p.last_name}
                      </span>
                    </div>
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                      {p.type === "ADULT" || p.type === "adult" ? "ผู้ใหญ่" : "เด็ก"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-gray-600">
                    {p.phone_number && (
                      <div className="flex items-center gap-2">
                        <Phone size={15} className="text-gray-400" />
                        <span>เบอร์โทร: {p.phone_number}</span>
                      </div>
                    )}
                    {p.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={15} className="text-gray-400" />
                        <span>อีเมล: {p.email}</span>
                      </div>
                    )}
                    {p.line_id && (
                      <div className="flex items-center gap-2">
                        <UserIcon size={15} className="text-gray-400" />
                        <span>Line ID: {p.line_id}</span>
                      </div>
                    )}
                    {p.id_card && (
                      <div className="flex items-center gap-2">
                        <span>บัตร ปชช./พาสปอร์ต: {p.id_card}</span>
                      </div>
                    )}
                    {p.nationality && (
                      <div className="flex items-center gap-2">
                        <span>สัญชาติ: {p.nationality}</span>
                      </div>
                    )}
                    {p.date_of_birth && (
                      <div className="flex items-center gap-2">
                        <span>วันเกิด: {RenderDate(p.date_of_birth, "d MMMM yyyy")}</span>
                      </div>
                    )}
                  </div>

                  {/* Medical / Food Allergy */}
                  {(p.has_medical_condition || p.has_food_allergy) && (
                    <div className="bg-red-50/70 border border-red-100 rounded-2xl p-3.5 text-xs text-red-800 space-y-1.5">
                      {p.has_medical_condition && (
                        <div className="flex items-start gap-2">
                          <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                          <span>
                            <strong>โรคประจำตัว:</strong>{" "}
                            {p.medical_condition_detail || "มีโรคประจำตัว"}
                          </span>
                        </div>
                      )}
                      {p.has_food_allergy && (
                        <div className="flex items-start gap-2">
                          <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                          <span>
                            <strong>แพ้อาหาร:</strong> {p.food_allergy_detail || "มีอาการแพ้อาหาร"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sizes & Equipment */}
                  {(p.helmet_size_us ||
                    p.glove_size_us ||
                    p.shoe_size_us ||
                    p.height_cm ||
                    p.weight_kg) && (
                    <div className="bg-gray-50 rounded-2xl p-3.5 text-xs text-gray-700">
                      <div className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-500" /> ข้อมูลไซส์ & อุปกรณ์
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {p.height_cm ? <span>ส่วนสูง: {p.height_cm} ซม.</span> : null}
                        {p.weight_kg ? <span>น้ำหนัก: {p.weight_kg} กก.</span> : null}
                        {p.helmet_size_us ? <span>ไซส์หมวก: {p.helmet_size_us}</span> : null}
                        {p.glove_size_us ? <span>ไซส์ถุงมือ: {p.glove_size_us}</span> : null}
                        {p.shoe_size_us ? <span>ไซส์รองเท้า: {p.shoe_size_us}</span> : null}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutPage>
  )
}
