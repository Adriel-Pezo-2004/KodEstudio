// src/components/Common/Card/Card.js
import React from 'react';
import './Card.css';

const Card = ({ title, content, image }) => {
  return (
    <div className="card">
      {image && <img src={image} alt={title} />}
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};

export default Card;