"use client"

import React, { createContext, useContext } from "react"
import { Token } from "@/types/user"
import { User } from "@/types/user"

interface SessionContextType {
  token: Token | null
  user: User | null
}

const SessionContext = createContext<SessionContextType>({
  token: null,
  user: null,
})

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: { token: Token | null; user: User | null }
}) {
  return <SessionContext.Provider value={{ ...session }}>{children}</SessionContext.Provider>
}

export function useSession() {
  return useContext(SessionContext)
}
