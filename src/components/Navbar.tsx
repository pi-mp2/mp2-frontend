import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logoutUser } from "../services/authService";
import "./Navbar.scss";

/**
 * Navbar reactiva y dinámica.
 * - Cambia los enlaces según el estado de autenticación.
 * - Colapsa en móvil con menú hamburguesa.
 */
export default function Navbar(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    navigate("/login");
  };


  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__brand" aria-label="Ir a inicio">
          <span className="brand__logo">MS</span>
          <span className="brand__name">Movie Star</span>
        </Link>

        {/* Menú hamburguesa para móvil */}
        <button
          className={`navbar__toggle ${menuOpen ? "is-active" : ""}`}
          onClick={toggleMenu}
          aria-label="Alternar menú de navegación"
          >
          <span className="toggle__bar"></span>
          <span className="toggle__bar"></span>
          <span className="toggle__bar"></span>
        </button>

        {/* Enlaces de navegación */}
        <nav
          className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}
          arial-label="Navegación principal"
          >
            <NavLink to="/" onClick={closeMenu}>Inicio</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" onClick={closeMenu}>Perfil</NavLink>
                <button className="logout-button" onClick={() => { closeMenu(); handleLogout(); }}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu}>Iniciar sesión</NavLink>
                <NavLink to="/register" onClick={closeMenu}>Registrarse</NavLink>
              </>
            )}
          </nav>
      </div>
    </header>
  );
}
