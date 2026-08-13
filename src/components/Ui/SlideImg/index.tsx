"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SlideImgProps {
  images: string[]
  alt?: string
}

export default function SlideImg({ images, alt = "image" }: SlideImgProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft
        const width = scrollRef.current.clientWidth
        const newIndex = Math.round(scrollLeft / width)
        setActiveIndex(newIndex)
      }
    }

    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll, { passive: true })
      return () => scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollTo = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth
      scrollRef.current.scrollTo({ left: width * index, behavior: "smooth" })
    }
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
        No image
      </div>
    )
  }

  return (
    <div className="w-full h-full relative group">
      <div
        ref={scrollRef}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((url, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
            <Image
              src={url}
              alt={`${alt} ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => scrollTo(Math.max(0, activeIndex - 1), e)}
            className={`absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 z-10`}
            disabled={activeIndex === 0}
          >
            <ChevronLeft size={18} />
          </button>
          
          <button
            onClick={(e) => scrollTo(Math.min(images.length - 1, activeIndex + 1), e)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 z-10`}
            disabled={activeIndex === images.length - 1}
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors shadow-sm ${
                  idx === activeIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
