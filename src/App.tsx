import React, { type FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import Landing from './pages/landing/Landing';
import './App.scss';

interface ProtectedRouteProps { 
  element: JSX.Element; 
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return <div>Cargando sesión...</div>
  }

  return isAuthenticated ? element : <Navigate to="/login" replace/>;
}

export const PublicRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return <div>Cargando sesión...</div>
  }

  // Si el usuario está autenticado, redirigir al home
  return !isAuthenticated ? element : <Navigate to="/home" replace/>;
}

const App: FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* 🔹 RUTAS PÚBLICAS (solo para usuarios NO autenticados) */}
          <Route path="/" element={
            <PublicRoute element={<Landing />} />
          } />
          <Route path="/login" element={
            <PublicRoute element={<Login />} />
          } />
          <Route path="/signup" element={
            <PublicRoute element={<Signup />} />
          } />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* 🔹 RUTAS PROTEGIDAS (solo para usuarios autenticados) */}
          <Route path="/home" element={
            <ProtectedRoute element={<Home />} />
          } />
          <Route path="/profile" element={
            <ProtectedRoute element={<Profile />} />
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute element={<Home />} />
          } />

          {/* 🔹 Redirección por defecto */}
          <Route path="*" element={
            <Navigate to={isAuthenticated ? "/home" : "/"} replace />
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;