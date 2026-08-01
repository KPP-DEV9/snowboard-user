import { getCourses } from "@/app/actions/course"
import { getInstructorById } from "@/app/actions/instructor"
import { Card } from "@/components/Ui/Card/Card"
import Breadcrumbs from "@/components/Breadcrumbs"
import { Pagination } from "@/components/Ui/Pagination"
import { notFound } from "next/navigation"
import Link from "next/link"
import numeral from "numeral"
import { ProgramTypeRenderValue } from "@/utils/ProgramTypeRender"

interface InstructorCoursesPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function InstructorCoursesPage({
  params,
  searchParams,
}: InstructorCoursesPageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const resolvedSearchParams = await searchParams
  const page =
    typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1
  const limit = 10

  const [instructorRes, coursesRes] = await Promise.all([
    getInstructorById(id),
    getCourses(page, limit, id),
  ])

  if (!instructorRes.success || !instructorRes.data) {
    return notFound()
  }

  const instructor = instructorRes.data
  const user = instructor.user
  const proName = user?.first_name ? `${user.first_name} ${user.last_name}` : user?.nickname || ""

  const courses = coursesRes.data?.data || []
  const totalPages = coursesRes.data?.total_pages || 1

  return (
    <div className="p-6 flex flex-col min-h-screen pb-[100px] animate-fade-in">
      <Breadcrumbs
        title={`คอร์สเรียนของ ${proName.toUpperCase()}`}
        step={"INSTRUCTOR"}
        urlBack={`/instructors/${id}`}
      />

      {coursesRes.error && (
        <div className="text-red-500 text-[14px] bg-red-500/10 p-4 rounded-lg mb-4 border border-red-500/20 mt-4">
          {coursesRes.error}
        </div>
      )}

      <div className="flex flex-col gap-4 mt-6">
        {courses.map((course) => {
          return (
            <Card key={course.id} interactive className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[18px] font-bold text-foreground">{course.title}</h3>
                  </div>
                </div>

                <div className="bg-gold/20 text-gold text-[10px] font-bold px-2 py-1 rounded w-fit">
                  {course.course_type.toUpperCase()}
                </div>

                {course.description && (
                  <p className="text-[14px] text-text-subtle line-clamp-2">{course.description}</p>
                )}

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-black/20 p-2 rounded flex flex-col items-center">
                    <span className="text-[10px] text-text-muted">ระยะเวลา</span>
                    <span className="text-[14px] font-bold">
                      {ProgramTypeRenderValue({
                        type: course.program_type,
                        hours: course.total_hour,
                        times: course.total_times,
                        days: course.total_days,
                      })?.text || "-"}
                    </span>
                  </div>
                  <div className="bg-black/20 p-2 rounded flex flex-col items-center">
                    <span className="text-[10px] text-text-muted">ผู้เรียนสูงสุด</span>
                    <span className="text-[14px] font-bold">
                      {numeral(course.max_students).format("0,0")}
                      คน
                    </span>
                  </div>
                  <div className="bg-black/20 p-2 rounded flex flex-col items-center">
                    <span className="text-[10px] text-gold">ราคา</span>
                    <span className="text-[14px] font-bold text-gold">
                      {numeral(course.price).format("0,0")}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/instructors/${id}/courses/${course.id}`}
                  className="w-full mt-2 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all border border-white/10"
                >
                  <span>ดูรายละเอียด</span>
                </Link>
              </div>
            </Card>
          )
        })}

        {coursesRes.success && courses.length === 0 && (
          <div className="text-center py-10 bg-card/50 rounded-xl border border-card-border/50">
            <div className="text-text-muted text-[14px]">ยังไม่มีคอร์สเรียนที่เปิดสอน</div>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            baseUrl={`/instructors/${id}/courses`}
          />
        )}
      </div>
    </div>
  )
}
