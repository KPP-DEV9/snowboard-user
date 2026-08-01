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
          <button className="w-8 h-8 flex items-center justify-center text-gold bg-card-bg border border-card-border rounded-full transition-colors hover:bg-gold/10">
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

      <Link href="/dashboard" passHref>
        <button className="flex items-center gap-2 text-text-muted hover:text-gold transition-colors text-[14px]">
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
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </Link>
    </header>
  )
}
