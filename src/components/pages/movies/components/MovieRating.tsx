import React, { FC } from "react";

interface MovieRatingProps {
  rating: number;
  className?: string;
}

const MovieRating: FC<MovieRatingProps> = ({ rating, className = "" }) => {
  return <span className={className}>{rating.toFixed(1)}</span>;
};

export default MovieRating;
