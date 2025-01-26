import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import './Simulador.css'

const Simulador = () => {
  const initialFormState = {
    projectType: '',
    priority: 'Medio',
    status: '',
    technicalRequirements: 0,
    startDate: '',
    endDate: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [estimatedBudget, setEstimatedBudget] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const calculateBudget = () => {
    const { projectType, priority, technicalRequirements, startDate, endDate } = formData;
    const projectTypeRates = {
        'Consultoría': 2000,
        'Desarollo Web': 2500,
        'Desarollo App Móvil': 3200,
        'Aplicación de Escritorio': 4000,
        'Otro': 2000
    };

    const priorityMultipliers = {
        'Bajo': 1.05,
        'Medio': 1.125,
        'Alto': 1.20,
        'Crítico': 1.25
    };

    const start = new Date(startDate);
    const end = new Date(endDate);

    const monthlyRate = projectTypeRates[projectType] || 2500;

    const dailyRate = monthlyRate / 30;

    let totalMonths = 
        (end.getFullYear() - start.getFullYear()) * 12 + 
        (end.getMonth() - start.getMonth());

    let remainingDays = 0;

    if (end.getDate() >= start.getDate()) {
        remainingDays = end.getDate() - start.getDate();
    } else {
        // Reduce a month if the end day is before the start day
        totalMonths -= 1;
        const daysInPrevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
        remainingDays = daysInPrevMonth - start.getDate() + end.getDate();
    }

    let budget = totalMonths * monthlyRate + remainingDays * dailyRate;

    budget *= priorityMultipliers[priority] || 1.125;

    if (technicalRequirements > 5) {
        budget += (technicalRequirements - 5) * 25;
    }

    budget = Math.round(budget / 50) * 50;

    setEstimatedBudget(budget);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateBudget();
  };

  return (
    <Container className="py-4">
      <Card className="shadow">
        <div className="header-sm">
          <h2>Simulador de Presupuesto</h2>
        </div>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Proyecto</Form.Label>
                  <Form.Select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione tipo de proyecto</option>
                    <option value="Desarollo App Móvil">Desarollo App Móvil</option>
                    <option value="Desarollo Web">Desarollo Web</option>
                    <option value="Aplicación de Escritorio">Aplicación de Escritorio</option>
                    <option value="Consultoría">Consultoría</option>
                    <option value="Otro">Otro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Prioridad</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value="Bajo">Bajo</option>
                    <option value="Medio">Medio</option>
                    <option value="Alto">Alto</option>
                    <option value="Crítico">Crítico</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Requerimientos Técnicos</Form.Label>
                  <Form.Control
                    type="number"
                    name="technicalRequirements"
                    value={formData.technicalRequirements}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Finalización</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Calcular Presupuesto
            </Button>
          </Form>

          {estimatedBudget !== null && (
            <div className="mt-4">
              <h4>Presupuesto Estimado: S/ {estimatedBudget.toFixed(2)}</h4>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Simulador;