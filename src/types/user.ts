import { Booking } from "./booking"
import { InstructorProfile } from "./instructor"

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

// export interface User {
//   id: string
//   username?: string
//   line_user_id?: string | null
//   nickname?: string | null
//   role_id: string
//   role?: Role
//   description?: string | null
//   bookings?: Booking[]
//   tax_id?: string | null
//   branch?: string | null
//   address?: string | null
//   profile_image?: string | null
//   is_active: boolean
//   created_at: string
//   updated_at: string
//   user_profile?: UserProfile | null
// }

// export interface UserProfile {
//   id: string
//   user_id: string
//   first_name?: string | null
//   last_name?: string | null
//   telephone?: string
//   email?: string | null
//   level: string
//   weight: number
//   height: number
//   head_size: string
//   glove_size: string
//   shoe_size: string
//   food_allergies: string
//   underlying_disease: string
//   sex: "Male" | "Female" | string
//   nation: string
//   id_card?: string | null
//   passport_no?: string | null
//   tax_id?: string | null
//   address?: string | null
//   birth_date?: string | Date
//   created_at: string | Date
//   updated_at: string | Date
// }

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
