"use server";

import { api } from "@/lib/api";
import { Booking } from "@/types/booking";

export async function getBookingByUser(userId: string) {
  if (!userId) {
    return { success: false, data: null, error: "No user ID provided" };
  }
  try {
    const res = await api.booking.getByUserID<Booking[]>(userId);
    if (!res.success) {
      return {
        success: false,
        data: null,
        error: res.message || "Failed to fetch bookings",
      };
    }
    return {
      success: true,
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || "Failed to fetch bookings",
    };
  }
}
