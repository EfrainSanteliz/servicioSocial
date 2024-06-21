
import React, { useState } from "react";
import "./Styles.css"; // Importa el archivo de estilos

function BrowserCompany() {
  const [browser, setBrowser] = useState('');
    // Define the handleSearch function
    const handleSearch = () => {
      // Add your search logic here
      console.log(`Searching for: ${criterio}`);
      // You can perform the search operation using the 'criterio' value
    };
  

  return (
    <div className="divContainer">
      <label className="form-label">Browser: </label>
      <div className="inputContainer">
        <input
          value={browser}
          onChange={(e) => setBrowser(e.target.value)}
          type="text"
          className="form-control inputField"
          placeholder=""
        />
        <button onClick={handleSearch} className="searchButton">
          Buscar
        </button>
      </div>
    </div>
  );
}

export default BrowserCompany;