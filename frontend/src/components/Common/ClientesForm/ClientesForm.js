import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ClientesForm.css';

const ClientesForm = () => {
  const { id } = useParams();
  const editMode = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const initialFormState = {
    nombre: '',
    celular: '',
    email: '',
    ciudad: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchClienteData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = `http://localhost:5000/api/clientes/${id}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data) {
        setFormData(response.data);
      } else {
        throw new Error('Failed to fetch client data');
      }
    } catch (error) {
      setError('Error loading client data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (editMode && id) {
      fetchClienteData();
    }
  }, [editMode, id, fetchClienteData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['nombre', 'celular', 'email', 'ciudad'];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in the ${field}`);
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Ingrese una dirección de email válida');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const url = editMode 
        ? `http://localhost:5000/api/clientes/${id}`
        : 'http://localhost:5000/api/clientes';
        
      const method = editMode ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess(editMode ? 'Cliente actualizado' : 'Cliente creado');

        if (!editMode) {
          setFormData(initialFormState);
        }

        setTimeout(() => {
          navigate('/clientes-list');
        }, 2000);
      }
    } catch (error) {
      setError('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow">
        <div className="shadow-sm">
          <h2 className="header-sm">
            {editMode ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
        </div>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Celular</Form.Label>
                  <Form.Control
                    type="tel"
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-between">
              <Button 
                variant="secondary" 
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Subiendo...' : (editMode ? 'Actualizar Cliente' : 'Crear Cliente')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClientesForm;