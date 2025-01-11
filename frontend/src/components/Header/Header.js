import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const handleLogoutClick = (e) => {
    if (!window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      e.preventDefault();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Kod Estudio
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/requirements-list">Servicios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-success" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-danger" to="/logout" onClick={handleLogoutClick}>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;