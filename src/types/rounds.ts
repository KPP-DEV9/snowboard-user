import { Classes } from "./course"

export type Rounds = {
  id: string
  classes_id: string
  classes: Classes
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  total: number
  hour: number
}
