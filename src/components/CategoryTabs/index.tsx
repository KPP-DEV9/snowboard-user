"use client"

import { useState } from "react"

interface Props {
  setCourseType: (courseType: string) => void
  handleSearch: () => void
}

type CategoryType = "snowboard" | "ski"

export default function CategoryTabs({ setCourseType, handleSearch }: Props) {
  const [active, setActive] = useState<CategoryType>("snowboard")

  const handleSearchType = (type: CategoryType) => {
    setActive(type)
    setCourseType(type)
    handleSearch()
  }

  return (
    <div className="flex bg-sec rounded-full p-1 relative shadow-inner w-full max-w-[500px]">
      <div
        onClick={() => {
          handleSearchType("snowboard")
        }}
        className={`flex-1 text-center rounded-full py-3 z-10 cursor-pointer transition-all duration-300 ${
          active === "snowboard" ? "bg-white shadow-md" : ""
        }`}
      >
        <span
          className={`font-bold text-lg transition-colors duration-300 ${
            active === "snowboard" ? "text-active" : "text-[#96A68C]"
          }`}
        >
          Snowboard
        </span>
      </div>
      <div
        onClick={() => handleSearchType("ski")}
        className={`flex-1 text-center rounded-full py-3 z-10 cursor-pointer transition-all duration-300 ${
          active === "ski" ? "bg-white shadow-md" : ""
        }`}
      >
        <span
          className={`font-bold text-lg transition-colors duration-300 ${
            active === "ski" ? "text-active" : "text-[#96A68C]"
          }`}
        >
          Ski
        </span>
      </div>
    </div>
  )
}
