import Link from "next/link"
import {
  ArrowLeft,
  Compass,
  Award,
  Building2,
  Users2,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react"
import LayoutPage from "@/components/Layout"
import Logo from "@/components/Logo"

export const metadata = {
  title: "เกี่ยวกับ SNOWVIBES | About SNOWVIBES",
  description: "รู้จักกับ SNOWVIBES ทริปและคอร์สเรียนสโนว์บอร์ด สกี ครบวงจร",
}

//triger

export default function AboutPage() {
  const highlights = [
    {
      icon: Compass,
      title: "Trips & Adventures",
      desc: "ทริปสัมผัสประสบการณ์หิมะคุณภาพในลานสกีชั้นนำทั้งในญี่ปุ่น จีน และสากล ออกแบบเส้นทางอย่างพิถีพิถัน",
    },
    {
      icon: Award,
      title: "Certified Coaching",
      desc: "ทีมผู้ฝึกสอนมืออาชีพที่ได้รับใบรับรองมาตรฐานระดับสากล สอนเข้าใจง่าย ปลอดภัย และพัฒนาทักษะได้จริง",
    },
    {
      icon: Building2,
      title: "Resort & Hotel Stays",
      desc: "คัดสรรโรงแรมและที่พักติดลานสกี (Ski-in / Ski-out) เพื่อความสะดวกสบายสูงสุดในทุกการพักผ่อน",
    },
    {
      icon: ShieldCheck,
      title: "Safety First",
      desc: "ให้ความสำคัญกับความปลอดภัยเป็นอันดับหนึ่ง พร้อมประกันภัยและการดูแลอย่างใกล้ชิดตลอดการเดินทาง",
    },
    {
      icon: Users2,
      title: "Vibrant Community",
      desc: "คอมมูนิตี้คนรักสโนว์บอร์ดและสกี มิตรภาพใหม่ๆ และความทรงจำสุดประทับใจร่วมกัน",
    },
    {
      icon: HeartHandshake,
      title: "Personalized Service",
      desc: "ให้คำแนะนำอุปกรณ์ การเตรียมตัว และบริการดูแลตั้งแต่ก่อนเริ่มทริปจนจบทริปอย่างอบอุ่น",
    },
  ]

  return (
    <LayoutPage isLicense={true}>
      <div className="w-full min-h-screen pb-32 pt-6 md:pt-10 px-4 md:px-8 lg:px-12 max-w-5xl mx-auto flex flex-col">
        {/* Back Link & Header */}
        <div className="relative flex items-center justify-center mb-8">
          <Link
            href="/"
            className="absolute left-0 text-white font-bold flex items-center gap-2 hover:opacity-80 transition-opacity text-sm md:text-base"
          >
            <ArrowLeft size={20} className="stroke-[3]" /> ย้อนกลับ
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            เกี่ยวกับ SNOWVIBES
          </h1>
        </div>

        {/* Hero Section */}
        <div className="bg-[#0A1A28]/40 backdrop-blur-md border border-white/15 rounded-3xl p-6 md:p-10 shadow-2xl mb-8 flex flex-col items-center text-center">
          <div className="mb-6 hover:scale-105 transition-transform">
            <Logo className="!w-[120px] md:!w-[150px]" />
          </div>

          <h2 className="text-white text-2xl md:text-3xl font-extrabold mb-4 tracking-tight">
            Your Ultimate Snowboard & Ski Experience
          </h2>
          <p className="text-white/85 text-sm md:text-base max-w-2xl leading-relaxed">
            <span className="font-semibold text-white">SNOWVIBES</span>{" "}
            คือพื้นที่สำหรับผู้ที่หลงใหลในเสน่ห์ของฤดูหนาวและกีฬาหิมะ
            เรามุ่งมั่นสร้างสรรค์ประสบการณ์การเดินทาง คอร์สเรียน
            และทริปสกี-สโนว์บอร์ดที่ตอบโจทย์ทุกคน ไม่ว่าจะเป็นผู้เริ่มต้นหัดเล่นครั้งแรก
            หรือผู้เล่นระดับแอดวานซ์ที่ต้องการพัฒนาทักษะสู่ระดับสูงสุด
          </p>
        </div>

        {/* Vision & Mission Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#0A1A28]/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-[#E86034] text-lg md:text-xl font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> วิสัยทัศน์ของเรา (Our Vision)
            </h3>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              เปิดโอกาสให้ทุกคนเข้าถึงกีฬาหิมะได้อย่างสนุกสนาน มั่นใจ และปลอดภัย
              สร้างมาตรฐานใหม่ให้กับการท่องเที่ยวและการฝึกสอนกีฬาฤดูหนาวในประเทศไทย
            </p>
          </div>

          <div className="bg-[#0A1A28]/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-[#00C300] text-lg md:text-xl font-bold mb-3 flex items-center gap-2">
              <span>❄️</span> พันธกิจของเรา (Our Mission)
            </h3>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              ส่งมอบการบริการที่ครบวงจร ตั้งแต่คำปรึกษาการเลือกอุปกรณ์ แคมป์ฝึกอบรม คอร์สส่วนตัว
              ไปจนถึงทริปท่องเที่ยวพร้อมที่พักคุณภาพสูง เพื่อความสุขและความปลอดภัยของทุกคน
            </p>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="mb-10">
          <h3 className="text-white text-xl md:text-2xl font-bold mb-6 text-center">
            ทำไมต้องเลือก SNOWVIBES
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlights.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="bg-[#0A1A28]/35 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-white/30 transition-all duration-300 flex flex-col"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4 shrink-0 shadow-inner">
                    <Icon size={22} className="text-[#E86034]" />
                  </div>
                  <h4 className="text-white font-bold text-base mb-2">{item.title}</h4>
                  <p className="text-white/70 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Banner CTA */}
        <div className="bg-gradient-to-r from-[#182638] to-[#121B28] border border-white/15 rounded-3xl p-6 md:p-8 text-center flex flex-col items-center shadow-xl">
          <h3 className="text-white text-lg md:text-xl font-bold mb-2">
            พร้อมเริ่มการเดินทางไปกับเราแล้วหรือยัง?
          </h3>
          <p className="text-white/75 text-xs md:text-sm max-w-xl mb-6">
            สอบถามรายละเอียดทริป ตารางคอร์สเรียน หรือปรึกษาข้อมูลการเดินทางได้ทุกเมื่อ
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="bg-[#C75D33] hover:bg-[#B34B24] text-white font-bold text-sm px-6 py-2.5 rounded-full transition-all shadow-md active:scale-95"
            >
              ติดต่อเรา
            </Link>
            <Link
              href="/all"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-2.5 rounded-full border border-white/20 transition-all active:scale-95"
            >
              ดูทริปทั้งหมด
            </Link>
          </div>
        </div>
      </div>
    </LayoutPage>
  )
}
