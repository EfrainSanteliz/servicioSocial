import React, { useState,useContext } from 'react';
import { Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "./Login.css";
import logo from "../../assets/logo.png"
import { GlobalContext } from '../../context/GlobalContext';
import { AlumnosContext } from '../../context/AlumnosContext';




const Login = () => {
  const [userType, setUserType] = useState('Alumno'); // 'alumno' es el tipo de usuario por defecto
  const [background, setBackground] = useState('Alumno-bg'); // La clase de fondo por defecto es 'alumno-bg'
  const navigate = useNavigate();
  const {setTipoUsuario, setEmailCoordinador, setAdmin, setAuthorized, periodo} = useContext(GlobalContext)
  const {setAlumno} = useContext(AlumnosContext)

  const redirectToScreen = (userType) => {
    if (userType === 'Alumno') {
      const alumno = document.getElementById('numero-control').value;
      console.log(alumno);
      setAlumno(alumno);
      navigate('/alumnos',{state:{alumno}});
    } else if (userType === 'Coordinador') {
      navigate('/asignar-estudiantes/'+periodo);
    }
  }

  // Función para manejar el cambio del tipo de usuario y cambiar la clase del fondo
  const handleUserTypeChange = (type) => {
    setUserType(type);
    setBackground(type + '-bg'); // Cambia la clase de fondo según el tipo
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Datos para el inicio de sesión
    const loginData = {
      control_number: userType === 'Alumno' ? document.getElementById('numero-control').value : null,
      nip: userType === 'Alumno' ? document.getElementById('nip').value : null,
      no_employed: userType === 'Coordinador' ? document.getElementById('email').value : null,
      password: userType === 'Coordinador' ? document.getElementById('password').value : null,
    };
  
    // Endpoints para el inicio de sesión
    const loginEndpoint = userType === 'Alumno' ? process.env.REACT_APP_API_URL+'student/login' : process.env.REACT_APP_API_URL+'coordinators/login';
  
    try {
      // Realizar la solicitud al servidor
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        setAuthorized(true);
        const tipoUsuario = userType === 'Alumno'? 'students' : 'coordinators';
        setTipoUsuario(tipoUsuario);
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', tipoUsuario);
        redirectToScreen(userType); // Redirige al usuario después del inicio de sesión exitoso
        if (userType === 'Coordinador') {
          const emailCoordinador = document.getElementById('email').value ;
          setEmailCoordinador(emailCoordinador); // Actualizar el contexto con el correo del coordinador
          if(emailCoordinador == 'residencias@hermosillo.tecnm.mx'){
            setAdmin(1);
          }else{
            setAdmin(0);
          }
         
        }
      } else {
        // Manejar errores de inicio de sesión
        console.error('Inicio de sesión fallido');
        Swal.fire('Contraseña y/o Usuario incorrectos','','error');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };
  

  return (
    <div className="container-fluid">
      <div className="row">
        <div className={`col-sm-6 col-md-7 intro-section ${background}`}>
          <div className="brand-wrapper">
              
          </div>
        </div>
        <div className="col-sm-6 col-md-5 form-section">
              
          <div className="login-wrapper">
            

            <h2 className="login-title"></h2>

            <Image src={logo} roundedCircle className='image' />

            <form onSubmit={handleSubmit}>
              
              {userType === 'Alumno' && (
                <>
                  <div className='btn-group'>
                    <Button className='btn-aaron user-btn' variant='none' size="lg" onClick={() => handleUserTypeChange('Alumno')}>Alumnos</Button>
                    <Button className='user-btn' variant='none' size="lg" onClick={() => handleUserTypeChange('Coordinador')}>Coordinador</Button>
                  </div>

                  <div className="form-group">
                    <label htmlFor="numero-control" className="sr-only">Número de Control</label>
                    <input type="text" name="numero-control" id="numero-control" className="form-control" placeholder="Número de Control" required />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="nip" className="sr-only">NIP</label>
                    <input type="password" name="nip" id="nip" className="form-control" placeholder="NIP" required />
                  </div>
                </>
              )}
              {userType === 'Coordinador' && (
                <>
                  <div className='btn-group'>
                    <Button className='user-btn' variant='none' size="lg" onClick={() => handleUserTypeChange('Alumno')}>Alumnos</Button>
                    <Button className='btn-aaron user-btn' variant='none' size="lg" onClick={() => handleUserTypeChange('Coordinador')}>Coordinador</Button>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="sr-only">Correo</label>
                    <input type="text" name="email" id="email" className="form-control" placeholder="Correo electrónico" required />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password" className="sr-only">Contraseña</label>
                    <input type="password" name="password" id="password" className="form-control" placeholder="Contraseña" required />
                  </div>
                </>
              )}
              <div className="d-flex justify-content-between align-items-center mb-5">
                <button name="login" id="login" className="btn login-btn" type="submit">Iniciar sesión</button>
              </div>
            </form>           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;