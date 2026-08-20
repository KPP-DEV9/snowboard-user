import { useState, useEffect } from "react";
import { Booking } from "@/types/booking";
import { api } from "@/lib/api";

export function useBookingByUserID(userId: string | undefined) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.booking.getByUserID(userId);
        if (!res.success) {
          throw new Error(res.message || "Failed to fetch bookings");
        }

        const data = res.data;
        setBookings(data as Booking[]);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.booking.getByUserID(userId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch bookings");
      }

      const data = res.data;
      setBookings(data as Booking[]);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  return { bookings, loading, error, refetch };
}
