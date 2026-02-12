import React, { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cinemaApi } from "../../../api/cinemaApi";
import { ICinema } from "../../../types/AppTypes";
import Loader from "../../common/Loader";
import "../../../assets/css/cinemas/cinemasPage.scss";

const CinemasPage: FC = () => {
  const [cinemas, setCinemas] = useState<ICinema[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cinemaApi
      .getCinemas()
      .then(setCinemas)
      .catch(() => navigate("/error"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <Loader />;

  return (
    <div className="cinemas-section">
      <h1>Кинотеатры</h1>
      <div className="cinemas-grid">
        {cinemas.map((cinema) => (
          <Link
            to={`/cinema/${cinema.id}`}
            key={cinema.id}
            className="cinema-card"
          >
            <div className="cinema-icon">🎞️</div>
            <div className="cinema-info">
              <h3 className="title">{cinema.name}</h3>
              <p className="subtitle">{cinema.address}</p>
            </div>
            <div className="action-button">Посмотреть сеансы</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CinemasPage;
