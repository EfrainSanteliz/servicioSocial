import React, { useState } from 'react'
import Select from 'react-select'

function FiltroCarrera({carreras, residencias, filterFunc}) {

    const filterStudentsByCareer = (value, action) => {
        if (action.action !== "select-option") return;

        let filteredData = [];

        if (value.value === 0) {
            // Todas las carreras.
            filteredData = residencias;
        } else {
            const filteredStudents = residencias.filter((residence) => residence.student.career.id == value.value);
            filteredData = filteredStudents;
        }
        
        filterFunc(filteredData);
    }

    return (
        <label style={{ margin: 0, padding: 0, minWidth: 400 }}>Carrera:
            <Select
                style={{ flex: 1 }}
                options={carreras}
                isClearable={false}
                onChange={filterStudentsByCareer}
                placeholder="Filtrar por carrera"
            />
        </label>
    )
}

export default FiltroCarrera