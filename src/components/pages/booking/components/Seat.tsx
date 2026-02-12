import React, { FC } from "react";
import "../../../../assets/css/booking/bookingPage.scss";

interface SeatProps {
    row: number;
    seat: number;
    isBooked: boolean;
    isSelected: boolean;
    onClick: (row: number, seat: number) => void;
}

const Seat: FC<SeatProps> = React.memo(
    ({ row, seat, isBooked, isSelected, onClick }) => {
        const handleClick = () => {
            onClick(row, seat);
        };

        return (
            <div
                className={`seat ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                onClick={handleClick}
            >
                {seat}
            </div>
        );
    },
);

export default Seat;
