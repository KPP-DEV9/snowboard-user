import { getCourses } from "@/app/actions/course"
import { Card } from "@/components/Ui/Card/Card"
import Breadcrumbs from "@/components/Breadcrumbs"
import { Pagination } from "@/components/Ui/Pagination"
import Link from "next/link"
import numeral from "numeral"
import { ProgramTypeRenderValue } from "@/utils/ProgramTypeRender"

interface CoursesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedSearchParams = await searchParams
  const page =
    typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1
  const limit = 10

  const { success, data: paginatedData, error } = await getCourses(page, limit)
  const courses = paginatedData?.data || []
  const totalPages = paginatedData?.total_pages || 1

  return (
    <div className="p-6 flex flex-col min-h-screen pb-[100px]">
      <Breadcrumbs title={"ซื้อคอร์สเรียน"} step={"STEP 2"} />

      {error && (
        <div className="text-red-500 text-[14px] bg-red-500/10 p-4 rounded-lg mb-4 border border-red-500/20">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {courses.map((course) => {
          const instructor = course.instructor
          const user = instructor?.user
          const proName = user?.first_name
            ? `${user.first_name} ${user.last_name}`
            : user?.nickname || ""

          return (
            <Link
              key={course.id}
              href={`/instructors/${instructor?.id}/courses/${course.id}`}
              className="block"
            >
              <Card interactive className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[18px] font-bold text-foreground">{course.title}</h3>
                      <p className="text-[12px] text-text-muted mt-1">สอนโดย {proName}</p>
                    </div>
                  </div>

                  <div className="bg-gold/20 text-gold text-[10px] font-bold px-2 py-1 rounded w-fit">
                    {course.course_type.toUpperCase()}
                  </div>

                  {course.description && (
                    <p className="text-[14px] text-text-subtle line-clamp-2">
                      {course.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-black/20 p-2 rounded flex flex-col items-center">
                      <span className="text-[10px] text-text-muted">ระยะเวลา</span>
                      <span className="text-[14px] font-bold">
                        {
                          ProgramTypeRenderValue({
                            type: course.program_type,
                            hours: course.total_hour,
                            times: course?.total_times,
                            days: course?.total_days,
                          })?.text
                        }
                      </span>
                    </div>
                    <div className="bg-black/20 p-2 rounded flex flex-col items-center">
                      <span className="text-[10px] text-text-muted">ผู้เรียนสูงสุด</span>
                      <span className="text-[14px] font-bold">
                        {numeral(course.max_students).format("0,0")} คน
                      </span>
                    </div>
                    <div className="bg-black/20 p-2 rounded flex flex-col items-center">
                      <span className="text-[10px] text-gold">ราคา</span>
                      <span className="text-[14px] font-bold text-gold">
                        {numeral(course.price).format("0,0")}
                      </span>
                      <span className="text-[10px] text-text-muted mt-1 uppercase">บาท</span>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <span className="text-[12px] font-bold text-gold border border-gold/50 rounded-lg px-4 py-2 flex items-center justify-center hover:bg-gold hover:text-black transition-colors w-full">
                      ดูรายละเอียด / ซื้อคอร์ส
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}

        {success && courses.length === 0 && (
          <div className="text-center py-10 text-text-muted text-[14px]">
            ไม่มีคอร์สเรียนเปิดให้บริการในขณะนี้
          </div>
        )}

        <Pagination totalPages={totalPages} currentPage={page} baseUrl="/courses" />
      </div>
    </div>
  )
}
