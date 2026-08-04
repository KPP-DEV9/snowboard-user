import { getSession } from "@/app/actions/auth"
import { getCourseById, getUserClassesByUserID } from "@/app/actions/course"
import Breadcrumbs from "@/components/Breadcrumbs"
import { Card } from "@/components/Ui/Card/Card"
import { formatStatusTh } from "@/utils/status"
import { addHours, format } from "date-fns"
import { th } from "date-fns/locale"
import { notFound } from "next/navigation"
import Link from "next/link"
import { DateTime } from "@/lib/date"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EnrollmentDetailsPage({ params }: PageProps) {
  const session = await getSession()
  if (!session?.user) {
    return notFound()
  }

  const resolvedParams = await params
  const { id: courseId } = resolvedParams

  const { success: courseSuccess, data: course } = await getCourseById(courseId)
  if (!courseSuccess || !course) {
    return notFound()
  }

  const courseClasses = course.rounds || []

  const { data: allBookings } = await getUserClassesByUserID(session.user.id)

  const userBookings = Array.isArray(allBookings) ? allBookings : []

  return (
    <div className="p-6 flex flex-col min-h-screen animate-fade-in pb-[100px]">
      <Breadcrumbs title={"รายละเอียดคอร์ส"} step={"DETAILS"} urlBack={`/enrollments`} />

      <h1 className="text-[24px] font-bold text-foreground mb-2">{course.title}</h1>

      <div className="flex flex-col gap-4">
        {courseClasses?.map((cls: any) => {
          const booking = userBookings.find((b: any) => b.classes_id === cls.id)
          const hasBooking = !!booking
          const isComplete = booking?.status.toUpperCase() === "COMPLETE"
          const bookingDate = booking?.round?.start_date
          const isWaitBooking = () => {
            switch (booking?.status.toUpperCase()) {
              case "WAIT_BOOKING":
              case "INS_REJECT":
              case "CUS_REJECT":
                return true
              default:
                return false
            }
          }

          return (
            <Card
              key={cls.id}
              className="p-5 flex flex-col gap-3 bg-card-bg/80 backdrop-blur-sm border-card-border/50 rounded-2xl"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-[16px] font-bold text-white mb-1">{cls.title}</h3>
                </div>
                {hasBooking && booking.status !== "WAIT_BOOKING" ? (
                  <span className="text-[10px] text-green-500 border border-green-500 px-2 py-1 rounded font-bold uppercase shrink-0">
                    {formatStatusTh(booking.status)}
                  </span>
                ) : (
                  <span className="text-[10px] text-gold border border-gold px-2 py-1 rounded font-bold uppercase shrink-0">
                    รอจองวัน
                  </span>
                )}
              </div>

              {cls.description && (
                <div className="text-[13px] text-gray-400 mb-2 line-clamp-2">{cls.description}</div>
              )}

              <div className="mt-2 pt-3 border-t border-card-border/30 flex flex-col gap-3">
                {hasBooking && bookingDate && booking.status !== "WAIT_BOOKING" ? (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      วันที่และเวลาเรียน
                    </span>
                    <span className="text-[14px] font-bold text-white">
                      {DateTime(bookingDate)}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      สถานะการจอง
                    </span>
                    <span className="text-[13px] text-gray-400">คุณยังไม่ได้ทำการจองคลาสนี้</span>
                  </div>
                )}

                <div className="mt-2">
                  {hasBooking ? (
                    <div>
                      {isComplete ? (
                        <Link href={`/analysis/${booking.id}`}>
                          <button className="w-full py-2 bg-gold/10 hover:bg-gold/20 text-gold text-[13px] font-bold rounded-lg transition-colors">
                            ดูผลประเมิน
                          </button>
                        </Link>
                      ) : (
                        <>
                          {isWaitBooking() && (
                            <Link href={`/user-classes/${booking.id}`}>
                              <button className="w-full py-2 bg-gold/10 hover:bg-gold/20 text-gold text-[13px] font-bold rounded-lg transition-colors">
                                จองวันเรียน
                              </button>
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
