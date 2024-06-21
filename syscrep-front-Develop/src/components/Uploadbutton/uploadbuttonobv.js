import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { AlumnosContext } from '../../context/AlumnosContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';

function FileUploadButtonobv({ uploadUrl, uniqueIndex, onUploadSuccess, studentId,buttonText, desiredFileName,isDisabled, buttonStyle,expectedFileType }) {
  const {alumno} = useContext(AlumnosContext);
  const {status, setStatus} = useContext(AlumnosContext);
  const [isUploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setLoading] = useState(false);

  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      let valid = false;
    let errorMessage = '';

    if (expectedFileType === 'word' && ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      valid = true;
    } else if (expectedFileType === 'pdf' && file.type === 'application/pdf') {
      valid = true;
    } else {
      errorMessage = `El archivo debe ser un ${expectedFileType.toUpperCase()}.`;
    }

    if (!valid) {
      Swal.fire('Error', errorMessage, 'error');
      return;
    }
      //El tamaño se mide en bytes, aqui se lanza la alerta si se superan los 3 Megabytes.
      if (file.size >= 3000000){
        Swal.fire('Exceso de tamaño','El tamaño del archivo no debe de exceder 3 MBs','error');
        return;
      }

      setSelectedFile(file);
      setLoading(true);
      console.log("Archivo seleccionado:", file);

      // Intenta cargar el archivo
      const formData = new FormData();
      formData.append('file', file);
      formData.append('student_id', studentId);
      formData.append('desired_name', desiredFileName);
      formData.append('filetype', expectedFileType);

      fetch(process.env.REACT_APP_API_URL+'upload', {
        method: 'POST',
        body: formData,
      })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setUploadSuccess(true)
        onUploadSuccess();
      })
      .catch((error) => {
        setLoading(false);
      });
    } 
  };

   return (
    <div className="file-upload">
      <div className="button-container">
        <Button 
          variant={buttonStyle} 
          size="md" 
          as="label" 
          htmlFor={`upload-button-${uniqueIndex}`}
          disabled={isDisabled}
        >
          {isLoading ? 'Subiendo…' : isUploadSuccess ? 'Subido' : buttonText}
          {isLoading && <FontAwesomeIcon icon={faHourglass} spin />}
        </Button>{' '}
      </div>
      <input 
        id={`upload-button-${uniqueIndex}`}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default FileUploadButtonobv;