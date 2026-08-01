"use client"

import { Wrench } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-card border border-border p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-xl">
        <div className="flex justify-center">
          <div className="p-4 bg-gold/10 rounded-full">
            <Wrench className="w-12 h-12 text-gold animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            ระบบปิดปรับปรุง
          </h1>
          <p className="text-muted text-sm">
            เวลา 13:30 - 18:00 น.
            <br />
            เรากำลังทำการปรับปรุงระบบเพื่อเพิ่มประสิทธิภาพการให้บริการ
            <br />
            ขออภัยในความไม่สะดวก
          </p>
        </div>

        <div className="text-xs text-muted/50 pt-4 border-t border-border">
          หากมีข้อสงสัยเพิ่มเติม โปรดติดต่อผู้ดูแลระบบ
        </div>
      </div>
    </div>
  )
}
