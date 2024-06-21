import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"; // Import Modal from 'react-modal'
import "./Styles.css";

Modal.setAppElement("#root");

const divStyle = {
  padding: 20,
  fontFamily: "montserrat",
  marginLeft: "450px",
  marginRight: "30px",
};
const divStyleinput = {
  padding: "5px" /* Ajusta el padding según tus preferencias */,
  width:
    "100%" /* O ajusta el valor según tus necesidades (ej. width: '300px;') */,
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
  fontSize: "14px",
};


const StoreCompany = ({ updateCompanys }) => {

  const [razonSocial, setRazonSocial] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [rfcEmpresa, setRfcEmpresa] = useState("");
  const [misionEmpresa, setMisionEmpresa] = useState("");
  const [direccionEmpresa, setDireccionEmpresa] = useState("");
  const [coloniaEmpresa, setColoniaEmpresa] = useState("");
  const [telefonoEmpresa, setTelefonoEmpresa] = useState("");
  const [correoEmpresa, setCorreoEmpresa] = useState("");
  const [ciudadEmpresa, setCiudadEmpresa] = useState("");
  const [cpEmpresa, setCpEmpresa] = useState("");
  const [tituloPersonatitular, setTituloPersonatitular] = useState("");
  const [nombrePersonatitular, setNombrePersonatitular] = useState("");
  const [cargoPersonatitular, setCargoPersonatitular] = useState("");
  const [responsableResidencias, setResponsableResidencias] = useState("");
  const [cargoResponsableResidencias, setCargoResponsableResidencias] = useState("");
  const [tamañoEmpresa, setTamañoEmpresa] = useState("");
  const [sectorEmpresa, setSectorEmpresa] = useState("");
  const [giroEmpresa, setGiroEmpresa] = useState("");
  const [EsInstitucionAcademica, setEsInstitucionAcademica] = useState("");
  const [EsEmpresaSinFinesDeLucro, setEsEmpresaSinFinesDeLucro] = useState("");
  const [document, setDocument] = useState("");

  const [Industria, setIndustria] = useState("");

  const nameRef = useRef(null);
  const addressRef = useRef(null);
  const phone_numberRef = useRef(null);
  const in_chargeRef = useRef(null);
  const emailRef = useRef(null);
  const tradenameRef = useRef(null);
  const rfcCompanyRef = useRef(null);
  const companyMissionRef = useRef(null);
  const cologneRef = useRef(null);
  const cityRef = useRef(null);
  const postal_codeRef = useRef(null);
  const title_in_chargeRef = useRef(null);
  const cargo_puestoRef = useRef(null);
  const NameResposableResidencesRef = useRef(null);
  const Cargo_o_Puesto_Responsable_ResidencesRef = useRef(null);
  const sizeCompayRef = useRef(null);
  const sectorCompanyRef = useRef(null);
  const giroRef = useRef(null);
  const companyIsinstitucionAcademiRef = useRef(null);
  const companyIsnonprofitfRef = useRef(null);
  const typeIndustriRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Enfocar en el primer campo con error después de haber establecido los errores
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      switch (firstErrorKey) {
        case "name":
          nameRef.current && nameRef.current.focus();
          break;
        case "address":
          addressRef.current && addressRef.current.focus();
          break;
        case "phone_number":
          phone_numberRef.current && phone_numberRef.current.focus();
          break;
        case "in_charge":
          in_chargeRef.current && in_chargeRef.current.focus();
          break;
        case "correoEmpresa":
          emailRef.current && emailRef.current.focus();
          break;
        case "tradename":
          tradenameRef.current && tradenameRef.current.focus();
          break;
        case "rfcEmpresa":
          rfcCompanyRef.current && rfcCompanyRef.current.focus();
          break;
        case "companyMission":
          companyMissionRef.current && companyMissionRef.current.focus();
          break;
        case "cologne":
          cologneRef.current && cologneRef.current.focus();
          break;
        case "city":
          cityRef.current && cityRef.current.focus();
          break;
        case "postal_code":
          postal_codeRef.current && postal_codeRef.current.focus();
          break;
        case "title_in_charge":
          title_in_chargeRef.current && title_in_chargeRef.current.focus();
          break;
        case "cargo_puesto":
          cargo_puestoRef.current && cargo_puestoRef.current.focus();
          break;
        case "NameResposableResidences":
          NameResposableResidencesRef.current && NameResposableResidencesRef.current.focus();
          break;
        case "Cargo_o_Puesto_Responsable_Residences":
          Cargo_o_Puesto_Responsable_ResidencesRef.current && Cargo_o_Puesto_Responsable_ResidencesRef.current.focus();
          break;
        case "sizeCompay":
          sizeCompayRef.current && sizeCompayRef.current.focus();
          break;
        case "sectorCompany": sectorCompanyRef.current && sectorCompanyRef.current.focus();
          break;
        case "giro":
          giroRef.current && giroRef.current.focus();
          break;
        case "companyIsinstitucionAcademi":
          companyIsinstitucionAcademiRef.current && companyIsinstitucionAcademiRef.current.focus();
          break; case "companyIsnonprofitf":
          companyIsnonprofitfRef.current && companyIsnonprofitfRef.current.focus();
          break; case "typeIndustri":
          typeIndustriRef.current && typeIndustriRef.current.focus();
          break;

        default:
          break;
      }
    }
  }, [errors]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const [message] = useState("Este campo no puede estar vacio");
  const store = async (e) => {
    e.preventDefault();
    const fieldErrors = {};

    if (!correoEmpresa) fieldErrors.correoEmpresa = message;
    else if (!isValidEmail(correoEmpresa)) fieldErrors.correoEmpresa = 'Introduce un correo electrónico válido';
    if (!rfcEmpresa) fieldErrors.rfcEmpresa = message;
    else if (!isValidRFC(rfcEmpresa)) fieldErrors.rfcEmpresa = 'Introduce un rfc valido';
    // if (!type) fieldErrors.type = message;
    const formData = new FormData();
    formData.append('razonSocial', razonSocial);
    formData.append('nombreEmpresa', nombreEmpresa);
    formData.append('rfcEmpresa', rfcEmpresa);
    formData.append('misionEmpresa', misionEmpresa);
    formData.append('direccionEmpresa', direccionEmpresa);
    formData.append('coloniaEmpresa', coloniaEmpresa);
    formData.append('telefonoEmpresa', telefonoEmpresa);
    formData.append('correoEmpresa', correoEmpresa);
    formData.append('ciudadEmpresa', ciudadEmpresa);
    formData.append('cpEmpresa', cpEmpresa);
    formData.append('tituloPersonatitular', tituloPersonatitular);
    formData.append('nombrePersonatitular', nombrePersonatitular);
    formData.append('cargoPersonatitular', cargoPersonatitular);
    formData.append('responsableResidencias', responsableResidencias);
    formData.append('cargoResponsableResidencias', cargoResponsableResidencias);
    formData.append('tamañoEmpresa', tamañoEmpresa);
    formData.append('sectorEmpresa', sectorEmpresa);
    formData.append('giroEmpresa', giroEmpresa);
    formData.append('EsInstitucionAcademica', EsInstitucionAcademica);
    formData.append('EsEmpresaSinFinesDeLucro', EsEmpresaSinFinesDeLucro);
    formData.append('Industria', Industria);


    try {
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return;
      }

      const response = await axios.post(process.env.REACT_APP_API_URL + 'company/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Llama a la función de actualización proporcionada por el padre
      updateCompanys(response.data.data);

      // Reiniciar el campo de texto a una cadena vacía después de agregar la compañía
      setRazonSocial("");
      setNombreEmpresa("");
      setRfcEmpresa("");
      setMisionEmpresa("");
      setDireccionEmpresa("");
      setColoniaEmpresa("");
      setTelefonoEmpresa("");
      setCorreoEmpresa("");
      setCiudadEmpresa("");
      setCpEmpresa("");
      setTituloPersonatitular("");
      setNombrePersonatitular("");
      setCargoPersonatitular("");
      setResponsableResidencias("");
      setCargoResponsableResidencias("");
      setTamañoEmpresa("");
      setSectorEmpresa("");
      setGiroEmpresa("");
      setEsInstitucionAcademica("");
      setEsEmpresaSinFinesDeLucro("");
      setIndustria("");


      setErrors({}); // Reinicia los errores después de una operación exitosa

      // Cerrar el modal después de agregar la compañía
      closeModal();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Manejar error de validación (422 Unprocessable Entity)
        alert("No puedes agregar compañías duplicadas.");
      } else {
        console.error("Error al crear la empresa:", error);
      }
    }
  };

  const isValidEmail = (email) => {
    // Expresión regular para validar direcciones de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidRFC = (rfc) => {
    // Expresión regular para validar claves
    const rfcRegex = /^([A-ZÑ\x26]{3}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/;

    return rfcRegex.test(rfc);
  };
  //console.log(isValidRFC("EXT990101NI45")); // Output: true


  const handleChange = (e, setState) => {
    setState(e.target.value.toUpperCase());
  };

  return (
    <div>
      <div id="agregarCompañia" style={divStyle}>
        <button onClick={openModal} className="btn btn-primary">
          AGREGAR COMPAÑIA
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Store Company Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "96%",
            height: "95%",
            marginLeft: "0px",
            marginRight: "60px",
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
            top: "20px",
            right: "20px",
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
          <h3>Agregar Compañia</h3>
          <form onSubmit={store}>
            <div id="mb-3">
              <label id="form-label">1. Nombre con el que está dado de alta en hacienda (SAT) </label>
              <input
                value={razonSocial}
                onChange={(e) => handleChange(e, setRazonSocial)}
                type="text"
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.razonSocial ? "is-invalid" : ""}`}
              />
              {errors.razonSocial && <div id="invalid-feedback">{errors.razonSocial}</div>}

              <label id="form-label">2. Nombre comercial de la Empresa</label>
              <input
                value={nombreEmpresa}
                onChange={(e) => handleChange(e, setNombreEmpresa)}
                type="text"
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.tradename ? "is-invalid" : ""}`}
              />
              {errors.tradename && <div id="invalid-feedback">{errors.tradename}</div>}
              <label id="form-label">3. Rfc de la compania</label>
              <input
                value={rfcEmpresa}
                onChange={(e) => handleChange(e, setRfcEmpresa)}
                type="text"
                ref={rfcCompanyRef}
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.rfcEmpresa ? "is-invalid" : ""}`}
              />
              {errors.rfcEmpresa && <div id="invalid-feedback">{errors.rfcEmpresa}</div>}

              <label id="form-label">4. Mision de la empresa</label>
              <input
                value={misionEmpresa}
                onChange={(e) => handleChange(e, setMisionEmpresa)}
                type="text"
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.companyMission ? "is-invalid" : ""}`}
              />
              {errors.companyMission && <div id="invalid-feedback">{errors.companyMission}</div>}

              <label id="form-label">5. Dirección calle y número</label>
              <input
                value={direccionEmpresa}
                onChange={(e) => handleChange(e, setDireccionEmpresa)}
                type="text"
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.address ? "is-invalid" : ""}`}
              />
              {errors.address && (
                <div id="invalid-feedback">{errors.address}</div>
              )}

              <label id="form-label">6. colonia de la empresa </label>
              <input
                value={coloniaEmpresa}
                onChange={(e) => handleChange(e, setColoniaEmpresa)}
                type="text"
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.cologne ? "is-invalid" : ""}`}
              />
              {errors.cologne && <div id="invalid-feedback">{errors.cologne}</div>}

              <label id="form-label">7. Telefono de contacto de la empresa</label>
              <input
                value={telefonoEmpresa}
                onChange={(e) => handleChange(e, setTelefonoEmpresa)}
                type="text"
                style={divStyleinput}
                required={true}
                inputMode={`form-control ${errors.phone_number ? "is-invalid" : ""
                  }`}
              />
              {errors.phone_number && (
                <div id="invalid-feedback">{errors.phone_number}</div>
              )}

              <label id="form-label">8. Email de la empresa</label>
              <input
                value={correoEmpresa}
                onChange={(e) => handleChange(e, setCorreoEmpresa)}
                type="text"
                ref={emailRef}
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.correoEmpresa ? "is-invalid" : ""}`}
              />
              {errors.correoEmpresa && <div id="invalid-feedback">{errors.correoEmpresa}</div>}


              <label id="form-label">9. Ciudad donde se encuentra ubicada la empresa</label>
              <input
                value={ciudadEmpresa}
                onChange={(e) => handleChange(e, setCiudadEmpresa)}
                type="text"
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.city2 ? "is-invalid" : ""}`}
              />
              {errors.city && <div id="invalid-feedback">{errors.city}</div>}

              <label id="form-label">10. Código Postal de la empresa</label>
              <input
                value={cpEmpresa}
                onChange={(e) => handleChange(e, setCpEmpresa)}
                type="text"
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.postal_code ? "is-invalid" : ""}`}
              />
              {errors.postal_code && <div id="invalid-feedback">{errors.postal_code
              }</div>}

              <label id="form-label">11. Nombre a quien se le dirigue el oficio. Director(a), Gerente General</label>
              <input
                value={nombrePersonatitular}
                onChange={(e) => handleChange(e, setNombrePersonatitular)}
                type="text"
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.in_charge ? "is-invalid" : ""}`}
              />
              {errors.in_charge && (
                <div id="invalid-feedback">{errors.in_charge}</div>
              )}

              <label id="form-label">12. Título del encargado</label>
              <select
                value={tituloPersonatitular}
                onChange={(e) => handleChange(e, setTituloPersonatitular)}
                className={`form-control ${errors.title_in_charge ? "is-invalid" : ""}`}
                style={divStyleinput}
                required={true}
              >
                <option defaultValue=""></option>
                <option value="ING">ING</option>
                <option value="LIC">LIC</option>
                <option value="M.C">M.C</option>
                <option value="M.A">M.A</option>
                <option value="DR">DR</option>
                <option value="C">C</option>
              </select>
              {errors.title_in_charge && <div id="invalid-feedback">{errors.title_in_charge}</div>}

              <label id="form-label">12. cargo o puesto del encargado </label>
              <input
                value={cargoPersonatitular}
                onChange={(e) => handleChange(e, setCargoPersonatitular)}
                type="text"
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.cargo_puesto2 ? "is-invalid" : ""}`}
              />
              {errors.cargo_puesto && (
                <div id="invalid-feedback">{errors.cargo_puesto}</div>
              )}

              <label id="form-label">13. Nombre del Responsable del programa de residencias de la empresa</label>
              <input
                value={responsableResidencias}
                onChange={(e) => handleChange(e, setResponsableResidencias)}
                type="text"
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.NameResposableResidences ? "is-invalid" : ""}`}
              />
              {errors.NameResposableResidences && (
                <div id="invalid-feedback">{errors.NameResposableResidences}</div>
              )}

              <label id="form-label">14. Cargo o puesto del responsable del programa de residencias de la empresa</label>
              <input
                value={cargoResponsableResidencias}
                onChange={(e) => handleChange(e, setCargoResponsableResidencias)}
                type="text"
                style={divStyleinput}
                required={true}
                id={`form-control ${errors.Cargo_o_Puesto_Responsable_Residences ? "is-invalid" : ""}`}
              />
              {errors.Cargo_o_Puesto_Responsable_Residences && (
                <div id="invalid-feedback">{errors.Cargo_o_Puesto_Responsable_Residences}</div>
              )}

              <label id="form-label">15. Tamaño de la empresa</label>
              <select
                value={tamañoEmpresa}
                onChange={(e) => handleChange(e, setTamañoEmpresa)}
                className={`form-control ${errors.sizeCompay ? "is-invalid" : ""}`}
                style={divStyleinput}
                required={true}
              >
                <option defaultValue=""></option>
                <option value="GRANDE">GRANDE</option>
                <option value="MEDIANA">MEDIANA</option>
                <option value="PEQUEÑA">PEQUEÑA</option>
                <option value="MICRO">MICRO</option>
              </select>
              {errors.sizeCompay && (
                <div id="invalid-feedback">{errors.sizeCompay}</div>
              )}

              <label id="form-label">16. Tipo Publico|Privado</label>
              <select
                value={sectorEmpresa}
                onChange={(e) => handleChange(e, setSectorEmpresa)}
                className={`form-control ${errors.type ? "is-invalid" : ""}`}
                style={divStyleinput}
                required={true}
              >
                <option defaultValue=""></option>
                <option value="PUBLICA">PUBLICA</option>
                <option value="PRIVADA">PRIVADA</option>
              </select>
              {errors.type && <div id="invalid-feedback">{errors.type}</div>}

              <label id="form-label">17. giro</label>
              <select
                value={giroEmpresa}
                onChange={(e) => handleChange(e, setGiroEmpresa)}
                className={`form-control ${errors.giro ? "is-invalid" : ""}`}
                style={divStyleinput}
                required={true}
              >
                <option defaultValue=""></option>
                <option value="INDUSTRIAL">INDUSTRIAL</option>
                <option value="SERVICIOS">SERVICIOS</option>
              </select>
              {errors.giro && (
                <div id="invalid-feedback">{errors.giro}</div>
              )}

              <label id="form-label">18. La compania es institución academica</label>
              <select
                value={EsInstitucionAcademica}
                onChange={(e) => handleChange(e, setEsInstitucionAcademica)}
                className={`form-control ${errors.giro ? "is-invalid" : ""}`}
                style={divStyleinput}
                required={true}
              >
                <option defaultValue=""></option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
              {errors.companyIsinstitucionAcademi && (
                <div id="invalid-feedback">{errors.companyIsinstitucionAcademi}</div>
              )}

              <label id="form-label">19. La compania es sin fines de lucro</label>
              <select
                value={EsEmpresaSinFinesDeLucro}
                onChange={(e) => handleChange(e, setEsEmpresaSinFinesDeLucro)}
                className={`form-control ${errors.giro ? "is-invalid" : ""}`}
                style={divStyleinput}
                required={true}
              >
                <option defaultValue=""></option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
              {errors.companyIsnonprofit && (
                <div id="invalid-feedback">{errors.companyIsnonprofit}</div>
              )}
              <label id="form-label">Tipo de industria</label>
              <select
                value={Industria}
                onChange={(e) => handleChange(e, setIndustria)}
                className={`form-control ${errors.typeIndustri ? "is-invalid" : ""}`}
                style={divStyleinput}
                required={true}
              >
                <option defaultValue=""></option>
                <option value="AGRICULTURA;PLANTACIONES;OTROS SECTORES RURALES">Agricultura;plantaciones;otros sectores rurales</option>
                <option value="ALIMENTACION; BEBIDAS; TABACO">Alimentacion; bebidas; tabaco</option>
                <option value="COMERCIO">Comercio</option>
                <option value="CONSTRUCCIÓN">Construcción</option>
                <option value="EDUCACIÓN">Educación</option>
                <option value="FABRICACIÓN DE MATERIALES DE TRANSPORTE">Fabricación de materiales de transporte</option>
                <option value="FUNCIÓN PÚBLICA">Función pública</option>
                <option value="HOTELERÍA, RESTAURACIÓN, TURISMO">Hotelería, restauración, turismo</option>
                <option value="INDUSTRIAS QUÍMICAS">Industrias químicas</option>
                <option value="INGENIERÍA MECÁNICA Y ELÉCTRICA">Ingeniería mecánica y eléctrica</option>
                <option value="MEDIOS DE COMUNICACIÓN; CULTURA; GRÁFICOS">Medios de comunicación; cultura; gráficos</option>
                <option value="MINERÍA (CARBÓN, OTRA MINERÍA)">Minería (carbón, otra minería)</option>
                <option value="PETRÓLEO Y PRODUCCIÓN DE GAS; REFINACIÓN DE PETRÓLEO">Petróleo y producción de gas; refinación de petróleo</option>
                <option value="PRODUCCIÓN DE METALES BÁSICOS">Producción de metales básicos</option>
                <option value="SERVICIOS DE CORREOS Y DE TELECOMUNICACIONES">Servicios de correos y de telecomunicaciones</option>
                <option value="SERVICIOS DE SALUD">Servicios de salud</option>
                <option value="SERVICIOS FINANCIEROS; SERVICIOS PROFESIONALES">Servicios financieros; servicios profesionales</option>
                <option value="SERVICIOS PÚBLICOS (AGUA; GAS; ELECTRICIDAD)">Servicios públicos (agua; gas; electricidad)</option>
                <option value="SILVICULTURA; MADERA; CELULOSA; PAPEL">Silvicultura; madera; celulosa; papel</option>
                <option value="TEXTILES; VESTIDO; CUERO; CALZADO">Textiles; vestido; cuero; calzado</option>
                <option value="TRANSPORTE (INCLUYENDO AVIACIÓN CIVIL; FERROCARRILES; TRANSPORTE POR CARRETERA)">Transporte (incluyendo aviación civil; ferrocarriles; transporte por carretera)</option>
                <option value="TRANSPORTE MARÍTIMO; PUERTOS; PESCA; TRANSPORTE INTERIOR">Transporte marítimo; puertos; pesca; transporte interior</option>
              </select>
              {errors.typeIndustri && (
                <div id="invalid-feedback">{errors.typeIndustri}</div>
              )}
              <label id="form-label">22. flyer</label>
              <input
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                style={divStyleinput}
                required={true}
              />
          
            </div>
            <br></br>

            <button type="submit" id="botonElegir">
              Agregar
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default StoreCompany;
