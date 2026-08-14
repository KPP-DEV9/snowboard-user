import { Round } from "./rounds"

export type Level = "Beginner" | "Level 1" | "Level 2" | "Level 3" | "Level 4" | "Level 5"

export type ProgramType = "TRIP" | "PRIVATE_COACHING"

export type CourseTypes = "SNOWBOARD" | "SKI"

export interface Course {
  id: string
  title: string
  description: string
  course_level: Level
  course_type: CourseTypes
  program_type: ProgramType
  image_urls: string[]
  register_start: string
  register_end: string
  start_date: string
  end_date: string
  price: number
  child_price: number
  down_price: number
  nation?: string
  province?: string
  district?: string
  discount: number
  total_days: number
  total_user: number
  max_users: number
  rounds?: Round[]
  course_rooms?: CourseRoom[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CourseRoom {
  id: string
  course_id: string
  room_id: string
  room_master?: RoomMaster
}

export interface RoomMaster {
  id: string
  hotel_id: string
  room_type: string
  bed_type: string
  code: string
  base_price: number
  extra_price: number
  is_active: boolean
  created_at: string
  updated_at: string
  hotel?: HotelsMaster
}

export interface HotelsMaster {
  id: string
  name: string
  nation: string
  city: string
  is_active: boolean
  created_at: string
  updated_at: string
  rooms?: RoomMaster[]
}
