import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Dowloadbutton from '../Uploadbutton/downloadbutton';


function DowloadPreliminarF({ id }) {
    const [isFileAvailable, setIsFileAvailable] = useState(false);
  
  
    
    useEffect(() => {
        const checkFileAvailability = async () => {
            try {
                const response = await axios.head(process.env.REACT_APP_API_URL +'getDocuments',{
                    params: {
                        student_id: id, 
                        desired_name: "Reporte_Preliminar_Aprobado_Firmado_", 
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
                El alumno no a subido el reporte firmado
            </Button>
        )
    }

    
    return (
        
        <Dowloadbutton
            studentId={id}
            buttonText="Descargar"
            desiredFileName="Reporte_Preliminar_Aprobado_Firmado_"
            isDisabled={!isFileAvailable}
            buttonStyle="primary"
            size="lg"
            fileType="pdf"
            uniqueIndex={6}
      />
    )
}

export default DowloadPreliminarF;