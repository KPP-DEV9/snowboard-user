import { getCourseById } from "@/app/actions/course"
import { getSession } from "@/app/actions/auth"
import { getAssetMasters } from "@/app/actions/assetMaster"
import { getOptionMasters } from "@/app/actions/optionMaster"
import { getEnrollmentById } from "@/app/actions/enrollment"
import { notFound, redirect } from "next/navigation"
import BookingFormClient from "./BookingFormClient"

interface BookingPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const resolvedSearchParams = await searchParams
  const enrollmentId =
    typeof resolvedSearchParams.enrollment_id === "string"
      ? resolvedSearchParams.enrollment_id
      : ""

  let enrollment = null
  if (enrollmentId) {
    const res = await getEnrollmentById(enrollmentId)
    if (res.success && res.data) {
      enrollment = res.data
    }
  }

  const courseId =
    (typeof resolvedSearchParams.course_id === "string" ? resolvedSearchParams.course_id : "") ||
    enrollment?.course_id ||
    ""
  const roundId =
    (typeof resolvedSearchParams.round_id === "string" ? resolvedSearchParams.round_id : "") ||
    enrollment?.round_id ||
    ""
  const adults =
    typeof resolvedSearchParams.adults === "string"
      ? parseInt(resolvedSearchParams.adults, 10)
      : enrollment?.adult_count || 1
  const childrenCount =
    typeof resolvedSearchParams.children === "string"
      ? parseInt(resolvedSearchParams.children, 10)
      : enrollment?.child_count || 0

  if (!courseId) {
    return notFound()
  }

  const { success, data: course } = await getCourseById(courseId, 0)

  if (!success || !course) {
    return notFound()
  }

  const session = await getSession()
  if (!session?.user) return redirect("/signin")

  const { data: assets } = await getAssetMasters(course.course_type.toUpperCase())
  const { data: options } = await getOptionMasters()

  return (
    <div className="min-h-screen bg-[#304B65] pb-24 font-sans selection:bg-[#568759]/30">
      <BookingFormClient
        course={course}
        roundId={roundId}
        adultsCount={adults}
        childrenCount={childrenCount}
        user={session.user}
        assets={assets || []}
        options={options || []}
        enrollment={enrollment}
      />
    </div>
  )
}
