import React, { useState,Component } from "react";
import DropdownButton from "./DropdownButton";
import Asignar from "../../../screens/coordinadores/Asignar";
import "./Styles.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';





function Evaluar({ selectedResidencecontrol_number }) {






  const [opcionSeleccionada, setOpcionSeleccionada] = useState("");
  const handleSeleccion = (opcion) => {
    setOpcionSeleccionada(opcion);
  };

  return (
    
    


    <div>
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="txtControl_number">
            <label htmlFor="txtControl_number">control_number</label>
          </div>

          <div className="texBoxControl_number">
            <input
              type="text"
              id="texBoxControlNumber"
              name="texBoxControlNumer"
              value={selectedResidencecontrol_number}
              readOnly
            />
          </div>
          <DropdownButton onSeleccion={handleSeleccion} />
        </div>
      </div>

      <br />
      <br />
      <br />

      <div>
        Contens
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <form id="updateContentsForm">
            <div className="txtContenido">
              <label htmlFor="txtContenido"></label>

              <textarea
                className="custom-input"
                id="contentsInput"
                type="text"
                name="contents"
                placeholder="Nuevo valor para contents"
              ></textarea>

              <button
                className="btnEnviar"
                type="submit"
                onclick="updateContents(event)"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Evaluar;
