"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { User, UserProfile } from "@/types/user"
import { api } from "@/lib/api"
import { DateToIso } from "@/lib/date"

export async function updateUserProfile(data: any) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("user")?.value

  if (userCookie) {
    const user = JSON.parse(userCookie) as User

    // Initialize user_profile if it doesn't exist
    const currentUserProfile =
      user.user_profile ||
      ({
        id: "temp-id",
        user_id: user.id,
        first_name: null,
        last_name: null,
        telephone: "",
        email: null,
        level: "Level 1",
        weight: 0,
        height: 0,
        head_size: "",
        glove_size: "",
        shoe_size: "",
        food_allergies: "",
        underlying_disease: "",
        sex: "Male",
        nation: "",
        id_card: "",
        passport_no: "",
        tax_id: "",
        address: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as UserProfile)

    // Update fields
    const updatedUser: User = {
      ...user,
      nickname: data.nickname || user.nickname,
      profile_image: data.profile_image || data.image_profile || user.profile_image,
      user_profile: {
        ...currentUserProfile,
        first_name: data.first_name || currentUserProfile.first_name,
        last_name: data.last_name || currentUserProfile.last_name,
        telephone: data.telephone || currentUserProfile.telephone,
        email: data.email || currentUserProfile.email,
        level: data.level || currentUserProfile.level,
        weight: Number(data.weight) || currentUserProfile.weight,
        height: Number(data.height) || currentUserProfile.height,
        head_size: data.head_size || currentUserProfile.head_size,
        glove_size: data.glove_size || currentUserProfile.glove_size,
        shoe_size: data.shoe_size || currentUserProfile.shoe_size,
        food_allergies:
          data.food_allergies !== undefined
            ? data.food_allergies
            : data.has_allergy
              ? data.allergy_detail || ""
              : "",
        underlying_disease:
          data.underlying_disease !== undefined
            ? data.underlying_disease
            : data.has_disease
              ? data.disease_detail || ""
              : "",
        sex:
          data.sex === "Male" || data.sex === "Female" || data.sex === "Other"
            ? data.sex
            : data.sex === "male"
              ? "Male"
              : data.sex === "female"
                ? "Female"
                : currentUserProfile.sex,
        nation: data.nation || currentUserProfile.nation,
        id_card: data.id_card || currentUserProfile.id_card,
        passport_no: data.passport_no || currentUserProfile.passport_no,
        tax_id: data.tax_id || currentUserProfile.tax_id,
        address: data.address || currentUserProfile.address,
        birth_date: data.birth_date || currentUserProfile.birth_date,
      },
    }

    try {
      const updatePayload = {
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        telephone: data.telephone || "",
        level: data.level || "Level 1",
        email: data.email || "",
        weight: Number(data.weight) || 0,
        height: Number(data.height) || 0,
        head_size: data.head_size || "",
        glove_size: data.glove_size || "",
        shoe_size: data.shoe_size || "",
        food_allergies: data.food_allergies || "",
        underlying_disease: data.underlying_disease || "",
        sex:
          data.sex === "Male" || data.sex === "Female" || data.sex === "Other"
            ? data.sex
            : data.sex === "male"
              ? "Male"
              : data.sex === "female"
                ? "Female"
                : "",
        nation: data.nation || "",
        id_card: data.id_card || "",
        passport_no: data.passport_no || "",
        tax_id: data.tax_id || "",
        address: data.address || "",
        birth_date: DateToIso(data.birth_date),
      }

      const response = await api.users.updateProfile(updatePayload)

      if (!response.success) {
        return { success: false, error: response.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }
      }
    } catch (err: any) {
      console.error("Failed to update profile to backend", err)
      return { success: false, error: "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์" }
    }

    cookieStore.set("user", JSON.stringify(updatedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    revalidatePath("/", "layout")
    return { success: true }
  }

  return { success: false, error: "ไม่พบข้อมูลผู้ใช้ในระบบ" }
}
