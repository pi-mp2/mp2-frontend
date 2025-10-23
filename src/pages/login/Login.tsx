import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Estados del formulario (visual)
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Modo demo: no llama a ningún servicio ni contexto
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    // Mensaje de éxito “mock” y redirección a Home
    setMessage('Inicio de sesión (demo) ✅');
    setTimeout(() => navigate('/'), 800);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
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

          {/* Enlace demo “¿Olvidaste tu contraseña?” (opcional) */}
          <div className="login-extras">
            <button
              type="button"
              className="link-button"
              onClick={() => navigate('/forgot-password')}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit">Ingresar</button>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
        </form>

        <p className="signup-redirect">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/signup')}
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
