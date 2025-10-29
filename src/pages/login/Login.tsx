import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, checkAuthStatus } from "../../services/authService";
import { useAuth } from "../../contexts/authContext";
import "./Login.scss";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      // 1) Login
      const resp = await loginUser({ email, password });
      console.log("Login response:", resp);

      // 2) Intentar extraer token/user de la respuesta
      const token =
        resp?.data?.token ?? resp?.token ?? resp?.accessToken ?? null;
      const user =
        resp?.data?.user ?? resp?.user ?? null;

      if (token || user) {
        // ✅ Backend devuelve token y/o user en el login
        login({ token: token ?? undefined, user: user ?? undefined });
      } else {
        // ✅ Backend NO devuelve datos; usa cookie httpOnly -> verificar sesión
        const verify = await checkAuthStatus(); // GET /auth/verify (con credenciales)
        const vToken =
          verify?.data?.token ?? verify?.token ?? null;
        const vUser =
          verify?.data?.user ?? verify?.user ?? null;

        if (!vUser && !vToken) {
          throw new Error("No se pudo validar la sesión después de iniciar.");
        }
        login({ token: vToken ?? undefined, user: vUser ?? undefined });
      }

      setMessage("Inicio de sesión exitoso. Redirigiendo...");
      navigate("/home", { replace: true });
    } catch (err: any) {
      setError(err?.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="login-form" autoComplete="off" aria-label="Formulario de inicio de sesión">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login-extras">
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/forgot-password")}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
        </form>

        <p className="signup-redirect">
          ¿No tienes una cuenta?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/signup")}
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
