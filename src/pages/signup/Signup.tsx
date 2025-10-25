import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.scss';
import { registerUser, type RegisterData } from '../../services/userService';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    age: 0,
    email: '',
    password: '',
    securityQuestion: '',
    securityAnswer: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'age'
          ? value === '' ? 0 : parseInt(value, 10) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { firstName, lastName, age, email, password } = formData;

    // 🔹 Heurística 5: Prevención de errores
    if (!firstName || !lastName || !email || !password || age <= 0) {
      setError('Por favor completa todos los campos correctamente.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const result = await registerUser(formData);
      setMessage(result.message || 'Registro exitoso');

      setFormData({
        firstName: '',
        lastName: '',
        age: 0,
        email: '',
        password: '',
        securityQuestion: '',
        securityAnswer: '',
      });

      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el usuario.');
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Apellidos"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Edad"
            value={formData.age === 0 ? '' : String(formData.age)}
            onChange={handleChange}
            min="1"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            name="securityQuestion"
            value={formData.securityQuestion}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una pregunta secreta</option>
            <option value="¿Cuál es el nombre de tu primera mascota?">¿Cuál es el nombre de tu primera mascota?</option>
            <option value="¿Cuál es el nombre de la calle donde creciste?">¿Cuál es el nombre de la calle donde creciste?</option>
            <option value="¿Cuál es el nombre de tu mejor amigo de la infancia?">¿Cuál es el nombre de tu mejor amigo de la infancia?</option>
          </select>

          <input
            name="securityAnswer"
            placeholder="Tu respuesta secreta"
            value={formData.securityAnswer}
            onChange={handleChange}
            required
          />

          <button type="submit">Registrarse</button>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
        </form>

        <p className="login-link">
          ¿Ya tienes una cuenta?{' '}
          <button className="link-button" type="button" onClick={() => navigate('/login')}>
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
