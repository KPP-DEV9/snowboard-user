import { getSession } from "@/app/actions/auth"
import { getUserBalance } from "@/app/actions/userBalance"
import { CreditCard } from "@/components/Credit"
import Booking from "@/components/Booking"
import Tab from "@/components/Ui/Tab"
import Recent from "@/components/Recent"
import Welcome from "@/components/Welcome"
import { Suspense } from "react"
import Loading from "@/components/Ui/Loading"
import Events from "@/components/Events"
import { Card } from "@/components/Ui/Card/Card"
import { getUserClassesSummary } from "../actions/course"
import { SumaryCourse } from "@/types/course"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.user) return null

  // let credit: Credit | null = null
  // const res = await getCredit(session.user.id)
  // if (res && res.success) {
  //   credit = res.data || null
  // }

  const balanceRes = await getUserBalance()
  const userBalances = balanceRes.success ? balanceRes.data : []

  const _summary = await getUserClassesSummary(session.user.id)
  const summary = _summary?.data as SumaryCourse[]

  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen">
      <Welcome user={session.user} />

      <CreditCard summary={summary} userBalances={userBalances} />

      <Suspense
        fallback={
          <Card interactive className="p-8">
            <Loading type="cycle" />
          </Card>
        }
      >
        <Events />
        <Booking userId={session?.user?.id} summary={summary} />
      </Suspense>

      <Tab />

      <Recent userId={session?.user?.id} limit={3} />
    </div>
  )
}
