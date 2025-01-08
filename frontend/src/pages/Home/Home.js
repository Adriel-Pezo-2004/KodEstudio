import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Common/Card/Card';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Desarrollo Web",
      content: "Creamos sitios web modernos y responsivos",
      image: "https://via.placeholder.com/400x300/6610f2/ffffff?text=Desarrollo+Web"
    },
    {
      title: "Apps Móviles",
      content: "Desarrollamos aplicaciones nativas y multiplataforma",
      image: "https://via.placeholder.com/400x300/6610f2/ffffff?text=Apps+Moviles"
    },
    {
      title: "Software a Medida",
      content: "Soluciones personalizadas para tu negocio",
      image: "https://via.placeholder.com/400x300/6610f2/ffffff?text=Software"
    }
  ];

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row min-vh-50 align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-white mb-4">Bienvenidos a Kod Estudio</h1>
              <p className="lead text-white mb-4">Transformando ideas en soluciones digitales</p>
              <button 
                className="btn btn-light btn-lg"
                onClick={() => navigate('/requirements')}
              >
                Comenzar Proyecto
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">Nuestros Servicios</h2>
          <div className="row g-4">
            {services.map((service, index) => (
              <div key={index} className="col-md-4">
                <Card {...service} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;