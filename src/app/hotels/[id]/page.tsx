import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Bed, Users, Calendar, Sparkles } from "lucide-react"
import LayoutPage from "@/components/Layout"
import SlideImg from "@/components/Ui/SlideImg"
import CourseBox from "@/components/CourseBox"
import { getHotelById } from "@/app/actions/hotel"
import { getLocationName } from "@/constants/location"
import { NATIONALITIES, getCountryTh } from "@/constants/nationality"

interface HotelDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function HotelDetailPage({ params }: HotelDetailPageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const { success, data: hotel, relatedCourses = [] } = await getHotelById(id)

  if (!success || !hotel) {
    return (
      <LayoutPage>
        <div className="w-full px-4 mx-auto pt-16 pb-32 max-w-2xl text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-4">
              ไม่พบข้อมูลโรงแรม
            </h1>
            <p className="text-white/70 text-sm mb-6">
              โรงแรมที่ท่านกำลังค้นหาอาจไม่มีอยู่ หรือถูกนำออกจากระบบแล้ว
            </p>
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 bg-[#C75D33] hover:bg-[#B34B24] text-white font-bold px-6 py-2.5 rounded-full transition-all text-sm"
            >
              <ArrowLeft size={16} /> กลับไปหน้ารวมโรงแรม
            </Link>
          </div>
        </div>
      </LayoutPage>
    )
  }

  const allImages = Array.from(
    new Set([
      ...(hotel.images || []),
      ...(hotel.rooms?.flatMap((r) => r.images || []) || []),
    ]),
  ).filter(Boolean)

  const { districtName, provinceName, nationName } = getLocationName(
    hotel.province,
    hotel.district,
    hotel.nation,
  )
  const countryTh = getCountryTh(hotel.nation) || nationName

  const locationText = [hotel.address, districtName, provinceName, countryTh]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(", ")

  return (
    <LayoutPage>
      <div className="w-full px-4 md:px-8 lg:px-12 mx-auto pt-6 pb-28 max-w-5xl">
        {/* Navigation Back */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/hotels"
            className="text-white font-bold flex items-center gap-2 hover:opacity-80 transition-opacity text-sm md:text-base"
          >
            <ArrowLeft size={20} className="stroke-[3]" /> กลับไปหน้ารวมโรงแรม
          </Link>
          <span className="text-xs md:text-sm font-semibold text-white/60">
            รายละเอียดโรงแรม
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 mb-8">
          {/* Main Image Slider */}
          <div className="relative w-full aspect-[920/474] bg-gray-100">
            {allImages.length > 0 ? (
              <SlideImg images={allImages} alt={hotel.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                ไม่มีรูปภาพ
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
              {hotel.name}
            </h1>

            {locationText && (
              <p className="text-sm md:text-base text-gray-600 flex items-start gap-2 mb-6">
                <MapPin size={18} className="text-[#E86034] shrink-0 mt-0.5" />
                <span>{locationText}</span>
              </p>
            )}

            {hotel.description && (
              <div className="border-t border-gray-100 pt-5">
                <h2 className="text-base font-bold text-gray-900 mb-2">เกี่ยวกับที่พัก</h2>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {hotel.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Rooms Section */}
        {hotel.rooms && hotel.rooms.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Bed className="text-[#E86034]" size={24} /> ประเภทห้องพัก
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {hotel.rooms.map((room, idx) => (
                <div
                  key={room.id || idx}
                  className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {room.name || room.room_type || "ห้องพัก"}
                    </h3>

                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-600 mb-3">
                      {room.capacity ? (
                        <span className="bg-gray-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Users size={12} className="text-gray-500" /> พักได้ {room.capacity} ท่าน
                        </span>
                      ) : null}
                      {room.bed_type ? (
                        <span className="bg-gray-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Bed size={12} className="text-gray-500" /> {room.bed_type}
                        </span>
                      ) : null}
                    </div>

                    {room.description && (
                      <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-4">
                        {room.description}
                      </p>
                    )}
                  </div>

                  {room.price_per_night ? (
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                      <span className="text-gray-500 text-xs">ราคาเริ่มต้น</span>
                      <span className="font-extrabold text-[#C75D33] text-base">
                        ฿{Number(room.price_per_night).toLocaleString()} / คืน
                      </span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Trips & Courses */}
        {relatedCourses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-[#E86034]" size={22} /> ทริปและคอร์สเรียนที่พักโรงแรมนี้
              </h2>
              <span className="text-xs font-semibold text-white/70">
                {relatedCourses.length} รายการ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCourses.map((c) => (
                <CourseBox key={c.id} course={c} className="w-full" />
              ))}
            </div>
          </div>
        )}
      </div>
    </LayoutPage>
  )
}

