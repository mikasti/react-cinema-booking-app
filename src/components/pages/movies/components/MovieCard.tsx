import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { IMovie } from "../../../../types/AppTypes";
import "../../../../assets/css/movies/movieCard.scss";
import MoviePoster from "./MoviePoster";
import MovieRating from "./MovieRating";

interface MovieCardProps {
  movie: IMovie;
}

const MovieCard: FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  const handleBookClick = () => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <article className="movie-card">
      <div className="poster-area">
        <MoviePoster
          src={movie.posterImage}
          alt={movie.title}
          className="poster-placeholder"
        />
        <MovieRating rating={movie.rating} className="rating" />
      </div>
      <div className="content-area">
        <h3 className="title">{movie.title}</h3>
        <p className="subtitle">
          {movie.year}, {movie.lengthMinutes} мин
        </p>
        <button className="action-button" onClick={handleBookClick}>
          Сеансы
        </button>
      </div>
    </article>
  );
};

export default MovieCard;
