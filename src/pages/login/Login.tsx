import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import './Login.scss';
import { useAuth } from '../../contexts/authContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Heurística 3: Prevención de errores → validación antes del envío
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      setLoading(true);
      
      // Usa la función login del contexto en lugar de loginUser directamente
      await login(email, password);
      
      setMessage('Inicio de sesión exitoso. Redirigiendo...');
      
      // Espera un poco para que el contexto se actualice completamente
      setTimeout(() => {
        navigate('/home');
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Iniciar sesión</h2>

        {/* Heurística 6: Reconocer antes que recordar → placeholders claros */}
        <form onSubmit={handleSubmit} className="login-form" autoComplete="off" aria-label="Formulario de inicio de sesión">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {/* Heurística 2: Control y libertad del usuario → opción de recuperar cuenta */}
          <div className="login-extras">
            <button
              type="button"
              className="link-button"
              onClick={() => navigate('/forgot-password')}
              disabled={loading}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>

          {/* Heurística 1: Visibilidad del estado → mensajes claros */}
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
        </form>

        {/* Heurística 4: Consistencia → botones y enlaces similares */}
        <p className="signup-redirect">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/signup')}
            disabled={loading}
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
