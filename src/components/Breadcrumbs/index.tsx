import Link from "next/link"

interface Props {
  title: string
  step: string
  urlBack?: string
}

export default function Breadcrumbs({ title, step, urlBack = "/dashboard" }: Props) {
  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href={urlBack} passHref>
          <button className="w-8 h-8 flex items-center justify-center text-gold bg-white/10 border border-white/30 rounded-full transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </Link>
        <div>
          <div className="text-[10px] text-gold tracking-[2px] font-bold mb-1">{step}</div>
          <h1 className="text-[24px] font-bold">{title}</h1>
        </div>
      </div>
    </header>
  )
}
