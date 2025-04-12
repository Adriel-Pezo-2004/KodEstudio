import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Carrusel.css';

const Carrusel = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Datos estáticos de respaldo
  const staticReviews = [
    {
      cliente: "Juan Pérez",
      calificacion: "⭐⭐⭐⭐⭐",
      descripcion: "Excelente servicio! El producto superó mis expectativas y llegó antes de lo esperado."
    },
    {
      cliente: "María González",
      calificacion: "⭐⭐⭐⭐",
      descripcion: "Muy buena calidad, aunque el envío tardó un poco más de lo anunciado."
    },
    {
      cliente: "Carlos Rodríguez",
      calificacion: "⭐⭐⭐⭐⭐",
      descripcion: "Increíble atención al cliente. Resolvieron mi problema inmediatamente."
    }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews');
        setReviews(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError("No se pudieron cargar las reseñas. Mostrando datos de ejemplo.");
        setReviews(staticReviews); // Usar datos estáticos si hay error
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [staticReviews]);

  // Usar reviews de la API o los estáticos si hay error
  const reviewsToShow = reviews.length > 0 ? reviews : staticReviews;
  const duplicatedReviews = [...reviewsToShow, ...reviewsToShow];

  if (loading) {
    return <div className="carrusel-container">Cargando reseñas...</div>;
  }

  return (
    <div className="carrusel-container">
      {error && <div className="error-message">{error}</div>}
      <div className="carrusel-track">
        {duplicatedReviews.map((review, index) => (
          <div key={index} className="carrusel-item">
            <h3>{review.cliente}</h3>
            <p className="rating">Calificación: {review.calificacion}</p>
            <p>{review.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carrusel;