import React, { memo, FC } from "react";
import "../../../../assets/css/booking/bookingPage.scss";

interface BookingHeaderProps {
  movieTitle: string;
  cinemaName: string;
  cinemaAddress: string;
  startTime: string;
}

const BookingHeader: FC<BookingHeaderProps> = memo(
  ({ movieTitle, cinemaName, cinemaAddress, startTime }) => {
    return (
      <>
        <h1>{movieTitle}</h1>
        <div className="session-info">
          <span>
            {cinemaName} • {cinemaAddress}
          </span>
          <span>{new Date(startTime).toLocaleString()}</span>
        </div>
      </>
    );
  },
);

export default BookingHeader;
