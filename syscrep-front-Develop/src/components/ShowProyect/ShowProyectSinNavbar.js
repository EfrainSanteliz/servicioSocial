import { Table, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import UpdateProyects from "../UpdateProyects/UpdateProyects";
import Modal from "react-modal";
import StoreProyect from "../StoreProyect/StoreProyect";
import "./Styles.css";
Modal.setAppElement("#root");

function ShowProyectSinNavbar({

  selectedCompanyId,
  solicitudRealizada,
  nameCompany

}) {
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [selectedProyectId, setSelectedProyecId] = useState(null);
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [numeroEstudiantes, setNumeroEstudiantes] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [nombreAsesorInterno, setNombreAsesorInterno] = useState(""); // Add this line
  const [nombreAsesorExterno, setNombreAsesorExterno] = useState(""); // Add this line
  const [puestoAsesorExterno, setPuestoAsesorExterno] = useState(""); // Add this line
  const [correoAsesorExterno, setCorreoAsesorExterno] = useState(""); // Add this line
  const [numeroAsesorExterno, setNumeroAsesorExterno] = useState(""); // Add this line
  const [AsesorExternoEgresadoITH, setAsesorExternoEgresadoITH] = useState(""); // Add this line
  const [displayProyects, setDisplayProyects] = useState([]);
  const [solicitudRealizada2, setSolicitudRealizada2] = useState(solicitudRealizada);

  const getProyects = async () => {
    if (!selectedCompanyId) {
      return;
    }

    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_URL + 'proyect/' + selectedCompanyId

      );
      setDisplayProyects(data.data);
      console.log(data);
    } catch (error) {
      setDisplayProyects([]);

      console.error("Error al obtener los proyectos:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (solicitudRealizada2 && displayProyects) {
        await getProyects();
        setSolicitudRealizada2(false);
      }
    };

    fetchData();
  }, [solicitudRealizada2, displayProyects]);


  useEffect(() => {

    const selectedProyect = displayProyects.find(
      (proyect) => proyect.id === selectedProyectId
    );
    setNombreProyecto(selectedProyect ? selectedProyect.nombreProyecto : "");
    setNumeroEstudiantes(selectedProyect ? selectedProyect.numeroEstudiantes : "");
    setFechaInicio(selectedProyect ? selectedProyect.fechaInicio : "");
    setFechaFin(selectedProyect ? selectedProyect.fechaFin : "");
    setNombreAsesorInterno(selectedProyect ? selectedProyect.nombreAsesorInterno : "");
    setNombreAsesorExterno(selectedProyect ? selectedProyect.nombreAsesorExterno : "");
    setPuestoAsesorExterno(selectedProyect ? selectedProyect.puestoAsesorExterno : "");
    setCorreoAsesorExterno(selectedProyect ? selectedProyect.correoAsesorExterno : "");
    setNumeroAsesorExterno(selectedProyect ? selectedProyect.numeroAsesorExterno : "");
    setAsesorExternoEgresadoITH(selectedProyect ? selectedProyect.AsesorExternoEgresadoITH : "");

  }, [selectedProyectId, displayProyects]);
  const handleUpdateProyect = (projectId) => {
    setModalUpdateIsOpen(true);
    setSelectedProyecId(projectId);
  };
  const closeModalUpdate = () => {
    setModalUpdateIsOpen(false);
    setSelectedProyecId(null);
  };



  const handleDeleteProyect = async (projectId) => {
    try {
      await axios.delete(process.env.REACT_APP_API_URL + 'proyect/' + projectId);
      getProyects();
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
    }
  };

  return (
    <div id="tabla" >
      <div id="separacion">

        <StoreProyect
          selectedCompanyId={selectedCompanyId}
          nameCompany={nameCompany}
          updateProyects={getProyects}
        />
        <br />
        {displayProyects === 0 ? (
          <p>No hay proyectos disponibles.</p>
        ) : (
          <Card>
            <Card.Body>
              <Table id="tablaShowProyectSinNavbar" striped hover responsive >
                <thead>
                  <tr>
                    {/*<th>id</th>*/}

                    <th>nombre Proyecto</th>
                    <th>numero Estudiantes</th>
                    <th>fecha Inicio</th>
                    <th>fecha Fin</th>
                    <th>#nombre Asesor Externo</th>
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
                      {/*<td>{proyect.id}</td>*/}

                      <td>{proyect.nombreProyecto}</td>
                      <td>{proyect.numeroEstudiantes}</td>
                      <td>{proyect.fechaInicio}</td>
                      <td>{proyect.fechaFin}</td>
                      <td>{proyect.nombreAsesorExterno}</td>
                      <td>{proyect.puestoAsesorExterno}</td>
                      <td>{proyect.correoAsesorExterno}</td>
                      <td>{proyect.numeroAsesorExterno}</td>
                      <td>{proyect.AsesorExternoEgresadoITH}</td>

                      <td width="90px">
                        <button
                          onClick={() => handleDeleteProyect(proyect.id)}
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{
                              color: "red",
                              fontSize: "18px",
                            }}
                          />
                        </button>
                        <button
                          onClick={() => handleUpdateProyect(proyect.id)}
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            style={{
                              color: "blue",
                              fontSize: "18px",
                            }}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        <Modal
          isOpen={modalUpdateIsOpen}
          onRequestClose={closeModalUpdate}
          contentLabel="Example Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            content: {
              width: "96%",
              height: "100%",
              marginLeft: "0px",
              marginRight: "0px",
              marginTop: "0%",
              position: "relative",
              overflow: "auto",
            },
          }}
        >
          <button
            onClick={closeModalUpdate}
            style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              zIndex: "1",
              background: "white",
              border: "1px solid #000",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "18px",
              color: "black",
              padding: "8px",
              top: "50px",
              right: "20px",
            }}
          >
            Cerrar
          </button>
          <UpdateProyects

            selectedProyectId={selectedProyectId}
            SelectednombreProyecto={nombreProyecto}
            SelectednumeroEstudiantes={numeroEstudiantes}
            SelectedfechaInicio={fechaInicio}
            SelectedfechaFin={fechaFin}
            SelectednombreAsesorInterno={nombreAsesorInterno}
            SelectednombreAsesorExterno={nombreAsesorExterno}
            SelectedpuestoAsesorExterno={puestoAsesorExterno}
            SelectedcorreoAsesorExterno={correoAsesorExterno}
            SelectednumeroAsesorExterno={numeroAsesorExterno}
            SelectedAsesorExternoEgresadoITH={AsesorExternoEgresadoITH}

            updateProyects={getProyects}

          />
          <br></br> <br></br>
        </Modal>
      </div>
    </div>
  );
}

export default ShowProyectSinNavbar;
