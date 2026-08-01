import { Booking } from "./booking"

export interface SwingAnalysis {
  id: string
  booking_id: string
  booking?: Booking
  video_url: string
  analyzed_at: string
  overall_score: number
  posture_score: number
  swing_plane_score: number
  tempo_score: number
  impact_score: number
  follow_through_score: number
  ai_insights: AIInsights
  frame_analysis: FrameData[]
  video_key: string
  club_type: string
}

export interface AIInsights {
  strengths: string[]
  improvements: string[]
  drills: string[]
}

export interface FrameData {
  phase: string
  timestamp: number
  keypoints: any
  angles: CalculatedAngles
}

export interface CalculatedAngles {
  spine_angle: number
  shaft_angle: number
  arm_extension: number
}
