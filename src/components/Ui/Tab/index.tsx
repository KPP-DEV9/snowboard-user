import Link from "next/link"

export default function Tab() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/instructors" className="flex-1 no-underline block">
        <button className="w-full bg-card-bg border border-card-border rounded-xl px-2 py-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#222]">
          <svg
            className="text-gold"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="text-[12px] font-semibold text-center leading-tight">เลือกโปร</span>
        </button>
      </Link>

      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold flex-shrink-0 opacity-50"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>

      <Link href="/courses" className="flex-1 no-underline block">
        <button className="w-full bg-card-bg border border-card-border rounded-xl px-2 py-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#222]">
          <svg
            className="text-gold"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <span className="text-[12px] font-semibold text-center leading-tight">ซื้อคอร์ส</span>
        </button>
      </Link>

      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold flex-shrink-0 opacity-50"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>

      <Link href="/book" className="flex-1 no-underline block">
        <button className="w-full bg-card-bg border border-card-border rounded-xl px-2 py-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#222]">
          <svg
            className="text-gold"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className="text-[12px] font-semibold text-center leading-tight">จองเวลา</span>
        </button>
      </Link>

      {/* <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold flex-shrink-0 opacity-50"
      >
        <path d="M9 18l6-6-6-6" />
      </svg> */}

      {/* <Link href="/enrollments" className="flex-1 no-underline block">
        <button className="w-full bg-card-bg border border-card-border rounded-xl px-2 py-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#222]">
          <svg
            className="text-gold"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span className="text-[12px] font-semibold text-center leading-tight">ประวัติ</span>
        </button>
      </Link> */}
    </div>
  )
}
