import React, { useEffect, type FC, type JSX } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import AboutUs from './pages/about/AboutUs';
import Login from './pages/login/Login';
import Signup from './pages/signup';
import Sitemap from './pages/sitemap/Sitemap';
import ResetPassword from './pages/change-password/ResetPassword';
import ForgotPassword from './pages/change-password/ForgotPassword';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/landing/Landing';
import './App.scss';

/** Demo de ruta protegida basada en localStorage (visual-only) */
interface ProtectedRouteProps { element: JSX.Element; }
const ProtectedRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" replace />;
};

const App: FC = () => {
  useEffect(() => {
    localStorage.getItem('token'); // placeholder
  }, []);

  return (
    <div className="app-container">
        <Routes>
          {/* 🔹 TODAS las rutas que deben mostrar el Navbar usan MainLayout */}
          <Route element={<MainLayout />}>
            <Route index element={<Landing />} /> {/* "/" */}
            <Route path="about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="dashboard" element={<ProtectedRoute element={<Home />} />} />
          </Route>
          {/* 🔹 Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  );
};

export default App;
