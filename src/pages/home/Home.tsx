import React, { useState, useEffect } from "react";
import "./Home.scss";
import MovieCarousel from "../../components/main-components/MovieCarousel";

export default function Home(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  
  return (
    <main className="home" aria-label="Página principal de películas">
      {/* 🔹 Heurística + accesibilidad: visibilidad del estado del sistema */}
      {isAuthenticated ? (
        <p className="user-status" role="status">
          Bienvenido de nuevo
        </p>
      ) : (
        <p className="user-status" role="status">
          Explora las películas disponibles
        </p>
      )}

      <section className="home-section" aria-labelledby="recommended-title">
        <h2 id="recommended-title" className="section-title">
          Para ti
        </h2>
        <MovieCarousel category="recommended" />
      </section>

      <section className="home-section" aria-labelledby="latest-title">
        <h2 id="latest-title" className="section-title">
          Más recientes
        </h2>
        <MovieCarousel category="latest" />
      </section>
    </main>
  );
}
