import { Course } from "./course";
import { Instructor } from "./instructor";
import { Schedule } from "./schedule";
import { User } from "./user";

export enum UserScheduleStatus {
  pending = "pending",
  confirmed = "confirmed",
  cancelled = "cancelled",
  completed = "completed",
}

export type UserSchedule = {
  id: string;
  user_id: string;
  user: User;
  schedule_id: string;
  schedule: Schedule;
  status: UserScheduleStatus;
  is_active: boolean;
  created_at: string;
  course_id: string;
  course: Course;
  instructor_id: string;
  instructor: Instructor;
};
