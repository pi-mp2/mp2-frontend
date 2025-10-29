import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import MovieCarousel from "../../components/main-components/MovieCarousel";
import { checkAuthStatus } from "../../services/authService";
import axiosClient from "../../services/axiosClient";

interface Movie {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

import type { JSX } from "react";

export default function Home(): JSX.Element {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userMovies, setUserMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        // ✅ Verificar si el token/cookie es válido
        await checkAuthStatus();
        setIsAuthenticated(true);

        // 🎬 Cargar las películas del usuario autenticado
        const { data } = await axiosClient.get<Movie[]>("/movies/my");
        setUserMovies(data);
      } catch (err: any) {
        console.error("❌ Error verificando sesión o cargando películas:", err?.message || err);
        setIsAuthenticated(false);
        // Redirige limpio si no hay sesión
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, [navigate]);

  if (loading) return <p>Cargando...</p>;

  return (
    <main className="home" aria-label="Página principal de películas">
      {isAuthenticated ? (
        <p className="user-status" role="status">
          Bienvenido de nuevo 👋
        </p>
      ) : (
        <p className="user-status" role="status">
          Explora las películas disponibles
        </p>
      )}

      {isAuthenticated && userMovies.length > 0 && (
        <section className="home-section" aria-labelledby="user-movies-title">
          <h2 id="user-movies-title" className="section-title">
            Tus películas
          </h2>
          <MovieCarousel category="user" movies={userMovies} />
        </section>
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
