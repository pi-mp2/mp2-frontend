import React, { useEffect, type FC, type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import AboutUs from './pages/about/AboutUs';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import MainLayout from './layouts/MainLayout';
import './App.scss';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" replace />;
};

const App: FC = () => {
  useEffect(() => {
    localStorage.getItem('token');
  }, []);

  return (
    <div className="app-container">
      <Router>
        <Routes>
          {/* 🔹 TODAS las rutas que deben mostrar el Navbar usan MainLayout */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} /> {/* "/" */}
            <Route path="about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="dashboard" element={<ProtectedRoute element={<Home />} />} />
          </Route>
          {/* 🔹 Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
