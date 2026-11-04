import Image from "next/image"
import MenuFooter from "../MenuFooter"

export default function LayoutPage({
  children,
  isLicense = false,
  isFooter = true,
}: {
  children: React.ReactNode
  isLicense?: boolean
  isFooter?: boolean
}) {
  return (
    <main className="w-full mx-auto min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src={"/bg/bg-desktop.png"}
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">{children}</div>

      {isLicense && (
        <div className="w-full text-center pb-28 text-white/80 text-sm font-medium z-10 relative">
          Snowvibes Co., Ltd. • Snowwhite by Snowvibes
        </div>
      )}
      {isFooter && <MenuFooter />}
    </main>
  )
}
