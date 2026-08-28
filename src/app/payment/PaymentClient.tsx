"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react"
import numeral from "numeral"
import { Toast } from "@/components/Ui/Toast/Toast"
import { Spinner } from "@/components/Ui/Loading/Spinner"
import { Course } from "@/types/course"
import { Enrollment } from "@/types/enrollment"
import { updateEnrollment } from "@/app/actions/enrollment"
import { uploadImageR2 } from "@/app/actions/image"

interface PaymentClientProps {
  course: Course
  enrollment?: Enrollment | null
  roundId?: string
  adultsCount: number
  childrenCount: number
}

export interface Image {
  id: string // ใช้ string หรือ uuid type จาก library เช่น uuid
  url: string
  key: string
  folder: string
  file_name: string
  file_size: number
  mime_type: string
}

export default function PaymentClient({
  course,
  enrollment,
  roundId,
  adultsCount,
  childrenCount,
}: PaymentClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)

  const [slipFile, setSlipFile] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (slipPreview) {
        URL.revokeObjectURL(slipPreview)
      }
    }
  }, [slipPreview])

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setToast({
        message: "กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น (JPG, PNG, WEBP)",
        type: "error",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({
        message: "ขนาดไฟล์รูปภาพต้องไม่เกิน 5 MB",
        type: "error",
      })
      return
    }

    if (slipPreview) {
      URL.revokeObjectURL(slipPreview)
    }

    const previewUrl = URL.createObjectURL(file)
    setSlipFile(file)
    setSlipPreview(previewUrl)
  }

  const handleRemoveFile = () => {
    if (slipPreview) {
      URL.revokeObjectURL(slipPreview)
    }
    setSlipFile(null)
    setSlipPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Check if deposit was already paid
  const isDepositAlreadyPaid = Boolean(
    (enrollment?.deposit_amount && enrollment.deposit_amount > 0) ||
    enrollment?.status === "deposit_paid" ||
    enrollment?.status?.toLowerCase()?.includes("มัดจำ"),
  )

  const [paymentType, setPaymentType] = useState<"deposit" | "full">(
    isDepositAlreadyPaid ? "full" : "deposit",
  )

  // Calculate prices
  const baseCoursePrice = (course.price || 0) - (course.discount || 0)
  const baseChildPrice = (course.child_price || 0) - (course.discount || 0)

  // 1. Adults trip cost
  const adultSubtotal = baseCoursePrice * (adultsCount || 1)

  // 2. Children trip cost
  const childSubtotal = baseChildPrice * (childrenCount || 0)

  // 3. Extra items (Requirement Transactions)
  const extrasSubtotal =
    enrollment?.requirement_transactions && enrollment.requirement_transactions.length > 0
      ? enrollment.requirement_transactions.reduce((sum, item) => {
          const price =
            item.requirement_type === "ASSET"
              ? Number(item.asset_master?.price) || 0
              : Number(item.option_master?.price) || 0
          return sum + price
        }, 0)
      : Number(enrollment?.req_total) || 0

  // รายการทั้งหมด (Subtotal = sum of all listed items)
  const subtotal = adultSubtotal + childSubtotal + extrasSubtotal

  // ภาษี Vat 7%
  const vatAmount = subtotal * 0.07

  // ยอดทั้งหมด (Grand Total)
  const totalAmount = subtotal + vatAmount

  // มัดจำ 30% ของยอดทั้งหมด
  const depositAmount =
    enrollment?.deposit_amount && enrollment.deposit_amount > 0
      ? enrollment.deposit_amount
      : totalAmount * 0.3

  // ยอดคงเหลือ
  const remainingAmount = Math.max(0, totalAmount - depositAmount)

  const currentPayAmount = isDepositAlreadyPaid
    ? remainingAmount
    : paymentType === "deposit"
      ? depositAmount
      : totalAmount

  const handleConfirmPayment = async () => {
    try {
      if (!slipFile) {
        setToast({
          message: "กรุณาแนบสลิปหลักฐานการชำระเงินก่อนกดยืนยัน",
          type: "warning",
        })
        return
      }

      setLoading(true)

      // 1. Upload slip image to /images-upload/r2
      const formData = new FormData()
      formData.append("image", slipFile)
      formData.append("folder", "payment_sv")

      const uploadRes = await uploadImageR2(formData)
      if (!uploadRes.success) {
        setToast({
          message: uploadRes.error || "เกิดข้อผิดพลาดในการอัพโหลดสลิป",
          type: "error",
        })
        return
      }

      const uploadedSlipUrl = uploadRes.data.url

      const isDeposit = paymentType === "deposit" ? true : false
      const newStatus = isDeposit ? "deposit_paid" : "paid"

      const effectiveAdults = Number(enrollment?.adult_count || adultsCount || 1)
      const effectiveChildren = Number(enrollment?.child_count ?? childrenCount ?? 0)

      if (enrollment?.id) {
        const res = await updateEnrollment(enrollment.id, {
          course_id: enrollment.course_id || course.id,
          round_id: enrollment.round_id || roundId || "",
          adult_count: effectiveAdults,
          child_count: effectiveChildren,
          status: newStatus,
          deposit_amount: isDeposit ? depositAmount : 0,
          total_amount: isDeposit ? 0 : totalAmount,
          slip_url: uploadedSlipUrl,
        })
        if (!res.success) {
          setToast({
            message: res.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูลการชำระเงิน",
            type: "error",
          })
          return
        }
      } else {
        setToast({
          message: "ไม่พบข้อมูลการจอง!",
          type: "error",
        })
        // router.push(backUrl)
      }

      setToast({
        message: "การชำระเงินสำเร็จ! กำลังพาท่านไปยังหน้ารายการทริป...",
        type: "success",
      })

      setTimeout(() => {
        router.push("/mytrip")
      }, 1000)
    } catch (err: any) {
      setToast({
        message: err?.message || "เกิดข้อผิดพลาดในการชำระเงิน",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const backUrl = `/booking/?enrollment_id=${enrollment?.id}&course_id=${course.id}&round_id=${roundId}&adults=${adultsCount}&children=${childrenCount}`

  return (
    <div className="min-h-screen bg-[#2D455D] pb-32 font-sans selection:bg-[#568759]/30">
      <div className="w-full px-4 mx-auto pt-6 max-w-lg">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-8">
          <Link
            href={backUrl}
            className="absolute left-0 text-white p-1 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={24} className="stroke-[2.5]" />
          </Link>
          <h1 className="text-xl font-bold text-white tracking-wide">ชำระเงิน</h1>
        </div>

        {/* Course Title & Price Summary */}
        <div className="mb-6">
          <h2 className="text-white font-extrabold text-[17px] md:text-[19px] leading-snug mb-4">
            {course.title}
          </h2>

          <div className="space-y-2 text-[14px] md:text-[15px]">
            {/* 1. Base trip cost for adults */}
            <div className="flex justify-between items-center text-white/95">
              <span className="font-normal">ค่าทริปผู้ใหญ่ ({adultsCount} ท่าน)</span>
              <span className="font-medium">฿ {numeral(adultSubtotal).format("0,0.00")}</span>
            </div>

            {/* 2. Base trip cost for children if any */}
            {childrenCount > 0 && (
              <div className="flex justify-between items-center text-white/95">
                <span className="font-normal">ค่าทริปเด็ก ({childrenCount} ท่าน)</span>
                <span className="font-medium">฿ {numeral(childSubtotal).format("0,0.00")}</span>
              </div>
            )}

            {/* 3. Extra items (Requirement Transactions) */}
            {enrollment?.requirement_transactions &&
              enrollment.requirement_transactions.map((item, idx) => {
                const isAsset = item.requirement_type === "ASSET"
                const name = isAsset
                  ? `${item.asset_master?.name || "เช่าอุปกรณ์"}${
                      item.asset_master?.size ? ` (${item.asset_master.size})` : ""
                    }`
                  : item.option_master?.name || "บริการเพิ่มเติม"
                const price = isAsset
                  ? item.asset_master?.price || 0
                  : item.option_master?.price || 0

                return (
                  <div
                    key={item.id || idx}
                    className="flex justify-between items-center text-white/95"
                  >
                    <span className="font-normal truncate max-w-[270px]">• {name}</span>
                    <span className="font-medium shrink-0">
                      ฿ {numeral(price).format("0,0.00")}
                    </span>
                  </div>
                )
              })}

            {/* Divider */}
            <div className="border-t border-white/20 pt-2.5 mt-2 space-y-2">
              <div className="flex justify-between items-center text-white">
                <span className="font-normal text-white/90">รายการทั้งหมด</span>
                <span className="font-medium">฿ {numeral(subtotal).format("0,0.00")}</span>
              </div>

              <div className="flex justify-between items-center text-white">
                <span className="font-normal text-white/90">ภาษี Vat 7%</span>
                <span className="font-medium">฿ {numeral(vatAmount).format("0,0.00")}</span>
              </div>

              <div className="flex justify-between items-center text-white pt-1">
                <span className="font-normal text-white/90">ยอดทั้งหมด</span>
                <span className="font-bold text-lg">฿ {numeral(totalAmount).format("0,0.00")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* White Payment Card */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col text-black">
          {/* Radio Options Header */}
          <h3 className="text-gray-900 font-bold text-base mb-3.5">เลือกรูปแบบชำระเงิน</h3>

          {/* Radio Options List */}
          <div className="space-y-2.5">
            {/* If deposit is NOT paid yet, show "ชำระมัดจำ" option */}
            {!isDepositAlreadyPaid && (
              <label className="flex items-center justify-between cursor-pointer py-1">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentType"
                    value="deposit"
                    checked={paymentType === "deposit"}
                    onChange={() => setPaymentType("deposit")}
                    className="w-4 h-4 text-[#0066FF] border-gray-300 focus:ring-[#0066FF] cursor-pointer"
                  />
                  <span className="text-gray-900 font-medium text-sm">ชำระมัดจำ</span>
                </div>
                <span className="text-gray-900 font-medium text-sm">
                  ฿ {numeral(depositAmount).format("0,0.00")}
                </span>
              </label>
            )}

            {/* Full Amount / Remaining Amount Option */}
            <label className="flex items-center justify-between cursor-pointer py-1">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentType"
                  value="full"
                  checked={paymentType === "full" || isDepositAlreadyPaid}
                  onChange={() => setPaymentType("full")}
                  className="w-4 h-4 text-[#0066FF] border-gray-300 focus:ring-[#0066FF] cursor-pointer"
                />
                <span className="text-gray-900 font-medium text-sm">ชำระเต็มจำนวน</span>
              </div>
              <span className="text-gray-900 font-medium text-sm">
                ฿ {numeral(isDepositAlreadyPaid ? remainingAmount : totalAmount).format("0,0.00")}
              </span>
            </label>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Deposit Instructions (Only shown when "ชำระมัดจำ" is selected and deposit not yet paid) */}
          {!isDepositAlreadyPaid && paymentType === "deposit" && (
            <div className="text-center py-2 mb-4">
              <div className="text-gray-900 font-bold text-sm mb-1.5">
                ชำระเงินเพื่อยืนยันการจอง 30% ของราคาทริป
              </div>

              <div className="text-gray-400 text-[11px] md:text-xs leading-relaxed space-y-0.5 font-normal">
                <p>โดยส่วนที่เหลือจะต้องชำระก่อนวันเดินทาง 30 วัน โดยระบบ</p>
                <p>จะทำการแจ้งเตือนให้ชำระเงินผ่าน Line</p>
                <p className="pt-0.5">**กรณียกเลิกขอสงวนสิทธิ์ในการคืนมัดจำ</p>
              </div>
            </div>
          )}

          {/* Slip Upload Section */}
          <div className="my-2 mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-900 font-bold text-sm flex items-center gap-1.5">
                <span>หลักฐานการชำระเงิน (สลิป)</span>
                <span className="text-[#D4411C] text-xs font-semibold">*</span>
              </label>
              {slipFile && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  ✓ แนบไฟล์แล้ว
                </span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
              className="hidden"
            />

            {!slipPreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  const file = e.dataTransfer.files?.[0]
                  if (file) handleFileSelect(file)
                }}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? "border-[#0066FF] bg-blue-50/50 scale-[1.01]"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50/60 hover:bg-gray-100/60"
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 border border-gray-100">
                  <Upload size={20} className="stroke-[2.2] text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    คลิกเพื่ออัพโหลด หรือลากไฟล์มาวาง
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    รองรับ JPG, PNG, WEBP ขนาดไม่เกิน 5MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl border border-gray-200 p-3 bg-gray-50 flex items-center gap-3.5 shadow-sm">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slipPreview}
                    alt="Slip Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {slipFile?.name || "สลิปหลักฐานการชำระเงิน"}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {slipFile ? `${(slipFile.size / (1024 * 1024)).toFixed(2)} MB` : ""}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#0066FF] font-medium hover:underline mt-1 inline-block cursor-pointer"
                  >
                    เปลี่ยนรูปภาพ
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="ลบรูปภาพ"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Pay Amount Row */}
          <div className="flex items-center justify-between my-3">
            <span className="text-gray-900 font-bold text-sm">ยอดชำระ:</span>
            <span className="text-gray-900 font-extrabold text-2xl md:text-[28px] tracking-tight">
              ฿ {numeral(currentPayAmount).format("0,0.00")}
            </span>
          </div>

          {/* Confirm Button (Only show when slip file is attached) */}
          {slipFile && (
            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className={`w-full bg-[#D4411C] hover:bg-[#B93816] text-white py-3.5 rounded-2xl font-bold text-base transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-3 ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="border-white" />
                  <span>กำลังดำเนินการ...</span>
                </>
              ) : (
                <span>ยืนยันชำระเงิน</span>
              )}
            </button>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
