// src/components/main-components/MovieCarousel.tsx
import React, { useRef, useState } from "react";
import "./MovieCarousel.scss";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

interface MovieLike {
  _id?: string;
  id?: string | number;
  title: string;
  imageUrl?: string;
  posterUrl?: string;
  description?: string;
}

interface Props {
  category: "recommended" | "latest" | "user";
  movies?: MovieLike[];
}

const MovieCarousel: React.FC<Props> = ({ category, movies }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieLike | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const next =
      direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
    scrollRef.current.scrollTo({ left: next, behavior: "smooth" });
  };

  // Si Home pasó películas del usuario, úsalas; si no, crea mock
  const moviesToShow: MovieLike[] =
    category === "user"
      ? movies || []
      : Array.from({ length: 10 }, (_, i) => ({
          id: `${category}-${i + 1}`,
          title: `${
            category === "recommended" ? "Película Recomendada" : "Película Reciente"
          } ${i + 1}`,
          posterUrl: `https://placehold.co/150x225?text=Poster+${i + 1}`,
          description: "Una breve descripción de la película para mostrar en el modal.",
        }));

  return (
    <>
      <div className="movie-carousel">
        <button
          className="scroll-button left"
          onClick={() => scroll("left")}
          aria-label="Desplazar a la izquierda"
        >
          &#8249;
        </button>

        <div className="carousel-container" ref={scrollRef}>
          {moviesToShow.map((movie, idx) => {
            const image =
              (movie.imageUrl && movie.imageUrl.trim()) ||
              (movie.posterUrl && movie.posterUrl.trim()) ||
              `https://placehold.co/150x225?text=Poster+${idx + 1}`;

            const key = movie._id ?? movie.id ?? `${category}-${idx}`;

            return (
              <MovieCard
                key={key}
                title={movie.title}
                image={image}
                onClick={() => setSelectedMovie(movie)}
              />
            );
          })}
        </div>

        <button
          className="scroll-button right"
          onClick={() => scroll("right")}
          aria-label="Desplazar a la derecha"
        >
          &#8250;
        </button>
      </div>

      {/* ✅ MovieModal con tipado correcto */}
      {selectedMovie && (
        <MovieModal
          movie={{
            title: selectedMovie.title,
            posterUrl:
              selectedMovie.posterUrl ||
              selectedMovie.imageUrl ||
              "https://placehold.co/150x225?text=Poster",
            description: selectedMovie.description,
          }}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
};

export default MovieCarousel;
