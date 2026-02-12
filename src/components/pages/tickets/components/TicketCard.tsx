import React, { FC, useCallback, useEffect, useState } from "react";
import { TicketStatus, UserBooking } from "../../../../types/AppTypes";

interface TicketCardProps {
  booking: UserBooking;
  variant: TicketStatus;
  paymentTimeSeconds?: number;
  onPay?: (id: string) => void;
}

const TicketCard: FC<TicketCardProps> = ({
  booking,
  variant,
  paymentTimeSeconds,
  onPay,
}) => {
  const isPast = variant === "past";
  const isUnpaid = variant === "unpaid";

  const calculateTimeLeft = useCallback(() => {
    if (!isUnpaid || !paymentTimeSeconds) return 0;
    const bookedAt = new Date(booking.bookedAt).getTime();
    const now = Date.now();
    const expirationTime = bookedAt + paymentTimeSeconds * 1000;
    return Math.max(0, Math.floor((expirationTime - now) / 1000));
  }, [booking, paymentTimeSeconds, isUnpaid]);

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    if (!isUnpaid) return;

    const timer = setInterval(() => {
      const nextTime = calculateTimeLeft();
      setTimeLeft(nextTime);
      if (nextTime <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft, isUnpaid]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `Осталось ${m}:${s.toString().padStart(2, "0")}`;
  };

  const formattedDate = new Date(
    booking.startTime || booking.movieSession?.startTime || booking.bookedAt,
  ).toLocaleString();

  const handlePay = () => {
    if (onPay) {
      onPay(booking.id);
    }
  };

  return (
    <div className={`ticket-card ${isPast ? "past" : ""}`}>
      <div className="ticket-info">
        <h3>{booking.movieTitle || "Фильм"}</h3>
        <p>{booking.cinemaName || "Кинотеатр"}</p>
        <p>{formattedDate}</p>
        <div className="seats-info">
          {booking.seats
            .map((s) => `Ряд ${s.rowNumber}, место ${s.seatNumber}`)
            .join("; ")}
        </div>
      </div>
      <div className="ticket-actions">
        {isUnpaid ? (
          timeLeft > 0 ? (
            <>
              <button className="pay-button" onClick={handlePay}>
                Оплатить
              </button>
              <div className="timer">{formatTime(timeLeft)}</div>
            </>
          ) : (
            <button className="pay-button" disabled>
              Срок истек
            </button>
          )
        ) : isPast ? (
          <span className="past-badge">Завершен</span>
        ) : (
          <span className="paid-badge">Оплачено</span>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
