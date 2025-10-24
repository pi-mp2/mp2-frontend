import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "../services/authContext"; // hook del contexto
import "./Navbar.scss";

export default function Navbar(): JSX.Element {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to={isAuthenticated ? "/home" : "/"} className="navbar__brand" aria-label="Ir a inicio">
          <span className="brand__logo">🎬</span>
          <span className="brand__name">Movie Star</span>
        </Link>

        <nav className="navbar__links" aria-label="Navegación principal">
          {isAuthenticated ? (
            <>
              <NavLink to="/home" end className="navlink">
                Inicio
              </NavLink>
              <NavLink to="/profile" className="navlink">
                Perfil
              </NavLink>
              <button onClick={handleLogout} className="navlink navlink--button">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" end className="navlink">
                Inicio
              </NavLink>
              <NavLink to="/login" className="navlink">
                Iniciar sesión
              </NavLink>
              <NavLink to="/signup" className="navlink navlink--outlined">
                Registrarse
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
