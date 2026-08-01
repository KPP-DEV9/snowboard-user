import { ClassesStatus } from "@/types/course"
import Link from "next/link"

export default function StatusBtn({ status, id }: { status: ClassesStatus; id: string }) {
  switch (status) {
    case "WAIT_BOOKING":
      return (
        <Link
          href={`/user-classes/${id}`}
          className="relative z-10 text-[10px] text-yellow-600 border border-yellow-600 px-2 py-1 rounded font-bold uppercase block transition-transform hover:scale-[1.01] text-center"
        >
          รอจอง
        </Link>
      )
    case "INS_REJECT":
    case "CUS_REJECT":
      return (
        <Link
          href={`/user-classes/${id}`}
          className="relative z-10 text-[10px] text-gray-500 border border-red-500 px-2 py-1 rounded font-bold uppercase block transition-transform hover:scale-[1.01] text-center"
        >
          {status.toUpperCase() === "INS_REJECT" ? "โปรยกเลิก" : "ลูกค้ายกเลิก"}
        </Link>
      )
    case "CUS_CONFIRM":
      return (
        <div className="text-[10px] text-yellow-500 border border-yellow-500 px-2 py-1 rounded font-bold uppercase">
          รอโปรยืนยัน
        </div>
      )
    case "INS_CONFIRM":
      return (
        <div className="text-[10px] text-green-500 border border-green-500 px-2 py-1 rounded font-bold uppercase">
          ยืนยันแล้ว
        </div>
      )
    case "INPROGRESS":
      return (
        <div className="text-[10px] text-blue-500 border border-blue-500 px-2 py-1 rounded font-bold uppercase">
          In Progress
        </div>
      )
    case "COMPLETE":
      return (
        <Link
          href={`/analysis/${id}`}
          className="relative z-10 text-[10px] text-gold border border-gold px-2 py-1 rounded font-bold uppercase block transition-transform hover:scale-[1.01] text-center"
        >
          เรียนจบแล้ว
        </Link>
      )
    default:
      return null
  }
}
