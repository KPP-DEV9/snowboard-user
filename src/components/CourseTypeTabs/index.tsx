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
    <div className="flex bg-sec rounded-full p-1 relative shadow-inner w-full max-w-[500px]">
      <div
        onClick={() => {
          handleSearchType("SNOWBOARD")
        }}
        className={`flex-1 text-center rounded-full py-3 z-10 cursor-pointer transition-all duration-300 ${
          active === "SNOWBOARD" ? "bg-white shadow-md" : ""
        }`}
      >
        <span
          className={`font-bold text-lg transition-colors duration-300 ${
            active === "SNOWBOARD" ? "text-active" : "text-[#96A68C]"
          }`}
        >
          Snowboard
        </span>
      </div>
      <div
        onClick={() => handleSearchType("SKI")}
        className={`flex-1 text-center rounded-full py-3 z-10 cursor-pointer transition-all duration-300 ${
          active === "SKI" ? "bg-white shadow-md" : ""
        }`}
      >
        <span
          className={`font-bold text-lg transition-colors duration-300 ${
            active === "SKI" ? "text-active" : "text-[#96A68C]"
          }`}
        >
          Ski
        </span>
      </div>
    </div>
  )
}
