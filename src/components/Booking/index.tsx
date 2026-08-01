import { getUserClassesSummary } from "@/app/actions/course"
import { SumaryCourse } from "@/types/course"

import BookingList from "./List"

interface Props {
  userId: string
  summary: SumaryCourse[]
}

export default async function Booking({ userId, summary }: Props) {
  if (!userId) return null

  return <BookingList summary={summary} />
}
