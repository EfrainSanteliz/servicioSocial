import React, { useState } from 'react';
import { Table, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import expediente from '../../../assets/expediente.png'
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import StatusDisplay from '../../StatusDisplay/StatusDisplay';


const MySwal = withReactContent(Swal);

const divStyle = {
    marginRight: '50px',
    marginLeft: '50px',
    fontFamily: 'montserrat',
};
const cellTexCenter = {
    textAlign: 'center',
};

function Tabla({ residences, updateFunc, children }) {

    const [ascending, setAscending] = useState(false);
    const [orderBy, setOrderBy] = useState(null);

    const handleSort = (key) => {
        if (orderBy === key) {
            setAscending(!ascending);
        } else {
            setOrderBy(key);
            setAscending(true);
        }
    };


    const sortedResidences = orderBy ?
        residences.sort((data_a, data_b) => {
            let a, b;

            if (orderBy == "date") {
                a = new Date(format(data_a.updated, 'yyyy-MM-dd'));
                b = new Date(format(data_b.updated, 'yyyy-MM-dd'));
            } else if (orderBy == "status") {
                a = data_a.status;
                b = data_b.status;
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
        })
        : residences;

    function Fila({ data, botones }) {
        let file_status = [];
        if(data.expediente != null){
           file_status  = Object.values(data.expediente.files);

        }

  

        return (
            <tr>
                <td>{data.student.control_number}</td>
                <td>{data.student.last_name + " " + data.student.second_last_name}</td>
                <td>{data.student.name}</td>
                <td>{data.student.career.name}</td>
                {/* <td>{data.proyect.company.name}</td>
                    <td>{data.proyect.name}</td> */}
                <td width="180px"><StatusDisplay propstatus={data.status} control_number={data.student.control_number} statusChangeFunc={(id, status) => updateFunc(id, status)}/></td>
                <td width="120px" style={cellTexCenter}>{convertirFecha(data.updated)}</td>
                <td style={cellTexCenter}>{data.status >= 2 ? (<>
                    <Link to={`/expediente-estudiante/${data.student.control_number}`} className="btn btn-primary"><img src={expediente} alt="Expediente" className="expediente-img" /></Link>
                    {file_status.find((fs) => fs === "1") && <FontAwesomeIcon icon={faExclamationCircle} color='red' title='Cambios en el expediente'/>}
                </>) : null}</td>
                <td width="120px" style={cellTexCenter} >{botones(data.student.control_number, data.student.id, data.status)}</td>
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
                                <OrderTh clickFunc={() => handleSort('status')} ascending={ascending} width="120px">Estado</OrderTh>
                                <OrderTh clickFunc={() => handleSort('date')} ascending={ascending} width="120px" style={cellTexCenter}>Actualizado</OrderTh>
                                <th width="140px" style={cellTexCenter}>Expediente</th>
                                <th width="150px" style={cellTexCenter}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedResidences.map((residence, idx) => (
                                <Fila key={idx} data={residence} botones={children} />
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