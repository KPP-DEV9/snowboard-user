import { Booking } from "./booking"
import { Course } from "./course"
import { Instructor, InstructorProfile } from "./instructor"
import { Round } from "./rounds"

export type Token = string

export interface Role {
  id: string
  name: string
  description?: string | null
  is_active: boolean
  deleted_at?: string | null
  created_at: string
  updated_at: string
}

export interface Analysis {
  id: string // uuid
  courses_id: string // uuid
  round_id?: string | null // uuid
  user_id: string // uuid
  image_urls: string[]
  analysis_notes: string
  is_passed: boolean
  score: number
  instructor_id: string // uuid
  created_at: string // ISO date string
  updated_at: string // ISO date string
  course?: Course | null
  round?: Round | null
  user?: User | null
  instructor?: Instructor | null
}

export interface User {
  id: string // uuid
  username?: string
  line_user_id?: string | null
  nickname?: string | null
  role_id: string // uuid
  role?: Role
  description?: string | null
  bookings?: Booking[]
  branch?: string | null
  profile_image?: string | null
  is_active: boolean
  created_at: string // Date or ISO string
  updated_at: string // Date or ISO string
  user_profile?: UserProfile | null
  instructor_profile?: InstructorProfile | null
  analysis?: Analysis
}

export interface UserProfile {
  id: string // uuid
  user_id: string // uuid
  first_name?: string | null
  last_name?: string | null
  telephone: string
  email?: string | null
  level: string
  weight: number // numeric(5,2)
  height: number // numeric(5,2)
  head_size: string
  glove_size: string
  shoe_size: string
  food_allergies: string
  underlying_disease: string
  sex: "Male" | "Female" | "Other"
  nation: string
  id_card?: string | null
  passport_no?: string | null
  tax_id?: string | null
  address?: string | null
  birth_date?: string | null // Date or ISO string
  created_at: string // Date or ISO string
  updated_at: string // Date or ISO string
}
