"use client";

import React, { createContext, useContext } from "react";
import { Token } from "@/types/user";
import { User } from "@/types/user";
import { Credit } from "@/types/credit";

interface SessionContextType {
  token: Token | null;
  user: User | null;
  credit: Credit | null;
}

const SessionContext = createContext<SessionContextType>({
  token: null,
  user: null,
  credit: null,
});

export function SessionProvider({
  children,
  session,
  credit,
}: {
  children: React.ReactNode;
  session: { token: Token | null; user: User | null };
  credit: Credit | null;
}) {
  return (
    <SessionContext.Provider value={{ ...session, credit }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
