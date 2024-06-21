import React, { useEffect, useState } from 'react'
import FiltroEstado from './FiltroEstado/FiltroEstado';
import FiltroCarrera from './FiltroCarrera/FiltroCarrera';
import { Form } from 'react-bootstrap';

function Filtros({ students, careers, returnFunc, filtroEstados = [] }) {

    const [availableStudents, setAvailableStudents] = useState([]);
    const [availableCareers, setAvailableCareers] = useState([]);
    const [nameFilter, setNameFilter] = useState("");
    const [controlFilter, setControlFilter] = useState("");
    const [expedientePendiente, setExpedientePendiente] = useState(false);

    useEffect(() => {
        setAvailableStudents(students);
    }, [students]);

    useEffect(() => {
        setAvailableCareers(careers);
    }, [careers]);


    const filterStudents = (e) => {
        const filterBox = e.target.name;
        const filterVal = e.target.value;

        let filteredData = availableStudents;

    
        if (filterBox === "student") {
            setNameFilter(filterVal);
            filteredData = filterStudentsByName(filteredData, filterVal)
            filteredData = filterStudentsByControlNumber(filteredData, controlFilter)
        } else {
            setControlFilter(filterVal);
            filteredData = filterStudentsByName(filteredData, nameFilter)
            filteredData = filterStudentsByControlNumber(filteredData, filterVal)
        }


        returnFunc(filteredData);
    }

    const filterStudentsByName = (data, name) => {
        if (name === "") {
            return data;
        }

        const filteredData = data.filter(({ student }) => {
            const studentName = `${student.name} ${student.last_name} ${student.second_last_name}`;
            return studentName.includes(name.toUpperCase());
        });

        return filteredData;
    }

    const filterStudentsByControlNumber = (data, control_number) => {
        if (control_number === "") {
            return data;
        }

        const filteredData = data.filter(({ student }) => {
            return student.control_number.includes(control_number.toUpperCase());
        });
        return filteredData;
    }

    const filterStudentsByCareer = (residencias) => {
        setAvailableStudents(residencias);
        residencias = filterStudentsByName(residencias, nameFilter);
        residencias = filterStudentsByName(residencias, controlFilter);
        returnFunc(residencias);
    }

    const filterStudentsByStatus = (residencias) => {
        residencias = filterStudentsByName(residencias, nameFilter);
        residencias = filterStudentsByName(residencias, controlFilter);
        returnFunc(residencias);
    }

    const handleExpedientePendienteChange = (e) => {
        setExpedientePendiente(e.target.checked);

        //Si es verdadero realizar filtro
        if(e.target.checked ){
            const filtrados = students.filter((estudiante)=>{
                if (estudiante.expediente && estudiante.expediente.files) {
                    const files = Object.values(estudiante.expediente.files);
                    return files.find((fs) => fs === "1"); // Devuelve true si hay archivos pendientes
                }
                return false; // Si no hay expediente o archivos pendientes, se descarta
            });

            setAvailableStudents(filtrados);

        }else{
            //Si es falso setAvailableStudents(students)
            setAvailableStudents(students)
        }
        // Refiltrar estudiantes al cambiar el estado del checkbox cambiando availableStudents

        //Si es falso setAvailableStudents(students)
        console.log(students);
        filterStudents({ target: { name: 'student', value: nameFilter } });
    }


    return (
        <span style={{ width: '93%', alignSelf: 'center', margin: '10px' }}>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'row'}}>
                <FiltroCarrera carreras={availableCareers} residencias={students} filterFunc={filterStudentsByCareer} />
                <span style={{ flex: 1, display: 'flex', flexDirection: 'row', marginLeft: '10px'}}>
                <FiltroEstado residencias={availableStudents} estados={filtroEstados} filterFunc={filterStudentsByStatus} />
                </span>
            </span>

           

            <span style={{ display: 'flex', flexDirection: 'column', marginTop: '10px'}}>


            <span style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                <Form.Control
                    onChange={(e) => filterStudents(e)}
                    placeholder='Filtro por Num. Control'
                    maxLength={9}
                    name={'control'}
                    style={{ flex: 1 }}
                />
            <span style={{ flex: 1, display: 'flex', flexDirection: 'row', marginLeft:'10px'}}>
            <Form.Control
                    onChange={(e) => filterStudents(e)}
                    placeholder='Filtro por Nombre de alumnos'
                    name={'student'}
                    style={{ flex: 6 }}
                />
            </span>
               
            </span>
            <span style={{flex: 1, display: 'flex', flexDirection: 'row', marginTop: '10px'}}>
            <Form.Check
                    type="checkbox"
                    label="Mostrar solo pendientes"
                    checked={expedientePendiente}
                    onChange={handleExpedientePendienteChange}
                />
            </span>
          
         </span>
        </span>
    )
}

export default Filtros