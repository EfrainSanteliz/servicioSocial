import React, { useContext, useState } from "react";
import logo from "../../assets//logo.png";
import Alumno from "../../assets/graduado.png";
import Asesor from "../../assets/Asesor.png"
import Coordinador from "../../assets/Coordinador.png"
import contrasena from "../../assets/contrasena.png"
import agregaralumno from "../../assets/anadir-alumno.png"
import Comunicado from "../../assets/comunicado.png"
import './SIdebar.css';
import { GlobalContext } from "../../context/GlobalContext"
import PasswordModal from "../ChangePasswordModal/passwordModal";
import { AlumnosContext } from '../../context/AlumnosContext';
import PasswordModalStudent from "../ChangePasswordModal/passwordModalStudent";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { tipoUsuario, admin, periodo} = useContext(GlobalContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModalStudent, setShowModalStudent] = useState(false);
  const {alumno} = useContext(AlumnosContext);

  // Función para abrir el modal
  const handleOpenModal = () => setShowModal(true);

  // Función para cerrar el modal
  const handleCloseModal = () => setShowModal(false);
  // Función para abrir el modal
  const handleOpenModalStudent = () => setShowModalStudent(true);

  // Función para cerrar el modal
  const handleCloseModalStudent = () => setShowModalStudent(false);

  const goBack = () => navigate(-1);


  return (

    <div className="sidebar">
      <div className="tab"><img src={logo} alt="Logo" /></div>
      <div className="tab" > <div className="Sidetext" > <img src={Asesor} alt="Logo" /> <span className="side-text">Asesor</span> </div>   </div>

      
      {/* Mostrar icono y ModalForm solo si el usuario es coordinador */}
      {tipoUsuario === 'coordinators' && (<>
        <div className="tab" onClick={() => navigate('/asignar-estudiantes/'+periodo)}> <div className="Sidetext" > <img src={Alumno} alt="Logo" /> <span className="side-text">Residencias</span> </div>   </div>
        
        {admin == 1 && (
          <div className="tab" onClick={() => navigate('/asignar-carreras')}> <div className="Sidetext" > <img src={Coordinador} alt="Logo" /> <span className="side-text">Coordinador</span> </div>   </div>
        )}
        { (
          <div className="tab" onClick={() => navigate('/agregar-estudante')}> <div className="Sidetext" > <img src={agregaralumno} alt="Logo" /> <span className="side-text">Añadir Participantes</span> </div>   </div>
        )}
        { (
          <div className="tab" onClick={() => navigate('/agregar-compañias-proyectos')}> <div className="Sidetext" > <img src={agregaralumno} alt="Logo" /> <span className="side-text">Añadir Compañias y Proyectos</span> </div>   </div>
        )}
         { (
          <div className="tab" onClick={() => navigate('/cambiar-asesor')}> <div className="Sidetext" > <img src={agregaralumno} alt="Logo" /> <span className="side-text">Cambiar Asesor</span> </div>   </div>
        )}
        { (
          <div className="tab" onClick={() => navigate('/agregar-comunicados')}> <div className="Sidetext" > <img src={Comunicado} alt="Logo" /> <span className="side-text">Añadir Comunicados</span> </div>   </div>
        )}
        {admin == 1 && (
          <div className="tab" onClick={() => navigate('/aprobar-carta')}> <div className="Sidetext" > <img src={Alumno} alt="Logo" /> <span className="side-text">Firmar Documentos</span> </div>   </div>
        )}
        {(
          <div className="tab" onClick={() => navigate('/generar-archivo')}> <div className="Sidetext" > <img src={Coordinador} alt="Logo" /> <span className="side-text">Generar Archivo</span> </div>   </div>
        )}
        
        <div className="tab" onClick={handleOpenModal}>
        <div className="Sidetext" > <img src={contrasena} alt="Logo" /> <span className="side-text">Contraseña</span></div>
        </div>
      </>
      )}
      {/* Mostrar icono y ModalForm solo si el usuario es coordinador */}
      {tipoUsuario === 'students' && (<>
       <div>

       <div className="tab" onClick={goBack}> <div className="Sidetext" > <img src={Asesor} alt="Logo" /> <span className="side-text">Alumno</span> </div>   </div>

       {/*<div className="tab" onClick={() => navigate(`/programas/${alumno}`)}> <div className="Sidetext" > <img src={Asesor} alt="Logo" /> <span className="side-text">Programas</span> </div>   </div>*/}

       <div className="tab" onClick={handleOpenModalStudent}>
        <div className="Sidetext" > <img src={contrasena} alt="Logo" /> <span className="side-text">Contraseña</span></div>
        </div>
        </div>

        
      </>
      )}
      <PasswordModal show={showModal} handleClose={handleCloseModal} />
      <PasswordModalStudent show={showModalStudent} handleClose={handleCloseModalStudent} />

      
    </div>
  );
};

export default Sidebar;