"use client"
import { getUser } from "@/app/actions/auth"
import MenuFooterClient from "./MenuFooterClient"
import { useEffect, useState } from "react"

export default function MenuFooter() {
  const [isLogged, setIsLogged] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser().then((user) => {
      if (user) setIsLogged(true)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  if (loading || !isLogged) return null

  return <MenuFooterClient />
}
