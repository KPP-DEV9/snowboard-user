import { getHotels } from "@/app/actions/hotel"
import LayoutPage from "@/components/Layout"
import HotelsClient from "./HotelsClient"

export default async function HotelsPage() {
  const result = await getHotels()
  if (!result.success) {
    throw new Error(result.error)
  }

  return (
    <LayoutPage>
      <HotelsClient initialHotels={result.data} />
    </LayoutPage>
  )
}

