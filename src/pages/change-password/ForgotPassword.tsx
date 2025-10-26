import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.scss";
import { getSecretQuestion } from "../../services/userService";

/** Versión solo visual (sin llamadas a backend) */
const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "question">("email");

  /* Paso 1: obtener pregunta secreta */
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const data = await getSecretQuestion(email);
      setSecurityQuestion(data.securityQuestion);
      setStep("question");
    } catch (error: any) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/forgot-password/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, securityAnswer }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error (data.message || "Respuesta incorrecta");

      navigate(`/reset-password?token=${encodeURIComponent(email)}&answer=${encodeURIComponent(securityAnswer)}`);
    } catch(error: any) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Recuperar contraseña</h2>

        {/* Paso 1: ingresar correo*/}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>{loading ? "Buscando..." : "Enviar"}</button>
          {err && <p className="error-message">{err}</p>}
        </form>)}

        {/* Paso 2: Responder pregunta secreta*/}
        {step === "question" && (
          <form onSubmit={handleAnswerSubmit} className="auth-form">
            <p><strong>Pregunta secreta:</strong> {securityQuestion}</p>
            <input
              type="password"
              placeholder="Tu respuesta secreta"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verificando..." : "Verificar respuesta"}
            </button>
            {err && <p className="error-message">{err}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
