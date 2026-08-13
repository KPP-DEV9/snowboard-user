import { Course } from "./course"

export interface Round {
  id: string
  course_id: string
  course?: Course
  start_date: string // ISO 8601 string format (เช่น "2026-08-13T10:00:00Z")
  end_date: string
  total_user: number
  total: number
  is_active: boolean
  created_at: string
  updated_at: string
  // instructors?: InstructorOfCourse[]
}
