"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/Ui/Button/Button"
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
    <div className="flex flex-col min-h-screen px-6 py-10 relative items-center justify-center text-center">
      <Logo />

      <div className="w-10 h-[2px] bg-gold mb-8 z-10 relative" />

      <p className="text-text-muted text-sm leading-[1.6] mb-auto max-w-[260px] z-10 relative">
        ระบบจองและบริหารการเรียน
        <br />
        สำหรับสมาชิกของ TOURS
      </p>

      <div className="w-full mt-16 z-10 relative flex flex-col items-center">
        <div style={{ width: "100%" }}>
          <Button
            variant="line"
            className="mb-4"
            onClick={handleLineLogin}
            disabled={!isReady || isLoading || !!liffError}
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.5 10.4C21.5 6.4 17.2 3.1 12 3.1C6.8 3.1 2.5 6.4 2.5 10.4C2.5 14.1 6.1 17.2 10.6 17.7C11.1 17.8 11.6 18.2 11.4 18.8C11.3 19.3 10.9 20.6 10.9 20.6C10.9 20.6 10.7 21.2 11.4 21.2C12.1 21.2 13.6 19.9 16.3 17.2C19.7 14 21.5 12.2 21.5 10.4Z"
                  fill="currentColor"
                />
              </svg>
            }
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วย LINE"}
          </Button>
          {liffError && <p className="text-red-500 text-[12px] mt-2">LIFF Error: {liffError}</p>}
        </div>

        <p className="text-[12px] text-text-subtle leading-[1.5]">
          การเข้าสู่ระบบถือว่ายอมรับ
          <br />
          เงื่อนไขการใช้บริการ
        </p>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
