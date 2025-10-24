import React from "react";
import "./MovieModal.scss";

interface MovieModalProps {
  movie: {
    title: string;
    posterUrl: string;
    description?: string;
  };
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  return (
    <div className="movie-modal__overlay" onClick={onClose}>
      <div className="movie-modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="movie-modal__close" onClick={onClose}>
          ✖
        </button>
        <img src={movie.posterUrl} alt={movie.title} className="movie-modal__image" />
        <h2>{movie.title}</h2>
        <p>{movie.description || "Sin descripción disponible."}</p>
      </div>
    </div>
  );
};

export default MovieModal;
