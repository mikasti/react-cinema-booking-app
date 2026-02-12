import React, { FC, useMemo } from "react";
import { ISeat, SessionDetails } from "../../../../types/AppTypes";
import "../../../../assets/css/booking/bookingPage.scss";
import Seat from "./Seat";

interface SeatMapProps {
  session: SessionDetails;
  selectedSeats: ISeat[];
  onSeatClick: (row: number, seat: number) => void;
}

const SeatMap: FC<SeatMapProps> = ({ session, selectedSeats, onSeatClick }) => {
  const bookedSeatsSet = useMemo(() => {
    return new Set(
      session.bookedSeats.map((s) => `${s.rowNumber}-${s.seatNumber}`),
    );
  }, [session.bookedSeats]);

  const selectedSeatsSet = useMemo(() => {
    return new Set(selectedSeats.map((s) => `${s.rowNumber}-${s.seatNumber}`));
  }, [selectedSeats]);

  return (
    <>
      <div className="seats-container">
        {Array.from({ length: session.seats.rows }).map((_, rowIndex) => {
          const rowNum = rowIndex + 1;
          return (
            <div key={rowNum} className="row">
              <div className="row-label">Ряд {rowNum}</div>
              {Array.from({ length: session.seats.seatsPerRow }).map(
                (_, seatIndex) => {
                  const seatNum = seatIndex + 1;
                  const seatId = `${rowNum}-${seatNum}`;
                  const isBooked = bookedSeatsSet.has(seatId);
                  const isSelected = selectedSeatsSet.has(seatId);

                  return (
                    <Seat
                      key={seatNum}
                      row={rowNum}
                      seat={seatNum}
                      isBooked={isBooked}
                      isSelected={isSelected}
                      onClick={onSeatClick}
                    />
                  );
                },
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default React.memo(SeatMap);
