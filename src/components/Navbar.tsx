import { Link, NavLink } from "react-router-dom";
import "./Navbar.scss";
import logo from "../assets/logo.jpeg"; //
import type { JSX } from "react";

export default function Navbar(): JSX.Element {
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
          <NavLink to="/" end className="navlink">
            Inicio
          </NavLink>
          <NavLink to="/login" className="navlink">
            Iniciar sesión
          </NavLink>
          <NavLink to="/signup" className="navlink navlink--outlined">
            Registrarse
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
