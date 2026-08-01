import { Booking } from "./booking"
import { InstructorProfile } from "./instructor"
import { Rounds } from "./rounds"
import { User } from "./user"

export type Course = {
  id: string
  instructor_id: string
  instructor?: InstructorProfile
  title: string
  description: string | null
  total_hour: number
  total_days: number
  total_times: number
  price: number
  program_type: string
  max_students: number
  course_type: string
  is_active: boolean
  created_at: string
  total_class?: number
  max_student?: number
  classes?: Classes[]
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
