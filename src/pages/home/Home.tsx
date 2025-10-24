import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="home">
      <h1>¡Bienvenido a Movie Star!</h1>
      <p>Descubre, guarda y disfruta tus películas favoritas.</p>
    </div>
  );
};

export default Home;
