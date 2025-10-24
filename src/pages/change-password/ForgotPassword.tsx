import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.scss";
import { getSecretQuestion } from "../../services/userService";

/** Versión solo visual (sin llamadas a backend) */
const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const data = await getSecretQuestion(email);
      setSecurityQuestion(data.securityQuestion);
    } catch (error:any) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  const goToReset = () => {
    navigate(`/reset-password?email=${encodeURIComponent(email)}&question=${encodeURIComponent(securityQuestion)}`)
  }

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
          <button type="submit" disabled={loading}>{loading ? "Buscando..." : "Enviar"}</button>
          {err && <p className="error-message">{err}</p>}
        </form>

        {securityQuestion && (
          <div className="auth-question">
            <p><strong>Pregunta secreta:</strong> {securityQuestion}</p>
            <button onClick={goToReset}>Responder y cambiar contraseña</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
