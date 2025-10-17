import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';
import logo from '../../assets/logo.jpeg';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo-container">
          <img src={logo} alt="Movie Star Logo" className="logo" />
          <span className="brand-name">Movie Star</span>
        </div>
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
          <button className="signup-btn" onClick={() => navigate('/signup')}>
            Registrarse
          </button>
        </div>
      </header>

      <main className="home-content">
        <h1>¡Bienvenido a Movie Star!</h1>
        <p>Descubre, guarda y disfruta tus películas favoritas.</p>
      </main>
    </div>
  );
};

export default Home;
