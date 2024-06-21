import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass, faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import IconDowmload from "../../assets/DescargarIcon.png"

function DownloadStudentKardex({ id }) {
    const [isLoading, setIsLoading] = useState(false);

    const getProyecto = async () => {
        setIsLoading(true); // Activa el indicador de carga
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + 'kardexStudents/' + id, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Kardex_' + id + '.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false); // Desactiva el indicador de carga
        }
    }

    return (
        <Button variant="primary" size="lg" className="DownloadIconButton" onClick={getProyecto} disabled={isLoading}>
             {isLoading ? <>... <FontAwesomeIcon icon={faHourglass} spin /> </> : < >  {"Descargar"} <img src={IconDowmload} alt="Expediente" className="icondownload-img" style={{ marginLeft: '15px' }}/></> }
        </Button>
    )
}

export default DownloadStudentKardex;