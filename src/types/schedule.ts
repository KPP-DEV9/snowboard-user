import { Course } from "./course";
import { InstructorProfile } from "./instructor";

export type Schedule = {
  id: string;
  course_id: string;
  course?: Course;
  instructor_id: string;
  instructor?: InstructorProfile;
  schedule_date: string;
  start_time: string;
  end_time: string;
  available_slots: number;
  total_slots: number;
  max_students: number;
  is_active: boolean;
  location: string | null;
  status: string;
  created_at: string;
};
