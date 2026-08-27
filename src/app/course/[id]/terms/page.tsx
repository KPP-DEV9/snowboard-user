import { getCourseById } from "@/app/actions/course"
import { getUser } from "@/app/actions/auth"
import { notFound, redirect } from "next/navigation"
import LayoutPage from "@/components/Layout"
import TermsClient from "./TermsClient"

interface CourseTermsPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ round_id?: string; adults?: string; children?: string }>
}

export default async function CourseTermsPage({ params, searchParams }: CourseTermsPageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const resolvedSearchParams = await searchParams
  const roundId = resolvedSearchParams.round_id || ""
  const adults = resolvedSearchParams.adults || "1"
  const children = resolvedSearchParams.children || "0"

  const user = await getUser()
  if (!user) {
    redirect("/signin")
  }

  const { success, data: course } = await getCourseById(id, 0)

  if (!success || !course) {
    return notFound()
  }

  // If there are no terms conditions master configured, redirect directly to booking
  if (!course.terms_conditions_master || course.terms_conditions_master.length === 0) {
    redirect(
      `/booking?course_id=${course.id}&round_id=${roundId}&adults=${adults}&children=${children}`,
    )
  }

  return (
    <LayoutPage isLicense={false}>
      <div className="min-h-screen bg-[#304B65] pb-24 font-sans selection:bg-[#568759]/30">
        <TermsClient
          course={course}
          roundId={roundId}
          adults={adults}
          childrenCount={children}
          user={user}
        />
      </div>
    </LayoutPage>
  )
}
