import React from 'react';
import './Card.css';

const Card = ({ title, content, image }) => {
  return (
    <div className="modern-card">
      {image && (
        <div className="card-image-container">
          <img src={image} alt={title} className="card-image" />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-text">{content}</p>
      </div>
    </div>
  );
};

export default Card;