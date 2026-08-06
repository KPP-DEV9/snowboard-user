"use client"

import { SlidersHorizontal, X, Search } from "lucide-react"
import { Nations, Provinces } from "@/constants/location"

interface Props {
  isFilterOpen: boolean
  setIsFilterOpen: (isFilterOpen: boolean) => void
  nationID: string
  setNationID: (nationID: string) => void
  province: string[]
  setProvince: (province: string[]) => void
  courseLevel: string
  setCourseLevel: (courseLevel: string) => void
  minPrice: string
  setMinPrice: (minPrice: string) => void
  maxPrice: string
  setMaxPrice: (maxPrice: string) => void
  isPriceEnabled: boolean
  setIsPriceEnabled: (isPriceEnabled: boolean) => void
  handleSearch: () => void
}

export default function HomeFilters({
  isFilterOpen,
  setIsFilterOpen,
  nationID,
  setNationID,
  province,
  setProvince,
  courseLevel,
  setCourseLevel,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  isPriceEnabled,
  setIsPriceEnabled,
  handleSearch,
}: Props) {
  return (
    <>
      <div className="flex gap-2 lg:gap-3 overflow-x-auto pb-2 scrollbar-hide w-full justify-center flex-wrap">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-1.5 bg-white text-[#4F7354] px-4 md:px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm hover:bg-gray-100 transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filter
        </button>

        {province.map((item, i) => (
          <button
            key={i}
            className="bg-[#6B7A5D] hover:bg-[#5F6A56] transition-colors text-white/90 px-4 md:px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm"
          >
            {Provinces.find((p) => p.code === item)?.name_th}
          </button>
        ))}
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[450px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-end items-center p-4">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex items-center gap-2 text-sm font-bold hover:opacity-70 transition-opacity"
              >
                ปิดหน้าต่าง
                <div className="bg-black text-white rounded-full p-1">
                  <X size={14} strokeWidth={3} />
                </div>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 md:px-8 pb-8 overflow-y-auto">
              <h2 className="text-[#357948] text-xl font-bold mb-6">ตัวกรองการค้นหา</h2>

              {/* Country */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">ค้นหาจากประเทศ</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    key={"ทั้งหมด"}
                    onClick={() => {
                      setNationID("ทั้งหมด")
                      setProvince([])
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                      nationID === "ทั้งหมด"
                        ? "bg-[#354359] text-white border-[#354359]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    ทั้งหมด
                  </button>

                  {Nations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setNationID(c.id)
                        setProvince([])
                      }}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                        nationID === c.id
                          ? "bg-[#354359] text-white border-[#354359]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {c.name_th}
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  ค้นหาจากชื่อเมือง
                </label>
                <div className="flex flex-wrap gap-2">
                  {Provinces.filter((p) => nationID === "ทั้งหมด" || p.nation_id === nationID).map(
                    (p) => {
                      const isSelected = province.includes(p.code)
                      return (
                        <button
                          key={p.code}
                          onClick={() => {
                            if (isSelected) {
                              setProvince(province.filter((code) => code !== p.code))
                            } else {
                              setProvince([...province, p.code])
                            }
                          }}
                          className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                            isSelected
                              ? "bg-[#354359] text-white border-[#354359]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {p.name_th}
                        </button>
                      )
                    },
                  )}
                </div>
              </div>

              {/* Level */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">ค้นหาจาก Level</label>
                <div className="flex flex-wrap gap-2">
                  {["ทั้งหมด", "Beginer", "Level 1", "Level 2", "Level 3", "Level 4"].map((l) => (
                    <button
                      key={l}
                      onClick={() => setCourseLevel(l)}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                        courseLevel === l
                          ? "bg-[#354359] text-white border-[#354359]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPriceEnabled}
                    onChange={(e) => setIsPriceEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#4F7354] focus:ring-[#4F7354]"
                  />
                  ค้นหาจากช่วงราคา
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    disabled={!isPriceEnabled}
                    className="w-full bg-gray-100 border-none rounded-lg px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4F7354]/50 disabled:opacity-50"
                  />
                  <span className="text-gray-400 font-bold">-</span>
                  <input
                    type="text"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    disabled={!isPriceEnabled}
                    className="w-full bg-gray-100 border-none rounded-lg px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4F7354]/50 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSearch}
                className="w-full bg-[#C75D33] hover:bg-[#B34B24] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Search size={18} /> ค้นหา
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
