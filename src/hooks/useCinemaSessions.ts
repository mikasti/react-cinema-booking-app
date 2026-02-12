import { useEffect, useState } from "react";
import { cinemaApi } from "../api/cinemaApi";
import { ICinema, IMovie, IMovieSession } from "../types/AppTypes";
import { formatDate } from "../utils/dateUtils";

interface DayCinemaSessions {
  date: string;
  movies: {
    movie: IMovie;
    sessions: IMovieSession[];
  }[];
}

export const useCinemaSessions = (cinemaId?: string) => {
  const [cinema, setCinema] = useState<ICinema | null>(null);
  const [daySessions, setDaySessions] = useState<DayCinemaSessions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!cinemaId) return;
      try {
        setLoading(true);
        const [allMovies, cinemasData, sessionsData] = await Promise.all([
          cinemaApi.getMovies(),
          cinemaApi.getCinemas(),
          cinemaApi.getCinemaSessions(Number(cinemaId)),
        ]);

        const foundCinema = cinemasData.find((c) => c.id === Number(cinemaId));
        setCinema(foundCinema || null);

        const movieMap = new Map<number, IMovie>();
        allMovies.forEach((m) => movieMap.set(m.id, m));

        const sessionsByDate: Record<
          string,
          Record<number, IMovieSession[]>
        > = {};

        sessionsData.forEach((session) => {
          const dateStr = formatDate(session.startTime);
          if (!sessionsByDate[dateStr]) {
            sessionsByDate[dateStr] = {};
          }
          if (!sessionsByDate[dateStr][session.movieId]) {
            sessionsByDate[dateStr][session.movieId] = [];
          }
          sessionsByDate[dateStr][session.movieId].push(session);
        });

        const groupedSessions: DayCinemaSessions[] = Object.entries(
          sessionsByDate,
        ).map(([date, moviesMap]) => {
          const movies = Object.entries(moviesMap).map(
            ([movieIdStr, sessions]) => {
              const movieId = Number(movieIdStr);
              sessions.sort(
                (a, b) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime(),
              );
              return {
                movie:
                  movieMap.get(movieId) || ({ title: "Unknown" } as IMovie),
                sessions,
              };
            },
          );

          return {
            date,
            movies,
          };
        });

        setDaySessions(groupedSessions);
      } catch (err) {
        console.error("Failed to fetch cinema details", err);
        setError("Failed to fetch cinema details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cinemaId]);

  return { cinema, daySessions, loading, error };
};
