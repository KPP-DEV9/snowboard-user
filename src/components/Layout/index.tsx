import MenuFooter from "../MenuFooter"

export default function LayoutPage({
  children,
  isLicense = true,
}: {
  children: React.ReactNode
  isLicense?: boolean
}) {
  return (
    <main className="w-full mx-auto min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col">
      {children}

      {isLicense && (
        <div className="w-full text-center pb-28 text-white/80 text-sm font-medium z-0 relative">
          Snowvibes Co., Ltd. • Snowwhite by Snowvibes
        </div>
      )}
      <MenuFooter />
    </main>
  )
}
