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
        <main className="w-full mx-auto min-h-screen relative bg-background shadow-2xl overflow-x-hidden">
          <WebSocketProvider userId={user?.id}>{children}</WebSocketProvider>
        </main>
      </body>
    </html>
  )
}
