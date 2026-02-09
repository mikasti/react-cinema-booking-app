import React, { FC } from "react";
import { TicketStatus, UserBooking } from "../../../../types/AppTypes";
import TicketCard from "./TicketCard";

interface TicketListProps {
  title: string;
  bookings: UserBooking[];
  emptyMessage?: string;
  type: TicketStatus;
  paymentTimeSeconds?: number;
  onPay?: (id: string) => void;
}

const TicketList: FC<TicketListProps> = ({
  title,
  bookings,
  emptyMessage = "Нет билетов",
  type,
  paymentTimeSeconds,
  onPay,
}) => {
  return (
    <div className="tickets-section">
      <h2>{title}</h2>
      <div className="tickets-list">
        {bookings.length === 0 && (
          <p className="empty-message">{emptyMessage}</p>
        )}
        {bookings.map((booking) => (
          <TicketCard
            key={booking.id}
            booking={booking}
            variant={type}
            paymentTimeSeconds={paymentTimeSeconds}
            onPay={onPay}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketList;
