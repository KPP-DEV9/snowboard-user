"use client"

import { useEffect, useState } from "react"
import { useLiff } from "@/hooks/useLiff"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { setSession } from "@/app/actions/auth"
import { Toast } from "@/components/Ui/Toast/Toast"
import Logo from "@/components/Logo"

export default function LoginPage() {
  const { liff, isReady, liffError } = useLiff()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)

  useEffect(() => {
    if (!isReady || !liff) return

    if (liff.isLoggedIn()) {
      setIsLoading(true)
      liff
        .getProfile()
        .then(async (profile) => {
          try {
            const response = await api.line.post<{ token: string }>("/auth/line", {
              line_user_id: profile.userId,
              name: profile.displayName,
              email: liff.getDecodedIDToken()?.email || "",
              profile_image: profile.pictureUrl || "",
            })

            console.log("response ==============> ", response)

            if (response.success && response.data?.token) {
              const userData = (response.data as any).user

              // if (userData?.role?.name === "instructor") {
              //   setToast({
              //     message: "บัญชี Instructor ไม่สามารถเข้าสู่ระบบผ่านช่องทางนี้ได้",
              //     type: "error",
              //   })
              //   setIsLoading(false)
              //   liff.logout()
              //   return
              // }

              await setSession(response.data.token, userData)
              router.push("/")
            } else {
              console.error("Login failed:", response.message)
              setToast({ message: response.message || "เข้าสู่ระบบล้มเหลว", type: "error" })
              setIsLoading(false)
            }
          } catch (error) {
            console.error("API error:", error)
            setToast({ message: "เกิดข้อผิดพลาดในการเชื่อมต่อ", type: "error" })
            setIsLoading(false)
          }
        })
        .catch((err) => {
          console.error("Failed to get LIFF profile:", err)
          setIsLoading(false)
        })
    }
  }, [liff, isReady, router])

  const handleLineLogin = () => {
    if (!isReady || !liff) return

    if (!liff.isLoggedIn()) {
      if (process.env.NODE_ENV === "development") {
        liff.login({ redirectUri: "https://localhost:3000/signin" })
      } else {
        liff.login()
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#859877] px-6 py-10 relative items-center justify-center text-center text-white">
      <div className="flex flex-col items-center flex-1 justify-center -mt-20">
        <Logo />

        <div className="mt-8 space-y-1 md:space-y-2">
          <p className="text-sm md:text-base font-medium">ยินดีต้อนรับสู่ SnowVibes</p>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wide">
            ทริปสุดพิเศษต้อง SnowVibes
          </h1>
        </div>
      </div>

      <div className="w-full max-w-sm mt-auto z-10 relative flex flex-col items-center pb-4 md:pb-8">
        <div className="w-full">
          <button
            className="w-full bg-[#3B4C5F] hover:bg-[#2C3948] text-white py-3.5 rounded-xl font-bold text-base transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLineLogin}
            disabled={!isReady || isLoading || !!liffError}
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วย LINE"}
          </button>
          {liffError && (
            <p className="text-red-500 text-[12px] mt-2 font-medium">LIFF Error: {liffError}</p>
          )}
        </div>

        <p className="text-xs text-white/80 mt-6 font-medium">
          การเข้าสู่ระบบถือว่ายอมรับเงื่อนไขการใช้บริการ
        </p>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
