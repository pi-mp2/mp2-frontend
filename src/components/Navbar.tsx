import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import logo from "../assets/logo.jpeg";
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
        <Link to="/" className="navbar__brand" aria-label="Ir a inicio">
          <img
            src={logo}
            alt="Logo de Movie Star"
            className="brand__logo" //
          />
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

              {/* Mostrar el correo del usuario si existe*/}
              {user && (
                <span className="navlink navlink--user">
                  {user.email}
                </span>
              )}
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
