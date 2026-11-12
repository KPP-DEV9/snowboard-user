// ==========================================
// Enums & Types
// ==========================================

export type AssetStatus =
  | "READY"
  | "NOT_READY"
  | "IN_USE"
  | "AWAITING_RETURN"
  | "DAMAGE"
  | "MAINTENANCE"

export type BookingStatus =
  | "WAIT_BOOKING"
  | "CUS_CONFIRM"
  | "CUS_REJECT"
  | "INS_CONFIRM"
  | "INS_REJECT"
  | "INPROGRESS"
  | "COMPLETE"
  | "CANCELLED"

export type ContactCategory = "contact" | "social"
export type ContactName =
  | "phone"
  | "line"
  | "email"
  | "facebook"
  | "instagram"
  | "tiktok"

export type ProgramType = "PRIVATE_COACHING" | "PARK_AND_FREESTYLE"
export type CourseTypes = "SKI" | "SNOWBOARD"
export type CourseLevel =
  | "Beginner"
  | "Level 1"
  | "Level 2"
  | "Level 3"
  | "Level 4"
  | "Level 5"

export type EnrollmentStatus =
  | "pending_payment"
  | "deposit_paid"
  | "paid"
  | "cancelled"
  | "completed"

// export type PaymentMethodType = "QR" | "CREDIT_CARD" | "CASH" | "BANK_TRANSFER"

export const CategoryStatus = {
  INSURANCE: "INSURANCE",
  PHOTOGRAPHY: "PHOTOGRAPHY",
  TRANSPORT: "TRANSPORT",
} as const

export type CategoryStatus =
  (typeof CategoryStatus)[keyof typeof CategoryStatus]

export const PaymentMethod = [
  {
    value: "QR",
    label: "สแกน (QR Code)",
  },
  {
    value: "BANK_TRANSFER",
    label: "โอนเงิน (PromptPay)",
  },
  {
    value: "CREDIT_CARD",
    label: "บัตรเครดิต",
  },
  {
    value: "CASH",
    label: "เงินสด (Cash)",
  },
  {
    value: "MANUAL_SLIP",
    label: "อัปโหลดสลิป",
  },
] as const

export type PaymentMethod =
  | "QR"
  | "CREDIT_CARD"
  | "CASH"
  | "BANK_TRANSFER"
  | "MANUAL_SLIP"

export const PaymentTransactionsStatus = {
  PendingReview: "pending_review",
  InvalidSlip: "invalid_slip",
  WrongAmount: "wrong_amount",
  Rejected: "rejected",
  Refunded: "refunded",
  Verified: "verified",
  GatewayPending: "gateway_pending",
  GatewaySuccess: "gateway_success",
  GatewayFailed: "gateway_failed",
  GatewayTimeout: "gateway_timeout",
} as const

export type PaymentTransactionsStatus =
  (typeof PaymentTransactionsStatus)[keyof typeof PaymentTransactionsStatus]

export type RequirementType = "ASSET" | "OPTION" | "ROOM"

export type RoleType =
  | "FOR_SUPER_ADMIN"
  | "FOR_ADMIN"
  | "FOR_INSTRUCTOR"
  | "FOR_CUSTOMER"
  | "FOR_GUEST"

export const UploadImageFolders = {
  Payment: "payment_sv",
  Profile: "profile_sv",
  Course: "course_sv",
} as const

export type UploadImageFolders =
  (typeof UploadImageFolders)[keyof typeof UploadImageFolders]
export type UploadVideoFolders = "video_sv"

// ==========================================
// models/role.go
// ==========================================

export interface Role {
  id: string
  name: string
  description: string
  role_type: RoleType
  created_at: string
  updated_at: string
}

// ==========================================
// models/admin.go
// ==========================================

