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
    const minimalUser = {
      id: user.id,
      username: user.username,
      line_user_id: user.line_user_id,
      nickname: user.nickname || user.nick_name || user.name,
      first_name: user.first_name,
      last_name: user.last_name,
      telephone: user.telephone,
      email: user.email,
      role_id: user.role_id,
      role: user.role ? { id: user.role.id, name: user.role.name } : undefined,
      is_active: user.is_active,
      profile_image: user.profile_image,
      sex: user.sex,
      student_profile: user.student_profile
        ? {
            ...user.student_profile,
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
