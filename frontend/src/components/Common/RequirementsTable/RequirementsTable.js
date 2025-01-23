import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const RequirementsTable = React.memo(({ requirements, onEdit, onDelete }) => {
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

  return (
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
                  onClick={() => onEdit(req._id)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(req._id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
});

export default RequirementsTable;
