"use client"

import { useState } from "react"

export default function CategoryTabs() {
  const [active, setActive] = useState<"snowboard" | "ski">("snowboard")

  return (
    <div className="flex bg-[#67755D] rounded-full p-1 mb-6 relative shadow-inner">
      <div
        onClick={() => setActive("snowboard")}
        className={`flex-1 text-center rounded-full py-3 z-10 cursor-pointer transition-all duration-300 ${
          active === "snowboard" ? "bg-white shadow-md" : ""
        }`}
      >
        <span
          className={`font-bold text-lg transition-colors duration-300 ${
            active === "snowboard" ? "text-[#4F7354]" : "text-[#96A68C]"
          }`}
        >
          Snowboard
        </span>
      </div>
      <div
        onClick={() => setActive("ski")}
        className={`flex-1 text-center rounded-full py-3 z-10 cursor-pointer transition-all duration-300 ${
          active === "ski" ? "bg-white shadow-md" : ""
        }`}
      >
        <span
          className={`font-bold text-lg transition-colors duration-300 ${
            active === "ski" ? "text-[#4F7354]" : "text-[#96A68C]"
          }`}
        >
          Ski
        </span>
      </div>
    </div>
  )
}
