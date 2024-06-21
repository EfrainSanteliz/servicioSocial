import React, { useState, useEffect } from 'react';
import { Table, Card, Pagination } from 'react-bootstrap';
import axios from 'axios';
import "./Styles.css"

const divStyle = {
  padding: 0,
  marginLeft: "-50px",
  marginRight: "-40px",
  fontSize: 11, // Ajusta este valor según tus preferencias
};//

const itemsPerPage = 20; // Número de elementos por página
const pagesToShow = 15; // Número de páginas que se mostrarán en la paginación

function ShowStudents({ students ,updateStudent}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStudents, setFilteredStudents] = useState([]);

  
  useEffect(() => {
    // Update filtered companies when the browser value changes
    updateStudent();
    setFilteredStudents(
      students.filter((student) =>
        Object.values(student).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [searchTerm, students]);

  // Cálculo de índices para la paginación
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Cálculo de límites para mostrar páginas
  const pageLimit = Math.ceil(filteredStudents.length / itemsPerPage);
  const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  const endPage = Math.min(pageLimit, startPage + pagesToShow - 1);

  return (
    <div style={divStyle}>
      <div id="tabla-container" style={{ padding: '50px', fontFamily: 'montserrat' }}>
        <div id="divContainer">
          <label id="form-label">BUSCAR : </label>
          <div id="inputContainer">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              className="form-control inputField"
              placeholder="Ingrese un dato del estudiante"
            />
          </div>
        </div>
        <Card>
          <Card.Body>
          <Table striped hover responsive>
              <thead>
                <tr>
                  <th width="150px">Nombre</th>
                  <th width="120px">Numero de control</th>
                  <th width="80px">Celular</th>
                  <th width="150px">Carrera</th>
                  <th width="80px">Semestre</th>
                  <th width="200px">email</th>

                  {/* Agrega más encabezados según los datos que tengas */}
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student, idx) => (
                  <tr key={idx}>
                    <td style={{ width: '150px' }}>{`${student.name} ${student.last_name} ${student.second_last_name}`}</td>
                    <td width="120px">{student.control_number}</td>
                    <td width="80px">{student.phone_number}</td>
                    <td width="150px">{student.career.name}</td>
                    <td width="80px">{student.semester}</td>
                    <td width="200px">{student.email}</td>
                   

                    {/* Agrega más celdas según los datos que tengas */}
                  </tr>
                ))}
              </tbody>
            </Table>
            <div id="paginationContainer">
            <Pagination style={{ width: '100%' }}>
                {startPage > 1 && (
                  <Pagination.Prev onClick={() => paginate(startPage - 1)} />
                )}
                {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
                  <Pagination.Item
                    key={startPage + index}
                    active={startPage + index === currentPage}
                    onClick={() => paginate(startPage + index)}
                    style={{ width: '55px', textAlign: 'center',fontSize:8 }} // Ancho fijo para los botones

                  >
                    {startPage + index}
                  </Pagination.Item>
                ))}
                {endPage < pageLimit && (
                  <Pagination.Next onClick={() => paginate(endPage + 1)} />
                )}
              </Pagination>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default ShowStudents;