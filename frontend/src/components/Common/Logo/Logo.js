import React from 'react';
import './Logo.css';

const Logo = ({ title, image }) => {
  return (
    <div className="modern-logo">
      {image && (
        <div className="logo-image-container">
          <img src={image} alt={title} className="logo-image" />
        </div>
      )}
    </div>
  );
};

export default Logo;