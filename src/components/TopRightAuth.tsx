"use client"

import { useEffect, useState } from "react"
import { getUser } from "@/app/actions/auth"
import Link from "next/link"
import { User as UserType } from "@/types/user"

export default function TopRightAuth() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser()
      .then((u) => {
        setUser(u as UserType)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return null

  if (user) {
    return null
  }

  return (
    <Link
      href="/signin"
      className="absolute top-2 right-2 text-[#4F7354] px-3 py-1 rounded-lg font-bold text-xs shadow-md hover:bg-gray-50 transition-all z-50"
    >
      เข้าสู่ระบบ
    </Link>
  )
}
