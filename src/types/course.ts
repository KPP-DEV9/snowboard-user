import { Booking } from "./booking"
import { InstructorProfile } from "./instructor"
import { Rounds } from "./rounds"
import { User } from "./user"

export interface Nation {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Province {
  id: string
  nation_id: string
  province_code: string
  name: string
  created_at: string
  updated_at: string
}

export interface District {
  id: string
  province_id: string
  district_code: string
  name: string
  created_at: string
  updated_at: string
}

export type ProgramType = "REGULAR" | string
export type CourseLevel = "Level 1" | string

export type Course = {
  id: string
  title_courses: string
  title: string
  description: string
  program_type: ProgramType
  course_level: CourseLevel
  course_type: {
    id: string
    program_type_master_id: string
    name: string
    has_evaluation: boolean
    passing_score: number
    created_at: string
    updated_at: string
  }
  register_start: string
  register_end: string
  start_date: string
  end_date: string
  price: string
  adult_price: number
  child_price: number
  down_price: number
  total_days: number
  total_user: number
  nation_id: string
  nation: Nation
  province_id: string
  province: Province
  district_id: string
  district: District
  province_code: string
  discount: number
  discount_active: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  total_hour: string
  total_times: number
  max_students: number
  total_class: number
  rounds?: Rounds[]
}

export type Classes = {
  course: Course
  course_id: string
  created_at: string
  hour: number
  description: string
  duration_hour: number
  id: string
  is_active: boolean
  title: string
  order: number
}

export type ClassesStatus =
  | "WAIT_BOOKING"
  | "CUS_CONFIRM"
  | "CUS_REJECT"
  | "INS_CONFIRM"
  | "INS_REJECT"
  | "INPROGRESS"
  | "COMPLETE"

export interface UserClasses {
  id: string
  user_id: string
  user?: User
  classes_id: string
  classes?: Classes
  status: ClassesStatus
  created_at: string | Date
  updated_at: string | Date
  deleted_at?: string | Date | null
  round?: Rounds
}

export type UserClassesSummary = {
  past: number
  remaining: number
  total: number
}

export type SumaryCourse = {
  course: Course
  bookings: Booking[]
  total: number
  past: number
  remaining: number
  count_past: number
}
