import { getEnrollmentByUserID } from "@/app/actions/enrollment"
import { addHours, format } from "date-fns"
import { th } from "date-fns/locale"
import Link from "next/link"

interface Props {
  userId: string
  limit?: number
}

export default async function Recent({ userId, limit = 10 }: Props) {
  if (!userId) return null

  const res = await getEnrollmentByUserID(1, limit)
  const recentItems = res.data?.data || []

  if (!recentItems || recentItems.length === 0) return null

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] tracking-[2px] text-gold font-bold">RECENT</span>
        <Link href="/enrollments" className="text-[12px] text-text-muted">
          ดูทั้งหมด &rsaquo;
        </Link>
      </div>

      <div className="flex flex-col">
        {recentItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center py-4 border-b border-card-border/50 last:border-0"
          >
            <div>
              <div className="text-[14px] font-semibold text-foreground">
                <p className="uppercase">
                  จองเรียนกับโปร {item?.course?.instructor?.user?.first_name}
                </p>
                <p className="text-[10px] text-text-muted/50 truncate w-[280px] ">
                  คอร์สเรียน : {item?.course?.title}
                </p>
              </div>
              <div className="text-[12px] text-text-muted">
                {item.updated_at
                  ? format(addHours(new Date(item.updated_at), 7), "dd MMM", { locale: th })
                  : "-"}
              </div>
            </div>
            <Link href={`/enrollments/${item.course_id}`} className="text-[12px] text-gold">
              ดูรายละเอียด
            </Link>
            {/* <div className="text-[12px] text-gold flex flex-col items-end">
              {item.payments ? (
                item.payments
                  ?.filter((e) => e.enrollment_id === item.id)
                  .map((payment) => (
                    <div key={payment.id}>
                      <p>
                        {payment.payment_method.toUpperCase() === "CREDIT"
                          ? `หัก  ${numeral(payment.amount).format("0,0")} เครดิต`
                          : `-${numeral(payment.amount).format("0,0")} บาท`}
                      </p>
                    </div>
                  ))
              ) : (
                <p>รอจองวัน</p>
              )}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  )
}
