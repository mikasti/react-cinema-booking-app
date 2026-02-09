import React, { useEffect, useState } from "react";
import { IMovie } from "../../../types/AppTypes";
import { cinemaApi } from "../../../api/cinemaApi";
import Loader from "../../common/Loader";
import MovieCard from "./components/MovieCard";
import "../../../assets/css/movies/moviesPage.scss";

const MoviesPage = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cinemaApi
      .getMovies()
      .then(setMovies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="movies-section">
      <div className="movies-flex-container">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
