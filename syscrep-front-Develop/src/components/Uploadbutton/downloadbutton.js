import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { AlumnosContext } from '../../context/AlumnosContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import IconDowmload from "../../assets/DescargarIcon.png"
import Swal from 'sweetalert2';

function Downloadbutton({ studentId, buttonText, desiredFileName, isDisabled, buttonStyle, size,fileType,uniqueIndex }) {
  const { alumno } = useContext(AlumnosContext);
  const [isLoading, setLoading] = useState(false);
  let  Type = "";

const now = new Date();
const timestamp = now.toISOString();

  if (fileType == "pdf"){
    Type = 'application/pdf';
  }else{
    Type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }

  const handleDownload = async () => {
    setLoading(true);

    try {
      const response = await axios.get(process.env.REACT_APP_API_URL+'getDocuments', {
        params: {
          student_id: studentId,
          desired_name: desiredFileName,
          filetype: fileType,
          timestamp: timestamp,
        },
        responseType: 'blob', // Importante para manejar la respuesta como un archivo binario
      });
      const blob = new Blob([response.data], { type: Type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      if(fileType == "pdf"){
        a.download = desiredFileName + studentId + '.pdf';
      }else{
        a.download = desiredFileName + studentId + '.docx';
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (desiredFileName === "Carta_Presentacion" && alumno != "") {
        showAlert();
    }

  } catch (e) {
      console.log(e);
  } finally {
      setLoading(false); // Desactiva el indicador de carga
  }
}

const showAlert = () => {
  Swal.fire({
      icon: 'info',
      title: 'Importante',
      html: 'Firmar la solicitud de registro en la parte de abajo donde aparece tu nombre.' +
          '<br>· Pedir a la empresa que te firmen y sellen de recibido la carta de presentación y agradecimiento (imprimir 2, una empresa y otra para expediente)' +
          '<br>· Solicitar a la empresa que emita la carta de aceptación membretada, con firma y sello.' +
          '<br>· TODOS ESTOS DOCUMENTOS DEBERÁS ESCANEAR Y SUBIR A LA SECCIÓN DE EXPEDIENTE.',
  });
};

   return (
    <div className="file-upload">
      <div className="button-container">
        <Button 
          variant={buttonStyle} 
          size={size} 
          as="label" 
          id={`download-button-${uniqueIndex}`}
          disabled={isDisabled}
          onClick={handleDownload}
        >
            {isLoading ? (
          <span>Descargando… <FontAwesomeIcon icon={faDownload} spin /></span>
        ) : (
          <span>{buttonText} <img src={IconDowmload} alt="Expediente" className="icondownload-img" style={{ marginLeft: '15px' }} /></span>
        )}
        </Button>{' '}
      </div>
    </div>
  );
}

export default Downloadbutton;