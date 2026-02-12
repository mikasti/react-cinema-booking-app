import React, { useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DateGroup, IMovie } from "../../../types/AppTypes";
import "../../../assets/css/movies/movieSessionPage.scss";
import Loader from "../../common/Loader";
import MovieInfo from "./components/MovieInfo";
import { useMovieSessions } from "../../../hooks/useMovieSessions";
import SessionsList from "../../common/SessionsList/SessionsList";

const MovieSessionsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const movie = location.state?.movie as IMovie | undefined;

  const { daySessions, loading } = useMovieSessions(id);

  const [filterCinemaId, setFilterCinemaId] = useState<string | null>(
    location.state?.fromCinemaId || null,
  );

  const handleSessionClick = (sessionId: number) => {
    navigate(`/movieSessions/${sessionId}`);
  };

  const sessionsData: DateGroup[] = useMemo(() => {
    return daySessions
      .map((day) => ({
        date: day.date,
        items: day.cinemas
          .filter(
            (c) =>
              filterCinemaId === null ||
              String(c.cinemaId) === String(filterCinemaId),
          )
          .map((c) => ({
            id: c.cinemaId,
            title: c.cinemaName,
            subtitle: c.cinemaAddress,
            sessions: c.sessions,
          })),
      }))
      .filter((day) => day.items.length > 0);
  }, [daySessions, filterCinemaId]);

  const handleClearFilter = () => setFilterCinemaId(null);

  if (loading) return <Loader />;
  if (!movie) return <div style={{ padding: 40 }}>Movie not found</div>;

  return (
    <div className="movie-details-page">
      <MovieInfo movie={movie} />
      {filterCinemaId && (
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={handleClearFilter}
            style={{
              background: "transparent",
              border: "1px solid #fff",
              color: "#fff",
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Показать все кинотеатры
          </button>
        </div>
      )}
      <SessionsList data={sessionsData} onSessionClick={handleSessionClick} />
    </div>
  );
};

export default MovieSessionsPage;
