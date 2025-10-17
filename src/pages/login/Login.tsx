import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { loginUser } from '../../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      const result = await loginUser({ email, password });
      setMessage(result.message || 'Inicio de sesión exitoso ✅');
      setTimeout(() => navigate('/'), 1000); // redirige a Home
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Error al iniciar sesión.');
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
          <button type="button" className="link-button" onClick={() => navigate('/signup')}>
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
