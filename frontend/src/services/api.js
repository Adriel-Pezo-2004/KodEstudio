import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = {
  test: () => axios.get(`${API_URL}/api/test`),
  // Agrega más métodos API aquí
};

export default api;