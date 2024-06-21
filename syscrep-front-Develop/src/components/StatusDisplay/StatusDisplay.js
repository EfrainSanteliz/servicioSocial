import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowAltCircleLeft} from "@fortawesome/free-solid-svg-icons"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

//Componente para mostrar el estado de la residencia
const StatusDisplay = ({ propstatus, statusChangeFunc, control_number }) => {
    const statuses = [
        { nombre: 'Inactivo', descripcion: 'El estudiante no ha descargado el reporte preliminar', color: '#eaebea', text:'black' },
        { nombre: 'Formato Descargado', descripcion: 'El estudiante descargó al menos una vez el formato del reporte preliminar', color: '#e34326' , text:'white'},
        { nombre: 'Entregado', descripcion: 'El estudiante ha enviado el reporte preliminar para su revisión', color: '#3cbaec' , text:'white'},
        { nombre: 'En Asignación de Asesor', descripcion: 'El reporte preliminar ha sido aceptado pero no se ha asignado un asesor', color: 'gray' , text:'white'},
        { nombre: 'Asesor Asignado', descripcion: 'Se le ha asignado un asesor al estudiante, en espera de aprobación', color: '#0623f9' , text:'white'},
        { nombre: 'Observación', descripcion: 'Se han enviado observaciones al estudiante', color: '#fdd458' , text:'black'},
        { nombre: 'Aprobado', descripcion: 'El reporte ha sido aprobado, el estudiante puede llenar su formulario', color: '#51b54a' , text:'white'},
        { nombre: 'Finalizado', descripcion: 'El estudiante ha enviado el formulario con sus datos y se ha generado la carta', color: 'black' , text:'white'},
        { nombre: 'Corrigiendo', descripcion: 'Realizando correcciones a la carta, esperando firma', color: '#7306f9' , text:'white'},
        { nombre: 'Firmado', descripcion: 'El estudiante tiene autorización para descargar la carta firmada', color: '#d7b879' , text:'black'},
        { nombre: 'Carta en Revision', descripcion: 'Se le ha mandado una observacion de la carta firmada', color: '#f9a21f' , text:'black'}
    ];

    //Estados con opcion para regresarlos
    const revertibleStates = [3, 4, 6];

    const status = parseInt(propstatus);
    const current_status = statuses[status]

    const customStyle = {
        "default":{
            backgroundColor: 'gray',
            borderRadius: 10,
            padding: 4,
            fontSize: 10,
            fontWeight: "bold"
        }
    }

    function revertStatus() {
        //Si el estatus es aprobado se tiene que ir al estado de asignacion directamente sin pasar por observaciones.
        const revertedStatus = status < 6 ? status - 1 : 4;

        MySwal.fire({
            title: 'Revertir Estado',
            html: `Se pasará del estado "${statuses[status].nombre}" a "${statuses[revertedStatus].nombre}"`,
            showDenyButton: true,
            confirmButtonText: "Revertir",
            confirmButtonColor: 'red',
            denyButtonText: `Cancelar`,
            denyButtonColor: 'gray',
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');

                    axios.post(process.env.REACT_APP_API_URL + 'residences/status/revert/' + control_number, null, {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }).then(({ data }) => {
                        console.log(data);
                        Swal.fire('Estado revertido', 'Se ha modificado el estado del alumno a: ' + statuses[revertedStatus].nombre, 'info');
                        statusChangeFunc(control_number, revertedStatus);
                    }).catch(e => Swal.fire('Error', 'Ha ocurrido un error: ' + e.message, 'error'));

                } catch (e) {
                    Swal.fire('Error', 'Ha ocurrido un error: ' + e.message, 'error');
                }
            }
        });
    }

    return (
        <>
            <span title={current_status.descripcion} style={{...customStyle.default, backgroundColor:current_status.color, color:current_status.text}}>{current_status.nombre}</span>
            {revertibleStates.includes(status) && <FontAwesomeIcon icon={faArrowAltCircleLeft} style={{ cursor: 'pointer' }} onClick={() => revertStatus()} />}
        </>
    )
}

export default StatusDisplay