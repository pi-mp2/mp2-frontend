import React from 'react';
import "./MovieCarousel.scss";

interface Props {
  title: string;
  image: string;
  onClick?: () => void; // nueva prop
}

const MovieCard: React.FC<Props> = ({ title, image, onClick }) => {
  return (
    <div className="movie-card" onClick={onClick}>
      <img
        src={image}
        alt={`Poster de ${title}`}
        className="movie-card__image"
      />
      <h3 className="movie-card__title">{title}</h3>
    </div>
  );
};

export default MovieCard;
