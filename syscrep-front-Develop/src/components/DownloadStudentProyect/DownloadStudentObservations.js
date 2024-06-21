import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function DownloadStudentObservations({ id }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFileAvailable, setIsFileAvailable] = useState(false);

    useEffect(() => {
        const checkFileAvailability = async () => {
            try {
                const response = await axios.head(process.env.REACT_APP_API_URL + 'ObservationsStudent/' + id);
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


    const getObservation = async () => {
        setIsLoading(true); // Activa el indicador de carga
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + 'ObservationsStudent/' + id, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Observaciones_' + id + '.docx';
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
        return null; // No renderiza nada si no hay archivo disponible
    }


    return (
        <Button onClick={getObservation} disabled={isLoading}>
            {isLoading ? <>Descargando... <FontAwesomeIcon icon={faHourglass} spin /></> : 'Descargar Observaciones'}
        </Button>
    )
}

export default DownloadStudentObservations;