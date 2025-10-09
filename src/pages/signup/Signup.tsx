import React, { useState } from 'react';
import './Signup.scss';
import { registerUser, type RegisterData } from '../../services/userService';

/**
 * Signup component - allows a new user to register.
 */
const Signup: React.FC = () => {
  // Estado del formulario
  const [formData, setFormData] = useState<RegisterData>({
    nombre: '',
    apellidos: '',
    edad: 0,
    email: '',
    password: '',
  });

  // Estado para mensajes
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Maneja cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'edad' ? Number(value) : value,
    });
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validaciones simples
    if (!formData.nombre || !formData.apellidos || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (formData.edad < 0) {
      setError('La edad no puede ser negativa.');
      return;
    }

    try {
      const result = await registerUser(formData);
      setMessage(result.message || 'Registro exitoso.');
      setFormData({ nombre: '', apellidos: '', edad: 0, email: '', password: '' });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al registrar el usuario.');
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={formData.edad || ''}
          onChange={handleChange}
          min="0"
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
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrarse</button>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
