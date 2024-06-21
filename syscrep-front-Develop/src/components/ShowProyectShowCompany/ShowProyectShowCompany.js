import { useState,useEffect } from "react";
import { Table, Card } from "react-bootstrap";
import "./Styles.css";
import axios from 'axios';
//import ShowCompany from '../ShowCompany'; // Asegúrate de ajustar la ruta correcta
//import ShowProyectos from '../ShowProyect'; // Asegúrate de ajustar la ruta correcta

function ShowProyectShowCompany() {
    const [displayCompanys, setDisplayCompanys] = useState([]);
    const [displayProyects, setDisplayProyects] = useState([]);
    const [data, setData] = useState([]);
  
    useEffect(() => {
      getCompanys();
      getProyects();
    }, []);
  
    const getCompanys = async () => {
      const { data } = await axios.get("http://127.0.0.1:8000/api/company");
      setDisplayCompanys(data.data);
      console.log(data);
    };
  
    const getProyects = async () => {
      const { data } = await axios.get("http://127.0.0.1:8000/api/proyect");
      setDisplayProyects(data.data);
      console.log(data);
    };
  
    return (
        <div className="tabla-container">
            <div className="separacion">
          <Card>
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    {/* <th>ID (Company)</th> */}
                    <th className="small-text">Nombre de Compañia</th>
                    {/* <th>ID (Proyecto)</th> */}
                    <th className="small-text">Nombre de Proyecto</th>
                    <th className="small-text">Descripción</th>
                    <th className="small-text">Requisitos</th>
                    <th className="small-text">Oferta</th>
                    <th className="small-text">Fecha de Expiración</th>
                    <th className="small-text">Remuneración</th>
                    <th className="small-text">Número de Residentes</th>
                    {/* <th className="small-text">Correo Electrónico</th>*/}
                    <th className="small-text">Número de Teléfono</th>

                  </tr>
                </thead>
                <tbody>
                  {displayCompanys.map((company, idx) => (
                    <tr key={`company-${idx}`}>
                      {/* <td>{company.id}</td> */}
                      <td className="small-text">{company.name}</td>
                      {/* Find the corresponding project for this company using the company ID */}
                      {displayProyects.find((proj) => proj.company_id === company.id) ? (
                        <>
                          {/* <td>{displayProyects.find((proj) => proj.company_id === company.id).id}</td> */}
                          <td className="small-text">{displayProyects.find((proj) => proj.company_id === company.id).name}</td>
                          <td className="small-text">{displayProyects.find((proj) => proj.company_id === company.id).description}</td>
                          <td className="small-text">{displayProyects.find((proj) => proj.company_id === company.id).requirements}</td>
                          <td className="small-text">{displayProyects.find((proj) => proj.company_id === company.id).offer}</td>
                          <td className="small-text">{displayProyects.find((proj) => proj.company_id === company.id).expiration}</td>
                          <td className="small-text">{displayProyects.find((proj) => proj.company_id === company.id).remuneration}</td>
                          <td className="small-text">{displayProyects.find((proj) => proj.company_id === company.id).resident_number}</td>
                          {/* <td className="small-text">{displayProyects.find((proj) => proj.company_id === company.id).email}</td>*/}
                          <td className="small-text">{displayProyects.find((proj) => proj.company_id === company.id).phone_number}</td>
                        </>
                      ) : (
                        // If there is no corresponding project, render empty cells
                        Array.from({ length: 9 }, (_, i) => <td key={i}></td>)
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
        </div>
      );
    
  }
  
  export default ShowProyectShowCompany;