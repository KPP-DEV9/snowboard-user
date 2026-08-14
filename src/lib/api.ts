import { UserSchedule } from "@/types/userSchedule"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: boolean
}

/**
 * Helper function to handle fetch requests and parse the response
 */
async function fetchWrapper<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  // Default headers
  const headers = new Headers(options.headers || {})
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  // Attach token from server session
  try {
    const { getToken } = await import("@/app/actions/auth")
    const token = await getToken()
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  } catch (err) {
    console.error("Failed to get token", err)
  }

  let shouldRedirect = false

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Backend Error Response:", response.status, data)
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          console.error("401 error")
          window.location.href = "/signout"
        } else {
          shouldRedirect = true
        }
      }
      // Throw an error that includes the backend's error message if available
      throw new Error(
        data?.message || data?.error || data?.detail || `An error occurred: ${response.status}`,
      )
    }

    // Polyfill success flag if backend doesn't provide it but response is ok
    if (typeof data === "object" && data !== null && data.success === undefined) {
      data.success = true
    }

    return data as ApiResponse<T>
  } catch (error: any) {
    if (shouldRedirect) {
      const { redirect } = await import("next/navigation")
      redirect("/signout")
    }

    // Standardize the error response to match the ApiResponse interface
    return {
      success: false,
      message: error.message || "Network error",
      errors: error,
    }
  }
}

export interface PaginatedData<T> {
  data: T[]
  total_items: number
  total_pages: number
  page: number
  limit: number
}

