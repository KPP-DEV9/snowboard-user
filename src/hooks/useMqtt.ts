"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import mqtt, { type MqttClient } from "mqtt"

export interface MqttMessage {
  topic: string
  mqttTopic?: string
  detail?: string
  status?: string
  userId?: string
  [key: string]: unknown
}

export type MqttMessageHandler = (data: MqttMessage, topic: string) => void

export interface UseMqttReturn {
  client: MqttClient | null
  isConnected: boolean
  subscribe: (topic: string) => void
  unsubscribe: (topic: string) => void
  publish: (topic: string, message: string | object) => void
  sendMessage: (message: string) => void
  onMessage: (handler: MqttMessageHandler) => () => void
}

export const useMqtt = (userId: string | undefined): UseMqttReturn => {
  const [client, setClient] = useState<MqttClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const clientRef = useRef<MqttClient | null>(null)
  const listenersRef = useRef<Set<MqttMessageHandler>>(new Set())

  useEffect(() => {
    if (!userId) return

    const rawMqtt = process.env.NEXT_PUBLIC_MQTT_URL || "ws://localhost:3001"

    let brokerUrl = rawMqtt
    if (brokerUrl.startsWith("http://")) {
      brokerUrl = brokerUrl.replace(/^http:\/\//i, "ws://")
    } else if (brokerUrl.startsWith("https://")) {
      brokerUrl = brokerUrl.replace(/^https:\/\//i, "wss://")
    }

    const clientId = `user_${userId}_${Math.random().toString(16).substring(2, 10)}`
    const defaultTopic = `user/${userId}/#`

    const MAX_RECONNECT_ATTEMPTS = 5
    let reconnectAttempts = 0

    const mqttClient = mqtt.connect(brokerUrl, {
      clientId,
      clean: true,
      reconnectPeriod: 3000,
      connectTimeout: 30 * 1000,
      keepalive: 30,
    })

    clientRef.current = mqttClient
    setClient(mqttClient)

    mqttClient.on("connect", () => {
      console.log(`MQTT connected to ${brokerUrl}`)
      setIsConnected(true)
      reconnectAttempts = 0
      mqttClient.subscribe(defaultTopic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${defaultTopic}:`, err)
        } else {
          console.log(`Subscribed to topic: ${defaultTopic}`)
        }
      })
    })

    mqttClient.on("message", (topic, payload) => {
      const payloadString = payload.toString()
      console.log(`MQTT message received on [${topic}]:`, payloadString)

      let parsedData: Record<string, unknown> = {}
      try {
        const parsed = JSON.parse(payloadString)
        if (typeof parsed === "object" && parsed !== null) {
          parsedData = parsed
        } else {
          parsedData = { detail: String(parsed) }
        }
      } catch {
        parsedData = { detail: payloadString }
      }

      const topicSegments = topic.split("/")
      const lastSegment = topicSegments[topicSegments.length - 1]
      const eventTopic =
        (typeof parsedData.topic === "string" && parsedData.topic) || lastSegment || topic

      const message: MqttMessage = {
        ...parsedData,
        topic: eventTopic,
        mqttTopic: topic,
        userId,
      }

      listenersRef.current.forEach((listener) => {
        try {
          listener(message, topic)
        } catch (err) {
          console.error("Error in MQTT message listener:", err)
        }
      })
    })

    mqttClient.on("reconnect", () => {
      reconnectAttempts += 1
      console.log(`MQTT reconnecting... (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`)
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.warn(
          `MQTT reconnect failed after ${MAX_RECONNECT_ATTEMPTS} attempts. Closing connection.`,
        )
        mqttClient.end(true)
        setIsConnected(false)
      }
    })

    mqttClient.on("close", () => {
      console.log("MQTT disconnected")
      setIsConnected(false)
    })

    mqttClient.on("error", (error) => {
      console.error("MQTT error:", error)
    })

    return () => {
      console.log("Cleaning up MQTT client...")
      mqttClient.end(true)
      clientRef.current = null
      setClient(null)
      setIsConnected(false)
    }
  }, [userId])

  const subscribe = useCallback((topic: string) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err)
        } else {
          console.log(`Subscribed to ${topic}`)
        }
      })
    }
  }, [])

  const unsubscribe = useCallback((topic: string) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.unsubscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to unsubscribe from ${topic}:`, err)
        } else {
          console.log(`Unsubscribed from ${topic}`)
        }
      })
    }
  }, [])

  const publish = useCallback(
    (topic: string, message: string | object) => {
      if (clientRef.current && isConnected) {
        const payload = typeof message === "string" ? message : JSON.stringify(message)
        clientRef.current.publish(topic, payload)
      } else {
        console.warn("MQTT is not connected. Cannot publish message.")
      }
    },
    [isConnected],
  )

  const sendMessage = useCallback(
    (message: string) => {
      const topic = userId ? `user/${userId}/client-message` : "user/client-message"
      publish(topic, message)
    },
    [publish, userId],
  )

  const onMessage = useCallback((handler: MqttMessageHandler) => {
    listenersRef.current.add(handler)
    return () => {
      listenersRef.current.delete(handler)
    }
  }, [])

  return { client, isConnected, subscribe, unsubscribe, publish, sendMessage, onMessage }
}
