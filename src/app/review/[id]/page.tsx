import { getUserClassesById } from "@/app/actions/course"
import Breadcrumbs from "@/components/Breadcrumbs"
import { notFound } from "next/navigation"
import { InstructorRatingForm } from "@/components/Analysis/InstructorRatingForm"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ReviewInstructorPage({ params }: PageProps) {
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
    : instructor?.nickname || "ผู้ฝึกสอน"

  return (
    <div className="min-h-screen text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 w-full">
        <Breadcrumbs title={"ประเมินผู้สอน"} step={"REVIEW"} urlBack={`/analysis/${id}`} />

        <div className="pt-4 mt-8 max-w-3xl mx-auto w-full">
          <InstructorRatingForm
            bookingId={id}
            instructorId={course?.instructor_id}
            userId={userClasses.user_id}
            instructorName={proName}
          />
        </div>
      </div>
    </div>
  )
}
