"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { SlidersHorizontal, X, Search } from "lucide-react"
import { Nations, Provinces } from "@/constants/location"
import DesktopFilters from "./DesktopFilters"

export interface SearchOverrides {
  nationID?: string
  province?: string[]
  courseLevel?: string
  type?: any
  courseType?: string
  program_type?: string
  search?: string
  date?: string
  availability?: string
  isPriceEnabled?: boolean
  minPrice?: string
  maxPrice?: string
}

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
  handleSearch: (
    targetPage?: number,
    type?: any,
    overrides?: SearchOverrides,
  ) => void | Promise<void>
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
  // Mobile filter states mirroring Desktop options
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sport, setSport] = useState("ทั้งหมด")
  const [tripType, setTripType] = useState("ทั้งหมด")
  const [date, setDate] = useState("ทั้งหมด")
  const [availability, setAvailability] = useState("ทั้งหมด")
  const [selectedPricePreset, setSelectedPricePreset] = useState("ทั้งหมด")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isFilterOpen) {
      document.body.classList.add("filter-open")
      document.body.style.overflow = "hidden"
    } else {
      document.body.classList.remove("filter-open")
      document.body.style.overflow = ""
    }
    return () => {
      document.body.classList.remove("filter-open")
      document.body.style.overflow = ""
    }
  }, [isFilterOpen])

  const sportOptions = [
    { label: "ทั้งหมด", value: "ทั้งหมด" },
    { label: "Snowboard", value: "SNOWBOARD" },
    { label: "Ski", value: "SKI" },
  ]

  const tripTypeOptions = [
    { label: "ทั้งหมด", value: "ทั้งหมด" },
    { label: "Trips", value: "TRIP" },
    { label: "Classes & Training", value: "CLASS" },
    { label: "Park & Freestyle", value: "PARK_AND_FREESTYLE" },
    { label: "Prep. Camp", value: "PREP_CAMP" },
    { label: "Private Class", value: "PRIVATE_COACHING" },
    { label: "Group Trip", value: "GROUP_TRIP" },
  ]

  const dateOptions = [
    { label: "ทั้งหมด", value: "ทั้งหมด" },
    { label: "เร็วๆ นี้", value: "soon" },
    { label: "พฤศจิกายน 2026", value: "2026-11" },
    { label: "ธันวาคม 2026", value: "2026-12" },
    { label: "มกราคม 2027", value: "2027-01" },
    { label: "กุมภาพันธ์ 2027", value: "2027-02" },
    { label: "มีนาคม 2027", value: "2027-03" },
  ]

  const pricePresetOptions = [
    { label: "ทั้งหมด", value: "ทั้งหมด", min: "0", max: "50000" },
    { label: "ไม่เกิน 15,000", value: "0-15000", min: "0", max: "15000" },
    { label: "15,001–30,000", value: "15001-30000", min: "15001", max: "30000" },
    { label: "30,001–60,000", value: "30001-60000", min: "30001", max: "60000" },
    { label: "60,001 ขึ้นไป", value: "60001-999999", min: "60001", max: "999999" },
  ]

  const availabilityOptions = [
    { label: "ทั้งหมด", value: "ทั้งหมด" },
    { label: "เปิดรับสมัคร", value: "available" },
    { label: "เต็มแล้ว", value: "full" },
  ]

  const handleClear = () => {
    setSearchTerm("")
    setSport("ทั้งหมด")
    setTripType("ทั้งหมด")
    setDate("ทั้งหมด")
    setAvailability("ทั้งหมด")
    setSelectedPricePreset("ทั้งหมด")
    setNationID("ทั้งหมด")
    setProvince([])
    setCourseLevel("ทั้งหมด")
    setIsPriceEnabled(false)
    setMinPrice("0")
    setMaxPrice("50000")
  }

  const handleClearAll = () => {
    handleClear()
    handleSearch(1, undefined, {
      search: undefined,
      courseType: undefined,
      program_type: undefined,
      date: undefined,
      availability: "ทั้งหมด",
      nationID: "ทั้งหมด",
      province: [],
      courseLevel: "ทั้งหมด",
      isPriceEnabled: false,
    })
  }

  const handleRemoveProvince = (code: string) => {
    const updated = province.filter((c) => c !== code)
    setProvince(updated)
    handleSearch(1, undefined, { province: updated })
  }

  const handleRemoveNation = () => {
    setNationID("ทั้งหมด")
    handleSearch(1, undefined, { nationID: "ทั้งหมด" })
  }

  const handleRemoveLevel = () => {
    setCourseLevel("ทั้งหมด")
    handleSearch(1, undefined, { courseLevel: "ทั้งหมด" })
  }

  const handleRemovePrice = () => {
    setIsPriceEnabled(false)
    setSelectedPricePreset("ทั้งหมด")
    handleSearch(1, undefined, { isPriceEnabled: false })
  }

  const applyFilters = () => {
    const formattedDate = (() => {
      if (!date || date === "ทั้งหมด") return undefined
      if (date === "soon") {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      }
      if (/^\d{4}-\d{2}/.test(date)) return date.slice(0, 7)
      return date
    })()

    handleSearch(1, undefined, {
      search: searchTerm.trim() || undefined,
      courseType: sport !== "ทั้งหมด" ? sport : undefined,
      program_type: tripType !== "ทั้งหมด" ? tripType : undefined,
      date: formattedDate,
      availability: availability !== "ทั้งหมด" ? availability : undefined,
      nationID,
      province,
      courseLevel,
      isPriceEnabled,
      minPrice,
      maxPrice,
    })
    setIsFilterOpen(false)
  }

  // Selected filter pills based on what the user has chosen
  const selectedPills: { id: string; label: string; onRemove: () => void }[] = []

  if (searchTerm.trim()) {
    selectedPills.push({
      id: "search",
      label: `"${searchTerm.trim()}"`,
      onRemove: () => {
        setSearchTerm("")
        handleSearch(1, undefined, { search: undefined })
      },
    })
  }

  if (sport !== "ทั้งหมด") {
    const sOpt = sportOptions.find((s) => s.value === sport)
    selectedPills.push({
      id: `sport-${sport}`,
      label: sOpt?.label || sport,
      onRemove: () => {
        setSport("ทั้งหมด")
        handleSearch(1, undefined, { courseType: undefined })
      },
    })
  }

  if (tripType !== "ทั้งหมด") {
    const tOpt = tripTypeOptions.find((t) => t.value === tripType)
    selectedPills.push({
      id: `tripType-${tripType}`,
      label: tOpt?.label || tripType,
      onRemove: () => {
        setTripType("ทั้งหมด")
        handleSearch(1, undefined, { program_type: undefined })
      },
    })
  }

  if (date !== "ทั้งหมด") {
    const dOpt = dateOptions.find((d) => d.value === date)
    selectedPills.push({
      id: `date-${date}`,
      label: dOpt?.label || date,
      onRemove: () => {
        setDate("ทั้งหมด")
        handleSearch(1, undefined, { date: undefined })
      },
    })
  }

  if (availability !== "ทั้งหมด") {
    const aOpt = availabilityOptions.find((a) => a.value === availability)
    selectedPills.push({
      id: `avail-${availability}`,
      label: aOpt?.label || availability,
      onRemove: () => {
        setAvailability("ทั้งหมด")
        handleSearch(1, undefined, { availability: "ทั้งหมด" })
      },
    })
  }

  if (nationID !== "ทั้งหมด") {
    const nationName = Nations.find((n) => n.id === nationID)?.name_th || nationID
    selectedPills.push({
      id: `nation-${nationID}`,
      label: nationName,
      onRemove: handleRemoveNation,
    })
  }

  province.forEach((code) => {
    const pName = Provinces.find((p) => p.code === code)?.name_th || code
    selectedPills.push({
      id: `province-${code}`,
      label: pName,
      onRemove: () => handleRemoveProvince(code),
    })
  })

  if (courseLevel !== "ทั้งหมด") {
    selectedPills.push({
      id: `level-${courseLevel}`,
      label: courseLevel,
      onRemove: handleRemoveLevel,
    })
  }

  if (isPriceEnabled) {
    selectedPills.push({
      id: "price-range",
      label:
        selectedPricePreset !== "ทั้งหมด"
          ? pricePresetOptions.find((p) => p.value === selectedPricePreset)?.label ||
            `฿${Number(minPrice).toLocaleString()} - ฿${Number(maxPrice).toLocaleString()}`
          : `฿${Number(minPrice || 0).toLocaleString()} - ฿${Number(maxPrice || 0).toLocaleString()}`,
      onRemove: handleRemovePrice,
    })
  }

  return (
    <>
      {/* Desktop Filter View */}
      <div className="hidden md:block w-full">
        <DesktopFilters
          nationID={nationID}
          setNationID={setNationID}
          province={province}
          setProvince={setProvince}
          isPriceEnabled={isPriceEnabled}
          setIsPriceEnabled={setIsPriceEnabled}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          handleSearch={handleSearch}
        />
      </div>

      {/* Mobile Filter View */}
      <div className="md:hidden w-full flex flex-col gap-2.5">
        {/* Row 1: Search prompt | Clear all */}
        <div className="relative flex items-center justify-center w-full px-1">
          {/* Search placeholder button */}
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="bg-[#0A1A28]/60 border border-white/15 text-white/80 hover:bg-white/10 hover:text-white transition-colors px-6 py-2 rounded-full text-xs font-medium whitespace-nowrap truncate cursor-pointer text-center w-full max-w-[480px]"
          >
            {searchTerm.trim() ? `ค้นหา: "${searchTerm}"` : "ต้องการค้นหา..."}
          </button>

          {/* Clear all button */}
          {selectedPills.length > 0 && (
            <div className="absolute right-1 flex justify-end shrink-0">
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-white/80 hover:text-white underline px-1 py-1 whitespace-nowrap cursor-pointer font-medium"
              >
                ล้างทั้งหมด
              </button>
            </div>
          )}
        </div>

        {/* Row 2: Selected filter pills */}
        {selectedPills.length > 0 && (
          <div className="flex gap-2 lg:gap-2.5 items-center justify-center overflow-y-auto max-h-[72px] w-full flex-wrap px-1 scrollbar-thin">
            {selectedPills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={pill.onRemove}
                className="flex items-center gap-1 bg-white text-gray-900 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 shadow-sm hover:bg-gray-100 transition-colors group cursor-pointer border border-white"
              >
                <span>{pill.label}</span>
                <X size={12} className="text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Modal Portal */}
      {mounted &&
        isFilterOpen &&
        createPortal(
          <div
            id="filter-modal"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          >
            <div className="bg-white w-full max-w-[450px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h2 className="text-[#354359] text-lg font-bold">ตัวกรองการค้นหา</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  ปิดหน้าต่าง
                  <div className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full p-1 transition-colors">
                    <X size={14} strokeWidth={2.5} />
                  </div>
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-6 md:px-8 py-6 overflow-y-auto space-y-6">
                {/* Search Keyword */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">ค้นหา</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="พิมพ์ชื่อทริป หรือสถานที่..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          applyFilters()
                        }
                      }}
                      className="w-full bg-gray-100 border border-gray-200 focus:border-[#354359] rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none"
                    />
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>

                {/* Sport (กีฬา) */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">กีฬา</label>
                  <div className="flex flex-wrap gap-2">
                    {sportOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSport(opt.value)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
                          sport === opt.value
                            ? "bg-[#354359] text-white border-[#354359]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trip Type (ประเภททริป) */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">ประเภททริป</label>
                  <div className="flex flex-wrap gap-2">
                    {tripTypeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setTripType(opt.value)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
                          tripType === opt.value
                            ? "bg-[#354359] text-white border-[#354359]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date (ช่วงเวลาเดินทาง) */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">
                    ช่วงเวลาเดินทาง
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {dateOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDate(opt.value)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
                          date === opt.value
                            ? "bg-[#354359] text-white border-[#354359]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability (สถานะการรับสมัคร) */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">
                    สถานะการรับสมัคร
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availabilityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAvailability(opt.value)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
                          availability === opt.value
                            ? "bg-[#354359] text-white border-[#354359]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country (ค้นหาจากประเทศ) */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">
                    ค้นหาจากประเทศ
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      key={"ทั้งหมด"}
                      type="button"
                      onClick={() => {
                        setNationID("ทั้งหมด")
                        setProvince([])
                      }}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
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
                        type="button"
                        onClick={() => {
                          setNationID(c.id)
                          setProvince([])
                        }}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
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

                {/* City (ค้นหาจากชื่อเมือง) */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">
                    ค้นหาจากชื่อเมือง
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setProvince([])}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
                        province.length === 0
                          ? "bg-[#354359] text-white border-[#354359]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      ทั้งหมด
                    </button>
                    {Provinces.filter(
                      (p) => nationID === "ทั้งหมด" || p.nation_id === nationID,
                    ).map((p) => {
                      const isSelected = province.includes(p.code)
                      return (
                        <button
                          key={p.code}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setProvince(province.filter((code) => code !== p.code))
                            } else {
                              setProvince([...province, p.code])
                            }
                          }}
                          className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#354359] text-white border-[#354359]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {p.name_th}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">
                    ค้นหาจาก Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "ทั้งหมด",
                      "Beginner",
                      "Level 1",
                      "Level 2",
                      "Level 3",
                      "Level 4",
                      "Level 5",
                    ].map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setCourseLevel(l)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
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

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">ช่วงราคา</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {pricePresetOptions.map((p) => {
                      const isSelected =
                        selectedPricePreset === p.value ||
                        (p.value === "ทั้งหมด" && !isPriceEnabled)

                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => {
                            setSelectedPricePreset(p.value)
                            if (p.value === "ทั้งหมด") {
                              setIsPriceEnabled(false)
                              setMinPrice("0")
                              setMaxPrice("50000")
                            } else {
                              setIsPriceEnabled(true)
                              setMinPrice(p.min)
                              setMaxPrice(p.max)
                            }
                          }}
                          className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#354359] text-white border-[#354359]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {p.label}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="mobile-custom-price"
                      checked={isPriceEnabled}
                      onChange={(e) => {
                        setIsPriceEnabled(e.target.checked)
                        if (!e.target.checked) {
                          setSelectedPricePreset("ทั้งหมด")
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-[#4F7354] focus:ring-[#4F7354] cursor-pointer"
                    />
                    <label
                      htmlFor="mobile-custom-price"
                      className="text-xs text-gray-600 font-semibold cursor-pointer"
                    >
                      กำหนดช่วงราคาเอง
                    </label>
                  </div>

                  {isPriceEnabled && (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={minPrice}
                        onChange={(e) => {
                          setMinPrice(e.target.value)
                          setSelectedPricePreset("custom")
                        }}
                        className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#354359]"
                        placeholder="ราคาต่ำสุด"
                      />
                      <span className="text-gray-400 font-bold">-</span>
                      <input
                        type="text"
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(e.target.value)
                          setSelectedPricePreset("custom")
                        }}
                        className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#354359]"
                        placeholder="ราคาสูงสุด"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50 shrink-0">
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                >
                  ล้าง
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="w-2/3 bg-[#C75D33] hover:bg-[#B34B24] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Search size={18} /> ค้นหา
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
