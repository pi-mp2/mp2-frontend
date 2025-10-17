import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { loginUser } from '../../services/authService';

/**
 * Login component - allows a user to log in.
 */
const Login: React.FC = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validación simple
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      // Llama al servicio de autenticación
      const result = await loginUser({ email, password });

      // Muestra mensaje y redirige
      setMessage(result.message || 'Inicio de sesión exitoso ✅');

      // Redirige al home luego de 1 segundo
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al iniciar sesión.');
      }
    }
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
