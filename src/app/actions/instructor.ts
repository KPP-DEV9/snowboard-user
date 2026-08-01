"use server";

import { InstructorProfile } from "@/types/instructor";
import { api, PaginatedData } from "@/lib/api";

export async function getInstructors(page = 1, limit = 10) {
  try {
    const res = await api.instructor.getAll<PaginatedData<InstructorProfile>>(
      page,
      limit,
    );
    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch instructors",
      };
    }
    return {
      success: true,
      data: res.data as PaginatedData<InstructorProfile>,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch instructors",
    };
  }
}

export async function getInstructorById(id: string) {
  try {
    const res = await api.instructor.getById<InstructorProfile>(id);
    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch instructor",
      };
    }
    return {
      success: true,
      data: res.data as InstructorProfile,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch instructor",
    };
  }
}
