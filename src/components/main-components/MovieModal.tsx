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
    // Heurística 2: Control y libertad del usuario (puede cerrar el modal haciendo clic fuera o en la X)
    <div className="movie-modal__overlay" onClick={onClose}>
      <div
        className="movie-modal__content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="movie-title"
        aria-modal="true"
      >
        {/* Heurística 1: Visibilidad del estado del sistema → botón visible para cerrar */}
        <button
          className="movie-modal__close"
          onClick={onClose}
          aria-label="Cerrar detalle de la película"
        >
          ×
        </button>

        {/* Heurística 4: Consistencia y estándares → estructura visual coherente */}
        <img
          src={movie.posterUrl}
          alt={`Póster de ${movie.title}`}
          className="movie-modal__image"
        />

        {/* Heurística 6: Reconocer antes que recordar → título claro y visible */}
        <h2 id="movie-title">{movie.title}</h2>

        {/* Heurística 5: Ayuda y documentación → mensaje útil si no hay descripción */}
        <p>{movie.description || "Sin descripción disponible."}</p>
      </div>
    </div>
  );
};

export default MovieModal;
