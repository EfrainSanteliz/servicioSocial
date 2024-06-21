import React, { useContext } from 'react';
import { AlumnosContext } from '../../context/AlumnosContext';
import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import Downloadbutton from '../Uploadbutton/downloadbutton';

function DocumentsDownload() {
    const { alumno } = useContext(AlumnosContext);

    const handleDownload = async (apiUrl, fileName) => {
        try {
            console.log('Descargando...');
            const response = await axios.get(apiUrl + alumno, { 'responseType': 'blob' });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

            // Crear una URL para los datos del Blob
            const url = window.URL.createObjectURL(blob);

            // Crear un enlace y disparar un clic para iniciar la descarga
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.log(e);
        }
    };

    return (

    <Row className='justify-content-center mb-4'>
        <Col md={4}>
        <Downloadbutton
                studentId={alumno}
                buttonText="Solicitud de Residencias"
                desiredFileName={`Solicitud_Residencias`}
                isDisabled={false}
                buttonStyle="primary"
                size="sm"
                fileType="word"
                uniqueIndex={17}
            />
        </Col>

        <Col md={4} >
                <Downloadbutton
                studentId={alumno}
                buttonText="Carta de Presentación"
                desiredFileName={`Carta_Presentacion`}
                isDisabled={false}
                buttonStyle="primary"
                size="sm"
                fileType="pdf"
                uniqueIndex={13}
            />
        </Col>
    </Row>

    );
}

export default DocumentsDownload;