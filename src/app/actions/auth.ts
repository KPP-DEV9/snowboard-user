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
    cookieStore.set("user", JSON.stringify(user), {
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