export const api = {
  line: {
    get: <T>(endpoint: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(endpoint, { ...options, method: "GET" }),
    post: <T>(endpoint: string, body?: any, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(endpoint, {
        ...options,
        method: "POST",
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),
    put: <T>(endpoint: string, body?: any, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(endpoint, {
        ...options,
        method: "PUT",
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),
  },
  users: {
    updateProfile: <T>(body: any, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`users/me`, {
        ...options,
        method: "PUT",
        body: JSON.stringify(body),
      }),
  },
  course: {
    getAll: <T>(
      page = 1,
      limit = 10,
      filters?: Record<string, any>,
      options?: Omit<RequestInit, "method" | "body">,
    ) => {
      let url = `courses?page=${page}&limit=${limit}`
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => {
                if (v !== undefined && v !== null && v !== "") {
                  url += `&${key}=${v}`
                }
              })
            } else {
              url += `&${key}=${value}`
            }
          }
        })
      }
      return fetchWrapper<T>(url, {
        ...options,
        method: "GET",
        cache: "no-store",
      })
    },
    getCourseById: <T>(
      id: string,
      total_user: number,
      options?: Omit<RequestInit, "method" | "body">,
    ) =>
      fetchWrapper<T>(`courses/${id}?total_user=${total_user}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
    // getCourseByInstructorId: <T>(id: string, options?: Omit<RequestInit, "method" | "body">) =>
    //   fetchWrapper<T>(`courses/instructor/${id}`, {
    //     ...options,
    //     method: "GET",
    //     cache: "no-store",
    //   }),
  },
  credit: {
    get: <T>(options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`credits/me`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
  },
  creditPackages: {
    getAll: <T>(page = 1, limit = 10, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`credit-packages?page=${page}&limit=${limit}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
    getById: <T>(id: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`credit-packages/${id}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
    PurchasePackage: <T>(
      body: { user_id: string; package_id: string },
      options?: Omit<RequestInit, "method" | "body">,
    ) =>
      fetchWrapper<T>(`credit-transactions/purchase`, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  instructor: {
    getAll: <T>(page = 1, limit = 10, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`instructors?page=${page}&limit=${limit}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
    getById: <T>(id: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`instructors/${id}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
  },
  user_schedule: {
    getByUserID: <T>(userId: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<UserSchedule[]>(`user-schedules/user/${userId}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
  },
  classes: {
    getByCourseId: <T>(courseId: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`classes/course/${courseId}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
  },
  booking: {
    updateUserClassesBooking: <T>(
      id: string,
      body: any,
      options?: Omit<RequestInit, "method" | "body">,
    ) =>
      fetchWrapper<T>(`booking/${id}`, {
        ...options,
        method: "PUT",
        body: JSON.stringify(body),
      }),
    getById: <T>(id: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`booking/${id}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
    getByUserID: <T>(userId: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<[]>(`booking/user/${userId}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
    getUserClassesByUserID: <T>(userId: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<[]>(`booking/user/${userId}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
    getUserClassesSummary: <T>(userId: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`booking/booking-summary/${userId}`, {
        ...options,
        method: "GET",
        cache: "default",
      }),
    getByClassesID: <T>(classesId: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`booking/class/${classesId}`, {
        ...options,
        method: "GET",
        cache: "default",
      }),
    // getUserClassesPast: <T>(userId: string, options?: Omit<RequestInit, "method" | "body">) =>
    //   fetchWrapper<T>(`user-classs/past/${userId}`, {
    //     ...options,
    //     method: "GET",
    //     cache: "default",
    //   }),
  },
  enrollment: {
    create: <T>(
      course_id: string,
      remaining_slots: number,
      payment_method: string,
      options?: Omit<RequestInit, "method" | "body">,
    ) =>
      fetchWrapper<T>(`enrollments`, {
        ...options,
        method: "POST",
        body: JSON.stringify({
          course_id,
          remaining_slots,
          payment_method,
        }),
      }),
    getByUserID: <T>(options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`enrollments/user`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
    getByUserIDCountStatus: <T>(
      user_id: string,
      status: string,
      options?: Omit<RequestInit, "method" | "body">,
    ) =>
      fetchWrapper<T>(`enrollments/user-count-past/${user_id}/${status}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
  },
  rounds: {
    getRoundByClassesID: <T>(
      classesId: string,
      start_date: string,
      options?: Omit<RequestInit, "method" | "body">,
    ) => {
      let url = `rounds/class/${classesId}/${start_date}`
      return fetchWrapper<T>(url, {
        ...options,
        method: "GET",
        cache: "no-store",
      })
    },
  },
  events: {
    getAll: <T>(page = 1, limit = 10, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`events?page=${page}&limit=${limit}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
    getById: <T>(id: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`events/${id}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
  },
  user_events: {
    create: <T>(
      body: { user_id: string; event_id: string; status: string },
      options?: Omit<RequestInit, "method" | "body">,
    ) =>
      fetchWrapper<T>(`user-events`, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      }),
    getByUserEventID: <T>(eventId: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`user-events/event/${eventId}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
    getByUserId: <T>(
      userId: string,
      page = 1,
      limit = 10,
      options?: Omit<RequestInit, "method" | "body">,
    ) =>
      fetchWrapper<T>(`user-events/user/${userId}?page=${page}&limit=${limit}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
    interestUserEvent: <T>(
      body: { event_id: string; status: string },
      options?: Omit<RequestInit, "method" | "body">,
    ) =>
      fetchWrapper<T>(`user-events/interest`, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      }),
    findUserJoinedEvent: <T>(
      eventId: string,
      status: string,
      options?: Omit<RequestInit, "method" | "body">,
    ) =>
      fetchWrapper<T>(`user-events/find/${eventId}?status=${status}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
  },
  feedbacks: {
    getByBookingId: <T>(bookingId: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`feedbacks/booking/${bookingId}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
    create: <T>(body: any, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`feedbacks`, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  ratings: {
    checkExisting: <T>(
      instructorId: string,
      userId: string,
      bookingId: string,
      options?: Omit<RequestInit, "method" | "body">,
    ) =>
      fetchWrapper<T>(
        `ratings/check?instructor_id=${instructorId}&user_id=${userId}&booking_id=${bookingId}`,
        {
          ...options,
          method: "GET",
          cache: "no-store",
        },
      ),
    create: <T>(body: any, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`ratings`, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  analytics: {
    getById: <T>(id: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`analytics/${id}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
  },
  swingAnalyses: {
    getByBookingId: <T>(bookingId: string, options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`swing-analyses/booking/${bookingId}`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
  },
  userBalances: {
    getMyBalances: <T>(options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`user-balances/me`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
  },
  contacts: {
    getAll: <T>(options?: Omit<RequestInit, "method" | "body">) =>
      fetchWrapper<T>(`contacts`, {
        ...options,
        method: "GET",
        cache: "no-store",
      }),
  },
  assetMasters: {
    getAll: <T>(
      page = 1,
      limit = 10,
      course_type = "",
      options?: Omit<RequestInit, "method" | "body">,
    ) => {
      let url = `asset-masters?page=${page}&limit=${limit}`
      if (course_type) url += `&course_type=${course_type}`
      return fetchWrapper<T>(url, {
        ...options,
        method: "GET",
        cache: "no-store",
      })
    },
  },
  optionMasters: {
    getAll: <T>(
      page = 1,
      limit = 10,
      options?: Omit<RequestInit, "method" | "body">,
    ) => {
      let url = `option-masters?page=${page}&limit=${limit}`
      return fetchWrapper<T>(url, {
        ...options,
        method: "GET",
        cache: "no-store",
      })
    },
  },
}
