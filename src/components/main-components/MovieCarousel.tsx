import React, { useRef, useState } from "react";
import "./MovieCarousel.scss";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

interface Props {
  category: "recommended" | "latest" | "user";
  movies?: any[]; // cuando category = "user"
}

const MovieCarousel: React.FC<Props> = ({ category, movies }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Si el padre (Home) pasó películas del usuario, úsalas
  const moviesToShow =
    category === "user"
      ? movies || []
      : Array.from({ length: 10 }, (_, i) => ({
          id: `${category}-${i + 1}`,
          title: `${
            category === "recommended" ? "Película Recomendada" : "Película Reciente"
          } ${i + 1}`,
          posterUrl: "https://via.placeholder.com/150x225?text=Poster",
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
          {moviesToShow.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              image={movie.posterUrl || movie.imageUrl}
              onClick={() => setSelectedMovie(movie)}
            />
          ))}
        </div>

        <button
          className="scroll-button right"
          onClick={() => scroll("right")}
          aria-label="Desplazar a la derecha"
        >
          &#8250;
        </button>
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
};

export default MovieCarousel;