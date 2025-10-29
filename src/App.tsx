import type { FC, JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/authContext";

// Páginas
import Home from "./pages/home/Home";
import AboutUs from "./pages/about/AboutUs";
import Login from "./pages/login/Login";
import Signup from "./pages/signup";
import Profile from "./pages/profile/Profile";
import Sitemap from "./pages/sitemap/Sitemap";
import ResetPassword from "./pages/change-password/ResetPassword";
import ForgotPassword from "./pages/change-password/ForgotPassword";
import Landing from "./pages/landing/Landing";

// Comunes
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./App.scss";

interface ProtectedRouteProps { element: JSX.Element; }
const ProtectedRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuth, loading } = useAuth();
  if (loading || isAuth === null) {
    return <div style={{ padding: 16 }}>Cargando sesión...</div>;
  }
  return isAuth ? element : <Navigate to="/login" replace />;
};

const App: FC = () => {
  const { isAuth, loading } = useAuth();

  return (
    <div className="app-container">
      <Navbar />

      <Routes>
        {/* "/" debe decidirse una vez que sepamos isAuth */}
        <Route
          index
          element={
            loading || isAuth === null
              ? <div style={{ padding: 16 }}>Cargando sesión...</div>
              : isAuth
                ? <Navigate to="/home" replace />
                : <Landing />
          }
        />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/sitemap" element={<Sitemap />} />

        {/* Auth públicas */}
        <Route path="/login" element={isAuth ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/signup" element={isAuth ? <Navigate to="/home" replace /> : <Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protegidas */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
