import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { AlumnosContext } from '../../context/AlumnosContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

function Updatestatusfle({ studentId, buttonText, statusKey, isDisabled,  size,statusValue,uniqueIndex }) {
  const { alumno } = useContext(AlumnosContext);
  const [isLoading, setLoading] = useState(false);

const now = new Date();
const timestamp = now.toISOString();


const updateStatus = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}StatusExpediente/${studentId}`, {
        controlNumber: studentId, 
        statusKey: statusKey,
        statusValue: statusValue
      });

      if (response.status === 200) {
        // Si la respuesta es exitosa, muestra una alerta de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: `El archivo fue aprobado correctamente.`,
        });
      }
    } catch (error) {
      let errorMessage = 'No se pudo actualizar el estado.';

      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      // Muestra una alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };




   return (
    <div className="file-upload">
      <div className="button-container">
        <Button 
          variant= "success" 
          size={size} 
          as="label" 
          id={`download-button-${uniqueIndex}`}
          disabled={isDisabled}
          onClick={updateStatus}
        >
         
         {buttonText}
        </Button>{' '}
      </div>
    </div>
      
  );
}

export default Updatestatusfle;