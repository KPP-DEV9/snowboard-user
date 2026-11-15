"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Logo from "../Logo"

function NavbarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeProgramType = searchParams.get("program_type")
  const activeCategory = searchParams.get("category")

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
    <header className="hidden md:block w-full sticky top-0 z-50 bg-[#1D2633]/90 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 hover:opacity-90 transition-opacity">
          <Logo className="!w-[74px] lg:!w-[84px]" />
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-6 lg:gap-8 xl:gap-9 text-[13px] lg:text-[14px] font-semibold tracking-wide">
          {menuItems.map((item) => {
            const isActive =
              (item.programType && activeProgramType === item.programType) ||
              (item.category && activeCategory === item.category) ||
              (item.matchPath && pathname.startsWith(item.matchPath))

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-colors whitespace-nowrap py-2 ${
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

        {/* LINE Button */}
        <div className="flex items-center shrink-0">
          <Link
            href="/contact"
            className="bg-[#00C300] hover:bg-[#00B000] text-white font-bold text-xs lg:text-[13px] tracking-wider px-5 py-2 rounded-full transition-all shadow-md active:scale-95 whitespace-nowrap inline-flex items-center justify-center leading-none"
          >
            LINE
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="hidden md:block w-full h-20 bg-[#1D2633]/90 border-b border-white/10" />
      }
    >
      <NavbarContent />
    </Suspense>
  )
}

