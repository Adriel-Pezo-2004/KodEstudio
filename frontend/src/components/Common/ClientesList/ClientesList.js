import React, { useEffect, useState, useCallback } from 'react';
import { Container, Button, Form, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDebounce from '../../../hooks/useDebounce';
import ClientesTable from '../ClientesTable/ClientesTable';
import './ClientesList.css';

const ClientesList = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedCity = useDebounce(cityFilter, 500);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();

      // Solo agregamos los parámetros si tienen valor
      if (debouncedSearch.trim()) {
        params.append('nombre', debouncedSearch.trim());
      }

      if (debouncedCity.trim()) {
        params.append('ciudad', debouncedCity.trim());
      }

      const url = `http://localhost:5000/api/clientes${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('Fetching URL:', url); // Para debugging

      const response = await axios.get(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data); // Para debugging
      setClientes(response.data.clientes || []);
      
    } catch (err) {
      console.error('Error fetching clientes:', err);
      setError('Error loading clients: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedCity]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCityFilterChange = (e) => {
    setCityFilter(e.target.value);
  };

  const handleEdit = (id) => navigate(`/edit-cliente/${id}`);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/clientes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchClientes();
      } catch (err) {
        setError('Error deleting client: ' + err.message);
      }
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Lista de Clientes</h2>
            <Button variant="primary" onClick={() => navigate('/clientes')}>
              Crear Cliente
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="mb-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Buscar por nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Filtrar por ciudad</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Filtrar por ciudad..."
                  value={cityFilter}
                  onChange={handleCityFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <ClientesTable clientes={clientes} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClientesList;