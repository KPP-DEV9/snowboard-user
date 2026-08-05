import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { WebSocketProvider } from "@/contexts/WebSocketContext"
import { getUser } from "./actions/auth"
import MenuFooter from "@/components/MenuFooter"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "SNOWVIBES TOURS",
  description: "จองทริปสโนว์บอร์ดและสกี",
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
        <main className="w-full mx-auto min-h-screen relative bg-background shadow-2xl overflow-x-hidden flex flex-col">
          <WebSocketProvider userId={user?.id}>
            <div className="flex-1">{children}</div>

            <div className="w-full text-center pb-28 text-white/80 text-sm font-medium z-0 relative">
              Snowvibes Co., Ltd. • Snowwhite by Snowvibes
            </div>
          </WebSocketProvider>
          <MenuFooter />
        </main>
      </body>
    </html>
  )
}
