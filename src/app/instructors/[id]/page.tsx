import { getInstructorById } from "@/app/actions/instructor"
import Breadcrumbs from "@/components/Breadcrumbs"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/Ui/Card/Card"
import numeral from "numeral"

interface Props {
  params: Promise<{ id: string }>
}

export default async function InstructorProfilePage({ params }: Props) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const { success, data: instructor } = await getInstructorById(id)

  if (!success || !instructor) {
    return notFound()
  }

  const user = instructor.user
  const proName = user?.first_name ? `${user.first_name} ${user.last_name}` : user?.nickname || ""

  const getYoutubeId = (url: string) => {
    if (!url) return null
    let videoId = null
    try {
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0]
      } else if (url.includes("youtube.com/watch")) {
        const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
        videoId = urlObj.searchParams.get("v")
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("youtube.com/embed/")[1]?.split("?")[0]
      } else if (url.includes("youtube.com/shorts/")) {
        videoId = url.split("youtube.com/shorts/")[1]?.split("?")[0]
      } else {
        // Fallback regex
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        const match = url.match(regExp)
        videoId = match && match[2].length === 11 ? match[2] : null
      }
    } catch (e) {
      // Fallback regex if URL parsing fails
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
      const match = url.match(regExp)
      videoId = match && match[2].length === 11 ? match[2] : null
    }
    return videoId || null
  }

  const ytId = instructor.video ? getYoutubeId(instructor.video) : null

  return (
    <div className="p-6 flex flex-col min-h-screen pb-[100px] animate-fade-in">
      <Breadcrumbs title={"โปรไฟล์ผู้สอน"} step={"INSTRUCTOR"} urlBack="/instructors" />

      {/* Hero Section */}
      <div className="relative mt-4 mb-8">
        <div className="w-full h-32 rounded-t-2xl bg-gradient-to-r from-[#8B6B22]/40 to-black overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>

        <div className="px-6 relative -mt-12 flex items-end gap-4">
          <div className="w-24 h-24 bg-[#111] rounded-2xl flex-shrink-0 border-4 border-background overflow-hidden shadow-xl shadow-black/50">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={proName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-subtle bg-card">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 pb-1">
            <h1 className="text-[20px] font-bold text-foreground leading-tight uppercase">
              {proName}
            </h1>
            <p className="text-[14px] text-gold font-medium mt-0.5">
              {instructor.speciality || "ผู้เชี่ยวชาญด้านกอล์ฟ"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-card/50 backdrop-blur-sm border-card-border/50">
          <span className="text-[12px] text-text-muted uppercase tracking-wider mb-1">
            ประสบการณ์
          </span>
          <span className="text-[24px] font-bold text-foreground">
            {instructor.experience_years}{" "}
            <span className="text-[14px] font-normal text-text-subtle">ปี</span>
          </span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center bg-card/50 backdrop-blur-sm border-card-border/50">
          <span className="text-[12px] text-text-muted uppercase tracking-wider mb-1">เรทราคา</span>
          <span className="text-[24px] font-bold text-gold">
            ฿{numeral(instructor.hourly_rate).format("0,0.00")}{" "}
            <span className="text-[14px] font-normal text-text-subtle">/ ชม.</span>
          </span>
        </Card>
      </div>

      {/* Bio Section */}
      <div className="mb-8">
        <h2 className="text-[16px] font-bold text-foreground mb-3 flex items-center gap-2">
          <div className="w-1 h-4 bg-gold rounded-full"></div>
          เกี่ยวกับโปร
        </h2>

        {instructor.description && (
          <Card className="p-5 text-[14px] text-text-subtle leading-relaxed bg-[#1A1A1A] mb-3">
            <p>{instructor.description}</p>
          </Card>
        )}

        {instructor.video && (
          <div className="mb-4 rounded-2xl overflow-hidden shadow-xl border border-card-border/50 bg-black">
            {ytId ? (
              <iframe
                className="w-full aspect-video"
                src={`https://www.youtube.com/embed/${ytId}`}
                title="Instructor Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                src={instructor.video}
                controls
                className="w-full aspect-video object-cover bg-black"
              />
            )}
          </div>
        )}

        {instructor.image && (
          <Card className="p-5 text-[14px] text-text-subtle leading-relaxed bg-[#1A1A1A] ">
            <img src={instructor.image} alt="" className="w-full rounded-lg" />
          </Card>
        )}
      </div>

      {/* Action / Next Steps (Placeholder for Courses/Schedules) */}
      <div className="mt-auto">
        <Link
          href={`/instructors/${id}/courses`}
          className="w-full bg-gold hover:bg-gold-hover text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold/20"
        >
          <span>ดูคอร์สเรียนทั้งหมด</span>
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
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  )
}
