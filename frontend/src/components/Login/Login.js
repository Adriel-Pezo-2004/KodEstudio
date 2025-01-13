import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Attempting login with username:', username);
      
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
      
      console.log('Server response:', response.data);
      
      if (!response.data.username) {
        console.error('No username in response');
        throw new Error('Server response missing username');
      }

      if (!response.data.token) {
        console.error('No token in response');
        throw new Error('Server response missing token');
      }

      // Limpiar localStorage antes de guardar nuevos datos
      localStorage.clear();
      
      // Guardar los datos en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      
      // Verificar que los datos se guardaron correctamente
      const storedUsername = localStorage.getItem('username');
      const storedToken = localStorage.getItem('token');
      
      console.log('Stored data:', {
        username: storedUsername,
        token: storedToken ? 'Token present' : 'Token missing'
      });

      if (!storedUsername || !storedToken) {
        throw new Error('Failed to store login data');
      }

      // Recargar la página completamente para asegurar que el estado se actualice
      window.location.href = '/requirements-list';
      
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      
      setError(
        error.response?.data?.error || 
        error.message || 
        'An error occurred during login'
      );
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;