import { useState, useEffect, useCallback, useRef } from "react"

export interface WebSocketMessage {
  topic: string
  detail: string
  status: string
  userId: string
}

interface UseWebSocketReturn {
  socket: WebSocket | null
  isConnected: boolean
  sendMessage: (message: string) => void
  onMessage: (handler: (data: WebSocketMessage) => void) => void
}

export const useWebSocket = (userId: string | undefined): UseWebSocketReturn => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null)
  const messageHandlerRef = useRef<((data: WebSocketMessage) => void) | null>(null)
  const maxRetries = 5
  const retryCount = useRef(0)

  const connect = useCallback(() => {
    if (!userId) return

    // Use environment variable for WebSocket URL or fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_WS_URL?.replace("https", "wss")
    const wsUrl = `${baseUrl}/ws?userId=${userId}`

    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected(true)
      setSocket(ws)
      retryCount.current = 0 // Reset retries on successful connection

      // Start heartbeat: send "ping" every 30 seconds
      heartbeatRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("ping")
          console.log("Heartbeat ping sent")
        }
      }, 30000)
    }

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data)

      // Ignore heartbeat pong responses
      if (event.data === "pong") return

      try {
        const parsed: WebSocketMessage = JSON.parse(event.data)
        if (messageHandlerRef.current) {
          messageHandlerRef.current(parsed)
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err)
      }
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
      setIsConnected(false)
      setSocket(null)

      // Stop heartbeat
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
        heartbeatRef.current = null
      }

      // Attempt to reconnect
      if (retryCount.current < maxRetries) {
        reconnectTimeoutRef.current = setTimeout(() => {
          retryCount.current += 1
          connect()
        }, 3000) // Retry after 3 seconds
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      ws.close()
    }

    return ws
  }, [userId])

  useEffect(() => {
    const ws = connect()

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (ws) {
        ws.close()
      }
    }
  }, [connect])

  const sendMessage = useCallback(
    (message: string) => {
      if (socket && isConnected) {
        socket.send(message)
      } else {
        console.warn("WebSocket is not connected. Cannot send message.")
      }
    },
    [socket, isConnected],
  )

  const onMessage = useCallback((handler: (data: WebSocketMessage) => void) => {
    messageHandlerRef.current = handler
  }, [])

  return { socket, isConnected, sendMessage, onMessage }
}
