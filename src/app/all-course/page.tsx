import { getCourses } from "@/app/actions/course"
import { Course } from "@/types/model"
import AllCourseClient from "./AllCourseClient"
import LayoutPage from "@/components/Layout"

export default async function AllCoursePage() {
  const res = await getCourses({ limit: 50 })
  const initialCourses = (
    Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
  ) as Course[]

  return (
    <LayoutPage>
      <AllCourseClient initialCourses={initialCourses} />
    </LayoutPage>
  )
}
