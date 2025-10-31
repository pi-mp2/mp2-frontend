import type { FC, JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/authContext";

import Home from "./pages/home/Home";
import AboutUs from "./pages/about/AboutUs";
import Login from "./pages/login/Login";
import Signup from "./pages/signup";
import Profile from "./pages/profile/Profile";
import Sitemap from "./pages/sitemap/Sitemap";
import ResetPassword from "./pages/change-password/ResetPassword";
import ForgotPassword from "./pages/change-password/ForgotPassword";
import Landing from "./pages/landing/Landing";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.scss";

const ProtectedRoute: FC<{ element: JSX.Element }> = ({ element }) => {
  const { isAuth, loading } = useAuth();
  if (loading || isAuth === undefined) return <div style={{ padding: 16 }}>Cargando sesión…</div>;
  return isAuth ? element : <Navigate to="/login" replace />;
};

const App: FC = () => {
  const { isAuth, loading } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        {/* Raíz: mientras carga, no decidas; luego, redirige si está logeado */}
        <Route
          index
          element={
            loading ? (
              <div style={{ padding: 16 }}>Cargando sesión…</div>
            ) : isAuth ? (
              <Navigate to="/home" replace />
            ) : (
              <Landing />
            )
          }
        />

        {/* públicas */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/login" element={isAuth ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* protegidas */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
