import { getInstructors } from "@/app/actions/instructor"
import Breadcrumbs from "@/components/Breadcrumbs"
import { Card } from "@/components/Ui/Card/Card"
import { Pagination } from "@/components/Ui/Pagination"
import Link from "next/link"
import numeral from "numeral"

interface InstructorsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function InstructorsPage({ searchParams }: InstructorsPageProps) {
  const resolvedSearchParams = await searchParams
  const page =
    typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1
  const limit = 10

  const { success, data: paginatedData, error } = await getInstructors(page, limit)
  const instructors = paginatedData?.data || []
  const totalPages = paginatedData?.total_pages || 1

  return (
    <div className="p-6 flex flex-col min-h-screen pb-[100px]">
      <Breadcrumbs title={"เลือกโปร"} step={"STEP 1"} />

      {error && (
        <div className="text-red-500 text-[14px] bg-red-500/10 p-4 rounded-lg mb-4 border border-red-500/20">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {instructors.map((instructor) => {
          const user = instructor.user
          const proName = user?.first_name
            ? `${user.first_name} ${user.last_name}`
            : user?.nickname || ""

          return (
            <Link href={`/instructors/${instructor.id}`} key={instructor.id} className="block">
              <Card interactive className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-[#222] rounded-xl flex-shrink-0 border border-card-border overflow-hidden">
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={proName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-subtle">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[16px] font-bold text-foreground uppercase">
                          {proName}
                        </h3>
                        <p className="text-[12px] text-gold mt-0.5">
                          {instructor.speciality || "General SNOWVIBES TOURS Instruction"}
                        </p>
                      </div>
                    </div>

                    <p className="text-[12px] text-text-subtle line-clamp-2 mt-2">
                      {instructor.bio || "ไม่มีประวัติการสอน"}
                    </p>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-card-border">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted uppercase tracking-wider">
                          ประสบการณ์
                        </span>
                        <span className="text-[14px] font-bold text-foreground">
                          {instructor.experience_years} ปี
                        </span>
                      </div>
                      <div className="w-px h-8 bg-card-border"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted uppercase tracking-wider">
                          เรทราคา/ชม.
                        </span>
                        <span className="text-[14px] font-bold text-gold">
                          ฿{numeral(instructor.hourly_rate).format("0,0.00")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}

        {success && instructors.length === 0 && (
          <div className="text-center py-10 text-text-muted text-[14px]">
            ไม่มีรายชื่อโปรผู้สอนในขณะนี้
          </div>
        )}

        <Pagination totalPages={totalPages} currentPage={page} baseUrl="/instructors" />
      </div>
    </div>
  )
}
