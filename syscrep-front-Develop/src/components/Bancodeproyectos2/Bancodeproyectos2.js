import React, { useState, useEffect } from "react";
import ShowCompanys from "../ShowCompany/ShowCompany";
import axios from "axios";
import { Table, Card } from "react-bootstrap";
import CustomModal from "./Modal";
import StoreCompany from "../StoreCompany/StoreCompany";
import "./Styles.css";


function Bancodeproyectos2() {
  const [displayCompanys, setDisplayCompanys] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    getCompanys();
  }, []);

  const getCompanys = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL+ 'company/');
      setDisplayCompanys(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  return (
    <div id="Bancodeproyectos">
      <div style={{ display: "flex", alignItems: "center" }}>
        <StoreCompany updateCompanys={getCompanys} />
      </div>
     {
      <div id="tabla">
        {displayCompanys.length > 0 ? (
          <ShowCompanys
            companys={displayCompanys}
            updateCompanys={getCompanys}
          />
        ) : (
          <Card style={{ margin: 50 }}>
            <Card.Title>No hay Compañias</Card.Title>
          </Card>
        )}
      </div>}
    </div>
  );
}

export default Bancodeproyectos2;
