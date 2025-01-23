import React, { useEffect, useState, useCallback } from 'react';
import { Container, Button, Form, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDebounce from '../../../hooks/useDebounce';
import RequirementsTable from '../../Common/RequirementsTable/RequirementsTable';
import './RequirementList.css';

const RequirementList = () => {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchRequirements = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = `http://localhost:5000/api/requirements`;

      if (debouncedSearchTerm) {
        url += `/search?q=${debouncedSearchTerm}`;
      } else {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) url += `?${key}=${value}`;
        });
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequirements(response.data.requirements || response.data.results);
    } catch (err) {
      setError('Error loading requirements: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearchTerm]);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (id) => navigate(`/edit-requirement/${id}`);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this requirement?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/requirements/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchRequirements();
      } catch (err) {
        setError('Error deleting requirement: ' + err.message);
      }
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Solicitudes de Proyecto</h2>
            <Button variant="primary" onClick={() => navigate('/requirements')}>
              Crear Solicitud
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
              <Form.Select
                name="status"
                value={filters.status || ''}
                onChange={handleFilterChange}
              >
                <option value="">Filtrar por Status</option>
                <option value="Rechazado">Rechazado</option>
                <option value="Aprobado">Aprobado</option>
                <option value="En Progreso">En Progreso</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                name="priority"
                value={filters.priority || ''}
                onChange={handleFilterChange}
              >
                <option value="">Filtrar por Prioridad</option>
                <option value="Bajo">Bajo</option>
                <option value="Medio">Medio</option>
                <option value="Alto">Alto</option>
                <option value="Crítico">Crítico</option>
              </Form.Select>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <RequirementsTable
              requirements={requirements}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RequirementList;
