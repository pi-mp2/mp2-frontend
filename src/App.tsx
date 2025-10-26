import React, { type FC, type JSX } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import PublicLayout from './layouts/PublicLayOut';
import PrivateLayout from './layouts/PrivateLayOut';
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
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

const App: FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div>Cargando aplicación...</div>;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* 🔓 Rutas públicas */}
          <Route element={<PublicLayout />}>
            <Route index element={<Landing />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/sitemap" element={<Sitemap />} />
          </Route>
          
          {/* 🔐 Rutas privadas */}
          <Route element={<PrivateLayout />}>
            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          </Route>
          
          {/* 🔁 Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;