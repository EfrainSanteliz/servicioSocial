import React, { useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios';
import Tabla from '../../components/coordinadores/Tabla/Tabla'
import NavBar from '../../components/Navbar/navbar';
import "../../index.css";
import Sidebar from '../../components/Sidebar/Sidebar';
import { Button, Form, Card } from 'react-bootstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
import { GlobalContext } from '../../context/GlobalContext';
import Select from 'react-select';
import "./Styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass, faNoteSticky, faListUl, faPersonCirclePlus, faPlus } from '@fortawesome/free-solid-svg-icons';
import FileUploadButtonobv from '../../components/Uploadbutton/uploadbuttonobv';
import ModalObservations from '../../components/ModalObservations';
import TextArea from '../../components/TextArea';
import Filtros from '../../components/Filtros/Filtros';
import { useNavigate, useParams } from 'react-router-dom';



const MySwal = withReactContent(Swal);

function AsignarEstudiantes() {
    const navigate = useNavigate();
    let { periodo } = useParams()

    const { emailCoordinador } = useContext(GlobalContext);
    const [activeStudents, setActiveStudents] = useState([]);//Alumnos activos en la plataforma
    const [displayedStudents, setDisplayStudents] = useState([]); //Alumnos que se mostraran
    const [advisers, setAdvisers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadMessage, setLoadMessage] = useState('Accediendo a base de datos');

    const [periodos, setPeriodos] = useState([]);

    const [Uploaded, setUploaded] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    const [modalShow, setModalShow] = React.useState(false);
    const [observationsData, setObservationsData] = useState([]);

    //Filtros
    const [availableCareers, setAvailableCareers] = useState([{ value: 0, label: 'TODAS LAS CARRERAS DISPONIBLES' }]);

    const handleUploadSuccess = () => {
        setUploaded(true);
    };

    const obtenerValorTextArea = () => {
        const textareaElement = document.getElementById('ver_observaciones');
        if (textareaElement) {
            const valor = textareaElement.value;
            return valor;

        } else {
            return "";
        }
    }

    const selectedAdviser = useRef(0);

    useEffect(() => {
        getPeriodos();
        getStudents();
        getAdvisers();
    }, []);

    const getPeriodos = async () => {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'period');
        const periodos = data.periods;

        const options = periodos.map((periodo) => {
            let periodoString = periodo.año + '-' + periodo.mitad;
            return { 'label': periodoString, 'value': periodoString };
        });

        setPeriodos(options);
    }

    const fetchObservations = async (ncontrol) => {
        try {

            let student_select = displayedStudents.find(student => student.student.control_number === ncontrol);
            var id_student = student_select.student.id;

            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(process.env.REACT_APP_API_URL + 'residences/observations/historic/' + id_student,
                { headers });

            var observationsList = response.data.data;

            setSelectedStudentId(ncontrol);
            setObservationsData(observationsList)
            setModalShow(true)

        } catch (error) {
            console.error('Error al obtener observaciones:', error);
        }
    }


    const getStudents = async () => {
        setLoading(true);

        //Obtener alumnos de la lista del coordinador
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'residences/list',
            {
                params: {
                    coordinador: emailCoordinador,
                    periodo: periodo
                }
            }
        );

        const disponibles = data.data;

        setActiveStudents(disponibles);
        setDisplayStudents(disponibles);

        const token = localStorage.getItem('token');

        //Obtener carreras del coordinador
        const response = await axios.get(process.env.REACT_APP_API_URL + 'coordinators/careers/' + emailCoordinador, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        setLoadMessage('Verificando carreras del asesor');

        const availableCareers = response.data.coordinator_relations.map((career) => { return { value: career.id, label: career.name } });
        setAvailableCareers([{ value: 0, label: 'TODAS LAS CARRERAS DISPONIBLES' }, ...availableCareers]);
        setLoadMessage('Filtrando alumnos que pertenezcan a las carreras del asesor');

        setLoading(false);
    }

    const getAdvisers = async () => {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'advisers');

        const options = data.data.map((adviser) => {
            const text = `${adviser.name} ${adviser.last_name} ${adviser.second_last_name}`
            return { value: adviser.id, label: text }
        });

        setAdvisers(options);
    }

    const assignStudent = (id, status) => { //Actualizar el status de un alumno en pantalla
        const student = displayedStudents.findIndex(({ student }) => student.control_number === id);
        const updated_students = [...displayedStudents]; //Se necesita crear una copia del arreglo para forzar un cambio.
        updated_students[student].status = status;
        setDisplayStudents(updated_students);
    }

    const updateStatus = async (id, status, formData) => {
        assignStudent(id, status);

        axios.post(process.env.REACT_APP_API_URL + 'residences/' + id, formData);
    }

    const evaluarAlert = (id, idx) => {

        MySwal.fire({
            title: "Autorizar Reporte",
            showDenyButton: true,
            confirmButtonText: "Autorizar",
            confirmButtonColor: '#198754',
            denyButtonText: `Observaciones`,
            html: (
                <>
                    <p>No.control: {id}</p>
                </>
            )
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('observations', 'El reporte ha sido revisado por la academia.');
                formData.append('status', 3);
                updateStatus(id, 3, formData);
            }
            else if (result.isDenied) {
                MySwal.fire({
                    title: "Observaciones de Reporte Preliminar",
                    confirmButtonText: "Confirmar",
                    confirmButtonColor: 'red',
                    html: (<>
                        <Form.Control id='observaciones' type='text' as='textarea' rows='3'></Form.Control>,

                        <FileUploadButtonobv
                            studentId={id}
                            onUploadSuccess={handleUploadSuccess}
                            buttonText={"Subir Observaciones (Word)"}
                            desiredFileName={"Observaciones_"}
                            uniqueIndex={7}
                            isDisabled={false} // Se deshabilita hasta que se suba el Kardex
                            buttonStyle={"primary"}
                            expectedFileType={"word"}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </>),



                }).then((result) => {
                    const observaciones = document.getElementById('observaciones').value;

                    if (observaciones === "") {
                        Swal.fire('Error', 'El campo de observaciones no puede estar vacio.', 'error');
                        return
                    }

                    const formData = new FormData();
                    formData.append('observations', observaciones);
                    formData.append('status', 5);
                    updateStatus(id, 5, formData);

                    if (result.isConfirmed) {
                        Swal.fire('Observaciones enviadas', '', 'info');
                    }
                })
            }
        });
    }

    const asignarAlert = (id, idx) => {
        function handle_change(value, action) {
            if (action.action === "select-option") {
                selectedAdviser.current = value.value;
            }
        }

        MySwal.fire({
            title: "Asignar Asesor Interno",
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#198754',
            customClass: {
                htmlContainer: 'asignar_estudiantes_modal_container'
            },
            showDenyButton: true,
            denyButtonText: 'Cancelar',
            denyButtonColor: 'gray',
            heightAuto: false,
            html: (
                <>
                    <Select
                        options={advisers}
                        isClearable={false}
                        onChange={handle_change}
                        placeholder="Seleccione un asesor..."
                    />

                    <p>Escriba el nombre de un asesor en el campo de texto para filtrar las opciones mostradas.</p>
                </>
            ),
            preConfirm: () => {
                const asesor = selectedAdviser.current;
                if (asesor === 0) {
                    Swal.fire('No se seleccionó ningún asesor.', '', 'error');
                    return;
                }

                const formData = new FormData();
                formData.append('observations', 'Asesor asignado.');
                formData.append('status', 4);
                formData.append('adviser_id', asesor);
                updateStatus(id, 4, formData);
                selectedAdviser.current = 0;
            }
        })

    }

    const autorizarAlert = (id) => {
        MySwal.fire({
            title: "Aprobar Dictamen",
            showDenyButton: true,
            confirmButtonText: "Aprobar",
            confirmButtonColor: '#198754',
            denyButtonText: `Cancelar`,
            denyButtonColor: 'gray',
            html: (<p>No.control: {id}</p>),
            preConfirm: () => {
                const formData = new FormData();

                formData.append('observations', 'El reporte preliminar ha sido ACEPTADO.');
                formData.append('status', 6);

                updateStatus(id, 6, formData);
            }
        });
    }


    const observacionesAlert = async (id) => {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'residences/' + id);
        const date_time = data.data.updated;

        const date = new Date(date_time);


        MySwal.fire({
            title: 'Agregar Observación',
            html: (<>
                <TextArea id='ver_observaciones' />

                <FileUploadButtonobv
                    studentId={id}
                    onUploadSuccess={handleUploadSuccess}
                    buttonText={"Subir Observaciones (Word)"}
                    desiredFileName={"Observaciones_"}
                    uniqueIndex={10}
                    isDisabled={false} // Se deshabilita hasta que se suba el Kardex
                    buttonStyle={"primary"}
                    expectedFileType={"word"}
                    onClick={(e) => e.stopPropagation()}
                />

            </>),
            confirmButtonText: "Guardar",
            confirmButtonColor: 'blue',
            showDenyButton: true,
            denyButtonText: "Salir",
            denyButtonColor: 'gray'
        }).then((result) => {
            if (result.isConfirmed) {
                const observacion = obtenerValorTextArea();

                if (observacion === "") {
                    Swal.fire('Error', 'El campo de observaciones no puede estar vacio.', 'error');
                    return
                }

                const formData = new FormData();
                formData.append('observations', observacion);
                formData.append('status', 5);
                updateStatus(id, 5, formData);

                Swal.fire('Observación', 'Nueva Observacion ha sido agregada.', 'info')
            }
        });
    }

    const filterStudents = (students) => {
        setDisplayStudents(students);
    }

    //Cambiar periodo de la lista que se muestra al utilizar el periodo
    const handlePeriodChange = (value, action) => {
        navigate('/asignar-estudiantes/' + value.value);
        window.location.reload();
    }

    return (
        <div id='body-content'>
            <Sidebar />
            <div id='main-content' >
                <NavBar user_type={'coordinators'} />

                <div id='row'>
                    <h2 style={{ paddingLeft: 50, paddingTop: 20 }}>Revision de Reporte Preliminar</h2>


                    <div className='col-xs-12'>
                        <div style={{ width: "90%", marginLeft: 50}}>
                            Periodo:
                            <Select options={periodos}
                                isClearable={false}
                                onChange={handlePeriodChange}
                                placeholder={periodo}
                            ></Select>

                        </div>
                        {activeStudents.length > 0 ?
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Filtros students={activeStudents} careers={availableCareers} returnFunc={filterStudents} />
                                <Tabla contador={false} residences={displayedStudents} updateFunc={assignStudent}>
                                    {(id, idx, status) => (<>

                                        {status == 2 ? (<Button onClick={() => evaluarAlert(id, idx)}>Autorizar</Button>) : null}
                                        {status == 3 ? (<Button variant='info' title="Asignar Asesor" onClick={() => asignarAlert(id, idx)}><FontAwesomeIcon icon={faPersonCirclePlus} color='#fff' size="2x" /></Button>) : null}
                                        {status == 4 ? (<Button variant='success' onClick={() => autorizarAlert(id)}>Aprobar</Button>) : null}
                                        {status == 5 ? (<><Button variant='primary' title="Agregar observación" style={{ marginRight: '5px' }} onClick={() => observacionesAlert(id)}><FontAwesomeIcon icon={faPlus} color='#fff' /><FontAwesomeIcon icon={faNoteSticky} color='#fff' /></Button>
                                        </>) : null}
                                        {status >= 2 ? (<Button variant='warning' title="Historial de observaciones" style={{ marginRight: '5px' }} onClick={() => fetchObservations(id)}><FontAwesomeIcon icon={faListUl} color='#fff' /></Button>) : null}

                                    </>)}
                                </Tabla>
                            </div>
                            :
                            <Card style={{ margin: 50 }}>
                                <Card.Title>
                                    {loading ? (
                                       <div class="contenedor-cargando">
                                        <p class="p-cargando">Cargando...</p>
                                        <div class="spinner"></div>
                                       </div>
                                    ) : <span style={{ marginLeft: '10px' }}>No hay alumnos</span>}
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

export default AsignarEstudiantes