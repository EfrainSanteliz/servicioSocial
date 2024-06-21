import React from "react";
import logo from "../assets/logo.png";
import "./navbarSyle.css";


function Navbar() {
    return (
      <nav>
        <div className="navbar-line-top"></div> {/* Línea superior (amarilla) */}
        <div className="nav-left">
          <a title="logoith" href="index.html">
            <img src={logo} alt="Logo del tecnológico" /> {/* Utiliza la variable "logo" como fuente de la imagen */}
          </a>
        </div>
        <div className="nav-right">
          <ul id="navbar">
            <li><a href="index.html">Mis Residencias</a></li>
          </ul>
        </div>
        <div className="navbar-line-bottom"></div> {/* Línea inferior (naranja) */}
      </nav>
    );
  }
  
  export default Navbar;
  
  
  
  
  
  