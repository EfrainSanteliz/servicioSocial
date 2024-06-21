import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import "./studentinfo.css";
import { AlumnosContext } from '../../context/AlumnosContext';

function StudentInfo() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [adviser, setAdviser] = useState(null);

    const { alumno } = useContext(AlumnosContext);

    useEffect(() => {


        axios.get(process.env.REACT_APP_API_URL + 'residences/' + alumno)
            .then(response => {
                setData(response.data.data);
                setLoading(false);
                console.log(response.data.data);

                getAsesor(alumno);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const getAsesor = async (control_number) => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL + 'residences/' + control_number);
            const adviser = data.data.adviser;

            if (adviser == null) return;

            setAdviser(`${adviser.name} ${adviser.last_name} ${adviser.second_last_name}`);
        } catch (e) {
            console.log(e);
        }
    }

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="student-info">
            <h1>Bienvenido  {`${data.student.last_name} ${data.student.second_last_name} ${data.student.name}`}</h1>
            <h2>Carrera: {data.student.career.name}</h2>
            { /*<p><strong>Proyecto:</strong> {data.proyect.name}</p>
            <p><strong>Empresa:</strong> {data.proyect.company.name}</p>*/}
            {adviser != null && <h6>Asesor asignado: {adviser}</h6>}

        </div>
    );
}

export default StudentInfo;