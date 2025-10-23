import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.scss";

/** Versión solo visual (sin llamadas a backend) */
const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!email) {
      setErr("Ingresa tu correo.");
      return;
    }
    // Navegación a Reset Password (mock)
    navigate("/reset-password?token=demo");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Recuperar contraseña</h2>
        <form onSubmit={onSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Enviar instrucciones</button>
          {err && <p className="error-message">{err}</p>}
        </form>

        <p className="auth-link">
          ¿Recordaste tu contraseña?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/login")}
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
