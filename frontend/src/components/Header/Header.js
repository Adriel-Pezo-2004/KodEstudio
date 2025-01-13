import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  console.log('Username retrieved:', username);  // Para debug

  const handleLogoutClick = (e) => {
    if (!window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      e.preventDefault();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login');
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
            {username ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Hola, {username}</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-danger" to="/logout" onClick={handleLogoutClick}>Logout</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link text-success" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;