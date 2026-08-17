import { Course } from "./course"
import { Payment } from "./payment"
import { User } from "./user"

type EnrollmentStatus = "pending_payment" | "deposit_paid" | "paid" | "cancelled" | string

export interface Enrollment {
  id: string
  user_id: string
  user?: User
  course_id: string
  course?: Course
  round_id?: string
  round?: any
  adult_count?: number
  child_count?: number
  total_amount?: number
  deposit_amount?: number
  ski_equipment?: boolean
  snowboard_equipment?: boolean
  status: EnrollmentStatus
  remaining_slots?: number
  participants?: EnrollmentParticipant[]
  payments?: Payment[]
  created_at: Date | string
  updated_at: Date | string
  deleted_at?: Date | string | null
}

export interface EnrollmentParticipantAssetOption {
  asset_options_id: string
  requirement_type: "ASSET" | "OPTION" | string
}

export interface EnrollmentParticipant {
  type: "ADULT" | "CHILD" | string
  line_id?: string
  id_card?: string
  passport_no?: string
  nationality?: string
  date_of_birth?: string
  first_name: string
  last_name: string
  gender?: "MALE" | "FEMALE" | string
  phone_number?: string
  email?: string
  has_medical_condition?: boolean
  medical_condition_detail?: string
  has_food_allergy?: boolean
  food_allergy_detail?: string
  weight_kg?: number
  height_cm?: number
  helmet_size_us?: string
  glove_size_us?: string
  shoe_size_us?: string
  asset_options?: EnrollmentParticipantAssetOption[]
}

export interface CreateEnrollmentRequest {
  course_id: string
  round_id: string
  adult_count: number
  child_count: number
  total_amount: number
  deposit_amount?: number
  ski_equipment?: boolean
  snowboard_equipment?: boolean
  participants?: EnrollmentParticipant[]
}
