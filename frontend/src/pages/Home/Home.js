import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Common/Card/Card';
import Logo from '../../components/Common/Logo/Logo';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const slideInFromLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        duration: 1,
        bounce: 0.3
      }
    }
  };

  const services = [
    {
      title: "Desarrollo Web",
      content: "Creamos sitios web modernos y responsivos",
      image: "https://scoreapps.com/blog/wp-content/uploads/desarrollo-web.png"
    },
    {
      title: "Apps Móviles",
      content: "Desarrollamos aplicaciones nativas y multiplataforma",
      image: "https://timedoor.net/wp-content/uploads/2022/09/Mobile-Apps-Development-2.png"
    },
    {
      title: "Software a Medida",
      content: "Soluciones personalizadas para tu negocio",
      image: "https://wac-cdn.atlassian.com/dam/jcr:7af87fb7-1d9d-40de-910b-852ad8fe1825/scrum@2x.png?cdnVersion=2501"
    }
  ];

  const lenguajes = [
    {
      image: "https://cdn.worldvectorlogo.com/logos/flask.svg"
    },
    {
      image: "https://static-00.iconduck.com/assets.00/react-original-wordmark-icon-840x1024-vhmauxp6.png"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sass_Logo_Color.svg/1280px-Sass_Logo_Color.svg.png"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/1200px-MongoDB_Logo.svg.png"
    }
  ];

  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container position-relative">
          <div className="row min-vh-50 align-items-center">
            <div className="col-lg-6">
              <motion.h1 
                className="display-4 fw-bold text-white mb-4"
                initial="hidden"
                animate="visible"
                variants={slideInFromLeft}
              >
                Bienvenidos a Kod Estudio
              </motion.h1>
              <motion.p 
                className="lead text-white mb-4"
                initial="hidden"
                animate="visible"
                variants={slideInFromLeft}
                transition={{ delay: 0.2 }}
              >
                Transformando ideas en soluciones digitales
              </motion.p>
              <motion.button 
                className="btn btn-light btn-lg"
                onClick={() => navigate('/requirements')}
                initial="hidden"
                animate="visible"
                variants={slideInFromLeft}
                transition={{ delay: 0.4 }}
              >
                Comenzar Proyecto
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section py-5">
        <div className="container">
          <h1 className="text-center mb-5 lenguajes-title">Nuestros Servicios</h1>
          <div className="row g-4">
            {services.map((service, index) => (
              <div key={index} className="col-md-4">
                <Card {...service} />
              </div>
            ))}
          </div>
        </div>
        <div className="container">
          <h1 className="text-center mb-5 lenguajes-title">Lenguajes</h1>
          <div className="row g-4">
            {lenguajes.map((lenguaje, index) => (
              <div key={index} className="col-md-3">
                <Logo {...lenguaje} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;