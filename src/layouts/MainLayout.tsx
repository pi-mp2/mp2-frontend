import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="main-layout">
      <Navbar /> {/* ✅ Siempre visible */}
      <main>
        <Outlet /> {/* Aquí se renderiza cada página */}
      </main>
      {location.pathname === '/' && <Footer />} {/* ✅ Solo en Home */}
    </div>
  );
};

export default MainLayout;
