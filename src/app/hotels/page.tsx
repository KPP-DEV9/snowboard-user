import { getHotels } from "@/app/actions/hotel"
import LayoutPage from "@/components/Layout"
import HotelsClient from "./HotelsClient"

export default async function HotelsPage() {
  const { data: hotels = [] } = await getHotels()

  return (
    <LayoutPage>
      <HotelsClient initialHotels={hotels} />
    </LayoutPage>
  )
}

