"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Menu, X } from "lucide-react"
import Logo from "../Logo"

function NavbarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const activeProgramType = searchParams.get("program_type")
  const activeCategory = searchParams.get("category")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on route or param change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname, searchParams])

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const menuItems = [
    {
      label: "Trips",
      href: "/all?program_type=TRIP",
      programType: "TRIP",
    },
    {
      label: "Classes & Training",
      href: "/all?program_type=CLASS",
      programType: "CLASS",
    },
    {
      label: "Ski Resorts",
      href: "/all?category=ski_resorts",
      category: "ski_resorts",
    },
    { label: "Hotels", href: "/hotels", matchPath: "/hotels" },
    { label: "About SNOWVIBES", href: "/about", matchPath: "/about" },
    { label: "Contact", href: "/contact", matchPath: "/contact" },
  ]

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-[#1D2633]/95 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0 hover:opacity-90 transition-opacity flex items-center">
            <Logo className="!w-[68px] md:!w-[74px] lg:!w-[84px]" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-9 text-[13px] lg:text-[14px] font-semibold tracking-wide">
            {menuItems.map((item) => {
              const isActive =
                (item.programType && activeProgramType === item.programType) ||
                (item.category && activeCategory === item.category) ||
                (item.matchPath && pathname.startsWith(item.matchPath))

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className={`transition-colors whitespace-nowrap py-2 flex items-center ${
                    isActive
                      ? "text-white font-extrabold underline underline-offset-8 decoration-2"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* LINE Button */}
            <Link
              href="/contact"
              className="bg-[#00C300] hover:bg-[#00B000] text-white font-bold text-xs lg:text-[13px] tracking-wider px-4 sm:px-5 py-2 rounded-full transition-all shadow-md active:scale-95 whitespace-nowrap inline-flex items-center justify-center leading-none"
            >
              LINE
            </Link>

            {/* Mobile Burger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full Screen Menu Portal */}
      {mounted &&
        isMobileMenuOpen &&
        createPortal(
          <div className="md:hidden fixed inset-0 z-[9999] bg-[#16202E] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
            {/* Top Bar inside Full Screen Menu */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="shrink-0 flex items-center"
              >
                <Logo className="!w-[68px]" />
              </Link>

              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[#00C300] hover:bg-[#00B000] text-white font-bold text-xs tracking-wider px-4 py-2 rounded-full transition-all shadow-md whitespace-nowrap inline-flex items-center justify-center leading-none"
                >
                  LINE
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="ปิดเมนู"
                  className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Nav Items */}
            <div className="p-6 flex-1 flex flex-col justify-between gap-6">
              <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                  const isActive =
                    (item.programType && activeProgramType === item.programType) ||
                    (item.category && activeCategory === item.category) ||
                    (item.matchPath && pathname.startsWith(item.matchPath))

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                        isActive
                          ? "bg-white/15 text-white shadow-sm"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#00C300] hover:bg-[#00B000] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all text-sm tracking-wider"
                >
                  LINE OFFICIAL
                </Link>
                <p className="text-center text-xs text-white/50 pt-1">
                  Snowvibes Co., Ltd. • Snowwhite by Snowvibes
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

export default function Navbar() {
  return (
    <Suspense
      fallback={<header className="w-full h-16 md:h-20 bg-[#1D2633]/95 border-b border-white/10" />}
    >
      <NavbarContent />
    </Suspense>
  )
}
