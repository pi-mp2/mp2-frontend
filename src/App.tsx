import React, { useEffect, type FC, type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import './App.scss';

/**
 * Props para la ruta protegida
 */
interface ProtectedRouteProps {
  element: JSX.Element;
}

/**
 * Componente de ruta protegida
 * - Redirige a /login si no hay token
 */
const ProtectedRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" replace />;
};

/**
 * Componente principal de la aplicación Movie Star
 */
const App: FC = () => {
  useEffect(() => {
    // Verificación simple del token (puedes ampliarla si lo deseas)
    localStorage.getItem('token');
  }, []);

  return (
    <div className="app-container">
      <Router>
        <Routes>
          {/* Página principal: bienvenida */}
          <Route path="/" element={<Home />} />

          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Ejemplo de ruta protegida */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Home />} />}
          />

          {/* Redirección para rutas no válidas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
