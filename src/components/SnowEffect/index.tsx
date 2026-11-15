"use client"

import { useEffect, useRef } from "react"

interface Flake {
  x: number
  y: number
  radius: number
  speedY: number
  speedX: number
  sway: number
  swaySpeed: number
  opacity: number
}

export default function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    // Number of flakes based on screen width (fewer on mobile to maximize battery performance)
    const flakeCount = width < 768 ? 40 : 85
    const flakes: Flake[] = []

    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: Math.random() * 0.4 - 0.2,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.008,
        opacity: Math.random() * 0.6 + 0.25,
      })
    }

    let isVisible = true
    const handleVisibilityChange = () => {
      isVisible = !document.hidden
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < flakeCount; i++) {
        const flake = flakes[i]

        flake.sway += flake.swaySpeed
        flake.y += flake.speedY
        flake.x += Math.sin(flake.sway) * 0.6 + flake.speedX

        // Reset if moved off screen
        if (flake.y > height + 10) {
          flake.y = -10
          flake.x = Math.random() * width
        }
        if (flake.x > width + 10) {
          flake.x = -10
        } else if (flake.x < -10) {
          flake.x = width + 10
        }

        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full"
    />
  )
}

