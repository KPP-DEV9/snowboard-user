"use client"

import { useState, useEffect } from "react"
import { Menu, X, User, Home, Clock, LogOut, Ticket } from "lucide-react"
import Link from "next/link"

export default function MenuBurger() {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full border border-card-border flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-card-bg border-l border-card-border z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-gold font-bold text-lg tracking-widest">MENU</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-white transition-colors bg-card-border/30 rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-foreground hover:text-gold hover:bg-gold/5 p-3 rounded-xl transition-all"
            >
              <Home size={20} className="text-gold" />
              <span className="font-semibold">หน้าหลัก</span>
            </Link>
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-foreground hover:text-gold hover:bg-gold/5 p-3 rounded-xl transition-all"
            >
              <User size={20} className="text-gold" />
              <span className="font-semibold">โปรไฟล์ของฉัน</span>
            </Link>
            <Link
              href="/my-events"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-foreground hover:text-gold hover:bg-gold/5 p-3 rounded-xl transition-all"
            >
              <Ticket size={20} className="text-gold" />
              <span className="font-semibold">กิจกรรมของฉัน</span>
            </Link>
            <Link
              href="/enrollments"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-foreground hover:text-gold hover:bg-gold/5 p-3 rounded-xl transition-all"
            >
              <Clock size={20} className="text-gold" />
              <span className="font-semibold">ประวัติคำสั่งซื้อ</span>
            </Link>
          </div>

          <div className="mt-auto pt-6 border-t border-card-border/50">
            <Link
              href="/signout"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-red-400 hover:text-red-300 hover:bg-red-400/10 p-3 rounded-xl transition-all"
            >
              <LogOut size={20} />
              <span className="font-semibold">ออกจากระบบ</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
