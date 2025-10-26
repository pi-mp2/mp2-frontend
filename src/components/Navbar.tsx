import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import logo from "../assets/logo.jpeg";
import "./Navbar.scss";

export default function Navbar(): JSX.Element {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Detectar si estamos en una página privada
  const privateRoutes = ["/home", "/about", "/profile"];
  const isPrivateRoute = privateRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link
          to={isAuthenticated ? "/home" : "/"}
          className="navbar__brand"
          aria-label="Ir a inicio"
        >
          <img src={logo} alt="Logo de Movie Star" className="brand__logo" />
          <span className="brand__name">Movie Star</span>
        </Link>

        <nav className="navbar__links" aria-label="Navegación principal">
          {isAuthenticated && isPrivateRoute ? (
            // Navbar para usuario autenticado (en páginas privadas)
            <>
              <NavLink to="/home" end className="navlink">
                Inicio
              </NavLink>
              <NavLink to="/about" className="navlink">
                Sobre nosotros
              </NavLink>
              <NavLink to="/profile" className="navlink">
                Perfil
              </NavLink>

              {user && (
                <span className="navlink navlink--user">{user.email}</span>
              )}

              <button
                onClick={handleLogout}
                className="navlink navlink--button"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            // 🌐 Navbar para visitantes (no autenticados)
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
