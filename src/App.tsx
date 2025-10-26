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

const ProtectedRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return <div>Cargando sesión...</div>
  }

  return isAuthenticated ? element : <Navigate to="/login" replace/>;
}

const PublicRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return <div>Cargando sesión...</div>
  }

  return !isAuthenticated ? element : <Navigate to="/home" replace/>;
}

const App: FC = () => {
  const { isAuthenticated } = useAuth();

  // Si aún está verificando la autenticación, muestra loading
  if (isAuthenticated === undefined) {
    return <div>Cargando aplicación...</div>;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* RUTA RAIZ - comportamiento directo */}
          <Route path="/" element={
            isAuthenticated ? <Home /> : <Landing />
          } />
          
          {/* RUTAS PÚBLICAS */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Login />
          } />
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Signup />
          } />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* RUTAS PROTEGIDAS */}
          <Route path="/home" element={
            isAuthenticated ? <Home /> : <Navigate to="/login" replace />
          } />
          <Route path="/profile" element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
          } />

          {/* Redirección por defecto */}
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