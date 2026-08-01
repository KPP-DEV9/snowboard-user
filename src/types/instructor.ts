import { User } from "./user"

export type InstructorProfile = {
  id: string
  user_id: string
  user?: User
  bio: string | null
  speciality: string | null
  hourly_rate: number
  experience_years: number
  is_active: boolean
  created_at: string
  description?: string
  image?: string
  video?: string
}

export type Instructor = {
  id: string
  user_id: string
  user: User
  bio: string | null
  speciality: string | null
  hourly_rate: number
  experience_years: number
  is_active: boolean
  created_at: string
}
