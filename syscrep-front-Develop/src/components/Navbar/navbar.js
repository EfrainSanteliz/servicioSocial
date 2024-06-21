import React from "react";
import logo from "../../assets/logo.png";
import axios from "axios";
import "./navbarSyle.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Navbar({ user_type }) {
  const navigate = useNavigate();

  const logout = () => {
    try {
      const accessToken = localStorage.getItem('token');
      localStorage.removeItem('token');
      navigate('/');

      axios.post(process.env.REACT_APP_API_URL+'' + user_type + '/logout', {},
        {
          'headers': { 'Authorization': `Bearer ${accessToken}` }
        }).catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <nav className="navbar">
      <h2>Mis Residencias</h2>
      <Button className="btn-logout" onClick={logout}>Logout</Button>
    </nav>
  );
}

export default Navbar;