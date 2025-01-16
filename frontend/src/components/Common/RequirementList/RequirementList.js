import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Badge, Button, Form, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RequirementList.css';

const RequirementList = () => {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const getPriorityBadgeVariant = (priority) => {
    const variants = {
      'Bajo': 'dark',
      'Medio': 'info',
      'Alto': 'warning',
      'Crítico': 'danger'
    };
    return variants[priority] || 'secondary';
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'Rechazado': 'warning',
      'Aprobado': 'success',
      'En Progreso': 'info',
    };
    return variants[status] || 'secondary';
  };

  const fetchRequirements = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = `http://localhost:5000/api/requirements?page=${currentPage}`;
      
      // Add filters to URL
      Object.entries(filters).forEach(([key, value]) => {
        if (value) url += `&${key}=${value}`;
      });

      if (searchTerm) {
        url = `http://localhost:5000/api/requirements/search?q=${searchTerm}`;
      }

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }        
      });
      
      if (searchTerm) {
        setRequirements(response.data.results);
        setTotalPages(1);
      } else {
        setRequirements(response.data.requirements);
        setTotalPages(response.data.total_pages);
      }
    } catch (err) {
      setError('Error loading requirements: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, searchTerm]);

  useEffect(() => {
    fetchRequirements();
  }, [currentPage, filters, searchTerm, fetchRequirements]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (id) => {
    navigate(`/edit-requirement/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this requirement?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/requirements/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        fetchRequirements();
      } catch (err) {
        setError('Error deleting requirement: ' + err.message);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Solicitudes de Proyecto</h2>
            <Button 
              variant="primary" 
              onClick={() => navigate('/requirements')}
            >
              Crear Solicitud
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Filters and Search */}
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
                value={filters.status}
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
                value={filters.priority}
                onChange={handleFilterChange}
              >
                <option value="">Filtrar por Prioridad</option>
                <option value="Bajo">Bajo</option>
                <option value="Medio">Medio</option>
                <option value="Alto">Alto</option>
                <option value="Crítico">Crítico</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                name="department"
                placeholder="Filtrar por Departmento"
                value={filters.department}
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
            <>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Título del Proyecto</th>
                      <th>Ciudad</th>
                      <th>Cliente</th>
                      <th>Status</th>
                      <th>Prioridad</th>
                      <th>Fecha de Fin</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requirements.map((req) => (
                      <tr key={req._id}>
                        <td>{req.projectTitle}</td>
                        <td>{req.department}</td>
                        <td>{req.requestorName}</td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(req.status)}>
                            {req.status}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getPriorityBadgeVariant(req.priority)}>
                            {req.priority}
                          </Badge>
                        </td>
                        <td>{new Date(req.requestedEndDate).toLocaleDateString()}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(req._id)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(req._id)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {!searchTerm && totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span className="mx-3 align-self-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RequirementList;