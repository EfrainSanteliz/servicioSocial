import React, { useState, useEffect } from "react";
import { Table, Card } from "react-bootstrap";
import Modal from "react-modal";
import axios from "axios";
import ShowProyectSinNavbar from "../ShowProyect/ShowProyectSinNavbar";
import StoreProyect from "../StoreProyect/StoreProyect";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdateCompany from "../UpdateCompany/UpdateCompany";
import "./Styles.css";//

const divStyle = {
  padding: 0,
  marginLeft: "15px",
  marginRight: "50px",
  fontSize: 11, // Ajusta este valor según tus preferencias
};

Modal.setAppElement("#root");

function ShowCompany({ companys, updateCompanys }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedrazonSocial, setSelectedCompanyName] = useState("");
  const [selectednombreEmpresa, setSelectedCompanynamecompany] = useState("");
  const [selectedrfcEmpresa, setSelectedCompanyRFC] = useState("");
  const [selectedmisionEmpresa, setSelectedCompanyMission] = useState("");
  const [selecteddireccionEmpresa, setSelectedCompanyAddress] = useState("");
  const [selectedcoloniaEmpresa, setSelectedCompanyColony] = useState("");
  const [selectedtelefonoEmpresa, setSelectedCompanyPhone] = useState("");
  const [selectedcorreoEmpresa, setSelectedCompanyEmail] = useState("");
  const [selectedciudadEmpresa, setSelectedCompanyCity] = useState("");
  const [selectedcpEmpresa, setSelectedCompanyPostalCode] = useState("");
  const [selectedtituloPersonatitular, setSelectedPersonTitle] = useState("");
  const [selectednombrePersonatitular, setSelectedPersonName] = useState("");
  const [selectedcargoPersonatitular, setSelectedPersonPosition] = useState("");
  const [selectedresponsableResidencias, setSelectedResponsible] = useState("");
  const [selectedcargoResponsableResidencias, setSelectedResponsiblePosition] = useState("");
  const [selectedtamañoEmpresa, setSelectedCompanySize] = useState("");
  const [selectedsectorEmpresa, setSelectedCompanySector] = useState("");
  const [selectedgiroEmpresa, setSelectedCompanyTurn] = useState("");
  const [selectedEsInstitucionAcademica, setSelectedIsAcademicInstitution] = useState("");
  const [selectedEsEmpresaSinFinesDeLucro, setSelectedIsNonProfit] = useState("");
  const [selectedIndustria, setSelectedIndustry] = useState("");

  const [browser, setBrowser] = useState("");
  const [filteredCompanys, setFilteredCompanys] = useState([]);
  const [solicitudRealizada, setSolicitudRealizada] = useState(true);
  const [seleccionCompanyId, setSeleccionCompanyId] = useState(false);
  const [selectedCompanyId2, setSelectedCompanyId2] = useState(null);


  useEffect(() => {

    updateSelectedCompanyDetails();
  }, [selectedCompanyId, companys, solicitudRealizada]);


  const updateSelectedCompanyDetails = () => {
    const selectedCompany = companys.find(
      (company) => company.id === selectedCompanyId
    );

    setSelectedCompanyName(selectedCompany ? selectedCompany.razonSocial : "");
    setSelectedCompanynamecompany(selectedCompany ? selectedCompany.nombreEmpresa : "");
    setSelectedCompanyRFC(selectedCompany ? selectedCompany.rfcEmpresa : "");
    setSelectedCompanyMission(selectedCompany ? selectedCompany.misionEmpresa : "");
    setSelectedCompanyAddress(selectedCompany ? selectedCompany.direccionEmpresa : "");
    setSelectedCompanyColony(selectedCompany ? selectedCompany.coloniaEmpresa : "");
    setSelectedCompanyPhone(selectedCompany ? selectedCompany.telefonoEmpresa : "");
    setSelectedCompanyEmail(selectedCompany ? selectedCompany.correoEmpresa : "");
    setSelectedCompanyCity(selectedCompany ? selectedCompany.ciudadEmpresa : "");
    setSelectedCompanyPostalCode(selectedCompany ? selectedCompany.cpEmpresa : "");
    setSelectedPersonTitle(selectedCompany ? selectedCompany.tituloPersonatitular : "");
    setSelectedPersonName(selectedCompany ? selectedCompany.nombrePersonatitular : "");
    setSelectedPersonPosition(selectedCompany ? selectedCompany.cargoPersonatitular : "");
    setSelectedResponsible(selectedCompany ? selectedCompany.responsableResidencias : "");
    setSelectedResponsiblePosition(selectedCompany ? selectedCompany.cargoResponsableResidencias : "");
    setSelectedCompanySize(selectedCompany ? selectedCompany.tamañoEmpresa : "");
    setSelectedCompanySector(selectedCompany ? selectedCompany.sectorEmpresa : "");
    setSelectedCompanyTurn(selectedCompany ? selectedCompany.giroEmpresa : "");
    setSelectedIsAcademicInstitution(selectedCompany ? selectedCompany.EsInstitucionAcademica : "");
    setSelectedIsNonProfit(selectedCompany ? selectedCompany.EsEmpresaSinFinesDeLucro : "");
    setSelectedIndustry(selectedCompany ? selectedCompany.Industria : "")
  };

  useEffect(() => {
    // Update filtered companies when the browser value changes
    setFilteredCompanys(
      companys.filter((company) =>
        Object.values(company).some((value) =>
          value.toString().toLowerCase().includes(browser.toLowerCase())
        )
      )
    );
  }, [browser, companys]);

  const handleButtonClick = () => {
    setModalIsOpen(true);

  };

  const handleUpdateCompany = (companyId) => {
    setModalUpdateIsOpen(true);
    setSelectedCompanyId(companyId);
  };
  const handleDeleteCompany = async (companyId) => {
    try {
      await axios.delete(process.env.REACT_APP_API_URL +'company/'+ companyId);
      updateCompanys();
    } catch (error) {
      console.error("Error al eliminar la empresa:", error);
    }
  };
  const closeModalUpdate = () => {
    setModalUpdateIsOpen(false);
    setSelectedCompanyId(null);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCompanyId(null);
  };



  return (
    <div>
      <div id="tabla-container" style={divStyle}>
        <div id="divContainer">
          <label id="form-label">BUSCAR : </label>
          <div id="inputContainer">
            <input
              value={browser}
              onChange={(e) => {
                setBrowser(e.target.value);
              }}
              type="text"
              className="form-control inputField"
              placeholder=""
            />
          </div>
        </div>
        <Card>
          <Card.Body>
            <Table striped hover responsive>
              <thead>
                <tr>

                  {/*<th width="100px">id</th>*/}
                  <th width="100px">razon Social</th>
                  <th width="150px">nombre </th>
                  <th width="120px">rfc </th>
                  <th width="200px">mision </th>
                  <th width="120px">direccion </th>
                  <th width="100px">colonia </th>
                  <th width="100px">telefono </th>
                  <th width="100px">correo </th>
                  <th width="100px">ciudad </th>
                  <th width="100px">cp </th>
                  <th width="100px">titulo Persona titular</th>
                  <th width="100px">nombre Persona titular</th>
                  <th width="100px">cargo Persona titular</th>
                  <th width="100px">responsable Residencias</th>
                  <th width="100px">cargo Responsable Residencias</th>
                  <th width="100px">tamaño </th>
                  <th width="100px">sector </th>
                  <th width="100px">giro Empresa</th>
                  <th width="100px">Es Institucion Academica</th>
                  <th width="100px">Es Empresa Sin Fines De Lucro</th>
                  <th width="100px">Industria</th>

                  <th style={{ width: "100px", paddingLeft: "25px" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanys.map((company, idx) => (
                  <tr key={idx}>
                    {/*<td>{company.id}</td>*/}
                    <td width="100px">{company.razonSocial}</td>
                    <td width="150px">{company.nombreEmpresa}</td>
                    <td width="120px">{company.rfcEmpresa}</td>
                    <td width="200px">{company.misionEmpresa}</td>
                    <td width="120px">{company.direccionEmpresa}</td>
                    <td width="100px">{company.coloniaEmpresa}</td>
                    <td width="100px">{company.telefonoEmpresa}</td>
                    <td width="100px">{company.correoEmpresa}</td>
                    <td width="100px">{company.ciudadEmpresa}</td>
                    <td width="100px">{company.cpEmpresa}</td>
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



                    <td width="50px" style={{ textAlign: "center" }}>
                      <div id="botones">
                        <button
                          onClick={() => {
                            handleButtonClick();
                            setSelectedCompanyId(company.id);
                          }}
                          style={{
                            border: "none", // Quitar el borde del botón
                            backgroundColor: "transparent", // o puedes usar "inherit"
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{
                              color: "green",
                              fontSize: "18px",
                            }}
                          />
                        </button>
                        <div id="separacion_entre_botones">
                          <button
                            onClick={() => handleDeleteCompany(company.id)}
                            style={{
                              border: "none", // Quitar el borde del botón
                              backgroundColor: "transparent", // o puedes usar "inherit"
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
                        </div>
                        <button
                          onClick={() => handleUpdateCompany(company.id)}
                          style={{
                            border: "none", // Quitar el borde del botón
                            backgroundColor: "transparent", // o puedes usar "inherit"
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
          <div id="separacion">

          </div>

          <div id="showProyect">
            <ShowProyectSinNavbar
              nameCompany={selectedrazonSocial}
              solicitudRealizada={solicitudRealizada}
              selectedCompanyId={selectedCompanyId}
            />
          </div>

        </Modal>

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
          <UpdateCompany
          updateCompanys={updateCompanys}
            SelectedCompanyId={selectedCompanyId}
            SelectedrazonSocial={selectedrazonSocial}
            SelectednombreEmpresa={selectednombreEmpresa}
            SelectedrfcEmpresa={selectedrfcEmpresa}
            SelectedmisionEmpresa={selectedmisionEmpresa}
            SelecteddireccionEmpresa={selecteddireccionEmpresa}
            SelectedcoloniaEmpresa={selectedcoloniaEmpresa}
            SelectedtelefonoEmpresa={selectedtelefonoEmpresa}
            SelectedcorreoEmpresa={selectedcorreoEmpresa}
            SelectedciudadEmpresa={selectedciudadEmpresa}
            SelectedcpEmpresa={selectedcpEmpresa}
            SelectedtituloPersonatitular={selectedtituloPersonatitular}
            SelectednombrePersonatitular={selectednombrePersonatitular}
            SelectedcargoPersonatitular={selectedcargoPersonatitular}
            SelectedresponsableResidencias={selectedresponsableResidencias}
            SelectedcargoResponsableResidencias={selectedcargoResponsableResidencias}
            SelectedtamañoEmpresa={selectedtamañoEmpresa}
            SelectedsectorEmpresa={selectedsectorEmpresa}
            SelectedgiroEmpresa={selectedgiroEmpresa}
            SelectedEsInstitucionAcademica={selectedEsInstitucionAcademica}
            SelectedEsEmpresaSinFinesDeLucro={selectedEsEmpresaSinFinesDeLucro}
            SelectedIndustria={selectedIndustria} />
          <br></br> <br></br>
        </Modal>
      </div>
    </div>
  );
}

export default ShowCompany;
