import React, { useContext, useEffect, useState } from 'react';
import { Alert, Row } from 'react-bootstrap';
import axios from 'axios';
import { AlumnosContext } from '../../context/AlumnosContext';

function AlertaCartaFirmada({ studentId }) {
    const [observation, setObservation] = useState(null);
    const { status } = useContext(AlumnosContext);

    useEffect(() => {
        getObservations()
    }, [studentId]);

    const getObservations = async () => {
        const token = localStorage.getItem('token');

        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL + 'residences/observations/historic/' + studentId,
                { headers: { Authorization: `Bearer ${token}` } });
            
            //Filtrar observaciones que hagan referencia a la carta firmada por el coordinador(id=99)
            const mensajes = data.data.filter((o)=>o.file == 99);

            if(mensajes.length != 0){
                setObservation(mensajes[0].observations);
            }

        } catch (e) {
            console.error(e);
        }

    }

    if (status >= 7 && observation != null) {

        return (
            <Row className="justify-content-center mb-4">
                <Alert variant="info">
                    <b>Mensaje del coordinador acerca de la carta firmada</b>:<br />
                    {observation}
                </Alert>
            </Row>
        )
    }else{
        return(<></>)
    }
}

export default AlertaCartaFirmada