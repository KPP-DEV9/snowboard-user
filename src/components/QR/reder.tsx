"use client"

import { Card } from "@/components/Ui/Card/Card"
import numeral from "numeral"
import { CreditPackage } from "@/types/credit"

interface Props {
  pkg?: CreditPackage
}

export default function RenderQr({ pkg }: Props) {
  return (
    <Card className="p-8 w-full bg-white flex flex-col items-center shadow-xl shadow-gold/10 border-gold/30 rounded-3xl relative overflow-hidden group">
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-gold via-yellow-400 to-gold"></div>

      {/* Mock QR Code */}
      <div className="w-56 h-56 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center p-3 mb-6 relative group-hover:scale-105 transition-transform duration-500">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-black opacity-80"
          fill="currentColor"
        >
          <rect
            x="10"
            y="10"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
          />
          <rect x="16" y="16" width="13" height="13" />
          <rect
            x="65"
            y="10"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
          />
          <rect x="71" y="16" width="13" height="13" />

          <rect
            x="10"
            y="65"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
          />
          <rect x="16" y="71" width="13" height="13" />

          <path d="M45,10 h10 v10 h-10 z M45,25 h10 v10 h-10 z M45,40 h10 v10 h-10 z" />
          <path d="M10,45 h10 v10 h-10 z M25,45 h10 v10 h-10 z" />
          <path d="M65,45 h10 v10 h-10 z M80,45 h10 v10 h-10 z" />
          <path d="M45,65 h10 v10 h-10 z M45,80 h10 v10 h-10 z" />

          <rect x="45" y="45" width="10" height="10" />
          <rect x="55" y="55" width="10" height="10" />
          <rect x="65" y="65" width="10" height="10" />
          <rect
            x="75"
            y="75"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
          />
        </svg>
        <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
      </div>

      <div className="text-center w-full">
        <div className="bg-gray-100 rounded-lg p-4 mb-2">
          <span className="text-[14px] text-gray-500 block mb-1">ยอดชำระเงิน</span>
          <span className="text-[28px] font-bold text-gray-900 tracking-tight">
            {`฿${numeral(pkg?.price).format("0,0.00")}`}
          </span>
        </div>
      </div>
    </Card>
  )
}
