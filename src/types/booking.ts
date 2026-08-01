import { Classes } from "./course"
import { User } from "./user"
import { Rounds } from "./rounds"

export type Booking = {
  id: string
  user_id: string
  user: User
  classes_id: string
  classes: Classes
  status: BookingStatus
  created_at: string | Date
  confirm_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date | null
  round_id: string | null
  round?: Rounds
}

export type BookingStatus =
  | "WAIT_BOOKING"
  | "CUS_CONFIRM"
  | "CUS_REJECT"
  | "INS_CONFIRM"
  | "INS_REJECT"
  | "INPROGRESS"
  | "COMPLETE"
