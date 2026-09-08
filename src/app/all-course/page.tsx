import { getCourses } from "@/app/actions/course"
import { Course } from "@/types/course"
import AllCourseClient from "./AllCourseClient"

export default async function AllCoursePage() {
  const res = await getCourses({ limit: 50 })
  const initialCourses = (Array.isArray(res?.data?.data)
    ? res.data.data
    : Array.isArray(res?.data)
      ? res.data
      : []) as Course[]

  return <AllCourseClient initialCourses={initialCourses} />
}
