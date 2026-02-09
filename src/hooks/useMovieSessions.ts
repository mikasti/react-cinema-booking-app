import { useEffect, useState } from "react";
import {
  CinemaWithSessions,
  DaySessions,
  ICinema,
  IMovieSession,
} from "../types/AppTypes";
import { cinemaApi } from "../api/cinemaApi";
import { formatDate } from "../utils/dateUtils";

export const useMovieSessions = (movieId?: string) => {
  const [daySessions, setDaySessions] = useState<DaySessions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) return;
      try {
        setLoading(true);
        const [cinemasData, sessionsData] = await Promise.all([
          cinemaApi.getCinemas(),
          cinemaApi.getMovieSessions(Number(movieId)),
        ]);

        const cinemaMap = new Map<number, ICinema>();
        cinemasData.forEach((c) => cinemaMap.set(c.id, c));

        const sessionsByDate: Record<string, IMovieSession[]> = {};
        sessionsData.forEach((session) => {
          const dateStr = formatDate(session.startTime);
          if (!sessionsByDate[dateStr]) {
            sessionsByDate[dateStr] = [];
          }
          sessionsByDate[dateStr].push(session);
        });

        const daySessions: DaySessions[] = Object.entries(sessionsByDate).map(
          ([date, dateSessions]) => {
            const groupedByCinema: Record<number, IMovieSession[]> = {};
            dateSessions.forEach((session) => {
              if (!groupedByCinema[session.cinemaId]) {
                groupedByCinema[session.cinemaId] = [];
              }
              groupedByCinema[session.cinemaId].push(session);
            });

            const cinemasWithSessions: CinemaWithSessions[] = Object.entries(
              groupedByCinema,
            ).map(([cinemaIdStr, sessions]) => {
              const cinemaId = Number(cinemaIdStr);
              sessions.sort(
                (a, b) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime(),
              );
              const cinema = cinemaMap.get(cinemaId);

              return {
                cinemaName: cinema?.name || "Unknown Cinema",
                cinemaId,
                cinemaAddress: cinema?.address || "",
                sessions,
              };
            });

            return {
              date,
              cinemas: cinemasWithSessions,
            };
          },
        );

        setDaySessions(daySessions);
      } catch (err) {
        console.error("Failed to fetch movie details", err);
        setError("Failed to fetch movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  return { daySessions, loading, error };
};
