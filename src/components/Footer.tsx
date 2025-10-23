import { Link } from 'react-router-dom';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 Movie Star. Todos los derechos reservados. <Link to="/sitemap">Mapa del sitio</Link></p>
      </div>
    </footer>
  );
}
