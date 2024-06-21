import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles.css";

const divStyleinput = {
  padding: "5px" /* Ajusta el padding según tus preferencias */,
  width:
    "100%" /* O ajusta el valor según tus necesidades (ej. width: '300px;') */,
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
  fontSize: "14px",
};
const StoreCompany = ({ updateProyects, selectedCompanyId, nameCompany }) => {

  const [OrigenProyecto, setOrigenProyecto] = useState("BANCO DE PROYECTOS");
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [numeroEstudiantes, setNumeroEstudiantes] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [nombreAsesorInterno, setNombreAsesorInterno] = useState("");
  const [nombreAsesorExterno, setNombreAsesorExterno] = useState("");
  const [puestoAsesorExterno, setPuestoAsesorExterno] = useState("");
  const [correoAsesorExterno, setCorreoAsesorExterno] = useState("");
  const [numeroAsesorExterno, setNumeroAsesorExterno] = useState("");
  const [AsesorExternoEgresadoITH, setAsesorExternoEgresadoITH] = useState("");

  const [company_id, setCompany_id] = useState(selectedCompanyId);

  const [errors, setErrors] = useState({});
  // Refs para cada campo
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const requirementsRef = useRef(null);
  const offerRef = useRef(null);
  const expirationRef = useRef(null);
  const remunerationRef = useRef(null);
  const resident_numberRef = useRef(null);
  const emailRef = useRef(null);
  const phone_numberRef = useRef(null);
  const startDateRef = useRef(null);
  const externalAdviserRef = useRef(null);
  const positionExternalAdviserRef = useRef(null);
  const isTheExternalAdviserGruadateOfIthRef = useRef(null);

  useEffect(() => {
    // Enfocar en el primer campo con error después de haber establecido los errores
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      switch (firstErrorKey) {
        case "name":
          nameRef.current.focus();
          break;
        case "description":
          descriptionRef.current.focus();
          break;
        case "requirements":
          requirementsRef.current.focus();
          break;
        case "offer":
          offerRef.current.focus();
          break;
        case "expiration":
          expirationRef.current.focus();
          break;
        case "remuneration":
          remunerationRef.current.focus();
          break;
        case "resident_number":
          resident_numberRef.current.focus();
          break;
        case "correoAsesorExterno":
          emailRef.current.focus();
          break;
        case "startDate":
          startDateRef.current.focus();
          break;
        case "externalAdviser":
          externalAdviserRef.current.focus();
          break;
        case "positionExternalAdviser":
          positionExternalAdviserRef.current.focus();
          break;
        case "isTheExternalAdviserGruadateOfIth":
          isTheExternalAdviserGruadateOfIthRef.current.focus();
          break;
        case "phone_number":
          phone_numberRef.current.focus();
          break;
      }
    }
  }, [errors]);
  const [message] = useState("Este campo no puede estar vacio");

  const store = async (e) => {
    e.preventDefault();
    const fieldErrors = {};

    if (!correoAsesorExterno) fieldErrors.correoAsesorExterno = message;
    else if (!isValidEmail(correoAsesorExterno)) fieldErrors.correoAsesorExterno = 'Introduce un correo electrónico válido';

    try {
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return;
      }

      const response = await axios.post(process.env.REACT_APP_API_URL + 'proyect/', {
        OrigenProyecto,
        nombreProyecto,
        numeroEstudiantes,
        fechaInicio,
        fechaFin,
        nombreAsesorInterno,
        nombreAsesorExterno,
        puestoAsesorExterno,
        correoAsesorExterno,
        numeroAsesorExterno,
        AsesorExternoEgresadoITH,
        company_id,

      });

      // Llama a la función de actualización proporcionada por el padre
      updateProyects(response.data.data);
      setErrors({}); // Reinicia los errores después de una operación exitosa


      setErrors({}); // Reinicia los errores después de una operación exitosa
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
    }
  };
  const isValidEmail = (email) => {
    // Expresión regular para validar direcciones de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e, setState) => {
    setState(e.target.value.toUpperCase());
  };

  return (
    <div id="fixed">
      <h3>Crear Proyecto para la Empresa {nameCompany}</h3>

      <form onSubmit={store}>
        <div id="mb-3">
          <label id="form-label">1. Nombre del proyecto</label>
          <input
            ref={nameRef}
            value={nombreProyecto}
            onChange={(e) => handleChange(e, setNombreProyecto)}
            type="text"
            style={divStyleinput}
            required={true}
            id={`form-control ${errors.nombreProyecto ? "is-invalid" : ""}`}
          />
          {errors.nombreProyecto && <div id="invalid-feedback">{errors.nanombreProyectome}</div>}
        </div>

        <label id="form-label">2. Indica el número de estudiantes que participarán en el desarollo del proyecto</label>
        <select
          ref={offerRef}
          value={numeroEstudiantes}
          onChange={(e) => handleChange(e, setNumeroEstudiantes)}
          type="text"
          style={divStyleinput}
          required={true}
          id={`form-control ${errors.offer ? "is-invalid" : ""}`}
        >

          <option value=""></option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>

        </select>

        {errors.offer && <div id="invalid-feedback">{errors.offer}</div>}


        <div id="mb-3">

          <label id="form-label">3. Fecha de inicio</label>
          <input
            ref={startDateRef}
            value={fechaInicio}
            onChange={(e) => handleChange(e, setFechaInicio)}
            type="Date"
            style={divStyleinput}
            required={true}
            id={`form-control ${errors.startDate ? "is-invalid" : ""}`}
          />
          {errors.startDate && (
            <div id="invalid-feedback">{errors.startDate}</div>
          )}

          <label id="form-label">4. Fecha de Expiración</label>
          <input
            ref={expirationRef}
            value={fechaFin}
            onChange={(e) => handleChange(e, setFechaFin)}
            type="Date"
            style={divStyleinput}
            required={true}
            id={`form-control ${errors.expiration ? "is-invalid" : ""}`}
          />
          {errors.expiration && (
            <div id="invalid-feedback">{errors.expiration}</div>
          )}

          <label id="form-label">5. Nombre del asesor externo</label>
          <input
            ref={remunerationRef}
            value={nombreAsesorExterno}
            onChange={(e) => handleChange(e, setNombreAsesorExterno)}
            type="Text"
            style={divStyleinput}
            required={true}
            id={`form-control ${errors.remuneration ? "is-invalid" : ""}`}
          />
          {errors.remuneration && (
            <div id="invalid-feedback">{errors.remuneration}</div>
          )}

          <label id="form-label">6. Puesto del asesor externo</label>
          <input
            ref={resident_numberRef}
            value={puestoAsesorExterno}
            onChange={(e) => handleChange(e, setPuestoAsesorExterno)}
            type="text"
            style={divStyleinput}
            required={true}
            id={`form-control ${errors.resident_number ? "is-invalid" : ""}`}
          />
          {errors.resident_number && (
            <div className="invalid-feedback">{errors.resident_number}</div>
          )}

          <label id="form-label">7. Correo Asesor Externo</label>
          <input
            ref={emailRef}
            value={correoAsesorExterno}
            onChange={(e) => handleChange(e, setCorreoAsesorExterno)}
            type="text"
            style={divStyleinput}
            required={true}
            id={`form-control ${errors.correoAsesorExterno ? "is-invalid" : ""}`}
          />
          {errors.correoAsesorExterno && (
            <div className="invalid-feedback">{errors.correoAsesorExterno}</div>
          )}

          <label id="form-label">8. Número de contacto del asesor externo</label>
          <input
            ref={nameRef}
            value={numeroAsesorExterno}
            onChange={(e) => handleChange(e, setNumeroAsesorExterno)}
            type="text"
            style={divStyleinput}
            required={true}
            id={`form-control ${errors.phone_number ? "is-invalid" : ""}`}
          />
          {errors.phone_number && (
            <div id="invalid-feedback">{errors.phone_number}</div>
          )}

          <label id="form-label">9. El asesor externo es egresado del ITH</label>
          <select
            ref={externalAdviserRef}
            value={AsesorExternoEgresadoITH}
            onChange={(e) => handleChange(e, setAsesorExternoEgresadoITH)}
            style={divStyleinput}
            required={true}
            id={`form-control ${errors.externalAdviser ? "is-invalid" : ""}`}
          >
            <option value="">Selecciona una opción</option>
            <option value="SI">Sí</option>
            <option value="NO">No</option>
            <option value="LO DESCONOZCO">LO DESCONOZCO</option>
          </select>
          {errors.externalAdviser && (
            <div id="invalid-feedback">{errors.externalAdviser}</div>
          )}

        </div>
        <br></br>
        <button  type="submit" id="botonElegir">
          Agregar
        </button>
      </form>
    </div>
  );
};

export default StoreCompany;
