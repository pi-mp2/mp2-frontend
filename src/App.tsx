import React, { useEffect, type FC, type JSX } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import Home from './pages/home/Home';
import AboutUs from './pages/about/AboutUs';
import Login from './pages/login/Login';
import Signup from './pages/signup';
import Profile from './pages/profile/Profile';
import Sitemap from './pages/sitemap/Sitemap';
import ResetPassword from './pages/change-password/ResetPassword';
import ForgotPassword from './pages/change-password/ForgotPassword';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import NavbarAuth from './components/NavbarAuth';
//import MainLayout from './layouts/MainLayout';
import Landing from './pages/landing/Landing';
import './App.scss';

/** Demo de ruta protegida basada en localStorage (visual-only) */
interface ProtectedRouteProps { element: JSX.Element; }

export const ProtectedRoute: FC<ProtectedRouteProps> =({ element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return <div>Cargando sesión...</div>
  }

  return isAuthenticated ? element : <Navigate to="/login" replace/>
};

const App: FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Rutas donde se usa el Navbar de usuario autenticado
  const privateRoutes = ["/home", "/about", "/profile"];
  const showAuthNavbar = privateRoutes.some((path) =>
    location.pathname.startsWith(path)
  );
  
  return (
    <div className="app-container">
      {isAuthenticated && showAuthNavbar ? <NavbarAuth /> : <Navbar />}
      <Navbar />          
          <Routes>
            <Route index element={<Landing />} /> {/* "/" */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/sitemap" element={<Sitemap />} />
            {/* Páginas protegidas */}
            <Route
              path="/home"
              element={<ProtectedRoute element={<Home />} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute element={<Profile />} />}
            />
    
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        <Navbar />
    </div>
  );
};

export default App;
