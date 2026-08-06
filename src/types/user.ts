export type Token = string

export type StudentProfile = {
  id: string
  user_id: string
  bio: string | null
  speciality: string | null
  hourly_rate: number
  experience_years: number
  is_active: boolean
  created_at: string
  image_profile?: string | null
}

export type User = {
  id: string
  username: string | null
  line_user_id: string | null
  nickname: string | null
  first_name: string | null
  last_name: string | null
  telephone: string | null
  email: string
  role_id: string
  role: {
    id: string
    name: string
    description: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  }
  level: string
  is_active: boolean
  profile_image: string | null
  sex?: string | null
  student_profile: StudentProfile
  created_at: string
  updated_at: string
}
