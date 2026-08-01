import { getUserClassesById } from "@/app/actions/course"
import Breadcrumbs from "@/components/Breadcrumbs"
import { notFound } from "next/navigation"
import { Card } from "@/components/Ui/Card/Card"
import { BookingFormRange } from "./BookingFormRange"
import { formatStatusTh } from "@/utils/status"
import { ProgramTypeRenderValue } from "@/utils/ProgramTypeRender"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function UserClassesPage({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const { success, data: userClasses } = await getUserClassesById(id)

  if (!success || !userClasses) {
    return notFound()
  }

  const classes = userClasses.classes
  const course = classes?.course
  const instructor = course?.instructor?.user
  const proName = instructor?.first_name
    ? `${instructor.first_name} ${instructor.last_name}`
    : instructor?.nickname || ""

  return (
    <div className="p-6 flex flex-col min-h-screen pb-[100px] animate-fade-in">
      <Breadcrumbs title={"รายละเอียดการเรียน"} step={"BOOKING"} urlBack={`/dashboard`} />

      <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
        <h1 className="text-[24px] font-bold text-foreground mb-2 ">{course?.title}</h1>
        <p className="text-[14px] text-text-muted mb-6 uppercase">สอนโดยโปร {proName}</p>

        <Card className="p-6 w-full bg-white flex flex-col shadow-xl shadow-gold/10 border-gold/30 rounded-3xl relative overflow-hidden group mb-6">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-gold via-yellow-400 to-gold"></div>

          <h2 className="text-[18px] font-bold text-gray-900 mb-2">{classes?.title}</h2>
          <div className="text-[14px] text-gray-600 mb-4 whitespace-pre-wrap">
            {classes?.description || "ไม่มีรายละเอียด"}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
            <div>
              <span className="text-[12px] text-gray-500 block mb-1">ระยะเวลาเรียน</span>
              <span className="text-[14px] font-bold text-gray-900">
                {ProgramTypeRenderValue({
                  type: course?.program_type || "",
                  hours: course?.total_hour || 0,
                  times: course?.total_times || 0,
                  days: course?.total_days || 0,
                }).text || "-"}
              </span>
            </div>
            <div>
              <span className="text-[12px] text-gray-500 block mb-2">สถานะ</span>
              <span className="text-[14px] font-bold text-gray-900">
                {formatStatusTh(userClasses.status)}
              </span>
            </div>
          </div>
        </Card>

        {userClasses?.classes?.id && <BookingFormRange classes_id={userClasses?.classes?.id} />}

        {/* {userClasses.status.toUpperCase() !== "WAIT_BOOKING" && userClasses.book_date && (
          <Card className="p-6 bg-card/40 border-card-border/50 rounded-2xl flex flex-col mb-8">
            <h3 className="text-[16px] font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-gold rounded-full"></div>
              วันและเวลาเรียนของคุณ
            </h3>
            <div className="text-[16px] font-bold text-white">
              {format(addHours(new Date(userClasses.book_date), 7), "dd MMMM yyyy, HH:mm")}
            </div>
          </Card>
        )} */}
      </div>
    </div>
  )
}
