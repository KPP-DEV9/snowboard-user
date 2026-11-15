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

  if (
    cleanParams.program_type === "CLASS" ||
    cleanParams.program_type === "TRIP" ||
    cleanParams.category === "trips" ||
    cleanParams.category === "classes_training"
  ) {
    courseType = cleanParams.courseType || "SNOWBOARD"
  } else if (cleanParams.category === "ski_resorts") {
    courseType = cleanParams.courseType || "SKI"
  }

  const res = await getCourses({
    limit: 50,
    ...cleanParams,
    courseType,
  })
  const initialCourses = (
    Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
  ) as Course[]

  return (
    <LayoutPage>
      <AllCourseClient
        initialCourses={initialCourses}
        initialParams={{ ...cleanParams, courseType }}
      />
    </LayoutPage>
  )
}
