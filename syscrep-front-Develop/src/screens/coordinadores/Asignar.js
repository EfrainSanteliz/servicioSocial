import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './Styles.css';
import Navbar from '../../components/coordinadores/Navbar/Navbar';
import Tabla from '../../components/coordinadores/Tabla/Tabla';
import Evaluar from '../../components/coordinadores/Evaluar/Evaluar';
import Header from '../../components/coordinadores/Header/Header';


function Asignar() {

    const [residences, setResidences] = useState([]);
    const [selectedResidencecontrol_number, setSelectedResidencecontrol_number] = useState(null);

    useEffect(() => {
        // Realizar una solicitud HTTP para obtener los datos de estudiantes desde tu servidor
        fetch(process.env.REACT_APP_API_URL+'residences')
            .then((response) => response.json())
            .then(({ data }) => setResidences(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    const handleEvaluarClick = (residences) => {
        setSelectedResidencecontrol_number(residences.student.control_number);
    }

   

    const Botones = ({ control_number }) => (
        <>
            <Button className="boton-asignar" style={{ marginRight: '10px' }}>Asignar</Button>
            <Button className="boton-evaluar" onClick={() => handleEvaluarClick({ student: { control_number } })} style={{ marginRight: '-30px' }}>Evaluar</Button>        </>
    );

    return (
        <div className='body-content'>
            <Navbar></Navbar>
            <Tabla residences={residences} contador={true} onEvaluarClick={handleEvaluarClick}>
                {( control_number) => (
                    <>
                        <Botones control_number={control_number} />
                    </>
                )}
            </Tabla>
        
                <Evaluar selectedResidencecontrol_number={selectedResidencecontrol_number} />         
        </div>
    );
}

export default Asignar;