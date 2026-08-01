import MenuFooter from "@/components/MenuFooter"
import { SlidersHorizontal, MapPin, CalendarDays, Zap, User } from "lucide-react"
import Image from "next/image"
import { getUser } from "./actions/auth"

export default async function MainPage() {
  return (
    <div className="min-h-screen bg-[#859877] pb-24 font-sans selection:bg-[#568759]/30">
      {/* Header Section */}
      <div className="pt-10 px-6 text-center">
        {/* Logo Replacement */}
        <div className="flex flex-col items-center justify-center mb-6">
          <h1 className="text-white font-extrabold text-4xl tracking-tighter uppercase leading-none drop-shadow-sm">
            Snow
          </h1>
          <h1 className="text-white font-extrabold text-4xl tracking-tighter uppercase leading-none drop-shadow-sm">
            Vibes
          </h1>
          <p className="text-white font-medium tracking-[0.3em] text-xs mt-1">TOUR</p>
        </div>

        <h2 className="text-white text-2xl font-bold mb-6 drop-shadow-sm">
          ทริปครั้งนี้ของคุณคือ...?
        </h2>

        {/* Toggle Switch */}
        <div className="flex bg-[#67755D] rounded-full p-1 mb-6 relative shadow-inner">
          <div className="flex-1 text-center bg-white rounded-full py-3 shadow-md z-10">
            <span className="text-[#4F7354] font-bold text-lg">Snowboard</span>
          </div>
          <div className="flex-1 text-center py-3 z-10 cursor-pointer">
            <span className="text-[#96A68C] font-bold text-lg">Ski</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
          <button className="flex items-center gap-1.5 bg-white text-[#4F7354] px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap shadow-sm snap-start shrink-0">
            <SlidersHorizontal size={14} />
            Filter
          </button>
          <button className="bg-[#67755D] text-white px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap snap-start shrink-0">
            ฮาร์บิน
          </button>
          <button className="bg-[#67755D] text-white px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap snap-start shrink-0">
            Sunac Snow
          </button>
          <button className="bg-[#67755D] text-white px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap snap-start shrink-0">
            นิเซโกะ
          </button>
          <button className="bg-[#67755D] text-white px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap snap-start shrink-0">
            นากาโนะ
          </button>
        </div>
      </div>

      {/* Upcoming Trips Section */}
      <div className="mt-6 mx-4 bg-[#5F6A56] rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="text-yellow-400 fill-yellow-400" size={20} />
          <h3 className="text-white text-xl font-bold">ทริปที่กำลังจะถึง</h3>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl overflow-hidden min-w-[260px] snap-start shrink-0 shadow-md">
            <div className="relative h-[160px] w-full bg-blue-100">
              <Image
                src="https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=600&auto=format&fit=crop"
                alt="Indoor snowpark"
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#1877F2] text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                Snowboard
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                ฝึกสโนว์บอร์ดที่กวางโจ...
              </h4>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-1">
                <MapPin size={14} />
                <span>กวางโจว, จีน</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                <CalendarDays size={14} />
                <span>25-28 กรกฎาคม 2026</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[#E03131] font-bold text-xl">฿ 12,600</span>
                <span className="text-gray-400 text-sm line-through decoration-gray-400">
                  ฿ 18,900
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl overflow-hidden min-w-[260px] snap-start shrink-0 shadow-md">
            <div className="relative h-[160px] w-full bg-blue-100">
              <Image
                src="https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=600&auto=format&fit=crop"
                alt="Outdoor snow mountain"
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#1877F2] text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                Snowboard
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                เมืองหิมะสวยสงบที่ฟุร...
              </h4>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-1">
                <MapPin size={14} />
                <span>ฮอกไกโด, ญี่ปุ่น</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                <CalendarDays size={14} />
                <span>28-31 สิงหาคม 2026</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[#E03131] font-bold text-xl">18,300 ฿</span>
                <span className="text-gray-400 text-sm line-through decoration-gray-400">
                  23,900 ฿
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Snowboard Trips Section */}
      <div className="mt-8 px-4">
        <div className="flex justify-between items-end mb-4 px-2">
          <h3 className="text-white text-2xl font-bold">ทริป Snowboard</h3>
          <a
            href="#"
            className="text-[#B3C8A4] font-medium text-sm hover:text-white transition-colors"
          >
            ทั้งหมด
          </a>
        </div>

        <div className="bg-white rounded-3xl p-3 shadow-lg flex gap-4">
          <div className="relative w-[120px] h-[140px] shrink-0 rounded-2xl overflow-hidden bg-blue-100">
            <Image
              src="https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=400&auto=format&fit=crop"
              alt="Changbaishan snow"
              fill
              className="object-cover"
            />
            <div className="absolute top-2 left-2 bg-[#1877F2] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              Snowboard
            </div>
          </div>
          <div className="flex flex-col justify-center py-1">
            <h4 className="font-bold text-lg text-gray-900 mb-1 leading-tight line-clamp-2">
              ฝึกสโนว์บอร์ดที่ฉางไป่ซาน ชมวิ...
            </h4>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
              <MapPin size={12} />
              <span>ฉางไป่ซาน, จีน</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
              <CalendarDays size={12} />
              <span>25-27 สิงหาคม 2026</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-2">
              <User size={12} />
              <span>Level 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MenuFooter />
    </div>
  )
}
