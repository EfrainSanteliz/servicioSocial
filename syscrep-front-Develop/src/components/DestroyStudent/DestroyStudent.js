import "./DestroyStudent.css";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Tabla from "../coordinadores/Tabla/Tabla";
import axios from "axios";
import { Table, Card, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ShowStudents from "../showStudents/showStudents";

import Modal from "react-modal";
import Sidebar from "../Sidebar/Sidebar";

function DestroyStudent() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  const [displayStudents, setDisplayStudents] = useState([]); // Agrega esta línea
  const [data, setData] = useState([]); // Agrega esta línea

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    const { data } = await axios.get("http://127.0.0.1:8000/api/students");
    setDisplayStudents(data.data);
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Sidebar />
        <div className="btnmodal"></div>

        <div className="NewStudents">
          <div className="Agregar_Estudiante">
            Eliminar Estudiantes
            <br />
            <br />
            Buscar Estudiantes por numero de control <br />
            <br />
            <div className="search-container">
              <div className="InputNumeroDeControl">
                <input type="text" id="nombre" name="nombre" />
              </div>
              <input
                type="submit"
                name="btnEnviar"
                value="Buscar Estudiante"
                className="btnEnviar"
              />
            </div>
            <br />
            <br />
            <input
              type="submit"
              name="btnEnviar"
              value="Eliminar Estudiante"
              class="btnEnviar"
            />
          </div>

          <br />
        </div>

        <div className="btncerrarmodal">
          <button onClick={closeModal}>Cerrar Modal</button>
        </div>

        <div className="tabla">
          {displayStudents.length > 0 ? (
            <ShowStudents
              contador={false}
              students={displayStudents}
            ></ShowStudents>
          ) : (
            <Card style={{ margin: 50 }}>
              <Card.Title>No hay alumnos</Card.Title>
            </Card>
          )}
        </div>
        <br />

        <br />
        <br />
        <br />
      </div>
    </form>
  );
}

export default DestroyStudent;
