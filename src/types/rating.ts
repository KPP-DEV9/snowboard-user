export interface Rating {
  id: string
  instructor_id: string
  booking_id: string
  user_id: string
  score: number
  comment: string | null
  created_at: string
  updated_at: string
}
