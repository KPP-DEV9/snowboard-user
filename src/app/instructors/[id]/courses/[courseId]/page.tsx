import { getCourseById } from "@/app/actions/course"
import Breadcrumbs from "@/components/Breadcrumbs"
import { notFound } from "next/navigation"
import { Card } from "@/components/Ui/Card/Card"
import CourseBookingActions from "./CourseBookingActions"
import numeral from "numeral"
import { ProgramTypeRenderValue } from "@/utils/ProgramTypeRender"

interface CourseDetailsPageProps {
  params: Promise<{ id: string; courseId: string }>
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const resolvedParams = await params
  const { id, courseId } = resolvedParams

  const { success, data: course } = await getCourseById(courseId)

  if (!success || !course) {
    return notFound()
  }

  const instructor = course.instructor
  const user = instructor?.user
  const proName = user?.first_name ? `${user.first_name} ${user.last_name}` : user?.nickname || ""

  return (
    <div className="p-6 flex flex-col min-h-screen pb-[100px] animate-fade-in">
      <Breadcrumbs
        title={"รายละเอียดคอร์ส"}
        step={"COURSE"}
        urlBack={`/instructors/${id}/courses`}
      />

      <div>
        <h1 className="text-[24px] font-bold text-foreground mb-2">{course.title}</h1>
        <p className="text-[14px] text-text-muted mb-6 uppercase">สอนโดยโปร {proName}</p>

        <div className="bg-gold/20 text-gold text-[12px] font-bold px-3 py-1.5 rounded-md w-fit mb-6">
          {course.course_type.toUpperCase()}
        </div>

        <Card className="p-5 mb-6 bg-card/50 backdrop-blur-sm border-card-border/50">
          <h2 className="text-[16px] font-bold text-foreground mb-3 flex items-center gap-2">
            <div className="w-1 h-4 bg-gold rounded-full"></div>
            รายละเอียด
          </h2>
          <div className="text-[14px] text-text-subtle leading-relaxed whitespace-pre-wrap">
            {course.description || "ไม่มีรายละเอียด"}
          </div>
        </Card>

        {course?.classes
          ?.sort((a, b) => a.order - b.order)
          .map((phase, index) => (
            <Card
              key={index}
              className="p-5 mb-6 bg-card/50 backdrop-blur-sm border-card-border/50"
            >
              <h2 className="text-[16px] font-bold text-foreground mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-gold rounded-full"></div>
                {phase.title}
              </h2>
              <div className="text-[14px] text-text-subtle leading-relaxed whitespace-pre-wrap">
                {phase.description || "ไม่มีรายละเอียด"}
              </div>
            </Card>
          ))}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[12px] text-text-muted uppercase tracking-wider mb-1">
              ระยะเวลา
            </span>
            <span className="text-[20px] font-bold text-foreground">
              {ProgramTypeRenderValue({
                type: course.program_type,
                hours: course.total_hour,
                times: course.total_times,
                days: course.total_days,
              })?.text || "-"}
            </span>
          </Card>

          <Card className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[12px] text-text-muted uppercase tracking-wider mb-1">
              ผู้เรียนสูงสุด
            </span>
            <span className="text-[20px] font-bold text-foreground">
              {numeral(course.max_students).format("0,0")}{" "}
              <span className="text-[14px] font-normal text-text-subtle">คน</span>
            </span>
          </Card>
        </div>

        <CourseBookingActions courseId={courseId} coursePrice={course.price} />
      </div>
    </div>
  )
}
