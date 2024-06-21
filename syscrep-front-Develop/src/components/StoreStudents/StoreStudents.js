import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StoreStudents.css";

function CreateNewStudents() {
  const [matricula, setMatricula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [semestre, setSemestre] = useState("");
  const [email, setEmail] = useState("");
  const [numeroCelular, setNumeroCelular] = useState("");

  const navigate = useNavigate();

 const store = async (e) => {
   // e.preventDefault();
    //await axios.post(process.env.REACT_APP_API_URL+'student',{matricula:matricula,nonbre:nombre,apellido:apellido,
    //semestre:semestre,email:email,numeroCelular})
};

  return (
    <div className="NewStudents">
      <div className="container">
        <div className="Agregar_Estudiante">Agregar estudiante</div>
        <form onSubmit={store}>
          <div className="inputContainer">
            <label htmlFor="matricula">Matricula</label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            />
          </div>

          <div className="inputContainer">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="inputContainer">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>

          <div className="inputContainer">
            <label htmlFor="semestre">Semestre</label>
            <input
              type="text"
              id="semestre"
              name="semestre"
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
            />
          </div>

          <div className="inputContainer">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputContainer">
            <label htmlFor="numeroCelular">Número de celular</label>
            <input
              type="text"
              id="numeroCelular"
              name="numeroCelular"
              value={numeroCelular}
              onChange={(e) => setNumeroCelular(e.target.value)}
            />
          </div>

          <input
            type="submit"
            name="btnEnviar"
            value="Registrar Nuevo Alumno"
            className="btnEnviar"
          />
        </form>
      </div>
    </div>
  );
}

export default CreateNewStudents;