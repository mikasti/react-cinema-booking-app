import { useEffect, useState, useCallback } from "react";
import { cinemaApi } from "../api/cinemaApi";
import { UserBooking } from "../types/AppTypes";

export const useMyBookings = () => {
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [paymentTimeSeconds, setPaymentTimeSeconds] = useState(1800);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [bookingsData, settingsData] = await Promise.all([
        cinemaApi.getMyBookings(),
        cinemaApi.getSettings(),
      ]);
      setBookings(bookingsData);
      setPaymentTimeSeconds(settingsData.bookingPaymentTimeSeconds);
    } catch (e) {
      console.error("Failed to fetch tickets data", e);
      setError("Failed to fetch tickets data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const payBooking = async (bookingId: string) => {
    try {
      await cinemaApi.payBooking(bookingId);
      await fetchData();
    } catch (e) {
      console.error("Payment failed", e);
      throw e;
    }
  };

  const refreshBookings = () => {
    fetchData();
  };

  return {
    bookings,
    paymentTimeSeconds,
    loading,
    error,
    payBooking,
    refreshBookings,
  };
};
