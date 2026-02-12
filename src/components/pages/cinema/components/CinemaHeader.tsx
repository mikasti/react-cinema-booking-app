import React, { FC } from "react";
import { ICinema } from "../../../../types/AppTypes";
import "../../../../assets/css/cinemas/cinemaDetails.scss";

interface CinemaHeaderProps {
  cinema: ICinema;
}

const CinemaHeader: FC<CinemaHeaderProps> = ({ cinema }) => {
  return (
    <div className="cinema-header">
      <div className="info-container">
        <h1>{cinema.name}</h1>
        <p>{cinema.address}</p>
      </div>
    </div>
  );
};

export default CinemaHeader;
