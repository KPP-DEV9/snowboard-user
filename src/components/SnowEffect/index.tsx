"use client"

import { useEffect, useRef } from "react"

interface Flake {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  sway: number
  swaySpeed: number
  swayAmp: number
  rotation: number
  rotationSpeed: number
  opacity: number
  spriteIndex: number
}

// Generate offscreen sprite canvases once for maximum rendering performance
function createSnowflakeSprites(): HTMLCanvasElement[] {
  if (typeof document === "undefined") return []

  const SPRITE_SIZE = 96
  const half = SPRITE_SIZE / 2
  const maxR = SPRITE_SIZE * 0.42

  // Sprite 0: Classic 6-arm Dendrite (หิมะกิ่งก้าน 6 แฉก)
  const c0 = document.createElement("canvas")
  c0.width = c0.height = SPRITE_SIZE
  const g0 = c0.getContext("2d")!
  g0.strokeStyle = "#FFFFFF"
  g0.fillStyle = "#FFFFFF"
  g0.lineWidth = 1.6
  g0.lineCap = "round"
  g0.lineJoin = "round"

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3
    g0.save()
    g0.translate(half, half)
    g0.rotate(angle)

    // Main spine
    g0.beginPath()
    g0.moveTo(0, 0)
    g0.lineTo(0, -maxR)
    g0.stroke()

    // Outer V-branches
    g0.beginPath()
    g0.moveTo(0, -maxR * 0.72)
    g0.lineTo(-maxR * 0.28, -maxR * 0.92)
    g0.moveTo(0, -maxR * 0.72)
    g0.lineTo(maxR * 0.28, -maxR * 0.92)
    g0.stroke()

    // Inner V-branches
    g0.beginPath()
    g0.moveTo(0, -maxR * 0.42)
    g0.lineTo(-maxR * 0.24, -maxR * 0.62)
    g0.moveTo(0, -maxR * 0.42)
    g0.lineTo(maxR * 0.24, -maxR * 0.62)
    g0.stroke()

    g0.restore()
  }
  // Center ring
  g0.beginPath()
  g0.arc(half, half, maxR * 0.12, 0, Math.PI * 2)
  g0.stroke()

  // Sprite 1: Stellar Snowflake with Arrowhead tips (เกล็ดหิมะทรงลูกศร)
  const c1 = document.createElement("canvas")
  c1.width = c1.height = SPRITE_SIZE
  const g1 = c1.getContext("2d")!
  g1.strokeStyle = "#FFFFFF"
  g1.fillStyle = "#FFFFFF"
  g1.lineWidth = 1.6
  g1.lineCap = "round"
  g1.lineJoin = "round"

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3
    g1.save()
    g1.translate(half, half)
    g1.rotate(angle)

    // Main spine
    g1.beginPath()
    g1.moveTo(0, 0)
    g1.lineTo(0, -maxR)
    g1.stroke()

    // Diamond / arrow tip
    g1.beginPath()
    g1.moveTo(0, -maxR)
    g1.lineTo(-maxR * 0.18, -maxR * 0.8)
    g1.lineTo(0, -maxR * 0.68)
    g1.lineTo(maxR * 0.18, -maxR * 0.8)
    g1.closePath()
    g1.stroke()

    // Mid cross needles
    g1.beginPath()
    g1.moveTo(-maxR * 0.2, -maxR * 0.45)
    g1.lineTo(maxR * 0.2, -maxR * 0.45)
    g1.stroke()

    g1.restore()
  }
  // Center dot
  g1.beginPath()
  g1.arc(half, half, maxR * 0.1, 0, Math.PI * 2)
  g1.fill()

  // Sprite 2: Crystal Flower / Hexagonal plate (เกล็ดคริสตัลลายหกเหลี่ยม)
  const c2 = document.createElement("canvas")
  c2.width = c2.height = SPRITE_SIZE
  const g2 = c2.getContext("2d")!
  g2.strokeStyle = "#FFFFFF"
  g2.lineWidth = 1.5
  g2.lineCap = "round"
  g2.lineJoin = "round"

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3
    g2.save()
    g2.translate(half, half)
    g2.rotate(angle)

    g2.beginPath()
    g2.moveTo(0, 0)
    g2.lineTo(0, -maxR)
    g2.stroke()

    // Fork tip
    g2.beginPath()
    g2.moveTo(-maxR * 0.22, -maxR * 0.85)
    g2.lineTo(0, -maxR * 0.65)
    g2.lineTo(maxR * 0.22, -maxR * 0.85)
    g2.stroke()

    g2.restore()
  }
  // Inner hexagon
  g2.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3
    const x = half + Math.cos(angle) * (maxR * 0.28)
    const y = half + Math.sin(angle) * (maxR * 0.28)
    if (i === 0) g2.moveTo(x, y)
    else g2.lineTo(x, y)
  }
  g2.closePath()
  g2.stroke()

  // Sprite 3: Delicate Star Snowflake (เกล็ดดาวโปร่งบาง)
  const c3 = document.createElement("canvas")
  c3.width = c3.height = SPRITE_SIZE
  const g3 = c3.getContext("2d")!
  g3.strokeStyle = "#FFFFFF"
  g3.lineWidth = 1.4
  g3.lineCap = "round"
  g3.lineJoin = "round"

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3
    g3.save()
    g3.translate(half, half)
    g3.rotate(angle)

    g3.beginPath()
    g3.moveTo(0, 0)
    g3.lineTo(0, -maxR)
    g3.stroke()

    // 2 small lateral branches
    g3.beginPath()
    g3.moveTo(-maxR * 0.18, -maxR * 0.75)
    g3.lineTo(0, -maxR * 0.75)
    g3.lineTo(maxR * 0.18, -maxR * 0.75)
    g3.stroke()

    g3.beginPath()
    g3.moveTo(-maxR * 0.14, -maxR * 0.5)
    g3.lineTo(0, -maxR * 0.5)
    g3.lineTo(maxR * 0.14, -maxR * 0.5)
    g3.stroke()

    g3.restore()
  }

  // Sprite 4: Soft Powder Glow Dot (ละอองหิมะฟุ้งนุ่ม)
  const c4 = document.createElement("canvas")
  c4.width = c4.height = 32
  const g4 = c4.getContext("2d")!
  const grad = g4.createRadialGradient(16, 16, 0, 16, 16, 14)
  grad.addColorStop(0, "rgba(255, 255, 255, 0.95)")
  grad.addColorStop(0.4, "rgba(255, 255, 255, 0.45)")
  grad.addColorStop(1, "rgba(255, 255, 255, 0)")
  g4.fillStyle = grad
  g4.beginPath()
  g4.arc(16, 16, 14, 0, Math.PI * 2)
  g4.fill()

  return [c0, c1, c2, c3, c4]
}

