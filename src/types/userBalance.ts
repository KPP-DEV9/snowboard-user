export type Course = {
  id: string
  name: string
  description?: string
  price: number
  // add more fields if necessary
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
