import React, { FC } from "react";
import { IMovie } from "../../../../types/AppTypes";
import "../../../../assets/css/movies/movieSessionPage.scss";
import MoviePoster from "./MoviePoster";
import MovieRating from "./MovieRating";

interface MovieInfoProps {
  movie: IMovie;
}

const MovieInfo: FC<MovieInfoProps> = ({ movie }) => {
  return (
    <div className="movie-header">
      <div className="poster-container">
        <MoviePoster
          src={movie.posterImage}
          alt={movie.title}
          className="placeholder"
        />
      </div>
      <div className="info-container">
        <h1>{movie.title}</h1>
        <p>{movie.description}</p>
        <div className="meta">
          <span>Год: {movie.year}</span>
          <span>Продолжительность: {movie.lengthMinutes} мин</span>
          <span>Продолжительность: {movie.lengthMinutes} мин</span>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <span>Рейтинг:</span>
            <MovieRating rating={movie.rating} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
