import { Link } from 'react-router-dom';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>Movie Star</h3>
        <nav className="footer-nav">
          <Link to="/">Inicio</Link>
          <Link to="/about">Sobre Nosotros</Link>
          <Link to="/login">Iniciar Sesión</Link>
          <Link to="/signup">Registrarse</Link>
        </nav>
        <p>© 2025 Movie Star. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
