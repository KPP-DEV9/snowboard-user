interface Props {
  text?: string
  type?: "fullScreen" | "cycle"
}

export default function Loading({ text, type = "fullScreen" }: Props) {
  if (type === "cycle") {
    return (
      <div className="flex items-center justify-center py-8 w-full">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full absolute border-4 border-card-border"></div>
          <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-gold border-t-transparent"></div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-6 gap-4">
        <div className="flex items-center justify-center py-8 w-full">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full absolute border-4 border-card-border"></div>
            <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-gold border-t-transparent"></div>
          </div>
        </div>
        <p className="text-[14px] text-text-subtle animate-pulse">{text || "กำลังโหลดข้อมูล..."}</p>
      </div>
    )
  }
}
