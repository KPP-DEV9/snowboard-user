import { Card } from "@/components/Ui/Card/Card"
import { ChevronLeft, Check, Star } from "lucide-react"
import Link from "next/link"
import numeral from "numeral"
import { getSession } from "../actions/auth"
import { getAllCreditPackages } from "../actions/credit"
import { Pagination } from "@/components/Ui/Pagination"
import { PurchasePackageBtn } from "@/components/Button/PurchasePackageBtn"

export default async function CreditPackagePage(props: {
  searchParams?: Promise<{
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page) || 1
  const limit = 100

  const session = await getSession()
  if (!session?.user) return null

  const res = await getAllCreditPackages(session.user.id, page, limit)
  const packages = res.data

  return (
    <div className="min-h-screen bg-[#111] text-foreground flex flex-col pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#111]/80 backdrop-blur-md border-b border-card-border/50 px-6 py-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gold" />
        </Link>
        <h1 className="text-lg font-bold tracking-wider text-gold">CREDIT PACKAGES</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="p-6 flex flex-col gap-8 flex-1">
        {/* Intro */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <p className="text-text-muted text-sm px-4">
            Select the best credit package that fits your training needs. More credits give you
            better value.
          </p>
        </div>

        {/* Packages List */}
        <div className="flex flex-col gap-6">
          {packages?.data
            ?.sort((a, b) => {
              if (a.tag === "POPULAR" && b.tag !== "POPULAR") return -1
              if (b.tag === "POPULAR" && a.tag !== "POPULAR") return 1
              return Number(a.price) - Number(b.price) // Sorting ascending by price
            })
            .map((pkg) => (
              <Card
                key={pkg.id}
                interactive
                className={`relative overflow-hidden ${
                  pkg.tag === "POPULAR"
                    ? "border-gold bg-gradient-to-br from-card-bg to-[#2a2212]"
                    : "border-card-border/50 bg-card-bg"
                }`}
              >
                {pkg.tag === "POPULAR" && (
                  <div className="absolute top-0 right-0 bg-gold text-[#111] text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 tracking-wider">
                    <Star className="w-3 h-3 fill-[#111]" /> MOST POPULAR
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gold">
                          {numeral(pkg.credit_amount).format("0,0.00")}
                        </span>
                        <span className="text-sm text-text-muted">เครดิต</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-xl font-bold">
                        {numeral(pkg.price).format("0,0.00")} THB
                      </span>
                      <span className="text-xs text-text-muted">
                        {numeral(Number(pkg.price) / Number(pkg.credit_amount)).format("0,0.00")}{" "}
                        THB / เครดิต
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-card-border/50 my-1"></div>

                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 w-full">
                    {session?.user?.id && (
                      <PurchasePackageBtn package_id={pkg.id} user_id={session.user.id} />
                    )}
                  </div>
                </div>
              </Card>
            ))}
        </div>

        <Pagination
          totalPages={packages?.total_pages || 1}
          currentPage={page}
          baseUrl="/credit-package"
        />
      </div>
    </div>
  )
}
