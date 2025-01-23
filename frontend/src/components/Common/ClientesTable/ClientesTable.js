import React from 'react';
import { Table, Button } from 'react-bootstrap';

const ClientesTable = React.memo(({ clientes, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <Table hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Celular</th>
            <th>Email</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente._id}>
              <td>{cliente.nombre}</td>
              <td>{cliente.celular}</td>
              <td>{cliente.email}</td>
              <td>{cliente.ciudad}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(cliente._id)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(cliente._id)}
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

export default ClientesTable;
