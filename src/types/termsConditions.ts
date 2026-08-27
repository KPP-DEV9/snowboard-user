import { TermsConditionsMaster } from "./course"
import { User } from "./user"

export interface TermsConditions {
  id: string
  user_id: string
  user?: User
  terms_conditions_master_id: string
  terms_conditions_master?: TermsConditionsMaster
  accept: boolean
  enrollment_id?: string
  created_at?: string
  updated_at?: string
}

export interface CreateTermsConditionsRequest {
  user_id?: string
  terms_conditions_master_id: string
  accept: boolean
  enrollment_id?: string
}
