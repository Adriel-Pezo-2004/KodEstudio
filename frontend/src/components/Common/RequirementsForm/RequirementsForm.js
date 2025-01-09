import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RequirementsForm = () => {
  const { id } = useParams();
  const editMode = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  const initialFormState = {
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
    estimatedBudget: '',
    status: 'Pending', // Added status field
    priority: 'Medium', // Added priority field
    projectType: '', // Added project type field
    technicalRequirements: '', // Added technical requirements field
    businessJustification: '', // Added business justification field
    riskAssessment: '', // Added risk assessment field
  };

  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState('');

  const fetchRequirementData = useCallback(async () => {
    try {
        setLoading(true);
        const url = `http://localhost:5000/api/requirements/${id}`;
        console.log('URL being accessed:', url); // Para ver la URL exacta
        console.log('ID value:', id); // Para verificar el valor del ID
        
        const response = await axios.get(url);
        if (response.data) {
            console.log('Response data:', response.data); // Para ver la respuesta cuando funcione
            setFormData(response.data);
        } else {
            throw new Error('Failed to fetch requirement data');
        }
    } catch (error) {
        console.error('Detailed error:', error.response || error); // Para ver más detalles del error
        setError('Error loading requirement data: ' + error.message);
    } finally {
        setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (editMode && id) {
      fetchRequirementData();
    }
  }, [editMode, id, fetchRequirementData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Add custom validation logic here
    const requiredFields = [
      'projectTitle',
      'requestorName',
      'requestorEmail',
      'department',
      'description',
      'requestedEndDate',
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.requestorEmail)) {
      setError('Please enter a valid requestor email address');
      return false;
    }
    if (!emailRegex.test(formData.sponsorEmail)) {
      setError('Please enter a valid sponsor email address');
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
        
        const url = editMode 
            ? `http://localhost:5000/api/requirements/${id}`
            : 'http://localhost:5000/api/submit-requirements';
            
        const method = editMode ? 'put' : 'post';
        
        const response = await axios({
            method,
            url,
            data: formData,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.status === 201 || response.status === 200) {
            setSuccess(editMode ? 'Requirement updated successfully!' : 'Requirement submitted successfully!');
            
            if (!editMode) {
                setFormData(initialFormState);
            }
            
            // Redirigir después de un breve delay para mostrar el mensaje de éxito
            setTimeout(() => {
                navigate('/requirements-list');
            }, 2000);
        }
    } catch (error) {
        console.error('Submit error:', error);
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
      <Card className="shadow-sm">
        <Card.Header>
          <h2 className="text-center mb-0">
            {editMode ? 'Edit Project Requirements' : 'New Project Requirements Form'}
          </h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            {/* Project Information */}
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Type</Form.Label>
                  <Form.Select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Project Type</option>
                    <option value="Development">Development</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Research">Research</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Requestor Information */}
            <h4 className="mb-3">Requestor Information</h4>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
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
                  <Form.Label>Phone</Form.Label>
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
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Sponsor Information */}
            <h4 className="mb-3">Sponsor Information</h4>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
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
                  <Form.Label>Phone</Form.Label>
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

            {/* Project Details */}
            <h4 className="mb-3">Project Details</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Project Description</Form.Label>
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
              <Form.Label>Business Justification</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="businessJustification"
                value={formData.businessJustification}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Technical Requirements</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="technicalRequirements"
                value={formData.technicalRequirements}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dependencies</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="dependencies"
                value={formData.dependencies}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Risk Assessment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="riskAssessment"
                value={formData.riskAssessment}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Requested End Date</Form.Label>
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
                  <Form.Label>Estimated Budget</Form.Label>
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

            <div className="d-flex justify-content-between">
              <Button 
                variant="secondary" 
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Submitting...' : (editMode ? 'Update Requirement' : 'Submit Requirement')}
              </Button>
            </div>
          </Form>
          {message && <p>{message}</p>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RequirementsForm;