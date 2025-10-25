import React, { useState, useEffect } from "react";
import "./Home.scss";
import MovieCarousel from "../../components/main-components/MovieCarousel";

interface Movie {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export default function Home(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userMovies, setUserMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    // ✅ Verificar si el usuario tiene sesión activa
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/verify`, {
          method: "GET",
          credentials: "include", // 🔥 permite enviar la cookie HTTP-only
        });

        if (res.ok) {
          setIsAuthenticated(true);
          await fetchUserMovies(); // Cargamos películas del usuario
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error verificando sesión:", err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // 🎬 Obtener las películas subidas por el usuario autenticado
    const fetchUserMovies = async () => {
      try {
        const res = await fetch(`${API_URL}/api/movies/my`, {
          method: "GET",
          credentials: "include", // importante para mantener la sesión
        });

        if (!res.ok) throw new Error("Error al obtener las películas");
        const data = await res.json();
        setUserMovies(data);
      } catch (err) {
        console.error("Error al cargar películas del usuario:", err);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <main className="home" aria-label="Página principal de películas">
      {/* Estado de sesión */}
      {isAuthenticated ? (
        <p className="user-status" role="status">
          Bienvenido de nuevo 👋
        </p>
      ) : (
        <p className="user-status" role="status">
          Explora las películas disponibles
        </p>
      )}

      {/* 🔹 Carrusel con las películas del usuario */}
      {isAuthenticated && userMovies.length > 0 && (
        <section className="home-section" aria-labelledby="user-movies-title">
          <h2 id="user-movies-title" className="section-title">
            Tus películas
          </h2>
          <MovieCarousel category="user" movies={userMovies} />
        </section>
      )}

      {/* Carruseles generales */}
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