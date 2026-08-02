"use client"

import { useState, useEffect, use } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts"
import { User, Activity, AlertTriangle, Star, CheckCircle2 } from "lucide-react"
import Breadcrumbs from "@/components/Breadcrumbs"
import Link from "next/link"
import { api } from "@/lib/api"
import { SwingAnalysis } from "@/types/analysis"
import { getUserClassesById } from "@/app/actions/course"
import { Rating } from "@/types/rating"

import { useParams } from "next/navigation"

export default function AnalysisPage() {
  const params = useParams<{ id: string }>()
  const [currentTime, setCurrentTime] = useState("0:00")
  const [analyticData, setAnalyticData] = useState<SwingAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [ratingData, setRatingData] = useState<Rating | null>(null)

  const handleGetAnalysisBookingById = async () => {
    if (params.id) {
      api.swingAnalyses
        .getByBookingId<{ data: SwingAnalysis | SwingAnalysis[] }>(params.id)
        .then((res) => {
          if (res.success && res.data) {
            const data = Array.isArray(res.data) ? res.data[0] : res.data
            if (data) {
              setAnalyticData(data as SwingAnalysis)
            }
          }
        })
        .catch((err) => {
          console.error("Failed to fetch swing analyses data", err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      handleGetAnalysisBookingById()

      const fetchRating = async () => {
        try {
          const userClassesRes = await getUserClassesById(params.id)
          if (userClassesRes.success && userClassesRes.data) {
            const instructorId = userClassesRes.data.classes?.course?.instructor_id
            const userId = userClassesRes.data.user_id
            if (instructorId && userId) {
              const ratingRes = await api.ratings.checkExisting<Rating>(
                instructorId,
                userId,
                params.id,
              )
              if (ratingRes.success && ratingRes.data?.id) {
                setRatingData(ratingRes.data)
              }
            }
          }
        } catch (err) {
          console.error("Failed to check rating", err)
        }
      }
      fetchRating()
    } else {
      setIsLoading(false)
    }
  }, [params.id])

  const renderRatingSection = () => {
    if (ratingData) {
      return (
        <div className="pt-4 border-t border-gray-800/50 mt-6 w-full max-w-md mx-auto md:max-w-none">
          <div className="bg-[#1a1d24] rounded-2xl border border-emerald-500/20 p-6 shadow-xl flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shrink-0 mx-auto md:mx-0">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">ให้คะแนนผู้สอนแล้ว</h3>
              <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${ratingData.score >= star ? "fill-gold text-gold" : "text-gray-700"}`}
                  />
                ))}
              </div>
              {ratingData.comment && (
                <p className="text-sm text-gray-300 italic bg-[#0f1115] p-3 rounded-lg border border-gray-800 text-left">
                  "{ratingData.comment}"
                </p>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="pt-4 border-t border-gray-800/50 flex justify-center mt-6 w-full">
        <Link
          href={`/review/${params.id}`}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-black hover:bg-gold-hover rounded-xl font-bold transition-all shadow-lg shadow-gold/20 hover:scale-[1.02]"
        >
          <Star className="w-5 h-5 fill-current" />
          ประเมินผู้สอน
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen text-gray-100 p-4 md:p-8 flex items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!analyticData) {
    return (
      <div className="min-h-screen text-gray-100 p-4 md:p-8 flex flex-col font-sans">
        <div className="max-w-7xl mx-auto w-full space-y-6">
          <Breadcrumbs title={"ผลการวิเคราะห์"} step={""} />
          <div className="grid items-center justify-center mt-20">
            <div className="text-center space-y-4 p-8 rounded-2xl border border-gray-800 shadow-xl max-w-md w-full">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                <Activity className="text-blue-400 w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                ยังไม่มีผลการวิเคราะห์
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                ระบบกำลังรอ Feedback และผลการวิเคราะห์วงสวิงจากโปรผู้สอน
                กรุณากลับมาตรวจสอบอีกครั้งในภายหลัง
              </p>
            </div>

            {/* Instructor Rating Form Section */}
            {renderRatingSection()}
          </div>
        </div>
      </div>
    )
  }

  const phases =
    analyticData?.frame_analysis?.map((f) => ({
      name: f.phase || "Phase",
      time: f.timestamp ? f.timestamp.toString() : "0.0",
    })) || []

  const radarData = analyticData
    ? [
        { subject: "Posture (ท่ายืน)", A: analyticData.posture_score || 0, fullMark: 100 },
        { subject: "Tempo (จังหวะ)", A: analyticData.tempo_score || 0, fullMark: 100 },
        { subject: "Swing Plane", A: analyticData.swing_plane_score || 0, fullMark: 100 },
        { subject: "Impact (ปะทะ)", A: analyticData.impact_score || 0, fullMark: 100 },
        { subject: "Follow Through", A: analyticData.follow_through_score || 0, fullMark: 100 },
      ]
    : []

  const lineChartData =
    analyticData?.frame_analysis?.map((f) => ({
      time: f.timestamp ? f.timestamp.toString() : "0.0",
      ideal: 45,
      student: f.angles?.shaft_angle || 0,
    })) || []

  return (
    <div className="min-h-screen text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs title={"ผลการวิเคราะห์"} step={""} />

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center border border-blue-500/30">
              <User className="text-blue-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Student SNOWVIBES TOURS Swing Analysis
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Student: John Doe • Recorded: 15 Jun 2026
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">
                Total Score
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  {analyticData?.overall_score || 0}
                </span>
                <span className="text-gray-500 font-medium">/100</span>
              </div>
            </div>
          </div>
        </header>

        {/* Video & Phase Navigator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 rounded-2xl border border-gray-800 overflow-hidden shadow-xl flex items-center justify-center p-2 relative">
            <div className="absolute inset-0" />
            <div className="relative w-full max-w-[380px] sm:max-w-[360px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800/80 z-10">
              {analyticData?.video_url && analyticData.video_url.includes("youtube") ? (
                <iframe
                  src={analyticData.video_url}
                  className="absolute inset-0 w-full h-full border-0 z-10"
                  title="Student SNOWVIBES TOURS Swing Analysis"
                  allow="autoplay;"
                  allowFullScreen
                />
              ) : analyticData?.video_url ? (
                <video
                  src={analyticData.video_url}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  controls
                  playsInline
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 z-10">
                  No Video Available
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 rounded-2xl border border-gray-800 p-5 shadow-xl flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Phase Navigator
            </h3>
            <div className="flex flex-col gap-3 flex-1 justify-center">
              {phases.map((phase: any, idx: any) => (
                <button
                  key={idx}
                  className="flex items-center justify-between w-full p-4 rounded-xl bg-[#222630] border border-gray-700/50 hover:border-blue-500/50 hover:bg-[#2a2f3a] transition-all group"
                  onClick={() => setCurrentTime(phase.time)}
                >
                  <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
                    {phase.name}
                  </span>
                  <span className="text-xs text-blue-400 font-mono px-2 py-1 rounded-md">
                    {phase.time}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="rounded-2xl border border-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-1">Radar Chart (5 Dimensions)</h3>
            <p className="text-sm text-gray-400 mb-6">สรุปภาพรวม 5 มิติ เพื่อช่วยในการพัฒนา</p>

            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "#6B7280", fontSize: 10 }}
                  />
                  <Radar
                    name="Student Score"
                    dataKey="A"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-3">
              {radarData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#222630]"
                >
                  <span className="text-sm font-medium text-gray-300">{item.subject}</span>
                  <div className="flex items-center gap-3">
                    {item.A < 70 && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    <span
                      className={`font-bold ${item.A < 70 ? "text-amber-500" : "text-emerald-400"}`}
                    >
                      {item.A / 10}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Line Chart */}
          <div className="rounded-2xl border border-gray-800 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-1">Swing Plane Consistency</h3>
            <p className="text-sm text-gray-400 mb-6">
              แสดงเส้นระนาบไม้กอล์ฟของนักเรียน เปรียบเทียบกับ "Ideal Plane"
            </p>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="time" stroke="#6B7280" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <YAxis stroke="#6B7280" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#E5E7EB" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Line
                    type="monotone"
                    dataKey="ideal"
                    name="Ideal Plane"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="student"
                    name="Student Plane"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#3B82F6", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {analyticData?.ai_insights?.improvements &&
              analyticData.ai_insights.improvements.length > 0 && (
                <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start">
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-amber-500 font-bold mb-1">
                      AI Insights: Needs Improvement
                    </h4>
                    <ul className="text-sm text-amber-200/80 leading-relaxed list-disc pl-4 space-y-1">
                      {analyticData.ai_insights.improvements.map(
                        (improvement: string, idx: number) => (
                          <li key={idx}>{improvement}</li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              )}
            {analyticData?.ai_insights?.strengths &&
              analyticData.ai_insights.strengths.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-4 items-start">
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 rounded-full bg-emerald-500/20">
                    <span className="text-emerald-500 font-bold text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="text-emerald-500 font-bold mb-1">AI Insights: Strengths</h4>
                    <ul className="text-sm text-emerald-200/80 leading-relaxed list-disc pl-4 space-y-1">
                      {analyticData.ai_insights.strengths.map((strength: string, idx: number) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Instructor Rating Form Section */}
        {renderRatingSection()}
      </div>
    </div>
  )
}
