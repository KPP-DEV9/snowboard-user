"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Search, Bed, Users } from "lucide-react"
import SlideImg from "@/components/Ui/SlideImg"
import { HotelsMaster } from "@/types/model"
import { getLocationName } from "@/constants/location"
import { NATIONALITIES, getCountryTh } from "@/constants/nationality"

interface HotelsClientProps {
  initialHotels: HotelsMaster[]
}

export default function HotelsClient({ initialHotels }: HotelsClientProps) {
  const [search, setSearch] = useState("")

  const filteredHotels = initialHotels.filter((hotel) => {
    if (!search.trim()) return true
    const query = search.toLowerCase()
    const { districtName, provinceName, nationName } = getLocationName(
      hotel.province,
      hotel.district,
      hotel.nation,
    )
    const nameMatch = hotel.name?.toLowerCase().includes(query)
    const provinceMatch =
      hotel.province?.toLowerCase().includes(query) ||
      provinceName?.toLowerCase().includes(query)
    const districtMatch =
      hotel.district?.toLowerCase().includes(query) ||
      districtName?.toLowerCase().includes(query)
    const countryTh = getCountryTh(hotel.nation)
    const nationMatch =
      hotel.nation?.toLowerCase().includes(query) ||
      nationName?.toLowerCase().includes(query) ||
      countryTh?.toLowerCase().includes(query)
    const addressMatch = hotel.address?.toLowerCase().includes(query)
    return nameMatch || provinceMatch || districtMatch || nationMatch || addressMatch
  })

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-6 pb-20 max-w-6xl">
      {/* Header */}
      <div className="relative flex items-center justify-center mb-6">
        <Link
          href="/"
          className="absolute left-0 text-white font-bold flex items-center gap-2 hover:opacity-80 transition-opacity text-sm md:text-base"
        >
          <ArrowLeft size={20} className="stroke-[3]" /> ย้อนกลับ
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-white">โรงแรมและที่พักทั้งหมด</h1>
      </div>

      {/* Search Input */}
      <div className="mb-8 max-w-md mx-auto relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อโรงแรม หรือเมือง..."
          className="w-full bg-white/90 backdrop-blur-md text-gray-900 placeholder:text-gray-400 pl-11 pr-4 py-3 rounded-2xl text-sm font-medium shadow-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#304B65]"
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>

      {/* Hotel Cards Grid */}
      {filteredHotels.length === 0 ? (
        <div className="text-center py-16 text-white/80 bg-black/15 backdrop-blur-md rounded-2xl font-medium">
          ไม่พบข้อมูลโรงแรม{search ? ` ที่ตรงกับ "${search}"` : ""}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel, idx) => {
            const allImages = Array.from(
              new Set([
                ...(hotel.images || []),
                ...(hotel.rooms?.flatMap((r) => r.images || []) || []),
              ]),
            ).filter(Boolean)

            return (
              <div
                key={hotel.id || idx}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col hover:shadow-2xl transition-all"
              >
                {/* Image Slider */}
                <div className="relative w-full h-[220px] bg-gray-100 shrink-0">
                  {allImages.length > 0 ? (
                    <SlideImg images={allImages} alt={hotel.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      ไม่มีรูปภาพ
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <Link
                      href={`/hotels/${hotel.id || encodeURIComponent(hotel.name)}`}
                      className="hover:text-[#C75D33] transition-colors"
                    >
                      <h3 className="font-extrabold text-lg text-gray-900 leading-snug">
                        {hotel.name}
                      </h3>
                    </Link>

                    {(hotel.address || hotel.province || hotel.nation || hotel.district) && (
                      <p className="text-xs text-gray-600 flex items-start gap-1.5">
                        <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
                        <span>
                          {(() => {
                            const { districtName, provinceName, nationName } = getLocationName(
                              hotel.province,
                              hotel.district,
                              hotel.nation,
                            )
                            const countryTh = getCountryTh(hotel.nation) || nationName
                            return [hotel.address, districtName, provinceName, countryTh]
                              .filter(Boolean)
                              .filter((v, i, a) => a.indexOf(v) === i)
                              .join(", ")
                          })()}
                        </span>
                      </p>
                    )}

                    {hotel.description && (
                      <p className="text-xs text-gray-600 leading-relaxed pt-1 line-clamp-3">
                        {hotel.description}
                      </p>
                    )}
                  </div>

                  {/* Room Types */}
                  {hotel.rooms && hotel.rooms.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <p className="text-[11px] font-semibold text-gray-500 mb-2 flex items-center gap-1">
                        <Bed size={13} /> ประเภทห้องพัก
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {hotel.rooms.map((room, rIdx) => (
                          <div
                            key={room.id || rIdx}
                            className="bg-gray-50 border border-gray-200 text-gray-800 text-[11px] font-medium px-2.5 py-1 rounded-xl flex items-center gap-1.5"
                          >
                            <span>{room.name || room.room_type || "ห้องพัก"}</span>
                            {room.capacity ? (
                              <span className="text-[10px] text-gray-500 flex items-center">
                                <Users size={10} className="mr-0.5" />
                                {room.capacity}
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/hotels/${hotel.id || encodeURIComponent(hotel.name)}`}
                    className="w-full mt-4 py-2.5 bg-[#304B65] hover:bg-[#20364C] text-white text-xs font-bold rounded-xl text-center transition-colors block"
                  >
                    ดูรายละเอียด
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

