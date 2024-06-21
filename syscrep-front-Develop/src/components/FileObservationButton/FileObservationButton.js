import React from 'react'
import { Button, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const MySwal = withReactContent(Swal);

//studentID: Numero de control del estudiante
//fileID: Id del archivo en la tabla de observaciones
//statusKey: Nombre del campo a modificar en la tabla de expedientes.
//fileName: Nombre de archivo que se muestra en la alerta.
function FileObservationButton({ studentID, fileID, statusKey, fileName }) {

    const observationAlert = () => {
        MySwal.fire({
            title: "Observaciones: " + fileName,
            confirmButtonText: "Confirmar",
            confirmButtonColor: 'red',
            html: (<>
                <Form.Control id={'observaciones_'+fileName} type='text' as='textarea' rows='3'></Form.Control>
            </>),

        }).then((result) => {
            const observations = document.getElementById('observaciones_'+fileName).value;

            if (observations === "") {
                Swal.fire('Error', 'El campo de observaciones no puede estar vacio.', 'error');
                return
            }

            if (result.isConfirmed) {
                const data = {
                    statusKey,
                    statusValue: '2',
                    observations,
                    file: fileID
                }

                axios.post(process.env.REACT_APP_API_URL + 'StatusExpediente/' + studentID, data)
                .then((response)=>{
                    console.log(response);
                    Swal.fire('Observaciones enviadas', '', 'info');
                }).catch((e)=>console.error(e));
                
                console.log(observations);
            }
        })
    }


    return (
        <Button variant='warning' onClick={()=>observationAlert()}>Observaciones</Button>
    )
}

export default FileObservationButton