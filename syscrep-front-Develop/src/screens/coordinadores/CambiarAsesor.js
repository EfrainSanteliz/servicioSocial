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
import CustomMenuList from '../../components/Customs/CustomMenuList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass, faNoteSticky, faListUl, faPersonCirclePlus, faPlus } from '@fortawesome/free-solid-svg-icons';
import ReactDOM from 'react-dom';
import FileUploadButtonobv from '../../components/Uploadbutton/uploadbuttonobv';
import ModalObservations from '../../components/ModalObservations';
import { format } from 'date-fns';
import TextArea from '../../components/TextArea';
const MySwal = withReactContent(Swal);

function AsignarEstudiantes() {
    const { emailCoordinador } = useContext(GlobalContext);
    const [displayedStudents, setDisplayStudents] = useState([]); //Alumnos que se mostraran
    const [availableStudents, setAvailableStudents] = useState([]); //Alumnos disponibles para el coordinador; Utilizado para el filtro.
    const [advisers, setAdvisers] = useState([]);
    const [loading, setLoading] = useState(true);
    const selectedAdviser = useRef(0);

    useEffect(() => {
        getStudents();
        getAdvisers();

    }, [])

    const getStudents = async () => {
        setLoading(true);
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'residences',);
        const activos = data.data.filter((residencia) => (residencia.status == 4 || residencia.status > 5));

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

        setDisplayStudents(disponibles);
        setAvailableStudents(disponibles);
        setLoading(false);
    }

    const getAdvisers = async () => {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'advisers');

        //Obtener datos del coordinador
        const response = await axios.get(process.env.REACT_APP_API_URL + 'coordinators/me', {
            headers: { Authorization: 'Bearer ' + token }
        });

        let options = [];

        //Si el departamento es nulo significa que se trata del administrador, por lo tanto se muestran todos los asesores
        if (response.data.coordinador.department == null) {
            options = data.data.map((adviser) => {
                const text = `${adviser.name} ${adviser.last_name} ${adviser.second_last_name}`
                return { value: adviser.id, label: text }
            });
        } else {
            const coordinator_department = response.data.coordinador.department.id;

            //Asesores del departamento de ciencias basicas.
            const basicAdvisers = data.data.filter((adviser) => adviser.department.name === 'DEPARTAMENTO DE CIENCIAS BASICAS');

            //Filtrar asesores por departamentos del coordinador
            const specificAdvisers = data.data.filter((adviser) => adviser.department.id == coordinator_department
                && adviser.department.name !== 'DEPARTAMENTO DE CIENCIAS BASICAS');

            const available = specificAdvisers.concat(basicAdvisers);

            //Crear opciones para el select
            options = available.map((adviser) => {
                const text = `${adviser.name} ${adviser.last_name} ${adviser.second_last_name}`
                return { value: adviser.id, label: text }
            });
        }

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

    const asignarAlert = async (id, idx) => {
        try {
            function handle_change(value, action) {
                if (action.action === "select-option") {
                    selectedAdviser.current = value.value;
                    console.log(selectedAdviser.current);
                }
            }
            MySwal.fire({
                title: "Cambiar Asesor Interno",
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
                            components={{
                                MenuList: CustomMenuList,
                            }}
                            onChange={handle_change}
                            placeholder="Seleccione un asesor..."
                        />

                        <p>Escriba el nombre de un asesor en el campo de texto para filtrar las opciones mostradas.</p>
                    </>
                ),
                preConfirm: () => {
                    const asesor = selectedAdviser.current;
                    console.log(asesor);
                    if (asesor === 0) {
                        Swal.fire('No se seleccionó ningún asesor.', '', 'error');
                        return;
                    }

                    try {
                        const data = { adviser_id: asesor };

                        axios.put(process.env.REACT_APP_API_URL + 'residences/advisers/change/' + id, data)
                        .then(response=>{
                            console.log(response.data);
                            Swal.fire(response.data.message);
                        });

                    } catch (e) {
                        console.error(e);
                    }

                    selectedAdviser.current = 0;
                }
            });

        } catch (error) {
            console.error("Error al obtener las observaciones:", error.message);
            // Manejar el error si fetchObservations falla
        }
    };

    const filterStudents = (e) => {
        const filterName = e.target.value;

        if (filterName == "") {
            setDisplayStudents(availableStudents);
        } else {
            const filteredData = availableStudents.filter(({ student }) => {
                const studentName = `${student.name} ${student.last_name} ${student.second_last_name}`;
                return studentName.includes(filterName.toUpperCase());
            });

            setDisplayStudents(filteredData);
        }

    }

    return (
        <div id='body-content'>
            <Sidebar />
            <div id='main-content' >
                <NavBar user_type={'coordinators'} />

                <div id='row'>
                    <h2 style={{ paddingLeft: 50, paddingTop: 20 }}>Cambiar Asesor</h2>
                    <div className='col-xs-12'>
                        {availableStudents.length > 0 ?
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Form.Control
                                    onChange={(e) => filterStudents(e)}
                                    placeholder='Filtro de alumnos'
                                    style={{ width: '90%', alignSelf: 'center' }} />
                                <Tabla contador={false} residences={displayedStudents}>
                                    {(id, idx, status) => (
                                        <>
                                            <Button variant='info' title="Asignar Asesor" onClick={async () => { asignarAlert(id, idx); }}>
                                                <FontAwesomeIcon icon={faPersonCirclePlus} color='#fff' size="2x" />
                                            </Button>

                                        </>
                                    )}
                                </Tabla>
                            </div>
                            :
                            <Card style={{ margin: 50 }}>
                                <Card.Title>
                                    {loading ? "Cargando..." : "No hay alumnos"}
                                    {loading && <FontAwesomeIcon icon={faHourglass} spin />}
                                </Card.Title>
                            </Card>
                        }

                    </div>
                </div>

            </div>
        </div>
    )
}

export default AsignarEstudiantes