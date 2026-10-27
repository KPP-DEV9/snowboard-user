"use client"

import { createContext, useContext, ReactNode } from "react"
import {
  useMqtt,
  type MqttMessage,
  type MqttMessageHandler,
  type UseMqttReturn,
} from "@/hooks/useMqtt"

const MqttContext = createContext<UseMqttReturn | undefined>(undefined)

interface MqttProviderProps {
  children: ReactNode
  userId?: string
}

export function MqttProvider({ children, userId }: MqttProviderProps) {
  const mqtt = useMqtt(userId)

  return <MqttContext.Provider value={mqtt}>{children}</MqttContext.Provider>
}

export function useMqttContext() {
  const context = useContext(MqttContext)
  if (context === undefined) {
    throw new Error("useMqttContext must be used within an MqttProvider")
  }
  return context
}

export { type MqttMessage, type MqttMessageHandler, type UseMqttReturn }
