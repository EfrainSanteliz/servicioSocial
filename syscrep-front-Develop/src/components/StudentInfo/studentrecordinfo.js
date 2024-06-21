import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./studentinfo.css";

function StudentRecordInfo(control_number) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [adviser, setAdviser] = useState(null);


  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + 'student/' + control_number.alumno)
      .then(response => {
        setData(response.data.data); // Asegúrate de que la respuesta tiene la estructura correcta
        setLoading(false);

        getAsesor(control_number.alumno);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [control_number]); // Dependencia de useEffect

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

  // Comprueba si 'data' y 'data.student' están definidos antes de intentar renderizar el componente
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data.student) return <div>No se encontraron datos del estudiante.</div>;

  return (
    <div className="student-info">

      <h3>Nombre Alumno: {data.student.name} {data.student.last_name} {data.student.second_last_name} </h3>
      <h3>No. de Control: {data.student.control_number}</h3>
      <h3>Carrera: {data.student.career.name}</h3>
      {adviser != null && <h6>Asesor asignado: {adviser}</h6>}

    </div>
  );
}

export default StudentRecordInfo;