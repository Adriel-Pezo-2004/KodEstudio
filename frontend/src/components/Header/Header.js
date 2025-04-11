import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem('username'));
  console.log('Username retrieved:', username);  // Para debug

  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(localStorage.getItem('username'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
          Synaptech
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
              <Link className="nav-link active" to="/sobre-nosotros">Sobre Nosotros</Link>
            </li>
            {username ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/requirements-list">Servicios</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/clientes-list">Clientes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/perfil">Hola, {username}</Link>
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