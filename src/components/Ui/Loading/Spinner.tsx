"use client"
import React from "react"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: string
}

export function Spinner({ size = "md", color = "border-current" }: SpinnerProps) {
  const sizeClass = {
    sm: "w-5 h-5 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  }[size]

  return (
    <div className="flex items-center justify-center">
      <div
        className={`rounded-full animate-spin border-t-transparent ${color} ${sizeClass}`}
      ></div>
    </div>
  )
}
