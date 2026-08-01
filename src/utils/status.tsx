export const formatStatusTh = (status: string): string => {
  if (!status) return ""
  switch (status.toUpperCase()) {
    case "WAIT_BOOKING":
      return "รอลูกค้าจองเวลา"
    case "CUS_CONFIRM":
      return "รอโปรยืนยัน"
    case "INS_CONFIRM":
      return "โปรยืนยันแล้ว"
    case "INS_REJECT":
      return "โปรยกเลิก"
    case "CUS_REJECT":
      return "ลูกค้ายกเลิก"
    case "INPROGRESS":
      return "กำลังเรียน"
    case "COMPLETE":
      return "เรียนจบแล้ว"
    default:
      return status.replace(/_/g, " ")
  }
}

export const LabelFormatStatusTh = ({ status }: { status: string }) => {
  if (!status) return null

  let text = ""
  let colorClass = ""

  switch (status.toUpperCase()) {
    case "WAIT_BOOKING":
      text = "รอลูกค้าจองเวลา"
      colorClass = "bg-gray-500/20 text-gray-300 border-gray-500/30"
      break
    case "CUS_CONFIRM":
      text = "รอโปรยืนยัน"
      colorClass = "bg-[#c19b52]/20 text-[#c19b52] border-[#c19b52]/30"
      break
    case "INS_CONFIRM":
      text = "ยืนยันเรียบร้อย"
      colorClass = "bg-green-500/20 text-green-500 border-green-500/30"
      break
    case "INS_REJECT":
      text = "โปรยกเลิก"
      colorClass = "bg-red-500/20 text-red-500 border-red-500/30"
      break
    case "CUS_REJECT":
      text = "ลูกค้ายกเลิก"
      colorClass = "bg-red-500/20 text-red-500 border-red-500/30"
      break
    case "INPROGRESS":
      text = "กำลังเรียน"
      colorClass = "bg-blue-500/20 text-blue-500 border-blue-500/30"
      break
    case "COMPLETE":
      text = "เรียนจบแล้ว"
      colorClass = "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
      break
    default:
      text = status.replace(/_/g, " ")
      colorClass = "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }

  return (
    <div
      className={`px-2 py-1 rounded text-[10px] font-bold border whitespace-nowrap text-center ${colorClass}`}
    >
      {text}
    </div>
  )
}
