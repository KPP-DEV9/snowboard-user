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
  Package,
  ShieldCheck,
} from "lucide-react"
import { RenderDate } from "@/lib/date"
import numeral from "numeral"
import { Card } from "@/components/Ui/Card/Card"
import LayoutPage from "@/components/Layout"
import { getLocationName } from "@/constants/location"
import { Vat } from "@/utils/Inv"
import SlideImg from "@/components/Ui/SlideImg"

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

  // Normalize terms_conditions
  const rawTerms = enrollment.terms_conditions || []
  const termsConditions = Array.isArray(rawTerms) ? rawTerms : rawTerms ? [rawTerms] : []
  const courseTermsMaster = course?.terms_conditions_master || []

  // Normalize guests from enrollment.guest, enrollment.guests, or enrollment.participants
  const rawGuests = enrollment.guest || enrollment.guests || enrollment.participants || []
  const guests = Array.isArray(rawGuests) ? rawGuests : rawGuests ? [rawGuests] : []

  const adultCount =
    enrollment.adult_count ||
    guests.filter((g: any) => (g.type || "").toUpperCase() === "ADULT").length ||
    1
  const childCount =
    enrollment.child_count ||
    guests.filter((g: any) => (g.type || "").toUpperCase() === "CHILD").length ||
    0

  const requirementTransactions = enrollment.requirement_transactions || []
  const extrasSubtotal =
    requirementTransactions.length > 0
      ? requirementTransactions.reduce((sum, item) => {
          const price =
            item.requirement_type === "ASSET"
              ? Number(item.asset_master?.price) || 0
              : Number(item.option_master?.price) || 0
          return sum + price
        }, 0)
      : Number(enrollment.req_total) || 0

  const rawTotal = enrollment.total_amount || course?.price || 0
  const totalAmount = rawTotal * Vat
  const depositAmount = enrollment.deposit_amount || 0

  const programType = course?.course_type?.toLowerCase()?.includes("ski") ? "Ski" : "Snowboard"
  const tagColor = programType === "Ski" ? "bg-[#F59E0B]" : "bg-[#304B65]"

  const statusLower = (enrollment.status || "").toLowerCase()
  const isDepositPaid =
    statusLower === "deposit_paid" ||
    (depositAmount > 0 && statusLower !== "paid" && statusLower !== "completed")

  const isPaid =
    statusLower === "paid" ||
    statusLower === "completed" ||
    statusLower === "ชำระแล้ว" ||
    statusLower === "ชำระสำเร็จ"

  const isCancelled =
    statusLower === "cancelled" || statusLower === "canceled" || statusLower.includes("ยกเลิก")

  const isPendingPayment = !isPaid && !isCancelled

  const getStatusDisplay = () => {
    if (isPaid) {
      return {
        title: "ชำระเงินเรียบร้อยแล้ว",
        badgeBg: "bg-[#E5F0FF] text-[#0056D2]",
        icon: <CheckCircle2 size={16} className="text-[#0056D2]" />,
      }
    }
    if (isCancelled) {
      return {
        title: "ยกเลิกแล้ว",
        badgeBg: "bg-[#FFE5E5] text-[#F04E23]",
        icon: <XCircle size={16} className="text-[#F04E23]" />,
      }
    }
    if (isDepositPaid) {
      return {
        title: "มัดจำแล้ว (รอชำระส่วนที่เหลือ)",
        badgeBg: "bg-[#FEF3C7] text-[#D97706]",
        icon: <Clock size={16} className="text-[#D97706]" />,
      }
    }
    return {
      title: "รอการชำระเงิน",
      badgeBg: "bg-[#FFF4E5] text-[#F04E23]",
      icon: <AlertCircle size={16} className="text-[#F04E23]" />,
    }
  }

  const statusInfo = getStatusDisplay()

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
          </div>

          {/* Main Course Info Card */}
          <Card className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-none mb-6 text-black overflow-hidden">
            {/* Course Images Slider */}
            {course?.image_urls && course.image_urls.length > 0 && (
              <div className="relative w-full h-[220px] md:h-[300px] overflow-hidden rounded-2xl mb-5 shadow-sm">
                <SlideImg images={course.image_urls} alt={course.title} />
              </div>
            )}

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
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-snug">
              {course?.title || "รายละเอียดการจองคอร์สเรียน"}
            </h1>

            {(() => {
              const { provinceName, districtName } = getLocationName(
                course?.province,
                course?.district,
                course?.nation,
              )
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={18} className="text-[#F04E23] shrink-0" />
                    <span>
                      {districtName ? `${districtName}, ` : ""}
                      {provinceName || "-"}
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
              )
            })()}
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
                  {adultCount + childCount} ท่าน (ผู้ใหญ่ {adultCount}
                  {childCount > 0 ? `, เด็ก ${childCount}` : ""})
                </span>
              </div>
              {extrasSubtotal > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>อุปกรณ์และบริการเสริม</span>
                  <span className="font-bold text-gray-900">
                    ฿ {numeral(extrasSubtotal).format("0,0.00")}
                  </span>
                </div>
              )}
              {depositAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>ยอดมัดจำที่ชำระ</span>
                  <span className="font-bold text-gray-900">
                    ฿ {numeral(depositAmount).format("0,0.00")}
                  </span>
                </div>
              )}
              {isDepositPaid && (
                <div className="flex justify-between text-gray-600">
                  <span>ยอดคงเหลือที่ต้องชำระ</span>
                  <span className="font-bold text-[#D97706]">
                    ฿ {numeral(Math.max(0, totalAmount - depositAmount)).format("0,0.00")}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 items-center">
                <span>สถานะ</span>
                <div
                  className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold ${statusInfo.badgeBg}`}
                >
                  {statusInfo.icon}
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

            {/* Pending / Remaining Payment Action */}
            {isPendingPayment && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  href={`/payment/?course_id=${enrollment.course_id}&round_id=${enrollment.round_id || ""}&enrollment_id=${enrollment.id}&adults=${adultCount}&children=${childCount}`}
                  className="w-full bg-[#F04E23] hover:bg-[#D4411C] text-white py-3.5 rounded-2xl font-bold text-[16px] transition-colors shadow-md flex items-center justify-center gap-2 text-center"
                >
                  <CreditCard size={18} />
                  {isDepositPaid ? "ชำระเงินส่วนที่เหลือ" : "ชำระเงิน"}
                </Link>
              </div>
            )}
          </Card>

          {/* Requirement Transactions Card (อุปกรณ์และบริการเสริม) */}
          {requirementTransactions.length > 0 && (
            <Card className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-none mb-6 text-black">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Package size={20} className="text-[#304B65]" />
                  รายการอุปกรณ์และบริการเสริม ({requirementTransactions.length} รายการ)
                </h3>
              </div>

              <div className="space-y-3">
                {requirementTransactions.map((item, idx) => {
                  const isAsset = item.requirement_type === "ASSET"
                  const name = isAsset
                    ? `${item.asset_master?.name || "เช่าอุปกรณ์"}${
                        item.asset_master?.size ? ` (ไซส์ ${item.asset_master.size})` : ""
                      }`
                    : item.option_master?.name || "บริการเพิ่มเติม"
                  const price = isAsset
                    ? Number(item.asset_master?.price) || 0
                    : Number(item.option_master?.price) || 0

                  return (
                    <div
                      key={item.id || idx}
                      className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white text-[#304B65] flex items-center justify-center shadow-xs border border-gray-200 shrink-0">
                          {isAsset ? (
                            <Package size={16} />
                          ) : (
                            <Sparkles size={16} className="text-amber-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{name}</div>
                          <div className="text-xs text-gray-400">
                            {isAsset ? "อุปกรณ์เช่า" : "บริการเสริม / ออฟชั่น"}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-[#448651] text-base shrink-0">
                        ฿ {numeral(price).format("0,0.00")}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100 text-sm">
                <span className="font-bold text-gray-700">ยอดรวมอุปกรณ์และบริการเสริม</span>
                <span className="font-bold text-gray-900 text-base">
                  ฿ {numeral(extrasSubtotal).format("0,0.00")}
                </span>
              </div>
            </Card>
          )}

          {/* Guest / Participants Detail Cards */}
          {guests.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="text-white font-bold text-lg px-1 flex items-center gap-2">
                <Users size={20} /> ข้อมูลผู้ร่วมทริป ({guests.length} ท่าน)
              </h3>

              {guests.map((g: any, idx: number) => {
                const fullName =
                  `${g.first_name || ""} ${g.last_name || ""}`.trim() ||
                  g.name ||
                  `ผู้ร่วมทริปท่านที่ ${idx + 1}`
                const isAdult = (g.type || "").toUpperCase() === "ADULT" || !g.type
                const phone = g.phone_number || g.phone || g.tel
                const lineId = g.line_id || g.lineId
                const idCard = g.id_card || g.idCard || g.passport_no
                const dob = g.date_of_birth || g.birth_date
                const hasMedical = g.has_medical_condition || g.has_disease
                const medicalDetail = g.medical_condition_detail || g.disease_detail
                const hasAllergy = g.has_food_allergy || g.has_allergy
                const allergyDetail = g.food_allergy_detail || g.allergy_detail

                const helmetSize = g.helmet_size_us || g.hat_size || g.hatSize
                const gloveSize = g.glove_size_us || g.glove_size || g.gloveSize
                const shoeSize = g.shoe_size_us || g.shoe_size || g.shoeSize
                const height = g.height_cm || g.height
                const weight = g.weight_kg || g.weight

                return (
                  <Card
                    key={g.id || idx}
                    className="bg-white rounded-3xl p-6 shadow-md border-none text-black space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#304B65] text-white flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <span className="font-bold text-gray-900 text-base">{fullName}</span>
                      </div>
                      <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                        {isAdult ? "ผู้ใหญ่" : "เด็ก"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-gray-600">
                      {phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={15} className="text-gray-400 shrink-0" />
                          <span>เบอร์โทร: {phone}</span>
                        </div>
                      )}
                      {g.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={15} className="text-gray-400 shrink-0" />
                          <span>อีเมล: {g.email}</span>
                        </div>
                      )}
                      {lineId && (
                        <div className="flex items-center gap-2">
                          <UserIcon size={15} className="text-gray-400 shrink-0" />
                          <span>Line ID: {lineId}</span>
                        </div>
                      )}
                      {idCard && (
                        <div className="flex items-center gap-2">
                          <span>บัตร ปชช./พาสปอร์ต: {idCard}</span>
                        </div>
                      )}
                      {g.nationality && (
                        <div className="flex items-center gap-2">
                          <span>สัญชาติ: {g.nationality}</span>
                        </div>
                      )}
                      {dob && (
                        <div className="flex items-center gap-2">
                          <span>วันเกิด: {RenderDate(dob, "d MMMM yyyy")}</span>
                        </div>
                      )}
                      {g.gender && (
                        <div className="flex items-center gap-2">
                          <span>
                            เพศ:{" "}
                            {g.gender === "MALE" || g.gender === "male"
                              ? "ชาย"
                              : g.gender === "FEMALE" || g.gender === "female"
                                ? "หญิง"
                                : g.gender}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Medical / Food Allergy */}
                    {(hasMedical || hasAllergy) && (
                      <div className="bg-red-50/70 border border-red-100 rounded-2xl p-3.5 text-xs text-red-800 space-y-1.5">
                        {hasMedical && (
                          <div className="flex items-start gap-2">
                            <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                            <span>
                              <strong>โรคประจำตัว:</strong> {medicalDetail || "มีโรคประจำตัว"}
                            </span>
                          </div>
                        )}
                        {hasAllergy && (
                          <div className="flex items-start gap-2">
                            <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                            <span>
                              <strong>แพ้อาหาร:</strong> {allergyDetail || "มีอาการแพ้อาหาร"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sizes & Equipment */}
                    {(helmetSize || gloveSize || shoeSize || height || weight) && (
                      <div className="bg-gray-50 rounded-2xl p-3.5 text-xs text-gray-700">
                        <div className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                          <Sparkles size={14} className="text-amber-500" /> ข้อมูลไซส์ & อุปกรณ์
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                          {height ? <span>ส่วนสูง: {height} ซม.</span> : null}
                          {weight ? <span>น้ำหนัก: {weight} กก.</span> : null}
                          {helmetSize ? <span>ไซส์หมวก: {helmetSize}</span> : null}
                          {gloveSize ? <span>ไซส์ถุงมือ: {gloveSize}</span> : null}
                          {shoeSize ? <span>ไซส์รองเท้า: {shoeSize}</span> : null}
                        </div>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          )}

          {/* Terms & Conditions Card */}
          {((termsConditions && termsConditions.length > 0) ||
            (courseTermsMaster && courseTermsMaster.length > 0)) && (
            <Card className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-none mb-8 text-black">
              <div className="border-b border-gray-100 pb-3 mb-4">
                <h3 className="font-bold text-gray-900 flex items-center mb-3">
                  <ShieldCheck size={20} className="text-[#304B65]" />
                  ข้อตกลงและเงื่อนไข (Terms & Conditions)
                </h3>
                <span className="flex items-center w-fit gap-1 bg-green-50 text-[#448651] text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                  <CheckCircle2 size={14} /> ยอมรับแล้ว
                </span>
              </div>

              <div className="space-y-3">
                {termsConditions && termsConditions.length > 0
                  ? termsConditions.map((term: any, idx: number) => {
                      const conditionText =
                        term.terms_conditions_master?.conditions ||
                        term.conditions ||
                        term.condition ||
                        "ยอมรับข้อตกลงและเงื่อนไขการจองคอร์ส"

                      return (
                        <div
                          key={term.id || idx}
                          className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 text-xs md:text-sm text-gray-800 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-500 text-xs">
                              ข้อที่ {idx + 1}
                            </span>
                            {term.created_at && (
                              <span className="text-[11px] text-gray-400">
                                ยอมรับเมื่อ {RenderDate(term.created_at, "d MMM yyyy HH:mm")}
                              </span>
                            )}
                          </div>
                          <div className="leading-relaxed whitespace-pre-wrap text-xs">
                            {conditionText}
                          </div>
                        </div>
                      )
                    })
                  : courseTermsMaster.map((master: any, idx: number) => (
                      <div
                        key={master.id || idx}
                        className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 text-xs text-gray-800 space-y-1"
                      >
                        <div className="font-bold text-gray-500 text-xs">ข้อที่ {idx + 1}</div>
                        <div className="leading-relaxed whitespace-pre-wrap font-medium text-xs">
                          {master.conditions}
                        </div>
                      </div>
                    ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </LayoutPage>
  )
}
