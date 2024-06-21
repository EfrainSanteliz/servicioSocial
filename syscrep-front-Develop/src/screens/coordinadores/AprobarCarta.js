import React, { useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios';
import TablaAprobar from '../../components/coordinadores/Tabla/TablaAprobar'
import NavBar from '../../components/Navbar/navbar';
import "../../index.css";
import Sidebar from '../../components/Sidebar/Sidebar';
import { Button, Form, Card } from 'react-bootstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
import { GlobalContext } from '../../context/GlobalContext';
import "./Styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass, faNoteSticky, faListUl, faPersonCirclePlus, faPlus } from '@fortawesome/free-solid-svg-icons';
import ReactDOM from 'react-dom';
import FileUploadButtonobv from '../../components/Uploadbutton/uploadbuttonobv';
import ModalObservations from '../../components/ModalObservations';
import { format } from 'date-fns';
import TextArea from '../../components/TextArea';
import Downloadbutton from '../../components/Uploadbutton/downloadbutton';
import Filtros from '../../components/Filtros/Filtros';


const MySwal = withReactContent(Swal);

function AprobarCarta() {
    const { emailCoordinador } = useContext(GlobalContext);
    const [displayedStudents, setDisplayStudents] = useState([]); //Alumnos que se mostraran
    const [availableStudents, setAvailableStudents] = useState([]); //Alumnos disponibles para el coordinador; Utilizado para el filtro.
    const [availableCareers, setAvailableCareers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [Uploaded, setUploaded] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    const [modalShow, setModalShow] = React.useState(false);
    const [observationsData, setObservationsData] = useState([]);

    useEffect(() => {
        getStudents();
    }, [])

    const getStudents = async () => {
        setLoading(true);
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'residences',);
        const activos = data.data.filter((residencia) => residencia.status != 0);

        const token = localStorage.getItem('token');

        //Obtener carreras del coordinador
        const response = await axios.get(process.env.REACT_APP_API_URL + 'coordinators/careers/' + emailCoordinador, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        const careers = response.data.coordinator_relations.map((career) => career.id);
        //Filtrar alumnos que no se encuentren en las carreras del coordinador
        const disponibles = activos.filter((residence) => careers.includes(residence.student.career.id));

        // Filtrar estudiantes con status 7 en la tabla residences
        const studentsWithStatus7 = disponibles.filter((residence) => residence.status > 6);

        const sorted_students = studentsWithStatus7.sort((a,b)=>a.status > b.status);

        const availableCareers = response.data.coordinator_relations.map((career) => { return { value: career.id, label: career.name } });
        setAvailableCareers([{ value: 0, label: 'TODAS LAS CARRERAS DISPONIBLES' }, ...availableCareers]);

        setDisplayStudents(sorted_students);
        setAvailableStudents(sorted_students);
        setLoading(false);
    }

    const assignStudent = (id, status) => { //Actualizar el status de un alumno en pantalla
        const student = displayedStudents.findIndex(({ student }) => student.control_number === id);
        const updated_students = [...displayedStudents]; //Se necesita crear una copia del arreglo para forzar un cambio.
        updated_students[student].status = status;
        setDisplayStudents(updated_students);
    }

    const updateStatus = async (id, status, formData) => {
        try{
            const {data} = await axios.post(process.env.REACT_APP_API_URL + 'residences/' + id, formData);
            
            assignStudent(id, status);
            
            return data.success;
        }catch(e){
            console.error(e);
            return false;
        }
    }

    const filterStudents = (residencias) => {
        setDisplayStudents(residencias);
    }

    return (
        <div id='body-content'>
            <Sidebar />
            <div id='main-content' >
                <NavBar user_type={'coordinators'} />

                <div id='row'>
                    <h2 style={{ paddingLeft: 50, paddingTop: 20 }}>Firma de carta membretada</h2>
                    <div className='col-xs-12'>
                        {availableStudents.length > 0 ?
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Filtros students={availableStudents} careers={availableCareers} returnFunc={filterStudents} filtroEstados={[7,8,9]}/>
                                <TablaAprobar contador={false} residences={displayedStudents} updateFunc={updateStatus}>
                                    {(id, idx, status) => (
                                        <>
                                            {status >= 7 ? (<Downloadbutton
                                                studentId={id}
                                                buttonText="Descargar"
                                                desiredFileName="Carta_Presentacion"
                                                isDisabled={false}
                                                buttonStyle="primary"
                                                size="md"
                                                fileType="word"
                                                uniqueIndex={12}
                                            />
                                            ) : null}
                                        </>)}
                                </TablaAprobar>
                            </div>
                            :
                            <Card style={{ margin: 50 }}>
                                <Card.Title>
                                    {loading ? "Cargando..." : "No hay alumnos"}
                                    {loading && <FontAwesomeIcon icon={faHourglass} spin />}
                                </Card.Title>
                            </Card>
                        }
                        {
                            observationsData &&
                            <ModalObservations observations={observationsData}
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                                studentId={selectedStudentId}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AprobarCarta