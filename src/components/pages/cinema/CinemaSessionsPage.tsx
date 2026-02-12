import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import { useCinemaSessions } from "../../../hooks/useCinemaSessions";
import CinemaHeader from "./components/CinemaHeader";
import "../../../assets/css/cinemas/cinemaDetails.scss";
import SessionsList from "../../common/SessionsList/SessionsList";
import { DateGroup } from "../../../types/AppTypes";

const CinemaSessionsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { cinema, daySessions, loading, error } = useCinemaSessions(id);

  useEffect(() => {
    if (error) {
      navigate("/error");
    }
  }, [error, navigate]);

  const handleSessionClick = (sessionId: number) => {
    navigate(`/movieSessions/${sessionId}`);
  };

  const sessionsData: DateGroup[] = useMemo(() => {
    return daySessions.map((day) => ({
      date: day.date,
      items: day.movies.map((m) => ({
        id: m.movie.id,
        title: m.movie.title,
        sessions: m.sessions,
        onTitleClick: () =>
          navigate(`/movie/${m.movie.id}`, {
            state: { movie: m.movie, fromCinemaId: cinema?.id },
          }),
      })),
    }));
  }, [daySessions, navigate, cinema?.id]);

  if (loading) return <Loader />;
  if (!cinema) return <div style={{ padding: 40 }}>Cinema not found</div>;

  return (
    <div className="cinema-details-page">
      <CinemaHeader cinema={cinema} />
      <SessionsList data={sessionsData} onSessionClick={handleSessionClick} />
    </div>
  );
};

export default CinemaSessionsPage;
