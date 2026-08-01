import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { WebSocketProvider } from "@/contexts/WebSocketContext"
import { getUser } from "./actions/auth"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Singha Golf Academy",
  description: "ระบบจองและบริหารการเรียนสำหรับสมาชิกของ Academy",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUser()

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <main className="max-w-[480px] lg:max-w-[700px] mx-auto min-h-screen relative bg-background shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-x-hidden">
          <WebSocketProvider userId={user?.id}>{children}</WebSocketProvider>
        </main>
      </body>
    </html>
  )
}
