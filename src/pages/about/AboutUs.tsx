import './AboutUs.scss';
import logo from '../../assets/logo.jpeg';

export default function AboutUs() {
  return (
    <div className="about-container">
      <h1>Sobre Nosotros</h1>

      <img
        src={logo}
        alt="Logo de Movie Star"
        className="about-logo"
      />

      <p>
        Bienvenido a <strong>Movie Star</strong>, una plataforma dedicada a los amantes del cine. 
        Aquí podrás descubrir películas, leer reseñas y calificar tus favoritas.
      </p>
      <p>
        Nuestro objetivo es crear una comunidad donde cada usuario pueda compartir 
        su pasión por el séptimo arte y descubrir nuevas historias que inspiren.
      </p>
    </div>
  );
}
