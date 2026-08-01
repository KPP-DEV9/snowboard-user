import { Course } from "./course"
import { Payment } from "./payment"
import { User } from "./user"

type EnrollmentStatus = "pending_payment" | "paid" | "cancelled"

export interface Enrollment {
  id: string
  user_id: string
  user?: User
  course_id: string
  course?: Course
  status: EnrollmentStatus
  remaining_slots: number
  payments?: Payment[]
  created_at: Date | string
  updated_at: Date | string
  deleted_at?: Date | string | null
}

export interface CreateEnrollmentRequest {
  course_id: string
  user_id: string
  remaining_slots: number
  payment_method: string
}