export interface Admin {
  id: string
  username: string
  name: string
  session_id?: string | null
  role_id: string
  role: Role
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface AdminResponse {
  id: string
  username: string
  name: string
  role_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ==========================================
// models/analysis.go
// ==========================================

export interface Analysis {
  id: string
  enrollment_id: string
  courses_id: string
  round_id?: string | null
  user_id: string
  image_urls: string[]
  analysis_notes: string
  is_passed: boolean
  score: number
  instructor_id: string
  created_at: string
  updated_at: string
  course?: Course | null
  round?: Round | null
  user?: User | null
  instructor?: Instructor | null
}

// ==========================================
// models/asset_master.go
// ==========================================

export interface AssetMaster {
  id: string
  name: string
  size: string
  price: number
  course_type: CourseTypes
  status: AssetStatus
  created_at: string
  updated_at: string
}

export interface CreateAssetMasterReq {
  name: string
  size: string
  course_type: CourseTypes
  price: number
  status: string
}

// ==========================================
// models/booking.go
// ==========================================

export interface Booking {
  id: string
  user_id: string
  user?: User | null
  enrollment_id?: string | null
  type: string
  status: BookingStatus
  confirm_at?: string | null
  created_at: string
  updated_at: string
  round_id?: string | null
  round: Round
  admin_id?: string | null
  admin?: Admin | null
  rounds?: Round[]
  requirement_transactions?: RequirementTransaction[]
  requirements?: RequirementTransaction[]
  RequirementTransactions?: RequirementTransaction[]
  enrollment?: Enrollment | null
  Enrollment?: Enrollment | null
  payment_transactions?: PaymentTransaction[]
  PaymentTransactions?: PaymentTransaction[]
  guests?: User[]
  course?: Course | null
  payment_status?: string
  enrollment_status?: string
  analysis?: Analysis | null
}

export interface BookingTransaction {
  id: string
  booking_id: string
  booking?: Booking
  status: BookingStatus
  action_by: string
  user?: User
  comment?: string | null
  created_at: string
  updated_at: string
}

export interface BookingCommissionDetail {
  booking_id: string
  user_id: string
  course_id: string
  course_name: string
  program_type: ProgramType
  course_type: CourseTypes
  commission_rate: number
  course_price: number
  commission_amount: number
  booking_date: string
  booking_status: BookingStatus
}

export interface CommissionReportResponse {
  instructor_id: string
  instructor_name: string
  total_commission: number
  total_bookings: number
  bookings: BookingCommissionDetail[]
}

export interface CommissionSummaryResult {
  instructor_id: string
  total_commission: number
  total_bookings: number
}

export interface RawBookingRevenue {
  date: string
  day_revenue: number
  month_revenue: number
  year_revenue: number
  day_count: number
  month_count: number
  year_count: number
}

export interface MonthlySummary {
  month: string
  total_revenue: number
  total_bookings: number
}

export interface PendingBookingDetail {
  booking_id: string
  user_id: string
  user_name: string
  course_name: string
  program_type: ProgramType
  course_type: CourseTypes
  price: number
  booking_status: BookingStatus
  created_at: string
}

export interface SummaryResponse {
  current_date: string
  daily_revenue: number
  monthly_revenue: number
  yearly_revenue: number
  daily_bookings: number
  monthly_bookings: number
  yearly_bookings: number
  monthly_summaries: MonthlySummary[]
  pending_bookings_count: number
  pending_bookings_details: PendingBookingDetail[]
  pending_enrollments_count: number
  pending_enrollments_details: PendingEnrollmentDetail[]
}

export interface GroupBookingResponse {
  course_id: string
  course_name: string
  program_type: ProgramType
  course_type: CourseTypes
  total_amount: number
  enrollments: EnrollmentGroupedResponse[]
}

// ==========================================
// models/contact.go
// ==========================================

export interface Contact {
  id: string
  category?: ContactCategory
  type?: ContactCategory | string
  name: ContactName
  value: string
  icon?: string | null
  is_active?: boolean
  isActive?: boolean
  order_index?: number
  created_at?: string
  createdAt?: string | Date
  updated_at?: string
  updatedAt?: string | Date
  deletedAt?: string | Date
}

// ==========================================
// models/course.go
// ==========================================

export interface Course {
  id: string
  title: string
  description: string
  detail?: string
  max_students?: number
  price: number
  deposit?: number
  course_cover?: string
  images_cover?: string[]
  banner_cover?: string[]
  program_type: ProgramType
  course_types?: CourseTypes
  course_type: CourseTypes
  level?: CourseLevel
  course_level?: CourseLevel
  level_custom?: string | null
  course_type_master_id?: string
  start_date: string
  end_date: string
  is_active: boolean
  early_bird_discount?: number
  early_bird_end_date?: string | null
  is_early_bird?: boolean
  commission?: number
  created_at: string
  updated_at: string
  round?: Round[]
  rounds?: Round[]
  course_hotel?: CourseHotel[]
  course_hotels?: CourseHotel[]
  hotels?: HotelsMaster[]
  enrollments?: Enrollment[]
  course_type_master?: CourseTypeMaster
  terms_conditions_master?: TermsConditionsMaster[]
  child_price: number
  down_price?: number
  discount: number
  total_days?: number
  total_user: number
  max_users?: number
  register_start?: string
  register_end?: string
  image_urls: string[]
  nation?: string
  province?: string
  district?: string
  course_rooms?: CourseRoom[]
}

export interface Analytic {
  course_id: string
  title: string
  course_types: CourseTypes
  program_type: ProgramType
  price: number
  total_students: number
  total_revenue: number
  start_date: string
  end_date: string
  instructor_count: number
  total_rounds: number
}

export interface BookingWithRoundsResponse {
  course_id: string
  total_rounds: number
  bookings: Booking[]
}

export interface InstructorRevenueSummary {
  instructor_id: string
  total_revenue: number
  total_courses: number
}

export interface CourseSummaryResult {
  total_courses: number
  active_courses: number
  inactive_courses: number
}

export interface CourseDetailResponse {
  course: Course
  rounds: RoundDetailResponse[]
  course_hotels: CourseHotel[]
  instructors: InstructorByRound[]
}

// ==========================================
// models/course_hotel.go
// ==========================================

export interface CourseHotel {
  id: string
  course_id: string
  course?: Course | null
  room_master_id?: string
  room_master?: RoomMaster | null
  night_count?: number
  price?: number
  created_at?: string
  updated_at?: string
  hotel_id?: string
  hotel?: HotelsMaster
}

// ==========================================
// models/course_type_master.go
// ==========================================

export interface CourseTypeMaster {
  id: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ==========================================
// models/enrollment.go
// ==========================================

export interface Enrollment {
  id: string
  course_id: string
  user_id: string
  total_amount: number
  paid_amount: number
  payment_status: EnrollmentStatus
  status?: EnrollmentStatus | PaymentStatus | string
  created_at: string
  updated_at: string
  course?: Course | null
  user?: User | null
  bookings?: Booking[]
  round_id?: string
  round?: Round
  participants?: any[]
  guest?: any
  guests?: any
  payments?: Payment[]
  payment_transactions?: PaymentTransactions[] | any[]
  PaymentTransactions?: PaymentTransaction[]
  requirement_transactions?: any[]
  terms_conditions?: TermsConditions[] | TermsConditions | null
  is_group_booking?: boolean
  group_booking_name?: string | null
  payment_method?: PaymentMethodType | null
  is_hotel_service?: boolean
  total_participant?: number
  adult_count?: number
  child_count?: number
  hotel_amount?: number
  option_amount?: number
  asset_amount?: number
  course_amount?: number
  deposit_amount?: number
  discount_amount?: number
  req_total?: number
  slip_url?: string
}

export interface EnrollmentParticipant {
  user_id?: string | null
  round_id?: string | null
  is_main_user: boolean
  user_profile: UserProfile
  requirements?: AssetOptionRequest[]
}

export interface EnrollmentRoom {
  room_id: string
  quantity: number
  price: number
}

export interface EnrollmentReq {
  course_id: string
  user_id: string
  is_hotel_service: boolean
  payment_status?: EnrollmentStatus
  participants: EnrollmentParticipant[]
  rooms?: EnrollmentRoom[]
  terms_conditions_master_id: string
  accept: boolean
  discount_amount?: number
}

export interface CreateEnrollmentRequest {
  enrollment_req?: EnrollmentReq
  payment_method?: PaymentMethodType
  course_id?: string
  round_id?: string
  adult_count?: number
  child_count?: number
  total_amount?: number
  deposit_amount?: number
  ski_equipment?: boolean
  snowboard_equipment?: boolean
  participants?: any[]
  req_total?: number
}

export interface PendingEnrollmentDetail {
  enrollment_id: string
  user_id: string
  user_name: string
  course_name: string
  program_type: ProgramType
  course_type: CourseTypes
  total_amount: number
  paid_amount: number
  payment_status: EnrollmentStatus
  created_at: string
}

export interface RawEnrollmentRevenue {
  date: string
  day_revenue: number
  month_revenue: number
  year_revenue: number
  day_count: number
  month_count: number
  year_count: number
}

export interface AssetOptionRequest {
  type: RequirementType
  id: string
}

export interface EnrollmentGroupedResponse {
  enrollment_id: string
  user_id: string
  user_name: string
  paid_amount: number
  payment_status: EnrollmentStatus
  booking_count: number
  created_at: string
}

export interface GroupBookingDetailResponse extends Enrollment {
  bookings: BookingMemberResponse[]
}

export interface BookingMemberResponse extends Booking {
  requirement_transactions: RequirementTransaction[]
  role_type: string
}

// ==========================================
// models/hotels_master.go
// ==========================================

export interface HotelsMaster {
  id: string
  name: string
  description?: string
  address?: string
  nation?: string
  province?: string
  district?: string
  images?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
  rooms?: RoomMaster[]
}

export interface CreateRoomMasterRequest {
  hotel_id: string
  name: string
  description: string
  capacity: number
  bed_type: string
  price_per_night: number
  room_total: number
  is_active: boolean
}

export interface CreateHotelMasterRequest {
  name: string
  description: string
  address: string
  is_active: boolean
  rooms?: CreateRoomMasterRequest[]
}

export interface UpdateRoomInput {
  id?: string | null
  name: string
  description: string
  capacity: number
  bed_type: string
  price_per_night: number
  room_total: number
  is_active: boolean
}

export interface UpdateHotelInput {
  name: string
  description: string
  address: string
  is_active: boolean
  rooms?: UpdateRoomInput[]
}

// ==========================================
// models/instructor.go
// ==========================================

export interface Instructor {
  id: string
  name?: string
  username?: string
  first_name?: string | null
  last_name?: string | null
  nickname?: string | null
  email?: string | null
  phone?: string | null
  telephone?: string | null
  profile_image?: string | null
  image?: string | null
  video?: string | null
  id_card?: string | null
  passport_no?: string | null
  nation?: string | null
  birth_date?: string | null
  sex?: string | null
  types?: string[]
  description?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  rounds?: Round[]
  instructor_by_rounds?: InstructorByRound[]
}

export interface InstructorBookingSummary {
  instructor_id: string
  total_bookings: number
  active_bookings: number
  completed_bookings: number
  cancelled_bookings: number
}

export interface InstructorSummary {
  total_instructors: number
  active_instructors: number
  inactive_instructors: number
  top_earning_instructor_id?: string | null
  top_earning_instructor_name?: string | null
  top_earning_amount: number
}

export interface InstructorMonthlyRevenueResult {
  month: string
  year: string
  total_revenue: number
}

export interface CreateInstructorRequest {
  name: string
  nickname: string
  email: string
  phone: string
  profile_image: string
  description?: string | null
  is_active: boolean
}

export interface UpdateInstructorRequest {
  name?: string | null
  nickname?: string | null
  email?: string | null
  phone?: string | null
  profile_image?: string | null
  description?: string | null
  is_active?: boolean | null
}

// ==========================================
// models/instructor_by_round.go
// ==========================================

export interface InstructorByRound {
  id: string
  round_id: string
  instructor_id: string
  created_at: string
  updated_at: string
  round?: Round | null
  instructor?: Instructor | null
}

export interface InstructorCourseResponse extends Course {
  course?: Course | null
  round_count: number
}

// ==========================================
// models/notification.go
// ==========================================

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  read_at?: string | null
  action_url?: string | null
  created_at: string
  updated_at: string
}

// ==========================================
// models/option_master.go
// ==========================================

export interface OptionMaster {
  id: string
  name: string
  description: string
  price: number
  category: CategoryStatus
  is_active: boolean
  created_at: string
  updated_at: string
}

// ==========================================
// models/payment.go
// ==========================================

export interface Payment {
  id: string
  enrollment_id: string
  amount: number
  payment_method: PaymentMethod
  payment_type: string
  is_refund: boolean
  created_at: string
  updated_at: string
  payment_transactions?: PaymentTransactions[]
}

// ==========================================
// models/payment_transactions.go
// ==========================================

export interface PaymentTransactions {
  id: string
  payment_id?: string
  amount: number | string
  status: PaymentTransactionsStatus
  slip_url?: string | null
  verified_by?: string | null
  verified_at?: string | null
  rejection_reason?: string | null
  gateway_ref?: string | null
  raw_response?: string | null
  created_at: string
  updated_at: string
  verified_by_user?: User | null
  payment?: Payment | null
  admin_id?: string
  currency?: string
  enrollment_id?: string
  enrollment_status?: EnrollmentStatus
  name?: string
  payment_method?: any
  ref_id?: string
  remark?: string
}

export interface RejectPaymentRequest {
  rejection_reason: string
}

export interface ApprovePaymentRequest {
  comment?: string
}

// ==========================================
// models/requirement_transaction.go
// ==========================================

export interface RequirementTransaction {
  id: string
  booking_id?: string
  enrollment_id?: string
  user_id?: string
  asset_master_id?: string | null
  asset_master?: AssetMaster | null
  option_master_id?: string | null
  option_master?: OptionMaster | null
  requirement_type?: "ASSET" | "OPTION" | string
  item_type?: "ASSET" | "OPTION" | string
  type?: RequirementType | string
  name?: string
  quantity?: number
  price?: number
  amount?: number
  total_price?: number
  note?: string
  status?: string
  reference_id?: string
  created_at?: string
  updated_at?: string
  asset?: AssetMaster | null
  option?: OptionMaster | null
  room?: RoomMaster | null
  booking?: Booking | null
  user?: User | null
  round?: Round | null
  course?: any
}

export interface CreateRequirementTransactionReq {
  type: RequirementType
  booking_id: string
  reference_id: string
  price: number
}

export interface UpdateRequirementTransactionReq {
  type?: RequirementType | null
  booking_id?: string | null
  reference_id?: string | null
  price?: number | null
}

export interface RequirementTransactionFilter {
  booking_id?: string | null
  type?: RequirementType | null
  reference_id?: string | null
  start_date?: string | null
  end_date?: string | null
  page: number
  page_size: number
  sort_by: string
  sort_order: string
}

export interface RequirementTransactionSummary {
  type: RequirementType
  total_count: number
  total_price: number
}

// ==========================================
// models/room_master.go
// ==========================================

export interface RoomMaster {
  id: string
  hotel_id: string
  name?: string
  description?: string
  capacity?: number
  bed_type?: string
  price_per_night?: number
  room_total?: number
  room_type?: string
  room_no?: string
  images?: string[]
  base_price?: number
  extra_price?: number
  is_active: boolean
  created_at: string
  updated_at: string
  hotel?: HotelsMaster | null
}

// ==========================================
// models/round.go
// ==========================================

export interface Round {
  id: string
  courses_id?: string
  course_id?: string
  course?: Course | null
  round_number?: number
  date_start?: string
  date_end?: string
  start_date: string
  end_date: string
  max_students?: number
  total_user: number
  total?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
  bookings?: Booking[]
  instructor_by_rounds?: InstructorByRound[]
  instructors?: (Instructor & { instructor?: Instructor | null })[]
}

export interface RoundDetailResponse {
  round: Round
  instructors: Instructor[]
}

// ==========================================
// models/terms_conditions.go
// ==========================================

export interface TermsConditions {
  id: string
  user_id: string
  terms_conditions_master_id: string
  enrollment_id?: string | null
  accept: boolean
  accept_at: string
  created_at: string
  updated_at: string
  terms_conditions_master?: TermsConditionsMaster | null
}

export interface TermsConditionsMaster {
  id: string
  conditions: string
  course_id: string
  created_at: string
  updated_at: string
  course?: Course | null
}

export interface CreateTermsConditionsMasterRequest {
  conditions: string
  course_id: string
}

export interface UpdateTermsConditionsMasterRequest {
  conditions?: string | null
  course_id?: string | null
}

export interface CreateTermsConditionsRequest {
  user_id?: string
  terms_conditions_master_id: string
  accept: boolean
  enrollment_id?: string
}

export interface UpdateTermsConditionsRequest {
  user_id?: string | null
  terms_conditions_master_id?: string | null
  accept?: boolean | null
  enrollment_id?: string | null
}

// ==========================================
// models/user.go
// ==========================================

export interface User {
  id: string
  username?: string
  line_user_id?: string
  nickname?: string
  role_id: string
  role?: Role
  description?: string
  bookings?: Booking[]
  branch?: string
  profile_image?: string
  is_active: boolean
  created_at: string
  updated_at: string
  user_profile?: UserProfile | null
  analysis?: Analysis | null
  refer_id?: string | null
  refer?: User | null
}

export interface UpdateProfileRequest {
  first_name?: string | null
  last_name?: string | null
  nickname?: string | null
  telephone: string
  email?: string | null
  level?: string | null
  user_profile?: UserProfile | null
  id_card?: string | null
  passport_no?: string | null
}

export interface CreateUserRequest {
  first_name: string
  last_name: string
  nickname: string
  telephone: string
  email: string
  role_id: string
  is_active?: boolean | null
  branch: string
  profile_image: string
  user_profile?: UserProfile | null
}

export interface UpdateUserRequest {
  first_name?: string | null
  last_name?: string | null
  nickname?: string | null
  telephone?: string | null
  email?: string | null
  role_id?: string | null
  is_active?: boolean | null
  branch?: string | null
  profile_image?: string | null
  user_profile?: UserProfile | null
}

// ==========================================
// models/user_profile.go
// ==========================================

export interface UserProfile {
  id: string
  user_id: string
  first_name?: string | null
  last_name?: string | null
  telephone?: string
  email?: string | null
  level: string
  weight: number
  height: number
  head_size: string
  glove_size: string
  shoe_size: string
  food_allergies: string
  underlying_disease: string
  sex: string
  nation: string
  id_card?: string | null
  passport_no?: string | null
  tax_id?: string | null
  address?: string | null
  birth_date?: string | null
  created_at: string
  updated_at: string
}

// ==========================================
// Additional Types & Extensions
// ==========================================

export type Token = string

export type PaymentMethodType = PaymentMethod

export type PaymentStatus =
  | "PENDING_PAYMENT"
  | "DEPOSIT_PAID"
  | "PAID"
  | "CANCELLED"

export const PaymentTransactionsStatusLabels: Record<
  PaymentTransactionsStatus,
  string
> = {
  [PaymentTransactionsStatus.PendingReview]: "กำลังรอการตรวจสอบ",
  [PaymentTransactionsStatus.InvalidSlip]: "สลิปไม่ถูกต้อง หรือใช้งานไม่ได้",
  [PaymentTransactionsStatus.WrongAmount]: "ยอดเงินโอนไม่ตรงกับยอดที่ต้องชำระ",
  [PaymentTransactionsStatus.Rejected]: "ปฏิเสธการชำระเงิน",
  [PaymentTransactionsStatus.Refunded]: "คืนเงินแล้ว",
  [PaymentTransactionsStatus.Verified]: "ตรวจสอบแล้ว",
  [PaymentTransactionsStatus.GatewayPending]: "กำลังรอทำรายการผ่าน Gateway",
  [PaymentTransactionsStatus.GatewaySuccess]: "ชำระเงินผ่าน Gateway สำเร็จ",
  [PaymentTransactionsStatus.GatewayFailed]: "ชำระเงินผ่าน Gateway ไม่สำเร็จ",
  [PaymentTransactionsStatus.GatewayTimeout]: "หมดเวลาทำรายการ (Timeout)",
}

export interface PaymentTransaction {
  id: string
  enrollment_id?: string
  name?: string
  enrollment_status?: string
  slip_url?: string | null
  payment_method?: PaymentMethodType
  ref_id?: string | null
  amount?: number
  currency?: string
  status: PaymentTransactionsStatus
  raw_response?: string | null
  remark?: string | null
  paid_at?: string | null
  created_at?: string
  updated_at?: string
  admin_id?: string | null
  admin?: Admin | null
  enrollment?: {
    id?: string
    user_id?: string
    user?: User
    course_id?: string
    course?: any
    status?: PaymentStatus | string
    adult_count?: number
    child_count?: number
    total_amount?: number
    deposit_amount?: number
    req_total?: number
    admin_id?: string | null
    admin?: Admin | null
    created_at?: string
    updated_at?: string
    [key: string]: unknown
  }
  booking_id?: string
  payment_type?: string
  type?: string
  price?: number
  deposit_amount?: number
  slip_image?: string | null
  image_url?: string | null
  slip?: string | null
  reference_no?: string | null
  ref_no?: string | null
  transaction_no?: string | null
  note?: string | null
}

export interface CreditPackage {
  id: string
  name: string
  price: number
  credit_amount: number
  validity_months: number
  tag: string
  features: string[]
  created_at?: string
  updated_at?: string
}

export interface CreditPackageFormData {
  name: string
  price: number
  credit_amount: number
  validity_months: number
  tag: string
  features: string[]
}

export type TransactionType =
  | "PENDING"
  | "INPROGRESS"
  | "TIMEOUT"
  | "SUCCESS"
  | "REFUND"
  | "CANCELED"

export interface CreditTransaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  previous_balance: number
  current_balance: number
  description: string
  reference_id: string
  created_at: string
  updated_at: string
  user?: User
  credit_package?: CreditPackage
  admin?: {
    id: string
    username: string
    first_name: string
    last_name: string
    email: string
  }
}

export interface CreditTransactionSummaryData {
  total_transactions: number
  total_amount_success: number
  total_amount_pending: number
  total_amount_refund: number
}

export interface Event {
  id: string
  title: string
  images: string[]
  videos: string[]
  description: string
  location: string
  start_date: string
  end_date: string
  application_fee: number
  limit_player: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EventFormData {
  title: string
  description: string
  location: string
  start_date: string
  end_date: string
  application_fee: number
  limit_player: number
  is_active: boolean
  images: string[]
  videos: string[]
}

export type RateType =
  | "PRO_RATE_PRIVATE"
  | "PRO_RATE_WORKSHOP"
  | "PRO_RATE_SIMULATOR"
  | "FIX_RATE_PER_TIMES"
  | "FIX_RATE_PER_DAY"
  | ""

export interface RateTier {
  id: string
  rate_type: RateType
  program_type: string
  admin_id: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
  commission_rate_tiers?: CommissionRateTier[]
  admin?: {
    username: string
  }
}

export interface RateTierFormData {
  rate_type: RateType
  program_type: string
}

export interface CommissionRateTier {
  id: string
  min: number
  max: number
  rate: number
  tax: number
  rate_type: RateType
  rate_tier_id: string
  admin_id: string
  admin: Admin
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CommissionRateTierFormData {
  min: number
  max: number
  rate: number
  tax: number
  rate_type: RateType
  rate_tier_id: string
}

export interface HourlyRateTier {
  id: string
  min_hours: number
  max_hours: number
  rate: number
  admin_id: string
  tax: number
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface HourlyRateTierFormData {
  min_hours: number
  max_hours: number
  rate: number
  tax: number
}

export interface CreateTermsConditionsMasterInput {
  conditions: string
  course_id: string
}

export interface UpdateTermsConditionsMasterInput {
  conditions?: string
  course_id?: string
}

export interface ContactMeta {
  name: ContactName
  title: string
  titleEn: string
  category: ContactCategory | string
  placeholder: string
  prefix?: string
  helper: string
  brandColor: string
  bgColor: string
  formatUrl: (val: string) => string
}

export const CONTACT_CHANNELS_META: Record<ContactName, ContactMeta> = {
  phone: {
    name: "phone",
    title: "เบอร์โทรศัพท์",
    titleEn: "Phone Number",
    category: "personal",
    placeholder: "08X-XXX-XXXX",
    helper: "เบอร์โทรสำหรับติดต่อสอบถามหรือฝ่ายบริการลูกค้า",
    brandColor: "#10B981",
    bgColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    formatUrl: (val: string) => `tel:${val.replace(/\s+/g, "")}`,
  },
  email: {
    name: "email",
    title: "อีเมลติดต่อ",
    titleEn: "Email Address",
    category: "personal",
    placeholder: "contact@example.com",
    helper: "อีเมลทางการสำหรับรับเรื่องหรือติดต่อธุรกิจ",
    brandColor: "#3B82F6",
    bgColor: "bg-blue-50 text-blue-600 border-blue-200",
    formatUrl: (val: string) => `mailto:${val.trim()}`,
  },
  line: {
    name: "line",
    title: "LINE Official / LINE ID",
    titleEn: "LINE Account",
    category: "personal",
    placeholder: "@snowboardth หรือ Line ID",
    helper: "LINE Official Account หรือ LINE ID สำหรับแชทกับลูกค้า",
    brandColor: "#06C755",
    bgColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    formatUrl: (val: string) => {
      const clean = val.trim()
      if (clean.startsWith("http")) return clean
      if (clean.startsWith("@")) return `https://line.me/R/ti/p/${clean}`
      return `https://line.me/ti/p/~${clean}`
    },
  },
  facebook: {
    name: "facebook",
    title: "Facebook Page",
    titleEn: "Facebook",
    category: "social",
    placeholder: "https://facebook.com/yourpage หรือ @yourpage",
    helper: "ลิงก์หน้าแฟนเพจ Facebook หรือชื่อเพจ",
    brandColor: "#1877F2",
    bgColor: "bg-blue-50 text-[#1877F2] border-blue-200",
    formatUrl: (val: string) => {
      const clean = val.trim()
      if (clean.startsWith("http")) return clean
      return `https://facebook.com/${clean.replace(/^@/, "")}`
    },
  },
  instagram: {
    name: "instagram",
    title: "Instagram",
    titleEn: "Instagram",
    category: "social",
    placeholder: "https://instagram.com/yourhandle หรือ @yourhandle",
    helper: "บัญชี Instagram สำหรับแสดงรูปภาพและกิจกรรม",
    brandColor: "#E4405F",
    bgColor: "bg-pink-50 text-pink-600 border-pink-200",
    formatUrl: (val: string) => {
      const clean = val.trim()
      if (clean.startsWith("http")) return clean
      return `https://instagram.com/${clean.replace(/^@/, "")}`
    },
  },
  tiktok: {
    name: "tiktok",
    title: "TikTok",
    titleEn: "TikTok",
    category: "social",
    placeholder: "https://tiktok.com/@yourhandle หรือ @yourhandle",
    helper: "บัญชี TikTok สำหรับคลิปสั้นและวิดีโอโปรโมท",
    brandColor: "#000000",
    bgColor: "bg-neutral-100 text-neutral-800 border-neutral-300",
    formatUrl: (val: string) => {
      const clean = val.trim()
      if (clean.startsWith("http")) return clean
      return `https://tiktok.com/@${clean.replace(/^@/, "")}`
    },
  },
}

export interface UploadImageRequest {
  folder: UploadImageFolders
  image: File
}

export interface CourseRoom {
  id: string
  course_id: string
  room_id: string
  room_master?: RoomMaster
}

export type InstructorProfile = Instructor

export interface InstructorIncome {
  id: string
  instructor_id: string
  instructor?: {
    id: string
    user: {
      nickname?: string
      first_name?: string
      last_name?: string
    }
  }
  month: number
  year: number
  income: number
  rate: number
  tax: number
  net_income: number
  status: string
}

export interface IncomeTransactionDetail {
  date: string
  time: string
  instructor_name: string
  instructor_code: string
  course_name: string
  hours: number
  customer_name: string
  customer_code: string
  income: number
  tax_amount: number
  net_income: number
}

export interface PaginatedHotelsMaster {
  data: HotelsMaster[]
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

export type UserBalance = {
  id: string
  user_id: string
  course_id: string
  course: Course
  total_times: number
  total_days: number
  total_hour: number
}

export type Schedule = {
  id: string
  course_id: string
  course?: Course
  instructor_id: string
  instructor?: InstructorProfile
  schedule_date: string
  start_time: string
  end_time: string
  available_slots: number
  total_slots: number
  max_students: number
  is_active: boolean
  location: string | null
  status: string
  created_at: string
}

export enum UserScheduleStatus {
  pending = "pending",
  confirmed = "confirmed",
  cancelled = "cancelled",
  completed = "completed",
}

export type UserSchedule = {
  id: string
  user_id: string
  user: User
  schedule_id: string
  schedule: Schedule
  status: UserScheduleStatus
  is_active: boolean
  created_at: string
  course_id: string
  course: Course
  instructor_id: string
  instructor: Instructor
}

export interface Rating {
  id: string
  instructor_id: string
  booking_id: string
  user_id: string
  score: number
  comment: string | null
  created_at: string
  updated_at: string
}

