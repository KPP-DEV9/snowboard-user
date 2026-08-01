import Image from "next/image"
import { Snowflake } from "lucide-react"

export default function Loading() {
  return (
    <div className="relative min-h-screen w-full bg-[#1e466e] flex flex-col justify-between overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800&auto=format&fit=crop"
          alt="Snowboarders on mountain"
          fill
          className="object-cover"
          priority
        />
        {/* Optional overlay to make text pop slightly if needed */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Top Wavy Overlay */}
      <div className="relative z-10 w-full pt-16 pb-32 px-6 flex flex-col items-center justify-start">
        {/* Wavy Background SVG */}
        <div className="absolute top-0 left-0 right-0 bottom-0 -z-10">
          <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[120%] object-cover object-bottom" preserveAspectRatio="none">
            <path 
              d="M0 0H1440V400C1440 400 1320 580 960 480C600 380 400 600 0 500V0Z" 
              fill="#859877"
            />
            {/* Added white border stroke for the wave */}
            <path 
              d="M1440 400C1320 580 960 480 600 380C400 600 0 500" 
              stroke="white" 
              strokeWidth="12" 
              fill="none"
            />
          </svg>
        </div>
        
        {/* Logo Replacement */}
        <div className="flex flex-col items-center justify-center mt-2 relative">
          <div className="flex flex-col items-center">
            <h1 className="text-white font-black text-[3.5rem] tracking-tighter uppercase leading-[0.85] drop-shadow-sm font-sans flex items-center relative z-10">
              SNOW
            </h1>
            <h1 className="text-white font-black text-[3.5rem] tracking-tighter uppercase leading-[0.85] drop-shadow-sm font-sans flex items-center relative z-10">
              V
              <div className="relative inline-flex items-center justify-center -mx-1">
                {/* i with a snowflake dot */}
                <span className="opacity-0">I</span>
                <span className="absolute bottom-0 text-white font-black">I</span>
                <Snowflake size={22} className="absolute -top-3 text-white fill-white" strokeWidth={3} />
              </div>
              BES
            </h1>
          </div>
          <p className="text-white font-bold tracking-[0.45em] text-sm mt-4 ml-2">TOUR</p>
        </div>
      </div>

      {/* Bottom Wavy Overlay */}
      <div className="relative z-10 w-full pt-32 pb-8 flex flex-col items-center justify-end">
         {/* Wavy Background SVG */}
         <div className="absolute bottom-0 left-0 right-0 top-0 -z-10">
          <svg viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover object-top" preserveAspectRatio="none">
            <path 
              d="M0 400H1440V200C1440 200 1200 0 720 150C240 300 0 100 0 100V400Z" 
              fill="#859877"
            />
             {/* Added white border stroke for the wave */}
             <path 
              d="M1440 200C1200 0 720 150 240 300C0 100 0 100" 
              stroke="white" 
              strokeWidth="12" 
              fill="none"
            />
          </svg>
        </div>
        <p className="text-white/90 text-[11px] font-medium tracking-wide">
          Snowvibes Co., Ltd. • Snowwhite by Snowvibes
        </p>
      </div>
    </div>
  )
}
