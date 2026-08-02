import Image from "next/image"

interface Props {
  style?: "white" | "green"
  className?: string
}

export default function Logo({ style = "white", className = "" }: Props) {
  const src = style === "white" ? "/logo/white.png" : "/logo/green.png"

  return (
    <Image
      src={src}
      alt="Snow Vibes Logo"
      width={500}
      height={200}
      priority
      // unoptimized={true}
      className={`w-[180px] lg:w-[280px] h-auto object-contain ${className}`}
    />
  )
}
