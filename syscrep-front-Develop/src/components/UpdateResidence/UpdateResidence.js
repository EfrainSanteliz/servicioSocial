import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"; // Import Modal from 'react-modal'


const endpoint = `http://localhost:8000/api/residences`;



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

const UpdateResidence = ({ selectStudentId,selectedAdviserId,UpdateResidences}) => {
  const [adviser_id, setAdviser_id] = useState(selectedAdviserId);

  const update = async (e) => {
    e.preventDefault();

    const fieldErrors = {};

    try {
    
      const response = await axios.put(process.env.REACT_APP_API_URL+ 'residences/'+selectStudentId, {
        adviser_id,
       
      });
      // Llama a la función de actualización proporcionada por el padre
      UpdateResidences(response.data.data);



    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Manejar error de validación (422 Unprocessable Entity)
        alert("No puedes agregar compañías duplicadas.");
      } else {
        console.error("Error al actualizar la residencia:", error);
      }
    }
  };



  return (
    <div>
      <div id="agregarCompañia" style={divStyle}>
      </div>
        <div id="separacion">
     
          <form onSubmit={update}>
         

            <button type="submit" id="btn btn-primary">
              Actualizar
            </button>

            id del estudiante = {selectStudentId} id del asesor es = {selectedAdviserId}
          </form>
        </div>
     
    </div>
  );
};

export default UpdateResidence;
