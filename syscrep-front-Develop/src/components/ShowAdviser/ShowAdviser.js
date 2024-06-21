import React, { useState, useEffect } from 'react';
import { Table, Card, Pagination } from 'react-bootstrap';
import axios from 'axios';
import "./Styles.css"

const divStyle = {
  padding: 0,
  marginLeft: "-50px",
  marginRight: "-40px",
  fontSize: 11, // Ajusta este valor según tus preferencias
};

const itemsPerPage = 20; // Número de elementos por página
const pagesToShow = 15; // Número de páginas que se mostrarán en la paginación

function ShowAdviser({ Advisers ,updateAdviser}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredAdvisers ,setFilteredAdvisers] = useState([]);

  
  useEffect(() => {
    // Update filtered companies when the browser value changes
    updateAdviser();
    setFilteredAdvisers(
        Advisers.filter((Adviser) =>
        Object.values(Adviser).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [searchTerm, Advisers]);

  // Cálculo de índices para la paginación
  const indexOfLastAdviser = currentPage * itemsPerPage;
  const indexOfFirstAdviser = indexOfLastAdviser - itemsPerPage;
  const currentAdvisers = filteredAdvisers.slice(indexOfFirstAdviser, indexOfLastAdviser);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Cálculo de límites para mostrar páginas
  const pageLimit = Math.ceil(filteredAdvisers.length / itemsPerPage);
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
              placeholder="Ingrese un dato del asesor"
            />
          </div>
        </div>
        <Card>
          <Card.Body>
          <Table striped hover responsive>
              <thead>
                <tr>
                  <th width="150px">Nombre</th>
                  <th width="150px">Número De Empleado</th>
                  <th width="200px">Correo</th>
                  <th width="100px">Telefono</th>
                  <th width="150px">Departamento</th>

                  {/* Agrega más encabezados según los datos que tengas */}
                </tr>
              </thead>
              <tbody>
                {currentAdvisers.map((adviser, idx) => (
                  <tr key={idx}>
                    <td style={{ width: '150px' }}>{`${adviser.name} ${adviser.last_name} ${adviser.second_last_name}`}</td>
                    <td width="120px">{adviser.employee_number}</td>
                    <td width="200px">{adviser.email}</td>
                    <td width="100px">{adviser.phone_number}</td>
                    <td width="150px">{adviser.department.name}</td>



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

export default ShowAdviser;