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
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = `http://localhost:5000/api/clientes`;
      
      if (debouncedSearchTerm) {
        url += `/search?q=${debouncedSearchTerm}`;
      } else if (filters.ciudad) {
        url += `?ciudad=${filters.ciudad}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(response.data.clientes || response.data.results);
    } catch (err) {
      setError('Error loading clients: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearchTerm]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
                <Form.Control
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                name="ciudad"
                placeholder="Filtrar por Ciudad"
                value={filters.ciudad || ''}
                onChange={handleFilterChange}
              />
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