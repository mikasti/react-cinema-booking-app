import React, { memo, FC } from "react";
import "../../../../assets/css/booking/bookingPage.scss";

const SeatLegend: FC = memo(() => {
  return (
    <div className="legend">
      <div className="item available">
        <div className="box"></div>Свободно
      </div>
      <div className="item selected">
        <div className="box"></div>Выбрано
      </div>
      <div className="item booked">
        <div className="box"></div>Занято
      </div>
    </div>
  );
});

export default SeatLegend;

SeatLegend.displayName = "SeatLegend";
