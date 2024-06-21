import React, { useContext, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { GlobalContext } from '../../context/GlobalContext';
import { useParams } from "react-router-dom";
const PasswordModal = ({ show, handleClose }) => {
  // Estados para los campos del formulario
  const [current_password, setcurrent_password] = useState('');
  const [new_password, setnew_password] = useState('');
  const [new_password_confirmation, setnew_password_confirmation] = useState('');
  const { emailCoordinador } = useContext(GlobalContext);

  // Manejador para el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear el objeto de datos
    const data = {
        current_password,
        new_password,
        new_password_confirmation
    };
   
    const token = localStorage.getItem("token");

    // Enviar datos a la API
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+'coordinators/change-password/'+emailCoordinador, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
           Authorization: 'Bearer ' + token

        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // Manejar respuesta exitosa
        console.log('Datos enviados correctamente');
        handleClose(); 
      } else {
        // Manejar errores de la respuesta
        console.error('Error al enviar datos');
      }
    } catch (error) {
      // Manejar errores de conexión
      console.error('Error al conectar con la API', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar Contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña Actual {emailCoordinador}</Form.Label>
            <Form.Control type="text" placeholder="" value={current_password} onChange={(e) => setcurrent_password(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña Nueva</Form.Label>
            <Form.Control type="text" placeholder="" value={new_password} onChange={(e) => setnew_password(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Volver a Ingresar Contraseña Nueva</Form.Label>
            <Form.Control type="text" placeholder="" value={new_password_confirmation} onChange={(e) => setnew_password_confirmation(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


export default PasswordModal;