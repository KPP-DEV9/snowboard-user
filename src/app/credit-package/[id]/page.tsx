import { getCreditPackageById } from "@/app/actions/credit"
import { getSession } from "@/app/actions/auth"
import Breadcrumbs from "@/components/Breadcrumbs"
import { notFound } from "next/navigation"
import { CreditPackage } from "@/types/credit"
import RenderQr from "@/components/QR/reder"
import PaymentWatcher from "@/components/Payment/PaymentWatcher"
import numeral from "numeral"

interface CreditPackagePageProps {
  params: Promise<{ id: string }>
}

export default async function CreditPackagePaymentPage({ params }: CreditPackagePageProps) {
  const resolvedParams = await params
  const packageId = resolvedParams.id

  if (!packageId) {
    return notFound()
  }

  const { success, data } = await getCreditPackageById(packageId)

  // Explicitly cast data to CreditPackage to let TS know its properties
  const pkg = data as unknown as CreditPackage

  if (!success || !pkg) {
    return notFound()
  }

  const session = await getSession()
  if (!session?.user) return notFound()

  return (
    <div className="p-6 flex flex-col min-h-screen pb-[100px] animate-fade-in">
      <Breadcrumbs title={"ชำระเงิน"} step={"PAYMENT"} urlBack={`/credit-package`} />

      <div className="mt-3 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-bold text-foreground mb-2">Scan to Pay</h1>
          <p className="text-[14px] text-text-muted">สแกน QR Code เพื่อชำระเงินซื้อแพ็กเกจเครดิต</p>
        </div>

        <RenderQr pkg={pkg} />

        <div className="w-full mt-8 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-card/40 p-4 rounded-xl border border-card-border/50">
            <div className="flex flex-col">
              <span className="text-[12px] text-text-muted">แพ็กเกจ</span>
              <span className="text-[14px] font-bold text-foreground truncate max-w-[200px]">
                {pkg.name}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[12px] text-text-muted text-right">เครดิตที่จะได้รับ</span>
              <div>
                <span className="text-[24px] font-medium text-gold uppercase">
                  {numeral(pkg.credit_amount).format("0,0")}
                </span>
                <span className="pl-2">เครดิต</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time payment status watcher via WebSocket */}
        <PaymentWatcher packageName={pkg.name} creditAmount={pkg.credit_amount} />
      </div>
    </div>
  )
}
