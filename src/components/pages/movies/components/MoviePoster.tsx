import React, { FC } from "react";
import { API_BASE_URL } from "../../../../api/apiConstants";

interface MoviePosterProps {
  src: string | null;
  alt: string;
  className?: string;
}

const MoviePoster: FC<MoviePosterProps> = ({ src, alt, className = "" }) => {
  if (src) {
    const fullSrc = src.startsWith("/") ? `${API_BASE_URL}${src}` : src;
    return <img src={fullSrc} alt={alt} className={className} />;
  }
  return <div className={className}>Пока нет постера</div>;
};

export default MoviePoster;
