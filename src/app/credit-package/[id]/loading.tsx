import { Spinner } from "@/components/Ui/Loading/Spinner"

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" color="border-gold" />
        <p className="text-sm text-text-muted animate-pulse">Loading package details...</p>
      </div>
    </div>
  )
}
