import React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  interactive?: boolean
  onClick?: () => void
}

export function Card({ children, className = "", interactive = false, onClick }: CardProps) {
  const baseClasses =
    "bg-card-bg bg-white border border-card-border rounded-2xl p-4 shadow-md transition-all duration-200"
  const interactiveClasses = interactive
    ? "hover:-translate-y-0.5 hover:shadow-lg hover:border-gold/30 cursor-pointer"
    : ""

  return (
    <div className={`${baseClasses} ${interactiveClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}
