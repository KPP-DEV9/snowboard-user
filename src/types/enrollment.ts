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
  requirement_transactions?: RequirementItem[]
}

export interface EnrollmentParticipantAssetOption {
  asset_options_id: string
  requirement_type: "ASSET" | "OPTION" | string
  price?: number
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
  req_total?: number
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
  req_total: number
}

export interface AssetMaster {
  id: string
  name: string
  size: string
  price: number
  course_type: CourseType | string
  status: AssetStatus | string
  created_at: string
  updated_at: string
}

export type RequirementType = "ASSET" | "OPTION"
export type CourseType = "SNOWBOARD" | "SKI" // ปรับเพิ่มตามที่มีในระบบ
export type AssetStatus = "READY" | "UNAVAILABLE" | "MAINTENANCE"
export type OptionCategory = "PHOTOGRAPHY" | string

export interface OptionMaster {
  id: string
  category: OptionCategory
  name: string
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// แบบที่ 1: ใช้ Discriminated Union (แนะนำหากต้องการ type-safety แยกตาม requirement_type)
export interface BaseRequirement {
  id: string
  user_id: string
  course_id: string
  enrollment_id: string
  asset_options_id: string
  created_at: string
  updated_at: string
}

export interface AssetRequirementItem extends BaseRequirement {
  requirement_type: "ASSET"
  asset_master: AssetMaster
  option_master?: never
}

export interface OptionRequirementItem extends BaseRequirement {
  requirement_type: "OPTION"
  option_master: OptionMaster
  asset_master?: never
}

export type RequirementItem = AssetRequirementItem | OptionRequirementItem
export type RequirementListResponse = RequirementItem[]

// แบบที่ 2: ใช้ Single Interface ทั่วไป (Optional fields)
// export interface Requirement {
//   id: string
//   user_id: string
//   course_id: string
//   enrollment_id: string
//   asset_options_id: string
//   requirement_type: RequirementType
//   created_at: string
//   updated_at: string
//   asset_master?: AssetMaster
//   option_master?: OptionMaster
// }
