import React, {useRef, useEffect, useState} from 'react'
import Select from 'react-select'

function FiltroCarrera({residencias, filterFunc, estados}) {

    const estado = useRef(0);
    
    const statusOptions = [
        {label: 'Todos', value: 0},
        {label: 'Formato Descargado', value: 1},
        {label: 'Entregado', value: 2},
        {label: 'En Asignación de Asesor', value: 3},
        {label: 'Asesor Asignado', value: 4},
        {label: 'Observación', value: 5},
        {label: 'Aprobado', value: 6},
        {label: 'Finalizado', value: 7},
        {label: 'Corrigiendo', value: 8},
        {label: 'Firmado', value: 9},
    ];
    
    const [options,setOptions] = useState(statusOptions);

    useEffect(()=>{
        if(estados.length > 0){
            const filteredStates = statusOptions.filter(estado=>estados.includes(estado.value));
            setOptions([{label: 'Todos', value: 0},, ...filteredStates]);
        }
    },[estados]);

    useEffect(()=>{
        filterStudentsByStatus({value:estado.current},{action:"select-option"});
    },[residencias]);

    const filterStudentsByStatus = (value, action) => {
        if (action.action !== "select-option") return;

        let filteredData = [];

        if (value.value === 0) {
            // Todas los estados.
            filteredData = residencias;
        } else {
            const filteredStudents = residencias.filter((residence) => residence.status == value.value);
            filteredData = filteredStudents;
        }

        estado.current = value.value;
        
        filterFunc(filteredData);
    }

    return (
        <label style={{ margin: 0, padding: 0, minWidth: 300 }}>Estatus:
            <Select
                style={{ flex: 1 }}
                options={options}
                isClearable={false}
                onChange={filterStudentsByStatus}
                placeholder="Filtrar por estatus"
            />
        </label>
    )
}

export default FiltroCarrera