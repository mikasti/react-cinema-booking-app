import React, { FC, useMemo } from "react";
import { ISeat } from "../../../../types/AppTypes";
import "../../../../assets/css/booking/bookingPage.scss";

interface SelectedSeatsProps {
  selectedSeats: ISeat[];
}

const SelectedSeats: FC<SelectedSeatsProps> = ({ selectedSeats }) => {
  const groupedSeats = useMemo(() => {
    const groups: Record<number, number[]> = {};

    selectedSeats.forEach((seat) => {
      if (!groups[seat.rowNumber]) {
        groups[seat.rowNumber] = [];
      }
      groups[seat.rowNumber].push(seat.seatNumber);
    });

    return Object.entries(groups)
      .map(([row, seats]) => ({
        row: Number(row),
        seats: seats.sort((a, b) => a - b),
      }))
      .sort((a, b) => a.row - b.row);
  }, [selectedSeats]);

  if (selectedSeats.length === 0) return null;

  return (
    <div className="selected-seats-info">
      <p>Выбрано мест: {selectedSeats.length}</p>
      <div className="seats-list">
        {groupedSeats.map(({ row, seats }) => (
          <span key={row}>
            Ряд {row}, Места {seats.join(", ")}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SelectedSeats;
