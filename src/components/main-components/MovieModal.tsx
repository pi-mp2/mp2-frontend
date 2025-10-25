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
    // Heurística 2 + Accesibilidad: Control y libertad del usuario + cierre con clic o teclado
    <div
      className="movie-modal__overlay"
      onClick={onClose}
      role="presentation"
      aria-label="Cerrar ventana modal"
    >
      <div
        className="movie-modal__content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="movie-title"
        aria-describedby="movie-description"
        aria-modal="true"
      >
        {/* Botón visible y accesible */}
        <button
          className="movie-modal__close"
          onClick={onClose}
          aria-label="Cerrar detalle de la película"
        >
          ×
        </button>

        {/* 🔹 Accesibilidad: texto alternativo descriptivo para la imagen */}
        <img
          src={movie.posterUrl}
          alt={`Póster de la película ${movie.title}`}
          className="movie-modal__image"
        />

        <h2 id="movie-title">{movie.title}</h2>

        {/* 🔹 Agregamos id para descripción accesible */}
        <p id="movie-description">{movie.description || "Sin descripción disponible."}</p>
      </div>
    </div>
  );
};

export default MovieModal;
