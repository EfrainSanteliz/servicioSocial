import React from 'react';
import { useContext, useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Expediente from "../../assets/expediente Alumno.png";
import { AlumnosContext } from '../../context/AlumnosContext';
import CardBlocker from '../CardBlocker/CardBlocker';

function ExpedienteForm({studentId}) {
  const { status } = useContext(AlumnosContext);
    const navigate = useNavigate();

    const handleClick = () => {
      navigate(`/expediente-alumno/${studentId}`);
    };

  return (
    <div className="containerCard">
      <div className={status >= 6 ? "card" : "card disabled"}>
      <div className="card">
        <div className="imgBx">
          <img src={Expediente} />
        </div>
        <div className="contentBx">
          <h2>Paso 5</h2>
          <div className="size">
            <h6>Expediente</h6>


          </div>

          <button onClick={handleClick} className="btn btn-primary btn-lg">
      Expediente
    </button>
        </div>
        
      </div>
      <CardBlocker show={status < 6} />
      </div>
    </div>
  );
}


export default ExpedienteForm;