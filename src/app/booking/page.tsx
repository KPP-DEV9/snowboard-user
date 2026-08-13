import { getCourseById } from "@/app/actions/course"
import { getSession } from "@/app/actions/auth"
import { notFound, redirect } from "next/navigation"
import BookingFormClient from "./BookingFormClient"

interface BookingPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const resolvedSearchParams = await searchParams
  const courseId =
    typeof resolvedSearchParams.course_id === "string" ? resolvedSearchParams.course_id : ""
  const roundId =
    typeof resolvedSearchParams.round_id === "string" ? resolvedSearchParams.round_id : ""
  const adults =
    typeof resolvedSearchParams.adults === "string" ? parseInt(resolvedSearchParams.adults, 10) : 1
  const childrenCount =
    typeof resolvedSearchParams.children === "string"
      ? parseInt(resolvedSearchParams.children, 10)
      : 0

  if (!courseId) {
    return notFound()
  }

  const { success, data: course } = await getCourseById(courseId, 0)

  if (!success || !course) {
    return notFound()
  }

  const session = await getSession()
  if (!session?.user) return redirect("/signin")

  return (
    <div className="min-h-screen bg-[#304B65] pb-24 font-sans selection:bg-[#568759]/30">
      <BookingFormClient
        course={course}
        roundId={roundId}
        adultsCount={adults}
        childrenCount={childrenCount}
      />
    </div>
  )
}
