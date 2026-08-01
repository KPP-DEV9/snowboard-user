export interface Event {
  id: string
  title: string
  description?: string
  images?: string[]
  videos?: string[]
  start_date?: string
  end_date?: string
  application_fee?: number
  limit_player?: number
  status?: string
  created_at?: string
  updated_at?: string
  location?: string
  participant_count: number
}
