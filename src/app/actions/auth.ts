"use server"

import { Token, User } from "@/types/user"
import { cookies } from "next/headers"
import { getCredit } from "./credit"

export async function setSession(token: string, user: any) {
  const cookieStore = await cookies()
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  if (user) {
    const minimalUser: User = {
      id: user.id,
      username: user.username,
      line_user_id: user.line_user_id,
      nickname: user.nickname || user.nick_name || user.name,
      role_id: user.role_id,
      role: user.role,
      description: user.description,
      bookings: user.bookings,
      branch: user.branch,
      profile_image: user.profile_image,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
      user_profile: user.user_profile
        ? {
            ...user.user_profile,
            user: undefined,
          }
        : undefined,
    }

    const userString = JSON.stringify(minimalUser)
    cookieStore.set("user", userString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })
  }
}

export async function getUser() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("user")?.value
  return userCookie ? (JSON.parse(userCookie) as User) : null
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value as Token
  const userCookie = cookieStore.get("user")?.value
  const user = userCookie ? (JSON.parse(userCookie) as User) : null
  const credit = await getCredit(user?.id as string)

  return { token, user, credit }
}

export async function getToken() {
  return (await cookies()).get("token")?.value
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete("token")
  cookieStore.delete("user")
}
