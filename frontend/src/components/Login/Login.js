import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
      
      if (!response.data.username || !response.data.token) {
        throw new Error('Invalid server response');
      }

      localStorage.clear();
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      
      window.location.href = '/requirements-list';
      
    } catch (error) {
      setError(
        error.response?.data?.error || 
        error.message || 
        'An error occurred during login'
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-form-section">
          <h2>Inicie Sesión</h2>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="sign-in-button">
              Inicia Sesión
            </button>
          </form>
        </div>

        <div className="welcome-section">
          <h2>Saludos, Usuario</h2>
          <p>¿No tienes una cuenta?</p>
          <button className="sign-up-button">Regístrate</button>
        </div>
      </div>
    </div>
  );
};

export default Login;