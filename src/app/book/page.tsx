import Breadcrumbs from "@/components/Breadcrumbs"
import { getUserClassesSummary } from "../actions/course"
import { getUser } from "../actions/auth"
import { SumaryCourse } from "@/types/course"
import BookingListAll from "@/components/Booking/ListAll"

export default async function BookPage() {
  const user = await getUser()
  if (!user) return null

  const _summary = await getUserClassesSummary(user.id)
  const summary = _summary?.data as SumaryCourse[]

  return (
    <div className="p-6 flex flex-col min-h-screen pb-[100px]">
      <Breadcrumbs title={"เลือกวันและเวลา"} step={"STEP 3"} />

      <BookingListAll summary={summary} />
    </div>
  )
}
