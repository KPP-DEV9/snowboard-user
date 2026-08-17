import { getCourseById } from "@/app/actions/course"
import { getSession } from "@/app/actions/auth"
import { getEnrollmentById } from "@/app/actions/enrollment"
import { getAssetMasters } from "@/app/actions/assetMaster"
import { getOptionMasters } from "@/app/actions/optionMaster"
import { notFound, redirect } from "next/navigation"
import LayoutPage from "@/components/Layout"
import PaymentClient from "./PaymentClient"

interface PaymentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const resolvedSearchParams = await searchParams
  const courseId =
    typeof resolvedSearchParams.course_id === "string" ? resolvedSearchParams.course_id : ""
  const roundId =
    typeof resolvedSearchParams.round_id === "string" ? resolvedSearchParams.round_id : ""
  const enrollmentId =
    typeof resolvedSearchParams.enrollment_id === "string" ? resolvedSearchParams.enrollment_id : ""
  const adults =
    typeof resolvedSearchParams.adults === "string" ? parseInt(resolvedSearchParams.adults, 10) : 1
  const childrenCount =
    typeof resolvedSearchParams.children === "string"
      ? parseInt(resolvedSearchParams.children, 10)
      : 0

  if (!courseId) {
    return notFound()
  }

  const session = await getSession()
  if (!session?.user) return redirect("/signin")

  const { success, data: course } = await getCourseById(courseId)
  if (!success || !course) {
    return notFound()
  }

  let enrollment = null
  if (enrollmentId) {
    const { success: enrollSuccess, data: enrollData } = await getEnrollmentById(enrollmentId)
    if (enrollSuccess && enrollData) {
      enrollment = enrollData
    }
  }

  return (
    <LayoutPage isLicense={false}>
      <PaymentClient
        course={course}
        enrollment={enrollment}
        roundId={roundId}
        adultsCount={adults}
        childrenCount={childrenCount}
      />
    </LayoutPage>
  )
}
