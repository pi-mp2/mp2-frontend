import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import logo from "../assets/logo.jpeg";
import "./Navbar.scss";

export default function NavbarAuth() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/home" className="navbar__brand" aria-label="Ir a inicio">
          <img src={logo} alt="Logo" className="brand__logo" />
          <span className="brand__name">Movie Star</span>
        </NavLink>

        <nav className="navbar__links">
          <NavLink to="/home" end className="navlink">
            Inicio
          </NavLink>
          <NavLink to="/profile" className="navlink">
            Perfil
          </NavLink>
          {user && <span className="navlink navlink--user">{user.email}</span>}
          <button onClick={handleLogout} className="navlink navlink--button">
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}
