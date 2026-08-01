import { getSession } from "@/app/actions/auth"
import { getEnrollmentByUserID } from "@/app/actions/enrollment"
import Breadcrumbs from "@/components/Breadcrumbs"
import { Card } from "@/components/Ui/Card/Card"
import { format, addHours } from "date-fns"
import numeral from "numeral"
import { notFound } from "next/navigation"
import { Pagination } from "@/components/Ui/Pagination"
import { th } from "date-fns/locale"
import Link from "next/link"
import { RenderDate } from "@/lib/date"
import { PaymentMethodRender } from "@/utils/PaymentMethodRender"
import { Inv } from "@/utils/Inv"

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EnrollmentsHistoryPage({ searchParams }: Props) {
  const session = await getSession()
  if (!session?.user) {
    return notFound()
  }

  const resolvedSearchParams = await searchParams
  const page =
    typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1
  const limit = 10

  const { success, data: paginatedData } = await getEnrollmentByUserID(page, limit)

  if (!success) {
    return (
      <div className="p-6 flex flex-col min-h-screen">
        <Breadcrumbs title={"ประวัติคำสั่งซื้อ"} step={"HISTORY"} urlBack={`/dashboard`} />
        <div className="flex-1 flex items-center justify-center text-text-muted">
          ไม่สามารถโหลดประวัติคำสั่งซื้อได้
        </div>
      </div>
    )
  }

  const paginatedEnrollments = paginatedData?.data || []
  const totalPages = paginatedData?.total_pages || 1

  return (
    <div className="p-6 flex flex-col min-h-screen animate-fade-in pb-[100px]">
      <Breadcrumbs title={"ประวัติคำสั่งซื้อ"} step={"HISTORY"} urlBack={`/dashboard`} />

      <h1 className="text-[24px] font-bold text-foreground mb-6">ประวัติคำสั่งซื้อทั้งหมด</h1>

      <div className="flex flex-col gap-4">
        {(!paginatedEnrollments || paginatedEnrollments.length === 0) && (
          <div className="text-center py-10 text-text-muted text-[14px]">
            ยังไม่มีประวัติการซื้อคอร์สเรียน
          </div>
        )}

        {paginatedEnrollments.map((enrollment) => {
          const course = enrollment.course
          const instructorUser = course?.instructor?.user
          const proName = instructorUser?.first_name
            ? `${instructorUser.first_name} ${instructorUser.last_name}`
            : instructorUser?.nickname || ""

          // Identify payment method if available
          const firstPayment =
            enrollment.payments && enrollment.payments.length > 0 ? enrollment.payments[0] : null
          const paymentMethod = firstPayment?.payment_method

          console.log("paymentMethod ==============> ", enrollment)

          // Status Badge Styles
          let statusBadge = null
          if (enrollment.status === "paid") {
            statusBadge = (
              <span className="text-[10px] text-green-500 border border-green-500 px-2 py-1 rounded font-bold uppercase">
                ชำระแล้ว
              </span>
            )
          } else if (enrollment.status === "pending_payment") {
            statusBadge = (
              <span className="text-[10px] text-yellow-500 border border-yellow-500 px-2 py-1 rounded font-bold uppercase">
                รอดำเนินการ
              </span>
            )
          } else if (enrollment.status === "cancelled") {
            statusBadge = (
              <span className="text-[10px] text-red-500 border border-red-500 px-2 py-1 rounded font-bold uppercase">
                ยกเลิก
              </span>
            )
          }

          return (
            <Card
              key={enrollment.id}
              className="p-4 flex flex-col gap-3 bg-card-bg/80 backdrop-blur-sm border-card-border/50"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1 pr-2">
                  <div className="text-[10px] text-text-muted">
                    {RenderDate(enrollment.created_at, "dd MMM yyyy HH:mm")}
                  </div>
                  <div className="text-[14px] font-bold text-foreground leading-snug">
                    {course?.title || "ไม่ทราบชื่อคอร์ส"}
                  </div>
                  <div className="text-[12px] text-gold">โปร {proName}</div>
                </div>
                <div className="flex-shrink-0">{statusBadge}</div>
              </div>

              <div className="mt-2 pt-3 border-t border-card-border/30 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
                    {PaymentMethodRender(paymentMethod || "") ? "ช่องทางชำระเงิน" : "ชำระเรียบร้อย"}
                  </span>
                  <span className="text-[12px] font-bold text-foreground">
                    {PaymentMethodRender(paymentMethod || "")}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
                    ยอดชำระ
                  </span>
                  <span className="text-[16px] font-bold text-gold">
                    {`${Inv(course?.price!)} บาท`}
                  </span>
                </div>
              </div>

              <div className="mt-1 pt-3 border-t border-card-border/30">
                <Link href={`/enrollments/${enrollment.course_id}`}>
                  <button className="w-full py-2 bg-gold/10 hover:bg-gold/20 text-gold text-[13px] font-bold rounded-lg transition-colors">
                    ดูรายละเอียดการเรียน
                  </button>
                </Link>
              </div>
            </Card>
          )
        })}

        {/* {totalPages > 1 && ( */}
        <div className="mt-4">
          <Pagination totalPages={totalPages} currentPage={page} baseUrl="/enrollments" />
        </div>
        {/* )} */}
      </div>
    </div>
  )
}
