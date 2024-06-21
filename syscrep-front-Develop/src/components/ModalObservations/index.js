import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { format } from 'date-fns';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faFloppyDisk, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'
import FileUploadButtonobv from '../Uploadbutton/uploadbuttonobv';

function ModalObservations(props) {

  var observations = props.observations;
  var id = props.studentId;
  console.log(id);
  const [editingObservationId, setEditingObservationId] = useState(null);
  const [editedObservation, setEditedObservation] = useState('');
  const [latestObservation, setLatestObservation] = useState('');
  const [labelObservation, setLabelObservation] = useState('Última Observación');
  const [Uploaded, setUploaded] = useState(false);

  const handleUploadSuccess = () => {
    setUploaded(true);
  };


  const cellStyle = {
    textAlign: 'center',
    padding: '5px',
  };

  const cellTextLeft = {
    textAlign: 'left',
  };

  const cellDate = {
    width: '200px',
    textAlign: 'center',
  }

  const cellTexCenter = {
    textAlign: 'center',
  };

  useEffect(() => {
    // Configurar la última observación al cargar el componente
    if (props.observations.length > 0) {
      const lastObservation = props.observations[0];
      setLatestObservation(lastObservation.observations);
    }
  }, [props.observations]);

  const getFormatDate = (dateString) => {
    const formattedDate = format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
    return formattedDate;
  };

  const handleEditClick = (observationId, observationText) => {
    setEditingObservationId(observationId);
    setEditedObservation(observationText);
    setLabelObservation("Editar Observación")
  };
  const handleDeleteClick = (observationId) => {
    deleteObservation(observationId);
  };

  const handleSaveClick = () => {

    editObservation(editingObservationId)
    setEditingObservationId(null);
    setEditedObservation('');
    setLabelObservation("Última Observación")

  };

  const handleCancelClick = () => {
    // Cancela la edición y limpia el estado de edición.
    setEditingObservationId(null);
    setEditedObservation('');
    setLabelObservation("Última Observación")
  };

  const editObservation = async (id) => {
    try {

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.put(process.env.REACT_APP_API_URL + 'residences/observations/edit/' + id,
        {
          new_observation: editedObservation
        }, { headers });

      // Handle the response
      if (response.data.success) {
        console.log('Observation updated successfully');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Observación actualizada exitosamente.',
          showConfirmButton: false,
          timer: 1500,
          width: '300px',
        })

        props.onHide();
      } else {
        console.error('Error updating observation:', response.data.message);
      }

    } catch (error) {
      console.error('Error al obtener observaciones:', error);
    }
  }

  const deleteObservation = async (id) => {
    try {

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.put(process.env.REACT_APP_API_URL + 'residences/observations/deshabilitar/' + id,
        null,
        {
          headers
        });

      // Handle the response
      if (response.data.success) {
        console.log('Observation delete successfully');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Observación eliminada exitosamente.',
          showConfirmButton: false,
          timer: 1500,
          width: '300px',
        })

        props.onHide();
      } else {
        console.error('Error delete observation:', response.data.message);
      }

    } catch (error) {
      console.error('Error al obtener observaciones:', error);
    }
  }



  return (
    <Modal
      {...props}
      size="lg"
      animation="slide"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Historial de Observaciones
        </Modal.Title>
      </Modal.Header>
      {observations.length > 0 ?
        (
          <Modal.Body>
            <div className='row'>
              <div className='col-xs-12'>
                <Form id='formObservation'>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ paddingLeft: '0px' }} >{labelObservation}</Form.Label>
                    <Form.Control id='observacion' as="textarea" rows={3}
                      value={editingObservationId !== null ? editedObservation : latestObservation}
                      onChange={(e) => setEditedObservation(e.target.value)} />
                  </Form.Group>
                </Form>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12'>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={cellStyle}>#</th>
                      <th style={cellTextLeft}>Observación</th>
                      <th style={cellDate}>Fecha</th>
                      <th style={cellTexCenter}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {observations.length > 0 && observations.map((observation, index) => (

                      <tr key={observation.id} >
                        <td width='80px' style={cellStyle}>{observations.length - index}</td>
                        <td style={cellTextLeft}>{observation.observations}</td>
                        <td style={cellDate}>{getFormatDate(observation.updated_at)}</td>
                        <td width='150px' style={cellTexCenter}>
                          {editingObservationId === observation.id ? (
                            <>
                              <Button title='Guardar' variant="success" onClick={handleSaveClick}>
                                <FontAwesomeIcon icon={faFloppyDisk} color='#fff' />
                              </Button>
                              <Button title='Cancelar' variant="danger" onClick={handleCancelClick}>
                                <FontAwesomeIcon icon={faTimes} color='#fff' />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button title='Editar'
                                onClick={() => handleEditClick(observation.id, observation.observations)}
                                variant="warning"
                                style={{ marginRight: '3px' }}
                              >
                                <FontAwesomeIcon icon={faPencil} color='#fff' />
                              </Button>
                              <Button title='Eliminar'
                                onClick={() => handleDeleteClick(observation.id)}
                                variant="danger"
                              >
                                <FontAwesomeIcon icon={faTrash} color='#fff' />
                              </Button>
                            </>
                          )}

                        </td>
                      </tr>

                    ))}
                  </tbody>
                </Table>
              </div>
            </div>

          </Modal.Body>
        ) :
        (<Modal.Body><h5>Este alumno no cuenta con observaciones.</h5></Modal.Body>)
      }


      <Modal.Footer>
        {
          observations.length > 0 &&
          <FileUploadButtonobv
            studentId={id}
            onUploadSuccess={handleUploadSuccess}
            buttonText={"Subir Observaciones (Word)"}
            desiredFileName={"Observaciones_"}
            uniqueIndex={9}
            isDisabled={false} // Se deshabilita hasta que se suba el Kardex
            buttonStyle={"primary"}
            expectedFileType={"word"}
          />
        }
        <Button onClick={props.onHide} className='btn-danger'>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ModalObservations;