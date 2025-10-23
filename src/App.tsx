import React, { useEffect, type FC, type JSX } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


import ResetPassword from './pages/login/ResetPassword';
import ForgotPassword from './pages/login/ForgotPassword';
import MainLayout from './layouts/MainLayout';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import AboutUs from './pages/about/AboutUs';
import Sitemap from './pages/sitemap/Sitemap';

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
        {/* Todas las vistas con Navbar dentro del layout */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />           {/* "/" */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="sitemap" element={<Sitemap />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="dashboard" element={<ProtectedRoute element={<Home />} />} />
        </Route>

        {/* 404 -> redirige a inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
