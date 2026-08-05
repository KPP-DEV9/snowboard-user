import { getUser } from "@/app/actions/auth"
import MenuFooterClient from "./MenuFooterClient"

export default async function MenuFooter() {
  const user = await getUser()

  if (!user) return null

  return <MenuFooterClient />
}
