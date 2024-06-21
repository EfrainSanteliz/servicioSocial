import "./NewStudents.css";
import { useForm } from "react-hook-form";
import ShowStudents from "../showStudents/showStudents";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, FormSelect, Card } from "react-bootstrap";
//import Navbar from '../NavBar/NavBar'
import Modal from "react-modal";
import StoreNewStudents from "../StoreStudents/StoreStudents";
import Sidebar from "../Sidebar/Sidebar";
function NewStudents() {
  const { register, handleSubmit } = useForm();
  const [displayedStudents, setDisplayStudents] = useState([]); //Alumnos que se mostraran

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    const { data } = await axios.get(process.env.REACT_APP_API_URL+'students',);
    setDisplayStudents(data.data);
    console.log(data);
}
 

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        
        <Sidebar/>



       
          <StoreNewStudents></StoreNewStudents>
          <div className="tabla">
          {displayedStudents.length > 0 ? (
          
            <ShowStudents
              contador={false}
              students={displayedStudents}
            ></ShowStudents>
          ) : (
            <Card style={{ margin: 50 }}>
              <Card.Title>No hay alumnos</Card.Title>
            </Card>
          )}

          <div className="btncerrarmodal">
            <button onClick={closeModal}>Cerrar Modal</button>
          </div>
          </div>
      </div>
    </form>
  );
}

export default NewStudents;
