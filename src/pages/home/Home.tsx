import React, { useState, useEffect } from "react";
import "./Home.scss";
import MovieCarousel from "../../components/main-components/MovieCarousel";
import {getMovies} from "../../services/moviesService"
import type { Movie } from "../../services/moviesService";

export default function Home(): JSX.Element {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchMovies = async () =>{
      try {
        const allMovies = await getMovies();

        const recommended = allMovies.slice(0,10);
        const latest = allMovies.slice(-10).reverse();

        setRecommendedMovies(recommended);
        setLatestMovies(latest);
      } catch (err) {
        console.error("Error al cargar películas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p>Cargando películas...</p>;

  return (
    <div className="home">
      <section className="home-section">
        <h2 className="section-title">Para ti</h2>
        <MovieCarousel category="recommended" movies= {recommendedMovies} />
      </section>

      <section className="home-section">
        <h2 className="section-title">Más recientes</h2>
        <MovieCarousel category="latest" movies= {latestMovies} />
      </section>
    </div>
  );
}
