import { User } from "./user"
import { Round } from "./rounds"

export interface Booking {
  id: string
  user_id: string
  user?: User
  status: BookingStatus
  created_at: string
  confirm_at?: string | null
  updated_at: string
  deleted_at?: string | null
  round_id?: string | null
  round?: Round | null
  admin_id?: string | null
  admin?: Admin | null
}

export enum BookingStatus {
  WaitingBooking = "WAIT_BOOKING",
  CusConfirm = "CUS_CONFIRM",
  CusReject = "CUS_REJECT",
  InsConfirm = "INS_CONFIRM",
  InsReject = "INS_REJECT",
  InProgress = "INPROGRESS",
  Complete = "COMPLETE",
}

export interface Admin {
  id: string
  username: string
  name: string
  session_id?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
}
