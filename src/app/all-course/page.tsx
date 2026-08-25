import { getCourses } from "@/app/actions/course"
import AllCourseClient from "./AllCourseClient"

export default async function AllCoursePage() {
  const res = await getCourses({ limit: 50 })
  const initialCourses = res?.data?.data || []

  return <AllCourseClient initialCourses={initialCourses} />
}
