import React, { useState, useEffect, useContext } from "react";
import { Table, Card } from "react-bootstrap";
import Modal from "react-modal";
import axios from "axios";
import { Link, useLocation } from "react-router-dom"; // Import Link from react-router-dom
import "./Styles.css";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/navbar";
import { AlumnosContext } from "../../context/AlumnosContext";
import { useParams } from "react-router-dom";

const divStyle = {
  padding: 50,
  fontFamily: "montserrat",
  fontSize: 11, // Ajusta este valor según tus preferencias

};

Modal.setAppElement("#root");

function ShowProgramas() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState([]);
  const { controlNumber } = useParams();

  const [displayCompanys, setDisplayCompanys] = useState([]);
  const [showCompanys, setShowCompanys] = useState([]);

  const [displayProyect, setDisplayProyects] = useState([]);
  const [data, setData] = useState([]);
  const { alumno } = useContext(AlumnosContext);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    getCompanys();
    getProyects();
  }, []);

  const getCompanys = async () => {
    const { data } = await axios.get(process.env.REACT_APP_API_URL + 'company/');
    setDisplayCompanys(data.data);
    console.log(data);
  };

  const getProyects = async () => {
    const { data } = await axios.get(process.env.REACT_APP_API_URL + 'proyect/');
    setDisplayProyects(data.data);
    console.log(data);
  };

  return (

    <div>
      <Sidebar />
      <Navbar user_type={"coordinators"} />
      <div id="tabla-container" style={divStyle}>
        <div id="separacion">
          <Card>
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    {/*<th>id</th>*/}
                    <th width="100px">Razon Social</th>
                    <th width="200px">Nombre Empresa</th>
                    <th width="90px">Rfc Empresa</th>
                    <th width="100px">Mision </th>
                    <th width="100px">Direccion </th>
                    <th width="100px">Colonia </th>
                    <th width="100px">Telefono </th>
                    <th width="150px">Correo </th>
                    <th width="100px">Ciudad </th>
                    <th width="100px">cp Empresa</th>

                    <th style={{ width: "150px", paddingLeft: "25px" }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayCompanys.map((company, idx) => (
                    <tr key={idx}>
                      <td width="100px">{company.razonSocial}</td>
                      <td width="200px">{company.nombreEmpresa}</td>
                      <td width="90px">{company.rfcEmpresa}</td>
                      <td width="100px">{company.misionEmpresa}</td>
                      <td width="100px">{company.direccionEmpresa}</td>
                      <td width="100px">{company.coloniaEmpresa}</td>
                      <td width="100px">{company.telefonoEmpresa}</td>
                      <td width="150px">{company.correoEmpresa}</td>
                      <td width="100px">{company.ciudadEmpresa}</td>
                      <td width="100px">{company.cpEmpresa}</td>

                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {/* Utiliza Link para navegar al componente ShowProyects */}
                          <Link
                            to={`/proyect/${company.id}/${encodeURIComponent(company.razonSocial)}/${controlNumber}/`}
                          >
                            Ver proyectos
                          </Link>

                          {<div id="separacion" style={{ marginLeft: "10px" }}>
                            <button onClick={() => {
                              setModalIsOpen(true);
                              setSelectedCompanyId(company.id);
                            }}>Ver mas</button>                          </div>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>


          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
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
              onClick={closeModal}
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

            <Card>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      {/*<th>id</th>*/}

                      <th width="100px">Titulo Persona titular</th>
                      <th width="100px">Nombre Persona titular</th>
                      <th width="100px">Cargo Persona titular</th>
                      <th width="100px">Responsable Residencias</th>
                      <th width="100px">Cargo Responsable Residencias</th>
                      <th width="100px">Tamaño Empresa</th>
                      <th width="100px">Sector Empresa</th>
                      <th width="100px">Giro Empresa</th>
                      <th width="100px">Es Institucion Academica</th>
                      <th width="100px">Es Empresa Sin Fines De Lucro</th>
                      <th width="100px">Industria</th>

                      <th style={{ width: "100px", paddingLeft: "25px" }}>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayCompanys.filter(company => company.id === selectedCompanyId ).map((company, idx) => (
                      <tr key={idx}>
                        <td width="100px">{company.tituloPersonatitular}</td>
                        <td width="100px">{company.nombrePersonatitular}</td>
                        <td width="100px">{company.cargoPersonatitular}</td>
                        <td width="100px">{company.responsableResidencias}</td>
                        <td width="100px">{company.cargoResponsableResidencias}</td>
                        <td width="100px">{company.tamañoEmpresa}</td>
                        <td width="100px">{company.sectorEmpresa}</td>
                        <td width="100px">{company.giroEmpresa}</td>
                        <td width="100px">{company.EsInstitucionAcademica}</td>
                        <td width="100px">{company.EsEmpresaSinFinesDeLucro}</td>
                        <td width="100px">{company.Industria}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Link
                              to={`/proyect/${company.id}/${encodeURIComponent(company.razonSocial)}/${controlNumber}/`}
                            >
                              Ver proyectos
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            <br></br> <br></br>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ShowProgramas;
