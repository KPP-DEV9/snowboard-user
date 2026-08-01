"use server"

import { Event } from "@/types/event"
import { api, PaginatedData } from "@/lib/api"

export async function getEvents(page = 1, limit = 10) {
  try {
    const res = await api.events.getAll<PaginatedData<Event> | Event[]>(page, limit)

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch events",
      }
    }

    return { success: true, data: res.data }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch events",
    }
  }
}

export async function getEventById(id: string) {
  try {
    const res = await api.events.getById<Event>(id)

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch event",
      }
    }

    return { success: true, data: res.data }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch event",
    }
  }
}

export async function joinEvent(user_id: string, event_id: string) {
  try {
    const res = await api.user_events.create<any>({ user_id, event_id, status: "REGISTERED" })

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to join event",
      }
    }

    return { success: true, data: res.data }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to join event",
    }
  }
}

export async function getByUserEventID(eventId: string): Promise<any> {
  try {
    const res = await api.user_events.getByUserEventID(eventId)
    if (!res.success || !res.data) return false
    return res.data as boolean
  } catch {
    return false
  }
}

export async function getMyEvents(userId: string, page = 1, limit = 10) {
  try {
    const res = await api.user_events.getByUserId<PaginatedData<any> | any[]>(userId, page, limit)

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to fetch user events",
      }
    }

    return { success: true, data: res.data }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch user events",
    }
  }
}

export async function interestUserEvent(event_id: string) {
  try {
    const res = await api.user_events.interestUserEvent({
      event_id,
      status: "INTERESTED",
    })

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to review event",
      }
    }

    return { success: true, data: res.data }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to review event",
    }
  }
}
