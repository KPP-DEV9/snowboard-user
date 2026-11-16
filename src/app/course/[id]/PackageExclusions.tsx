import { XCircle } from "lucide-react"

interface PackageExclusionsProps {
  exclusions: string[]
}

export default function PackageExclusions({ exclusions }: PackageExclusionsProps) {
  if (exclusions.length === 0) return null

  return (
    <div className="bg-[#FFF5F5] border border-[#FEE2E2] rounded-[1.5rem] p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3.5 text-rose-800 font-bold text-sm">
        <XCircle size={18} className="text-rose-500 fill-rose-100 shrink-0" />
        <span>สิ่งที่ไม่รวมอยู่ในแพ็กเกจ</span>
      </div>
      <ul className="space-y-2 text-xs md:text-[13px] text-gray-700 font-medium">
        {exclusions.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-gray-400 select-none">•</span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

