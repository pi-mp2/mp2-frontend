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
    <div className="home">
      {/* 🔹 Heurística 1: Mostrar visibilidad del estado del sistema */}
      {isAuthenticated ? (
        <p className="user-status">Bienvenido de nuevo</p>
      ) : (
        <p className="user-status">Explora las películas disponibles</p>
      )}

      <section className="home-section">
        <h2 className="section-title">Para ti</h2>
        <MovieCarousel category="recommended" />
      </section>

      <section className="home-section">
        <h2 className="section-title">Más recientes</h2>
        <MovieCarousel category="latest" />
      </section>
    </div>
  );
}
