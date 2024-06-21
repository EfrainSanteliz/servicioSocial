//import React from 'react'

import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap'
//import './styles.css';

const divStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px', // Agrega un margen inferior
};


function  Header({residences}) {

  
    const [enProcesoCount, setEnProcesoCount] = useState(0);
    const [Aceptados, setAceptados] = useState(0);
    const [Denegados, setDenegados] = useState(0);
    const [Sinrevisar, setSinrevisar] = useState(0);

    useEffect(() => {
      // Función para contar cuántas veces aparece "En proceso" ,aceptados etc en la tabla
      const contarString = () => {
        let contadorEnProceso = 0;
        let contadorEnAceptados = 0;
        let contadorEnDenegados = 0;
        let contadorEnSinRevisar= 0;
  
        residences.forEach(({student}) => {
          if (student.estado === 'En Proceso') {
            contadorEnProceso++;
          }
          if (student.estado === 'Aceptado') {
            contadorEnAceptados++;
          }
          if (student.estado === 'Denegado') {
            contadorEnDenegados++;
          }
          if (student.estado === 'Sin revisar') {
            contadorEnSinRevisar++;
          }
        });
  
        setEnProcesoCount(contadorEnProceso);
        setAceptados(contadorEnAceptados);
        setDenegados(contadorEnDenegados);
        setSinrevisar(contadorEnSinRevisar);

      };
  
      contarString(); // Llama a la función cuando el componente se monta
    }, [residences]); // Asegúrate de que la función se ejecute cuando cambie la lista de estudiantes
  
     // Verificar si students existe y es un arreglo antes de usar map()
     if (!residences || !Array.isArray(residences)) {
        return <div>No hay estudiantes para mostrar.</div>;
}
    return (

        <div className="tabla-container">
        <div className="encabezado">
            <div style={divStyle}>
                <label htmlFor="aceptados">Aceptados:</label>
                <input type="text" id="aceptados" name="aceptados" value={Aceptados} readOnly />

                <label htmlFor="denegados">Denegados:</label>
                <input type="text" id="denegados" name="denegados" value={Denegados} readOnly/>

                <label htmlFor="enproceso">En proceso:</label>
                <input type="text" id="enproceso" name="enproceso" value={enProcesoCount} readOnly />

                <label htmlFor="sinrevisar">Sin revisar:</label>
                <input type="text" id="sinrevisar" name="sinrevisar" value={Sinrevisar} readOnly />
            </div>
        </div>
            <Table striped bordered hover>

              <thead>
                    <tr>
                        <th>#</th>
                        <th>Empresa</th>
                        <th>Titulo</th>
                        <th>Estado</th>
                        <th>Matricula</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Solicitud</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {residences.map(({student})=><Fila key={student.id} data={student} />)}
                </tbody>
            </Table>
        </div>
    )
}

function Fila({ data, botones }) { //componente de filas
  return (
      <tr>
          <td>{data.id}</td>
          <td>{data.empresa}</td>
          <td>{data.titulo}</td>
          <td>{data.estado}</td>
          <td>{data.matricula}</td>
          <td>{data.nombre}</td>
          <td>{data.apellido}</td>
          <td>{data.solicitud}</td>
          <td>{botones}</td>
      </tr>
  );
}

export default Header