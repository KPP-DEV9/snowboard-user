import { CheckCircle2 } from "lucide-react"

interface PackageInclusionsProps {
  inclusions: string[]
}

export default function PackageInclusions({ inclusions }: PackageInclusionsProps) {
  if (inclusions.length === 0) return null

  return (
    <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-[1.5rem] p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3.5 text-emerald-800 font-bold text-sm">
        <CheckCircle2 size={18} className="text-emerald-600 fill-emerald-100 shrink-0" />
        <span>สิ่งที่รวมอยู่ในแพ็กเกจ</span>
      </div>
      <ul className="space-y-2 text-xs md:text-[13px] text-gray-700 font-medium">
        {inclusions.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-gray-400 select-none">•</span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

