import CategoryTabs from "@/components/CategoryTabs"
import { SlidersHorizontal, MapPin, CalendarDays, User } from "lucide-react"
import Image from "next/image"
import Logo from "@/components/Logo"
import { getCourses } from "./actions/course"
import { RenderDate } from "@/lib/date"
import numeral from "numeral"
import Link from "next/link"

export default async function MainPage() {
  const toures = await getCourses()

  const course = toures?.data?.data

  return (
    <div className="min-h-screen bg-[#859877] pb-24 font-sans selection:bg-[#568759]/30">
      <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-8 lg:pt-12 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-12 gap-6">
          {/* Logo */}
          <Logo />

          {/* Greeting Text */}
          <h2 className="text-white text-xl md:text-2xl font-bold drop-shadow-sm text-center mt-2">
            สวัสดี, เตรียมตัวให้พร้อมสำหรับทริปสุดพิเศษของคุณ
          </h2>

          {/* Category Tabs */}
          <div className="w-full max-w-[500px]">
            <CategoryTabs />
          </div>

          {/* Filters */}
          <div className="flex gap-2 lg:gap-3 overflow-x-auto pb-2 scrollbar-hide w-full justify-center flex-wrap mt-2">
            <button className="flex items-center gap-1.5 bg-white text-[#4F7354] px-4 md:px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm hover:bg-gray-100 transition-colors">
              <SlidersHorizontal size={14} />
              Filter
            </button>
            <button className="bg-[#6B7A5D] hover:bg-[#5F6A56] transition-colors text-white/90 px-4 md:px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm">
              ฮาร์บิน
            </button>
            <button className="bg-[#6B7A5D] hover:bg-[#5F6A56] transition-colors text-white/90 px-4 md:px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm">
              Sunac Snow
            </button>
            <button className="bg-[#6B7A5D] hover:bg-[#5F6A56] transition-colors text-white/90 px-4 md:px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm">
              นิเซโกะ
            </button>
            <button className="bg-[#6B7A5D] hover:bg-[#5F6A56] transition-colors text-white/90 px-4 md:px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm">
              นากาโนะ
            </button>
            <button className="bg-[#6B7A5D] hover:bg-[#5F6A56] transition-colors text-white/90 px-4 md:px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm hidden md:block">
              ฮาร์บิน
            </button>
            <button className="bg-[#6B7A5D] hover:bg-[#5F6A56] transition-colors text-white/90 px-4 md:px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm hidden md:block">
              Sunac Snow
            </button>
            <button className="bg-[#6B7A5D] hover:bg-[#5F6A56] transition-colors text-white/90 px-4 md:px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm hidden lg:block">
              นิเซโกะ
            </button>
            <button className="bg-[#6B7A5D] hover:bg-[#5F6A56] transition-colors text-white/90 px-4 md:px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm hidden lg:block">
              นากาโนะ
            </button>
          </div>
        </div>

        {/* Upcoming Trips Section */}
        <div className="bg-[#6C7A5E] rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-xl w-full mb-12">
          <div className="flex items-center justify-center mb-8">
            <h3 className="text-white text-xl md:text-2xl font-bold tracking-wide">
              ทริปที่กำลังจะถึง..
            </h3>
          </div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 snap-x scrollbar-hide">
            {course?.map((item, i) => (
              <Link
                href={`/course/${item.id}`}
                key={i}
                className="bg-white rounded-[1.5rem] overflow-hidden min-w-[280px] md:min-w-0 snap-start shrink-0 shadow-md hover:shadow-2xl transition-all duration-300 group flex flex-col cursor-pointer"
              >
                <div className="relative h-[180px] lg:h-[200px] w-full bg-blue-100 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=600&auto=format&fit=crop"
                    alt="Indoor snowpark"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#1877F2] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    {item?.course_type?.name}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="font-bold text-lg md:text-xl text-gray-900 mb-3 leading-tight group-hover:text-[#4F7354] transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <MapPin size={16} className="text-[#4F7354] shrink-0" />
                      <span className="truncate">
                        {item?.district?.name}, {item?.province?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <CalendarDays size={16} className="text-[#4F7354] shrink-0" />
                      <span>
                        {RenderDate(item.start_date, "dd MMM yyyy")} {" - "}
                        {RenderDate(item.end_date, "dd MMM yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-gray-400 text-sm line-through decoration-gray-400 font-medium">
                        ฿ {numeral(item.adult_price).format("0,0")}
                      </div>
                      <div className="text-[#E03131] font-extrabold text-xl md:text-2xl">
                        ฿ {numeral(item.adult_price - item.discount).format("0,0")}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Snowboard Trips Section */}
        <div className="w-full flex flex-col">
          <div className="flex justify-between items-end mb-6 px-2">
            <h3 className="text-white text-2xl font-bold tracking-wide">ทริป Snowboard</h3>
            <Link
              href="#"
              className="text-[#B3C8A4] font-bold hover:text-white transition-colors text-lg"
            >
              ทั้งหมด
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {course?.map((item, i) => (
              <Link
                href={`/course/${item.id}`}
                key={i}
                className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 shadow-xl hover:shadow-2xl transition-shadow flex gap-4 md:gap-6 group cursor-pointer border border-transparent hover:border-[#4F7354]/30"
              >
                <div className="relative w-[120px] md:w-[160px] h-[140px] md:h-[160px] shrink-0 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden bg-blue-100">
                  <Image
                    src="https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=400&auto=format&fit=crop"
                    alt="Changbaishan snow"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#1877F2] text-white text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded shadow-sm">
                    {item?.course_type?.name}
                  </div>
                </div>
                <div className="flex flex-col py-2 pr-2 md:pr-4 flex-1 justify-center">
                  <h4 className="font-bold text-base md:text-xl text-gray-900 mb-2 md:mb-3 leading-tight line-clamp-2 group-hover:text-[#4F7354] transition-colors">
                    {item?.title}
                  </h4>
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm font-medium">
                      <MapPin size={16} className="text-[#4F7354] shrink-0" />
                      <span className="truncate">
                        {item?.district?.name}, {item?.province?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm font-medium">
                      <CalendarDays size={16} className="text-[#4F7354] shrink-0" />
                      <span>
                        {RenderDate(item.start_date, "dd MMM yyyy")} {" - "}
                        {RenderDate(item.end_date, "dd MMM yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm font-medium">
                      <User size={16} className="text-[#4F7354] shrink-0" />
                      <span>{item.course_level}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
