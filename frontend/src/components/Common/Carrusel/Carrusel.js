import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Carrusel.css';

const Carrusel = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  // Duplicate reviews to make the carousel continuous
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <div className="carrusel-container">
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