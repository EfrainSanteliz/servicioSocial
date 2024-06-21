import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import { AlumnosContext } from "../../context/AlumnosContext";
import axios from 'axios';

Modal.setAppElement("#root");

function Alumnoinfo() {
  const [data, setData] = useState({ student: {} }); // Inicializa con un objeto que tiene la propiedad 'student'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { alumno } = useContext(AlumnosContext);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL+'student/' + alumno)
      .then(response => {
        setData(response.data.data); // Asegúrate de que la respuesta tiene la estructura correcta
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [alumno]); // Dependencia de useEffect

  // Comprueba si 'data' y 'data.student' están definidos antes de intentar renderizar el componente
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data.student) return <div>No se encontraron datos del estudiante.</div>;


  return (
         
          <div className="Title4">
            1. No. de Control
            <br />
            <input type="text" name="controlNumber" value={data.student.control_number} readOnly />
            <br />
            <br />
            2. Carrera
            <br />
            <input type="text" name="Carrer" value={data.student.career.name}  readOnly />
            <br />
            <br />
            3. Coordinador de Residencias
            <br />
            <input type="text" name="Coodinator" value={data.student.coordinators[1].name}  readOnly />
            <br />
            <br />
            4. Nombre(s)
            <br />
            <input type="text" name="Name" value={data.student.name} readOnly />
            <br />
            <br />
            5. Apellido Paterno
            <br />
            <input type="text" name="FLastname" value={data.student.last_name} readOnly />
            <br />
            <br />
            6. Apellido Materno
            <br />
            <input type="text" name="MLastname" value={data.student.second_last_name} readOnly />
            <br />
            </div>
  );
}

export default Alumnoinfo;