export default function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const sprites = createSnowflakeSprites()

    let animationFrameId: number
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = window.innerWidth
    let height = window.innerHeight

    const setupSize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    setupSize()

    const handleResize = () => {
      setupSize()
    }

    window.addEventListener("resize", handleResize)

    // Number of flakes (subtle, delicate anime atmosphere)
    const flakeCount = width < 768 ? 32 : 60
    const flakes: Flake[] = []

    for (let i = 0; i < flakeCount; i++) {
      // 75% snowflake crystals (sprites 0-3), 25% soft glowing powder specks (sprite 4)
      const isPowder = Math.random() < 0.25
      const spriteIndex = isPowder ? 4 : Math.floor(Math.random() * 4)

      // Varied size for depth
      const size = isPowder
        ? Math.random() * 4 + 3 // 3-7px
        : Math.random() * 12 + 10 // 10-22px (delicate detailed snowflakes)

      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speedY: isPowder ? Math.random() * 0.6 + 0.3 : Math.random() * 0.7 + 0.4, // gentle, slow float
        speedX: Math.random() * 0.3 - 0.15,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayAmp: Math.random() * 0.8 + 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.012, // slow spinning
        opacity: isPowder ? Math.random() * 0.4 + 0.2 : Math.random() * 0.38 + 0.18, // subtle, translucent (บางๆ)
        spriteIndex,
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
        flake.x += Math.sin(flake.sway) * flake.swayAmp + flake.speedX
        flake.rotation += flake.rotationSpeed

        // Wrap around viewport edges
        if (flake.y > height + 20) {
          flake.y = -20
          flake.x = Math.random() * width
        }
        if (flake.x > width + 20) {
          flake.x = -20
        } else if (flake.x < -20) {
          flake.x = width + 20
        }

        const sprite = sprites[flake.spriteIndex]
        if (sprite) {
          ctx.save()
          ctx.translate(flake.x, flake.y)
          ctx.rotate(flake.rotation)
          ctx.globalAlpha = flake.opacity
          ctx.drawImage(
            sprite,
            -flake.size / 2,
            -flake.size / 2,
            flake.size,
            flake.size,
          )
          ctx.restore()
        }
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
