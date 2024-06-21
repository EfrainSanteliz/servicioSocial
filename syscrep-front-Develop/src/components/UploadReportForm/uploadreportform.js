import React, { useContext, useEffect, useState } from 'react';
import './uploadreportformStyle.css';
import FileUploadButton from '../Uploadbutton/uploadbutton';
import SubirArchivo from "../../assets/SubirArchivo.png"
import CardBlocker from '../CardBlocker/CardBlocker';
import { Col, Row } from 'react-bootstrap';

import { AlumnosContext } from '../../context/AlumnosContext';
import Swal from 'sweetalert2';
import axios from 'axios';

function ReportUploadForm({ uploadUrl, studentId }) {
  const { status, setStatus, alumno } = useContext(AlumnosContext);
  const [kardexUploaded, setKardexUploaded] = useState(false);
  const [reportUploaded, setReportUploaded] = useState(false);


  const handleKardexUploadSuccess = () => {
    setKardexUploaded(true);
    checkStatus();
  };

  const handleReportUploadSuccess = () => {
    setReportUploaded(true);
    checkStatus();
  };

  const checkStatus = async ()=>{
    const {data} = await axios.get(process.env.REACT_APP_API_URL +'residences/status/'+alumno);
    if (data.status == 2){
      setStatus(2);
    }else{
      Swal.fire('Advertencia','Para completar el paso 2 es necesario subir el otro archivo.','info');
    }
  }

  const statusMessages = (status) => {

    const value = status.toString();

    switch (value) {
      case '2':
        return 'Enviado para revisión';
      case '3':
        return 'Esperando asignación de asesor';
      case '4':
        return 'Validado por la academia';
      case '5':
        return 'Observaciones';
      default:
        if (value >= 6)return 'Aceptado';
        return 'No Enviado';
    }
  }
  useEffect(() => {
    if (kardexUploaded && reportUploaded) {

    }
  }, [kardexUploaded, reportUploaded]);

  return (
    <div className="containerCard">
      <div className={status == 1 || status == 2 || status == 5 ? "card" : "card disabled"}>
        <div className="imgBx">
          <img src={SubirArchivo} alt="Subir Archivo" />
        </div>
        <div className="contentBx">
          <h2>Paso 2</h2>
          <h3>
            Status: {statusMessages(status)}
          </h3>
          <div className="size">
          </div>
          <Row className='justify-content-center mb-4'>
            <Col md={4}>
              <FileUploadButton
                uploadUrl={uploadUrl}
                onUploadSuccess={handleKardexUploadSuccess}
                studentId={studentId}
                buttonText={"Subir Kardex (PDF)"}
                desiredFileName={"Kardex_"}
                uniqueIndex={3}
                isDisabled={false}
                buttonStyle={"primary"}
                expectedFileType={"pdf"}
                size={"md"}

              />
            </Col>
            <Col md={4}>
              <FileUploadButton
                uploadUrl={uploadUrl}
                onUploadSuccess={handleReportUploadSuccess}
                studentId={studentId}
                buttonText={"Subir Reporte (Word)"}
                desiredFileName={"Reporte_Preliminar_"}
                uniqueIndex={4}
                isDisabled={false} // Se deshabilita hasta que se suba el Kardex
                buttonStyle={"primary"}
                expectedFileType={"word"}
                size={"md"}
              />
            </Col>
          </Row>
        </div>
        <CardBlocker show={!(status == 1 || status == 2 || status == 5)} />
      </div>
    </div>
  );
}

export default ReportUploadForm;