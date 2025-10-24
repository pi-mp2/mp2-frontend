import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ResetPassword.scss";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const token = sp.get("token") || "demo";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!password || password.length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setErr("Las contraseñas no coinciden.");
      return;
    }

    // Solo visual: muestra mensaje y redirige al login
    setMsg(`Contraseña actualizada (token: ${token}).`);
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Restablecer contraseña</h2>
        <form onSubmit={onSubmit} className="auth-form">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit">Guardar contraseña</button>

          {err && <p className="error-message">{err}</p>}
          {msg && <p className="success-message">{msg}</p>}
        </form>

        <p className="auth-link">
          ¿Tienes cuenta?{" "}
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

export default ResetPassword;
