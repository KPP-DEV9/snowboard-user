import { getCourses } from "@/app/actions/course"
import { Course } from "@/types/model"
import AllCourseClient from "./AllCourseClient"
import LayoutPage from "@/components/Layout"

interface AllCoursePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AllCoursePage({ searchParams }: AllCoursePageProps) {
  const resolvedParams = await searchParams

  const cleanParams: Record<string, any> = {}
  if (resolvedParams) {
    Object.entries(resolvedParams).forEach(([key, val]) => {
      if (typeof val === "string") {
        cleanParams[key] = val
      }
    })
  }

  let courseType = cleanParams.courseType || cleanParams.type

  const queryParams = { ...cleanParams }

  if (cleanParams.category === "ski_resorts") {
    courseType = cleanParams.courseType || "SKI"
    delete queryParams.category
  }
  courseType = courseType || "all"

  const page = cleanParams.page ? parseInt(cleanParams.page) : 1
  const limit = cleanParams.limit ? parseInt(cleanParams.limit) : 12

  const res = await getCourses({
    page,
    limit,
    ...queryParams,
    courseType,
  })
  const initialCourses = (
    Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
  ) as Course[]

  const totalPages = res?.data?.total_pages || (res as any)?.total_pages || 1
  const currentPage = res?.data?.page || (res as any)?.page || page

  return (
    <LayoutPage>
      <AllCourseClient
        initialCourses={initialCourses}
        initialParams={{ ...cleanParams, courseType }}
        initialPage={currentPage}
        initialTotalPages={totalPages}
      />
      <br />
      <br />
      <br />
      <br />
    </LayoutPage>
  )
}
