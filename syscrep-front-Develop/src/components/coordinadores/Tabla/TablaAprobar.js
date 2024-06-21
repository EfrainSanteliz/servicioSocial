import React, { useState, useEffect } from 'react';
import { Table, Card, Badge, Button, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import Downloadbutton from '../../Uploadbutton/downloadbutton';
import FileUploadButton from '../../Uploadbutton/uploadbutton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEye, faPenFancy } from '@fortawesome/free-solid-svg-icons';
import StatusDisplay from '../../StatusDisplay/StatusDisplay';

const MySwal = withReactContent(Swal);

const divStyle = {
    padding: 50,
    fontFamily: 'montserrat',
};
const cellTexCenter = {
    textAlign: 'center',
};

function Tabla({ residences, updateFunc, children }) {

    const [ascending, setAscending] = useState(false);
    const [statusAscending, setStatusAscending] = useState(false);
    const [orderBy, setOrderBy] = useState(null);

    const handleKardexUploadSuccess = async (studentId, status) => {
        if (status >= 8) return;
        const { data } = await axios.put(process.env.REACT_APP_API_URL + "residences/status/" + studentId, { status: 8 });

        const formData = new FormData();
        formData.append('observations', 'Corrigiendo Carta');
        formData.append('status', 8);
        updateFunc(studentId, 8, formData);
    };

    const firmarDocumento = async (studentId) => {
        const formData = new FormData();
        formData.append('observations', 'Carta Firmada');
        formData.append('status', 9);
        const result = await updateFunc(studentId, 9, formData);
        if (result) {
            Swal.fire('Se le ha desbloqueado la carta al alumno para descargarla.');
        }
    }

    const handleSort = (key) => {
        if (key == 'status') {
            setStatusAscending(!statusAscending);
            return;
        }

        if (orderBy === key) {
            setAscending(!ascending);
        } else {
            setOrderBy(key);
            setAscending(true);

        }
    };


    const observationAlert = (id, status) => {
        MySwal.fire({
            title: "Enviar observaciones",
            confirmButtonText: "Confirmar",
            confirmButtonColor: 'red',
            html: (<>
                <Form.Control id='observaciones' type='text' as='textarea' rows='3'></Form.Control>
            </>),
        }).then((result) => {
            const observaciones = document.getElementById('observaciones').value;

            if (result.isConfirmed) {
                if (observaciones === "") {
                    Swal.fire('Error', 'El campo de observaciones no puede estar vacio.', 'error');
                    return
                }

                const formData = new FormData();
                formData.append('status', status);
                formData.append('observations', observaciones);
                formData.append('file', 99);

                updateFunc(id, status, formData);

                Swal.fire('Observaciones enviadas', '', 'info');
            }
        })
    }

    const viewObservationAlert = async (id) =>{
        const token = localStorage.getItem('token');
        let message = null

        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL + 'residences/observations/historic/' + id,
                { headers: { Authorization: `Bearer ${token}` } });
            
            //Filtrar observaciones que hagan referencia a la carta firmada por el coordinador(id=99)
            const mensajes = data.data.filter((o)=>o.file == 99);

            if(mensajes.length != 0){
                message = mensajes[0].observations;
            }
            console.log(data);
        }catch(e){
            console.log(e);
        }finally{
            if(message == null){
                message = "No se le ha enviado ningun mensaje"
            }
    
            MySwal.fire('Mensaje Enviado',message);
        }

    }


    const sortedResidences = orderBy ? (() => {
        const sorted = residences.sort((data_a, data_b) => {
            let a, b;

            if (orderBy == "date") {
                a = new Date(format(data_a.updated, 'yyyy-MM-dd'));
                b = new Date(format(data_b.updated, 'yyyy-MM-dd'));
            } else if (orderBy == "career") {
                a = data_a.student.career.name;
                b = data_b.student.career.name;
            } else {
                a = data_a.student[orderBy];
                b = data_b.student[orderBy];
            }

            if (a < b) {
                return ascending ? -1 : 1;
            } else if (a > b) {
                return ascending ? 1 : -1;
            } else {
                return 0;
            }
        });

        const statusSorted = sorted.sort((a, b) => {
            if (a.status < b.status) {
                return statusAscending ? -1 : 1;
            } else if (a.status > b.status) {
                return statusAscending ? 1 : -1;
            } else {
                return 0;
            }
        });

        return statusSorted;
    })()
        : residences;

    function Fila({ data, botones, studentId }) {

        return (
            <tr>
                <td>{data.student.control_number}</td>
                <td>{data.student.last_name + " " + data.student.second_last_name}</td>
                <td>{data.student.name}</td>
                <td>{data.student.career.name}</td>
                {/* <td>{data.proyect.company.name}</td>
                    <td>{data.proyect.name}</td> */}
                <td width="180px"><StatusDisplay propstatus={data.status} control_number={data.student.control_number} statusChangeFunc={(id, status) => updateFunc(id, status)}/></td>
                <td>{convertirFecha(data.updated)}</td>
                <td width="120px" style={cellTexCenter} >{botones(data.student.control_number, data.student.id, data.status)}</td>
                <td width="120px" style={cellTexCenter} ><FileUploadButton
                    onUploadSuccess={() => handleKardexUploadSuccess(studentId, data.status)}
                    studentId={studentId}
                    buttonText={"Subir Carta"}
                    desiredFileName={"Carta_Presentacion"}
                    uniqueIndex={studentId}
                    isDisabled={false}
                    buttonStyle={"primary"}
                    expectedFileType={"pdf"}
                    size={"lg"}
                />
                    {data.status >= 8 && (<Downloadbutton
                        studentId={studentId}
                        buttonText="Carta validada"
                        desiredFileName={`Carta_Presentacion`}
                        isDisabled={false}
                        buttonStyle="secondary"
                        size="sm"
                        fileType="pdf"
                        uniqueIndex={11}
                    />)}
                </td>
                <td style={cellTexCenter}>
                    <Button variant='dark' 
                    title='Firmar Carta'
                    disabled={data.status < 8 || data.status >= 10} 
                    onClick={() => firmarDocumento(studentId)}>
                    Firmar
                    </Button>
                    <br></br>
                    <Button
                        variant='warning'
                        title='Agregar Observaciones'
                        onClick={() => observationAlert(studentId, data.status)}>
                        <FontAwesomeIcon icon={faAdd} />
                    </Button>
                    <Button variant='info'
                    title='Ver Mensaje'
                    onClick={()=> viewObservationAlert(data.student.id)}>
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                </td>

            </tr>
        );

    }


    return (

        <div className="tabla-container" style={divStyle}>
            <Card>
                <Card.Body>
                    <Table striped hover responsive>
                        <thead>
                            <tr>
                                {/* OrderTh es un elemento th que permite al usuario ordenar la tabla */}
                                <OrderTh clickFunc={() => handleSort('control_number')} ascending={ascending}>Matrícula</OrderTh>
                                <OrderTh clickFunc={() => handleSort('last_name')} ascending={ascending}>Apellido</OrderTh>
                                <OrderTh clickFunc={() => handleSort('name')} ascending={ascending}>Nombre</OrderTh>
                                <OrderTh clickFunc={() => handleSort('career')} ascending={ascending}>Carrera</OrderTh>
                                <OrderTh clickFunc={() => handleSort('status')} ascending={statusAscending} width="120px">Estado</OrderTh>
                                <OrderTh clickFunc={() => handleSort('date')} ascending={ascending} width="120px">Actualización</OrderTh>
                                <th width="140px" style={cellTexCenter}>Original</th>
                                <th width="150px" style={cellTexCenter}>Correcciones</th>
                                <th width="150px" style={cellTexCenter}>Firmar</th>

                            </tr>
                        </thead>
                        <tbody>
                            {sortedResidences.map((residence, idx) => (
                                <Fila key={idx} data={residence} botones={children} studentId={residence.student.control_number} />
                            ))}
                        </tbody>
                    </Table>

                </Card.Body>

            </Card>
        </div>
    );
}

const OrderTh = ({ children, clickFunc, ascending }) => {
    return (
        <th onClick={clickFunc} style={{ cursor: 'pointer' }}>{children}{ascending ? '↓' : '↑'}</th>
    );
}

function convertirFecha(date_str) {
    return format(date_str, 'dd/MM/yyyy');
}


export default Tabla;