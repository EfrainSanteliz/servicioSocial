import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass, faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Downloadbutton from '../Uploadbutton/downloadbutton';

function DownloadStudentAceptCard({ id }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFileAvailable, setIsFileAvailable] = useState(false);

    
    useEffect(() => {
        const checkFileAvailability = async () => {
            try {
                const response = await axios.head(process.env.REACT_APP_API_URL +'getDocuments',{
                    params: {
                        student_id: id, 
                        desired_name: "Formato_Solicitud_Residencias_Firmado_", 
                        filetype: "pdf" 
                    }
                });
                if (response.status === 200) {
                    setIsFileAvailable(true);
                }
            } catch (error) {
                console.error("Error checking file availability", error);
                setIsFileAvailable(false);
            }
        };

        checkFileAvailability();
    }, [id]);

    if (!isFileAvailable) {
        return (
            <Button  variant='secondary' className="DownloadIconButton" disabled={true}>
                La solicitud Firmada no ha sido subida
            </Button>
        )
    }


    return (
        <Downloadbutton
        studentId={id}
        buttonText="Descargar"
        desiredFileName="Formato_Solicitud_Residencias_Firmado_"
        isDisabled={!isFileAvailable}
        buttonStyle="primary"
        size="lg"
        fileType="pdf"
        uniqueIndex={1}
      />
    )
}

export default DownloadStudentAceptCard;