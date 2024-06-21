import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass, faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import IconDowmload from "../../assets/DescargarIcon.png"
import Dowloadbutton from '../Uploadbutton/downloadbutton';

function DowloadMonthlyReport({ id,num }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFileAvailable, setIsFileAvailable] = useState(false);
  
  
    
    useEffect(() => {
        const checkFileAvailability = async () => {
            try {
                const response = await axios.head(process.env.REACT_APP_API_URL +'getDocuments',{
                    params: {
                        student_id: id, 
                        desired_name: "Reporte_"+num+"_", 
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
                El alumno no a subido el Reporte 
            </Button>
        )
    }

    
    return (
        <Dowloadbutton
        studentId={id}
        buttonText="Descargar"
        desiredFileName={`Reporte_${num}_`}
        isDisabled={!isFileAvailable}
        buttonStyle="primary"
        size="lg"
        fileType="pdf"
        uniqueIndex={1}
      />
    )
}

export default DowloadMonthlyReport;