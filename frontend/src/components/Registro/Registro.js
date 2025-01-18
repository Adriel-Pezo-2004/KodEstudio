import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Registro.css';

const registerUser = async (userData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error registering user');
  }
};

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await registerUser({ username: formData.username, password: formData.password });
      setSuccess('User registered successfully');
      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-card-header">
          <h2>Registro</h2>
        </div>
        <div className="registro-card-body">
          {error && <div className="registro-alert registro-alert-danger">{error}</div>}
          {success && <div className="registro-alert registro-alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="registro-form-group">
              <label className="registro-form-label" htmlFor="username">Nombre</label>
              <input
                type="text"
                id="username"
                name="username"
                className="registro-form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="registro-form-group">
              <label className="registro-form-label" htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                className="registro-form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="registro-form-group">
              <label className="registro-form-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="registro-form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="registro-btn registro-btn-primary">Registrate</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registro;