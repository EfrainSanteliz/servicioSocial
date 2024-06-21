import React, { useEffect, useState,createContext} from "react";
import "./AlumnosStyle.css";
import Navbar from '../../components/Navbar/navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import DownloadReportForm from '../../components/DowloadReportForm/downloadportform';
import ReportUploadForm from '../../components/UploadReportForm/uploadreportform';
import { Col, Container, Row } from 'react-bootstrap';
import ObservationCard from '../../components/ObservationCard/ObservationCard';
import { AlumnosContext } from '../../context/AlumnosContext';
import { useLocation } from 'react-router-dom';
import FormCard from '../../components/FormCard/Forrmcard';
import StudentInfo from '../../components/StudentInfo/studentinfo';
import axios from 'axios';
import PresentacionCard from '../../components/PresentacionCard/presentacionCard';
import Alert from 'react-bootstrap/Alert';
import ComunicadosCard from '../../components/ComunicadosCard/ComunicadosCard';
import PcomunicadosCard from '../../components/ComunicadosCard/PcomunicadosCard';
import ExpedienteForm from "../../components/DowloadReportForm/expedienteForm";
import AlertaCartaFirmada from "../../components/AlertaCartaFirmada/AlertaCartaFirmada";

export const MyContext = createContext();

const Alumnos = ({ children }) => {
  const { state } = useLocation(); //Obtener alumno de la funcion de navigate en el Login//
  //Guardar el alumno en el contexto para que pueda ser usado por componentes descendentes
  const [alumno, setAlumno] = useState(state.alumno);
  const [studentId,setStudentId] = useState(null);
  const [status, setStatus] = useState(0);
  const [career, setCareer] = useState(null);
  const context = { alumno, setAlumno, status, setStatus };
  const [myVariable, setMyVariable] = useState('hola');
  useEffect(() => {
    async function getStatus() {
      const { data } = await axios.get(
        process.env.REACT_APP_API_URL + "residences/" + alumno
      );
      console.log('alumnos call:')
      console.log(data);
      setStatus(data.data.status);
      setCareer(data.data.student.career.id);
      setStudentId(data.data.student.id);
    }

    getStatus();
  }, []);
  console.log(studentId);
  function onLinkClick() {
    const el = document.getElementById("observations_card");
    el.scrollIntoView();
    console.log(el);
    // will scroll to 4th h3 element
  }

  return (
<MyContext.Provider value={{ myVariable: '', setMyVariable }}>
        {children} 
    <AlumnosContext.Provider value={context}>
    
      <div className="Alumnos-body">
        <Sidebar/>
        <div className="main-content">
          <Navbar  user_type="student" />
          <Container fluid className="cuerpo">
            {status == 5 && (
              <Alert
                variant="warning"
                style={{ cursor: "pointer" }}
                onClick={onLinkClick}
              >
                El reporte tiene observaciones
              </Alert>
            )}

            <Row className="justify-content-center mb-4">
              <ComunicadosCard career_id={career}/>
            </Row>

            <Row className="justify-content-center mb-1">
              <PcomunicadosCard student_id={studentId}/>
            </Row>

            <Row className="justify-content-center mb-4">
            
              <StudentInfo />
            </Row>


            {/* Primera fila */}
            <Row className="justify-content-center mb-4">
              <Col md={4}>
                <DownloadReportForm />
              </Col>

              <Col md={4}>
                <ReportUploadForm studentId={alumno} />
              </Col>

              <Col md={4}>
                <FormCard studentId={alumno} />
              </Col>
            </Row>

            {/* Segunda fila */}
            <Row className="justify-content-center mb-4">
              <Col md={6}>
                <ObservationCard studentId ={studentId}/>
              </Col>
            </Row>

            <AlertaCartaFirmada studentId={studentId}/>

            {/* Tercera fila*/}
            <Row className="justify-content-center mb-4">
              <Col md={4}>
                <PresentacionCard />
              </Col>
              <Col md={4}>
                <ExpedienteForm studentId={alumno} />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      {alumno}
      

     {/*<Bancodeproyectos2></Bancodeproyectos2>*/}
    
     {/*<Programas></Programas>*/}
     

    

    </AlumnosContext.Provider>
    </MyContext.Provider>
  );
};

export default Alumnos;
