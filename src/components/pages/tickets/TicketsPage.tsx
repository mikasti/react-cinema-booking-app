import React, { useMemo, useState } from "react";
import "../../../assets/css/tickets/ticketsPage.scss";
import Loader from "../../common/Loader";
import { useMyBookings } from "../../../hooks/useMyBookings";
import TicketList from "./components/TicketList";

const TicketsPage = () => {
  const { bookings, paymentTimeSeconds, loading, payBooking } = useMyBookings();

  const handlePay = async (bookingId: string) => {
    try {
      await payBooking(bookingId);
    } catch (e) {
      console.error(e);
      alert("Payment failed");
    }
  };

  const [now] = useState(() => Date.now());

  const { unpaid, future, past } = useMemo(() => {
    const unpaidList = bookings.filter((b) => !b.isPaid);
    const paidList = bookings.filter((b) => b.isPaid);

    const futureList = paidList.filter((b) => {
      const start = b.movieSession?.startTime || b.startTime;
      if (!start) return true;
      return new Date(start).getTime() > now;
    });

    const pastList = paidList.filter((b) => {
      const start = b.movieSession?.startTime || b.startTime;
      if (!start) return false;
      return new Date(start).getTime() <= now;
    });

    return { unpaid: unpaidList, future: futureList, past: pastList };
  }, [bookings, now]);

  if (loading) return <Loader />;

  return (
    <div className="tickets-page">
      <h1>Мои билеты</h1>

      <TicketList
        title="Не оплаченные"
        bookings={unpaid}
        type="unpaid"
        emptyMessage="Нет неоплаченных билетов"
        paymentTimeSeconds={paymentTimeSeconds}
        onPay={handlePay}
      />

      <TicketList
        title="Будущие"
        bookings={future}
        type="paid"
        emptyMessage="Нет будущих сеансов"
      />

      <TicketList
        title="Прошедшие"
        bookings={past}
        type="past"
        emptyMessage="Нет прошедших сеансов"
      />
    </div>
  );
};

export default TicketsPage;
