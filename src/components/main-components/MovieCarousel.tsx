import React, { useRef } from "react";
import "./MovieCarousel.scss";
import MovieCard from "./MovieCard";
import type {Movie} from "../../services/moviesService";

interface Props {
    category: "recommended" | "latest";
    movies: Movie[];
}

const MovieCarousel: React.FC<Props> = ({ category }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
        }
    };

    const movies = Array.from({ length: 10 }, (_, i) => ({
        id: `${category}-${i + 1}`,
        title: `${category === "recommended" ? "Película Recomendada" : "Película Reciente"} ${i + 1}`,
        posterUrl: "https://via.placeholder.com/150x225?text=Poster",
    }));

    return (
        <div className="movie-carousel">
            <button className="scroll-button left" onClick={() => scroll("left")} aria-label="Desplazar a la izquierda">
                &#8249;
            </button>
            <div className="carousel-container" ref={scrollRef}>
                {movies.map((movie) => (
                    <MovieCard key={movie.id} title={movie.title} image={movie.posterUrl} />
                ))}
            </div>
            <button className="scroll-button right" onClick={() => scroll("right")} aria-label="Desplazar a la derecha">
                &#8250;
            </button>
        </div>
    );
};

export default MovieCarousel;