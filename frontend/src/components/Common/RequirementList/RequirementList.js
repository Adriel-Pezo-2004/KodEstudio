import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Badge, Button, Form, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      'Low': 'info',
      'Medium': 'warning',
      'High': 'danger',
      'Critical': 'dark'
    };
    return variants[priority] || 'secondary';
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'Pending': 'warning',
      'Approved': 'success',
      'In Progress': 'info',
      'Completed': 'primary',
      'Rejected': 'danger'
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
            <h2 className="mb-0">Project Requirements</h2>
            <Button 
              variant="primary" 
              onClick={() => navigate('/requirements')}
            >
              New Requirement
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
                  placeholder="Search..."
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
                <option value="">Filter by Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
              >
                <option value="">Filter by Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                name="department"
                placeholder="Filter by Department"
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
                      <th>Project Title</th>
                      <th>Department</th>
                      <th>Requestor</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>End Date</th>
                      <th>Actions</th>
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
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(req._id)}
                          >
                            Delete
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