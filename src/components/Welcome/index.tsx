import { User } from "@/types/user"
import { format } from "date-fns"
import Link from "next/link"
import MenuBurger from "./MenuBurger"

interface Props {
  user: User
}

export default function Welcome({ user }: Props) {
  const name = !user.first_name ? user.nickname : `${user?.first_name} ${user?.last_name}`

  return (
    <header className="flex justify-between items-start">
      <div>
        <p className="text-[14px] text-text-muted mb-1">สวัสดี...</p>
        <Link
          href="/profile"
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          {user.profile_image && (
            <img
              className="w-8 h-8 rounded-full border border-gold/30 object-cover"
              src={user.profile_image}
              alt=""
            />
          )}
          <div>
            <h1 className="text-[24px] font-bold text-foreground flex items-center gap-2">
              {name}
              <span className="text-gold">•</span>
            </h1>
          </div>
        </Link>
        <p className="text-[12px] text-text-subtle mt-1">
          วันที่ {format(new Date(), "dd MMMM yyyy")}
        </p>
      </div>

      <MenuBurger />
    </header>
  )
}
