"use client"

import { createContext, useContext, ReactNode } from "react"
import { useWebSocket, type WebSocketMessage } from "@/hooks/useWebSocket"

interface WebSocketContextType {
  socket: WebSocket | null
  isConnected: boolean
  sendMessage: (message: string) => void
  onMessage: (handler: (data: WebSocketMessage) => void) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

interface WebSocketProviderProps {
  children: ReactNode
  userId?: string
}

export function WebSocketProvider({ children, userId }: WebSocketProviderProps) {
  const webSocket = useWebSocket(userId)

  return <WebSocketContext.Provider value={webSocket}>{children}</WebSocketContext.Provider>
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider")
  }
  return context
}
