import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/navbar";
import { AlumnosContext } from "../../context/AlumnosContext";
import { useLocation } from 'react-router-dom';
import { Table, Card, Alert } from "react-bootstrap";
import "./Styles.css";

const divStyle = {
  padding: 30,
  fontFamily: "montserrat",
  fontSize: "10px",
  marginLeft: "60px",
};
function ShowProyect() {
  const [residencesLoaded, setResidencesLoaded] = useState(false);
  const [proyectLoaded, setProyectLoaded] = useState(false);
  const [displayProyects, setDisplayProyects] = useState([]);
  const [displayResidences, setDisplayResidences] = useState([]);
  const { id, razonSocial, controlNumber } = useParams();
  const [proyect_id, setProyect_id] = useState([]);
  const [selectedProyect, setSelectedProyect] = useState([]);
  const [displayshowProyects, setShowDisplayProyects] = useState([]);

  const handleButtonClick = (Proyect_id) => {
    setProyect_id(Proyect_id);
    setSelectedProyect(Proyect_id);
  };

  const getProyects = async () => {
    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + "proyect/" + id);
      setDisplayProyects(data.data);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener los proyectos:", error);
    }
  };

  useEffect(() => {
    getProyects();
  }, []);

  useEffect(() => {
    const getResidences = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + "residences/" + controlNumber);
        setDisplayResidences(data.data);
        setResidencesLoaded(true);
        console.log(data);
      } catch (error) {
        console.error("Error al obtener las residencias:", error);

      }
    };
    const getProyects = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + "proyect/" + id + "/proyectId");
        setShowDisplayProyects(data.data);
        setProyectLoaded(true);
        console.log(data);
      } catch (error) {
        console.error("Error al obtener las residencias:", error);
        setProyectLoaded(true);
      }
    };

    getResidences();
    getProyects();
  }, [id]);

  const update = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(process.env.REACT_APP_API_URL + "residences/" + controlNumber + "/editProyect_id", {
        proyect_id, selectedProyect,
      });
      window.location.reload(); // Recargar toda la página
    } catch (error) { }
  };

  const EstablecerNull = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(process.env.REACT_APP_API_URL + "residences/" + controlNumber + "/editProyect_id", {
        proyect_id, selectedProyect,
      });
      window.location.reload(); // Recargar toda la página
    } catch (error) { }
  };

  return (
    <div id="">
      <Navbar user_type="student" />
      <div id="tabla-container" style={divStyle}>
        <Sidebar></Sidebar>
        {(residencesLoaded && proyectLoaded) && (
          <>
            <h2>Proyectos de la compañía {razonSocial}</h2>

            <Card>
              <Card.Body>
                {displayProyects.length === 0 ? (
                  <Alert variant="info">No hay proyectos</Alert>
                ) : (
                  <Table striped hover responsive>
                    <thead>
                      <tr>
                        <th>nombre Proyecto</th>
                        <th>numero Estudiantes</th>
                        <th>fecha Inicio</th>
                        <th>fecha Fin</th>
                        <th>nombre Asesor Externo</th>
                        <th>puesto Asesor Externo</th>
                        <th>correo Asesor Externo</th>
                        <th>numero Asesor Externo</th>
                        <th>Asesor Externo Egresado ITH</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayProyects.map((proyect) => (
                        <tr key={proyect.id}>

                          <td>{proyect.nombreProyecto}</td>
                          <td>{proyect.numeroEstudiantes}</td>
                          <td>{proyect.fechaInicio}</td>
                          <td>{proyect.fechaFin}</td>
                          <td>{proyect.nombreAsesorExterno}</td>
                          <td>{proyect.puestoAsesorExterno}</td>
                          <td>{proyect.correoAsesorExterno}</td>
                          <td>{proyect.numeroAsesorExterno}</td>
                          <td>{proyect.AsesorExternoEgresadoITH}</td>

                          <td>
                            {proyect.id === displayResidences.selectedProyect && (
                              <form onSubmit={EstablecerNull}>
                                <div id="cancelar">
                                  <button id = 'botonCancelar' onClick={() => { setProyect_id(null); setSelectedProyect(0); }}>
                                    Cancelar
                                  </button>
                                </div>
                              </form>
                            )}

                            {proyect.id !== displayResidences.selectedProyect && (
                              <form onSubmit={update}>
                                <div id="elegir">
                                  <button id = 'botonElegir' onClick={() => handleButtonClick(proyect.id)}>
                                    Elegir Proyecto 
                                  </button>
                                </div>
                              </form>
                            )}
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default ShowProyect;




