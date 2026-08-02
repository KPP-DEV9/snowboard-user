import MenuFooter from "@/components/MenuFooter"
import CategoryTabs from "@/components/CategoryTabs"
import { SlidersHorizontal, MapPin, CalendarDays, Zap, User } from "lucide-react"
import Image from "next/image"
import Logo from "@/components/Logo"

export default async function MainPage() {
  return (
    <div className="min-h-screen bg-[#859877] pb-24 font-sans selection:bg-[#568759]/30">
      <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-8 lg:pt-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-10 gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center lg:items-start">
            <Logo />
          </div>

          {/* Right Header Area */}
          <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-[400px]">
            <h2 className="text-white text-2xl lg:text-3xl font-bold drop-shadow-sm text-center lg:text-right">
              ทริปครั้งนี้ของคุณคือ...?
            </h2>
            <div className="w-full">
              <CategoryTabs />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x w-full lg:flex-wrap lg:justify-end">
              <button className="flex items-center gap-1.5 bg-white text-[#4F7354] px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm snap-start shrink-0 hover:bg-gray-100 transition-colors">
                <SlidersHorizontal size={14} />
                Filter
              </button>
              <button className="bg-[#67755D] hover:bg-[#5F6A56] transition-colors text-white px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap snap-start shrink-0 shadow-sm">
                ฮาร์บิน
              </button>
              <button className="bg-[#67755D] hover:bg-[#5F6A56] transition-colors text-white px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap snap-start shrink-0 shadow-sm">
                Sunac Snow
              </button>
              <button className="bg-[#67755D] hover:bg-[#5F6A56] transition-colors text-white px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap snap-start shrink-0 shadow-sm">
                นิเซโกะ
              </button>
              <button className="bg-[#67755D] hover:bg-[#5F6A56] transition-colors text-white px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap snap-start shrink-0 shadow-sm">
                นากาโนะ
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Grid Layout Wrapper */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
          {/* Upcoming Trips Section */}
          <div className="xl:col-span-8 bg-[#5F6A56] rounded-[2rem] p-5 md:p-8 shadow-xl border border-white/10 h-full flex flex-col">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="bg-white/20 p-2.5 rounded-full">
                <Zap className="text-yellow-400 fill-yellow-400" size={24} />
              </div>
              <h3 className="text-white text-2xl font-bold tracking-wide">ทริปที่กำลังจะถึง</h3>
            </div>

            <div className="flex md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 snap-x scrollbar-hide flex-1">
              {/* Card 1 */}
              <div className="bg-white rounded-[1.5rem] overflow-hidden min-w-[280px] md:min-w-0 snap-start shrink-0 shadow-md hover:shadow-2xl transition-all duration-300 group flex flex-col">
                <div className="relative h-[180px] lg:h-[220px] w-full bg-blue-100 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=600&auto=format&fit=crop"
                    alt="Indoor snowpark"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#1877F2] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    Snowboard
                  </div>
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <h4 className="font-bold text-xl text-gray-900 mb-3 leading-tight group-hover:text-[#4F7354] transition-colors">
                    ฝึกสโนว์บอร์ดที่กวางโจว...
                  </h4>
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <MapPin size={16} className="text-[#4F7354]" />
                      <span>กวางโจว, จีน</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <CalendarDays size={16} className="text-[#4F7354]" />
                      <span>25-28 กรกฎาคม 2026</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-gray-400 text-sm line-through decoration-gray-400 font-medium">
                        ฿ 18,900
                      </div>
                      <div className="text-[#E03131] font-extrabold text-2xl">฿ 12,600</div>
                    </div>
                    <button className="bg-gray-900 hover:bg-[#4F7354] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-[1.5rem] overflow-hidden min-w-[280px] md:min-w-0 snap-start shrink-0 shadow-md hover:shadow-2xl transition-all duration-300 group flex flex-col">
                <div className="relative h-[180px] lg:h-[220px] w-full bg-blue-100 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=600&auto=format&fit=crop"
                    alt="Outdoor snow mountain"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#1877F2] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    Snowboard
                  </div>
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <h4 className="font-bold text-xl text-gray-900 mb-3 leading-tight group-hover:text-[#4F7354] transition-colors">
                    เมืองหิมะสวยสงบที่ฟุระโนะ...
                  </h4>
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <MapPin size={16} className="text-[#4F7354]" />
                      <span>ฮอกไกโด, ญี่ปุ่น</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <CalendarDays size={16} className="text-[#4F7354]" />
                      <span>28-31 สิงหาคม 2026</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-gray-400 text-sm line-through decoration-gray-400 font-medium">
                        ฿ 23,900
                      </div>
                      <div className="text-[#E03131] font-extrabold text-2xl">฿ 18,300</div>
                    </div>
                    <button className="bg-gray-900 hover:bg-[#4F7354] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Snowboard Trips Section */}
          <div className="xl:col-span-4 flex flex-col mt-4 xl:mt-0">
            <div className="flex justify-between items-end mb-6 px-2">
              <h3 className="text-white text-2xl font-bold tracking-wide">ทริป Snowboard</h3>
              <a
                href="#"
                className="text-[#B3C8A4] font-medium hover:text-white transition-colors bg-white/10 px-4 py-1.5 rounded-full text-sm"
              >
                ดูทั้งหมด
              </a>
            </div>

            <div className="bg-white rounded-[2rem] p-4 shadow-xl hover:shadow-2xl transition-shadow flex gap-5 group cursor-pointer border border-transparent hover:border-[#4F7354]/30">
              <div className="relative w-[130px] h-[150px] shrink-0 rounded-2xl overflow-hidden bg-blue-100">
                <Image
                  src="https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=400&auto=format&fit=crop"
                  alt="Changbaishan snow"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-[#1877F2] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                  Snowboard
                </div>
              </div>
              <div className="flex flex-col justify-center py-2 pr-2">
                <h4 className="font-bold text-lg text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-[#4F7354] transition-colors">
                  ฝึกสโนว์บอร์ดที่ฉางไป่ซาน ชมวิวเทือกเขาหิมะ...
                </h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                    <MapPin size={14} className="text-[#4F7354]" />
                    <span>ฉางไป่ซาน, จีน</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                    <CalendarDays size={14} className="text-[#4F7354]" />
                    <span>25-27 สิงหาคม 2026</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium bg-gray-100 w-fit px-2 py-1 rounded-md mt-1">
                    <User size={12} className="text-gray-700" />
                    <span className="text-gray-700">Level 1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Can add more vertical list items here for desktop if needed */}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MenuFooter />
    </div>
  )
}
