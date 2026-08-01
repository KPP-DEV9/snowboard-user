"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

function getYoutubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

interface MediaItem {
  type: "image" | "video"
  url: string
}

interface MediaCarouselProps {
  media: MediaItem[]
  title: string
}

export default function MediaCarousel({ media, title }: MediaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

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

  return (
    <div className="w-full h-[250px] relative group">
      <div
        ref={scrollRef}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {media.map((item, idx) => (
          <div
            key={idx}
            className="w-full h-full flex-shrink-0 snap-center relative cursor-pointer"
            onClick={() => setSelectedIndex(idx)}
          >
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={`${title} - media ${idx + 1}`}
                className="w-full h-full object-cover pointer-events-none"
              />
            ) : getYoutubeVideoId(item.url) ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeVideoId(item.url)}?controls=0&showinfo=0&rel=0&mute=1`}
                className="w-full h-full pointer-events-none border-0"
                tabIndex={-1}
                title="YouTube preview"
              />
            ) : (
              <video
                src={item.url}
                className="w-full h-full object-cover pointer-events-none"
                playsInline
                muted
              />
            )}

            {/* Play Button Overlay for Video Preview */}
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fixed Title overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80 pointer-events-none" />
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-10 flex justify-between items-end">
        <h1 className="text-[24px] font-bold text-white drop-shadow-md leading-tight flex-1">
          {title}
        </h1>

        {media.length > 1 && (
          <div className="flex gap-1.5 mb-1 ml-4">
            {media.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === activeIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen DaisyUI Modal via Portal */}
      {selectedIndex !== null &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedIndex(null)}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full h-full p-0 bg-black overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent">
                <div className="text-white text-[14px] font-medium drop-shadow-md">
                  {selectedIndex + 1} / {media.length}
                </div>
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 w-full h-full overflow-hidden">
                <GalleryScroller
                  media={media}
                  initialIndex={selectedIndex}
                  onIndexChange={setSelectedIndex}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

function GalleryScroller({
  media,
  initialIndex,
  onIndexChange,
}: {
  media: MediaItem[]
  initialIndex: number
  onIndexChange: (idx: number) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth
      scrollRef.current.scrollTo({ left: width * initialIndex, behavior: "instant" as any })
    }
  }, [initialIndex])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft
        const width = scrollRef.current.clientWidth
        const newIndex = Math.round(scrollLeft / width)
        if (newIndex !== initialIndex) {
          onIndexChange(newIndex)
        }
      }
    }

    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll, { passive: true })
      return () => scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [onIndexChange, initialIndex])

  return (
    <div
      ref={scrollRef}
      className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {media.map((item, idx) => (
        <div
          key={idx}
          className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center relative"
        >
          {item.type === "image" ? (
            <img
              src={item.url}
              alt="fullscreen media"
              className="w-full h-full object-contain bg-black"
            />
          ) : getYoutubeVideoId(item.url) ? (
            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeVideoId(item.url)}?autoplay=${idx === initialIndex ? 1 : 0}&rel=0`}
              className="w-full h-full bg-black border-0"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen={true}
              title="YouTube video"
            />
          ) : (
            <video
              src={item.url}
              controls
              autoPlay={idx === initialIndex}
              className="w-full h-full object-contain bg-black"
              playsInline
              onClick={(e) => {
                const video = e.currentTarget
                if (video.paused) {
                  video.play()
                  // Request native fullscreen when playing
                  if (video.requestFullscreen) {
                    video.requestFullscreen().catch(() => {})
                  } else if ((video as any).webkitEnterFullscreen) {
                    ;(video as any).webkitEnterFullscreen() // For iOS Safari
                  } else if ((video as any).webkitRequestFullscreen) {
                    ;(video as any).webkitRequestFullscreen()
                  }
                } else {
                  video.pause()
                }
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
