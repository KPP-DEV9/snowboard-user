import { getEnrollmentByUserID } from "@/app/actions/enrollment"
import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { Enrollment } from "@/types/enrollment"
import LayoutPage from "@/components/Layout"
import MyTripClient from "./MyTripClient"

export default async function MyTripPage() {
  const user = await getUser()
  if (!user) {
    redirect("/signin")
  }

  const { success, data } = await getEnrollmentByUserID(1, 50)
  const enrollments: Enrollment[] = success && Array.isArray(data?.data) ? data.data : []

  return (
    <LayoutPage isLicense={false}>
      <MyTripClient enrollments={enrollments} />
    </LayoutPage>
  )
}

