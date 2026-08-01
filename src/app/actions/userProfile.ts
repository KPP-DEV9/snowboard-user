"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { User, StudentProfile } from "@/types/user"
import { api } from "@/lib/api"

export async function updateUserProfile(data: any) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("user")?.value
  
  if (userCookie) {
    const user = JSON.parse(userCookie) as User;
    
    // Initialize student_profile if it doesn't exist
    const currentStudentProfile = user.student_profile || {
      id: "temp-id",
      user_id: user.id,
      bio: null,
      speciality: null,
      hourly_rate: 0,
      experience_years: 0,
      is_active: true,
      created_at: new Date().toISOString()
    } as StudentProfile;

    // Update fields
    const updatedUser: User = {
      ...user,
      first_name: data.first_name,
      last_name: data.last_name,
      nickname: data.nickname,
      email: data.email,
      telephone: data.telephone,
      sex: data.sex,
      student_profile: {
         ...currentStudentProfile,
         speciality: data.speciality,
         hourly_rate: Number(data.hourly_rate) || 0,
         experience_years: Number(data.experience_years) || 0,
         image_profile: data.image_profile || currentStudentProfile.image_profile,
      }
    };
    
    try {
      const updatePayload = {
        first_name: data.first_name,
        last_name: data.last_name,
        nickname: data.nickname,
        telephone: data.telephone,
        email: data.email,
        student_profile: {
          bio: currentStudentProfile.bio,
          speciality: data.speciality,
          experience_years: Number(data.experience_years) || 0,
          image_profile: data.image_profile || currentStudentProfile.image_profile,
        }
      };

      const response = await api.users.updateProfile(updatePayload);
      if (!response.success) {
         return { success: false, error: response.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
      }
    } catch (err: any) {
       console.error("Failed to update profile to backend", err)
       return { success: false, error: "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์" };
    }
    
    cookieStore.set("user", JSON.stringify(updatedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })
    
    revalidatePath("/profile");
    return { success: true };
  }
  
  return { success: false, error: "ไม่พบข้อมูลผู้ใช้ในระบบ" };
}
