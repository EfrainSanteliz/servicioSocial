import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass, faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import IconDowmload from "../../assets/DescargarIcon.png"

function DownloadStudentIdent({ id }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFileAvailable, setIsFileAvailable] = useState(false);


    useEffect(() => {
        const checkFileAvailability = async () => {
            try {
                const response = await axios.head(process.env.REACT_APP_API_URL + 'IdentStudent/' + id);
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


    const getIdent = async () => {
        setIsLoading(true); // Activa el indicador de carga
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + 'IdentStudent/' + id, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Credencial_' + id + '.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false); // Desactiva el indicador de carga
        }
    }

    if (!isFileAvailable) {
        return (
            <Button  variant='secondary' className="DownloadIconButton" onClick={getIdent} disabled={true}>
                El alumno no a subido la credencial
            </Button>
        )
    }

    return (
        <Button variant="primary" size="lg"  className="DownloadIconButton" onClick={getIdent} disabled={isLoading}>
            {isLoading ? <>... <FontAwesomeIcon icon={faHourglass} spin /> </> : < >  {"Descargar"} <img src={IconDowmload} alt="Expediente" className="icondownload-img" style={{ marginLeft: '15px' }}/></> }
        </Button>
    )
}

export default DownloadStudentIdent;