import React from 'react';
import './Sitemap.scss';

interface RouteItem {
  name: string;
  path: string;
}

const routes: RouteItem[] = [
  { name: 'Sobre nosotros', path: '/about' },
  { name: 'Inicio', path: '/home' },
  { name: 'Iniciar sesión', path: '/login' },
  { name: 'Registrarse', path: '/signup' },
  { name: 'Perfil', path: '/profile' },
  { name: 'Recuperar contraseña', path: '/reset-password' },
  { name: 'Mapa del sitio', path: '/sitemap' },
  { name: 'Tareas', path: '/taskList' },
];

const Sitemap: React.FC = () => {
  return (
    <div className="sitemap-wrapper">
      <div className="sitemap-container">
        <h2>Mapa del Sitio</h2>
        <p className="subtitle">
          Listado de todas las rutas indexadas en el sitemap.xml
        </p>

        <ul className="route-list">
          {routes.map((route) => (
            <li key={route.path}>
              <a href={route.path}>{route.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sitemap;
