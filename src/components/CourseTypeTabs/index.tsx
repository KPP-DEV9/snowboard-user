"use client"

import { CategoryType } from "@/app/page"
import { useState } from "react"

interface Props {
  setCourseType: (courseType: CategoryType) => void
  handleSearch: (targetPage?: number, type?: CategoryType) => Promise<void>
  page: number
}

export default function CourseTypeTabs({ setCourseType, handleSearch, page }: Props) {
  const [active, setActive] = useState<CategoryType>("SNOWBOARD")

  const handleSearchType = async (type: CategoryType) => {
    setActive(type)
    setCourseType(type)
    await handleSearch(page, type)
  }

  return (
    <div className="flex bg-[#0A1A28]/70 backdrop-blur-md rounded-full p-1 relative border border-white/10 shadow-inner w-full max-w-[420px]">
      <div
        onClick={() => {
          handleSearchType("SNOWBOARD")
        }}
        className={`flex-1 text-center rounded-full py-2.5 z-10 cursor-pointer transition-all duration-300 ${
          active === "SNOWBOARD" ? "bg-white shadow-md" : ""
        }`}
      >
        <span
          className={`font-bold text-base md:text-lg transition-colors duration-300 ${
            active === "SNOWBOARD" ? "text-gray-900" : "text-white/60 hover:text-white"
          }`}
        >
          Snowboard
        </span>
      </div>
      <div
        onClick={() => handleSearchType("SKI")}
        className={`flex-1 text-center rounded-full py-2.5 z-10 cursor-pointer transition-all duration-300 ${
          active === "SKI" ? "bg-white shadow-md" : ""
        }`}
      >
        <span
          className={`font-bold text-base md:text-lg transition-colors duration-300 ${
            active === "SKI" ? "text-gray-900" : "text-white/60 hover:text-white"
          }`}
        >
          Ski
        </span>
      </div>
    </div>
  )
}
