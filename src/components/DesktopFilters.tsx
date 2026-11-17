"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { ChevronDown } from "lucide-react"
import { Nations, Provinces } from "@/constants/location"
import { SearchOverrides } from "./HomeFilters"

interface Props {
  nationID: string
  setNationID: (nationID: string) => void
  province: string[]
  setProvince: (province: string[]) => void
  isPriceEnabled: boolean
  setIsPriceEnabled: (isPriceEnabled: boolean) => void
  minPrice: string
  setMinPrice: (minPrice: string) => void
  maxPrice: string
  setMaxPrice: (maxPrice: string) => void
  handleSearch: (
    targetPage?: number,
    type?: any,
    overrides?: SearchOverrides,
  ) => void | Promise<void>
}

interface DropdownOption {
  label: string
  value: string
}

export default function DesktopFilters({
  nationID,
  setNationID,
  province,
  setProvince,
  isPriceEnabled,
  setIsPriceEnabled,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handleSearch,
}: Props) {
  const [, startTransition] = useTransition()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Local filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDestination, setSelectedDestination] = useState("ทั้งหมด")
  const [selectedDate, setSelectedDate] = useState("ทั้งหมด")
  const [selectedSport, setSelectedSport] = useState("ทั้งหมด")
  const [selectedTripType, setSelectedTripType] = useState("ทั้งหมด")
  const [selectedPriceLabel, setSelectedPriceLabel] = useState("ทั้งหมด")
  const [selectedAvailability, setSelectedAvailability] = useState("ทั้งหมด")

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Options
  const destinationOptions: DropdownOption[] = [
    { label: "ทั้งหมด", value: "ทั้งหมด" },
    ...Nations.map((n) => ({ label: n.name_th, value: `nation:${n.id}` })),
    ...Provinces.slice(0, 10).map((p) => ({
      label: p.name_th,
      value: `province:${p.code}`,
    })),
  ]

  const dateOptions: DropdownOption[] = [
    { label: "ทั้งหมด", value: "ทั้งหมด" },
    { label: "เร็วๆ นี้", value: "soon" },
    { label: "พฤศจิกายน 2026", value: "2026-11" },
    { label: "ธันวาคม 2026", value: "2026-12" },
    { label: "มกราคม 2027", value: "2027-01" },
    { label: "กุมภาพันธ์ 2027", value: "2027-02" },
    { label: "มีนาคม 2027", value: "2027-03" },
  ]

  const sportOptions: DropdownOption[] = [
    { label: "ทั้งหมด", value: "ทั้งหมด" },
    { label: "Snowboard", value: "SNOWBOARD" },
    { label: "Ski", value: "SKI" },
  ]

  const tripTypeOptions: DropdownOption[] = [
    { label: "ทั้งหมด", value: "ทั้งหมด" },
    { label: "Trips", value: "TRIP" },
    { label: "Classes & Training", value: "CLASS" },
    { label: "Park & Freestyle", value: "PARK_AND_FREESTYLE" },
    { label: "Prep. Camp", value: "PREP_CAMP" },
    { label: "Private Class", value: "PRIVATE_COACHING" },
    { label: "Group Trip", value: "GROUP_TRIP" },
  ]

  const priceOptions: DropdownOption[] = [
    { label: "ทั้งหมด", value: "ทั้งหมด" },
    { label: "ไม่เกิน 15,000", value: "0-15000" },
    { label: "15,001–30,000", value: "15001-30000" },
    { label: "30,001–60,000", value: "30001-60000" },
    { label: "60,001 ขึ้นไป", value: "60001-999999" },
  ]

  const availabilityOptions: DropdownOption[] = [
    { label: "ทั้งหมด", value: "ทั้งหมด" },
    { label: "เปิดรับสมัคร", value: "available" },
    { label: "เต็มแล้ว", value: "full" },
  ]

  // Handlers
  const handleDestinationSelect = (val: string) => {
    setSelectedDestination(val)
    if (val === "ทั้งหมด") {
      setNationID("ทั้งหมด")
      setProvince([])
      handleSearch(1, undefined, { nationID: "ทั้งหมด", province: [] })
    } else if (val.startsWith("nation:")) {
      const nid = val.replace("nation:", "")
      setNationID(nid)
      setProvince([])
      handleSearch(1, undefined, { nationID: nid, province: [] })
    } else if (val.startsWith("province:")) {
      const pcode = val.replace("province:", "")
      setProvince([pcode])
      handleSearch(1, undefined, { province: [pcode] })
    }
  }

  const handlePriceSelect = (val: string) => {
    const opt = priceOptions.find((o) => o.value === val)
    setSelectedPriceLabel(opt?.label || "ทั้งหมด")

    if (val === "ทั้งหมด") {
      setIsPriceEnabled(false)
      setMinPrice("0")
      setMaxPrice("50000")
      handleSearch(1, undefined, { isPriceEnabled: false })
    } else {
      const [min, max] = val.split("-")
      setIsPriceEnabled(true)
      setMinPrice(min)
      setMaxPrice(max)
      handleSearch(1, undefined, {
        isPriceEnabled: true,
        minPrice: min,
        maxPrice: max,
      })
    }
  }

  const handleSportSelect = (val: string) => {
    setSelectedSport(val)
    handleSearch(1, undefined, {
      courseType: val === "ทั้งหมด" ? undefined : val,
    })
  }

  const handleTripTypeSelect = (val: string) => {
    setSelectedTripType(val)
    handleSearch(1, undefined, {
      program_type: val === "ทั้งหมด" ? undefined : val,
    })
  }

  const handleDateSelect = (val: string) => {
    setSelectedDate(val)
    if (val === "ทั้งหมด") {
      handleSearch(1, undefined, { date: "ทั้งหมด" })
      return
    }
    const formattedDate = (() => {
      if (val === "soon") {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      }
      if (/^\d{4}-\d{2}/.test(val)) return val.slice(0, 7)
      return val
    })()
    handleSearch(1, undefined, {
      date: formattedDate,
    })
  }

  const handleAvailabilitySelect = (val: string) => {
    setSelectedAvailability(val)
    handleSearch(1, undefined, {
      availability: val,
    })
  }

  const handleSearchSubmit = () => {
    startTransition(() => {
      handleSearch(1, undefined, { search: searchTerm })
    })
  }

  const renderDropdown = (
    id: string,
    label: string,
    currentValue: string,
    displayLabel: string,
    options: DropdownOption[],
    onSelect: (val: string) => void,
  ) => {
    const isOpen = openDropdown === id
    return (
      <div className="flex flex-col relative w-full">
        <label className="text-xs font-semibold text-white/90 mb-1.5 block">{label}</label>
        <button
          type="button"
          onClick={() => setOpenDropdown(isOpen ? null : id)}
          className={`w-full h-10 px-3 bg-[#182332] hover:bg-[#1E2B3E] border rounded-lg flex items-center justify-between text-xs lg:text-[13px] text-white transition-all cursor-pointer ${
            isOpen
              ? "border-[#E86034] ring-1 ring-[#E86034]"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown
            size={14}
            className={`text-white/60 shrink-0 ml-1.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div
            className={`absolute top-[calc(100%+4px)] ${
              id === "availability" ? "right-0" : "left-0"
            } min-w-full w-max max-w-[260px] bg-[#141A22] border border-white/10 rounded-lg shadow-2xl py-1 z-50`}
          >
            {options.map((opt) => {
              const isSelected = currentValue === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onSelect(opt.value)
                    setOpenDropdown(null)
                  }}
                  className={`w-full px-3 py-2 text-left text-xs lg:text-[13px] flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer ${
                    isSelected ? "text-white font-bold" : "text-white/80"
                  }`}
                >
                  <span className="w-3 text-center text-xs font-bold shrink-0">
                    {isSelected ? "✓" : ""}
                  </span>
                  <span className="truncate">{opt.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const getDestinationDisplayLabel = () => {
    if (selectedDestination === "ทั้งหมด") return "ทั้งหมด"
    const opt = destinationOptions.find((o) => o.value === selectedDestination)
    return opt?.label || "ทั้งหมด"
  }

  const getDateDisplayLabel = () => {
    if (selectedDate === "ทั้งหมด") return "ทั้งหมด"
    const opt = dateOptions.find((o) => o.value === selectedDate)
    return opt?.label || "ทั้งหมด"
  }

  const getSportDisplayLabel = () => {
    if (selectedSport === "ทั้งหมด") return "ทั้งหมด"
    const opt = sportOptions.find((o) => o.value === selectedSport)
    return opt?.label || "ทั้งหมด"
  }

  const getTripTypeDisplayLabel = () => {
    if (selectedTripType === "ทั้งหมด") return "ทั้งหมด"
    const opt = tripTypeOptions.find((o) => o.value === selectedTripType)
    return opt?.label || "ทั้งหมด"
  }

  const getAvailabilityDisplayLabel = () => {
    if (selectedAvailability === "ทั้งหมด") return "ทั้งหมด"
    const opt = availabilityOptions.find((o) => o.value === selectedAvailability)
    return opt?.label || "ทั้งหมด"
  }

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 w-full">
        {/* 1. ค้นหา */}
        <div className="flex flex-col w-full">
          <label className="text-xs font-semibold text-white/90 mb-1.5 block">ค้นหา</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={handleSearchSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit()
            }}
            placeholder="ชื่อหรือสถานที่"
            className="w-full h-10 px-3 bg-[#182332] hover:bg-[#1E2B3E] focus:bg-[#1E2B3E] border border-white/10 hover:border-white/20 focus:border-[#E86034] focus:ring-1 focus:ring-[#E86034] focus:outline-none rounded-lg text-xs lg:text-[13px] text-white placeholder:text-white/40 transition-all"
          />
        </div>

        {/* 2. Destination */}
        {renderDropdown(
          "destination",
          "Destination",
          selectedDestination,
          getDestinationDisplayLabel(),
          destinationOptions,
          handleDestinationSelect,
        )}

        {/* 3. Date */}
        {renderDropdown(
          "date",
          "Date",
          selectedDate,
          getDateDisplayLabel(),
          dateOptions,
          handleDateSelect,
        )}

        {/* 4. Price */}
        {renderDropdown(
          "price",
          "Price",
          priceOptions.find((o) => o.label === selectedPriceLabel)?.value || "ทั้งหมด",
          selectedPriceLabel,
          priceOptions,
          handlePriceSelect,
        )}

        {/* 5. Availability */}
        {renderDropdown(
          "availability",
          "Availability",
          selectedAvailability,
          getAvailabilityDisplayLabel(),
          availabilityOptions,
          handleAvailabilitySelect,
        )}
      </div>
    </div>
  )
}
