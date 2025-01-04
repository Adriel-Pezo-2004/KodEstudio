import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';

const RequirementsForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    projectTitle: '',
    requestorName: '',
    requestorPhone: '',
    requestorEmail: '',
    department: '',
    sponsorName: '',
    sponsorPhone: '',
    sponsorEmail: '',
    description: '',
    dependencies: '',
    requestedEndDate: '',
    estimatedBudget: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit-requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Requerimientos enviados exitosamente');
      } else {
        alert('Error al enviar los requerimientos');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar los requerimientos');
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header>
          <h2 className="text-center mb-0">Formulario de Requerimientos del Proyecto</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Información General */}
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Título del Proyecto</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Información del Solicitante */}
            <h4 className="mb-3">Información del Solicitante</h4>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="requestorName"
                    value={formData.requestorName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="requestorPhone"
                    value={formData.requestorPhone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="requestorEmail"
                    value={formData.requestorEmail}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-4">
              <Form.Label>Departamento</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Información del Patrocinador */}
            <h4 className="mb-3">Información del Patrocinador</h4>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="sponsorName"
                    value={formData.sponsorName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="sponsorPhone"
                    value={formData.sponsorPhone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="sponsorEmail"
                    value={formData.sponsorEmail}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Detalles del Proyecto */}
            <h4 className="mb-3">Detalles del Proyecto</h4>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dependencias Conocidas</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="dependencies"
                value={formData.dependencies}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Finalización Solicitada</Form.Label>
                  <Form.Control
                    type="date"
                    name="requestedEndDate"
                    value={formData.requestedEndDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Presupuesto Estimado</Form.Label>
                  <Form.Control
                    type="number"
                    name="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={handleChange}
                    placeholder="$ 0.00"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button variant="primary" type="submit" size="lg">
                Enviar Requerimientos
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RequirementsForm;