import { Link, NavLink } from "react-router-dom";
import "./Navbar.scss";

/**
 * Navbar SOLO visual (sin autenticación).
 * - Muestra Inicio / Iniciar sesión / Registrarse siempre.
 * - No importa ni usa AuthContext.
 */
export default function Navbar(): JSX.Element {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Ir a inicio">
          <span className="brand__logo">MS</span>
          <span className="brand__name">Movie Star</span>
        </Link>

        <nav className="navbar__links" aria-label="Navegación principal">
          <NavLink to="/" end className="navlink">Inicio</NavLink>
          <NavLink to="/login" className="navlink">Iniciar sesión</NavLink>
          <NavLink to="/signup" className="navlink navlink--outlined">Registrarse</NavLink>
        </nav>
      </div>
    </header>
  );
}
