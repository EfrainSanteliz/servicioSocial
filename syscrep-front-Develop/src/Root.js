import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Alumnos from './screens/Alumnos/Alumnos';
import ShowProyects from './components/ShowProyect/ShowProyect';
import AsignarEstudiantes from './screens/coordinadores/AsignarEstudiantes';
import Login from "./screens/Login/login";
import AsignarCarreras from './screens/coordinadores/AsignarCarreras';
import AltaEstudiante from './components/NewStudents/NewStudents';
import BajaEstudiante from './components/DestroyStudent/DestroyStudent';
import AgregarEstudiante from './screens/coordinadores/AgregarEstudiante';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Bancodeproyectos2 from './components/Bancodeproyectos2/Bancodeproyectos2'; 
import AgregarCompañiasYproyectos from './screens/coordinadores/AgregarCompañiasYproyectos';
import ShowProgramas from './components/ShowProgramas/ShowProgramas';
import ExpedienteEstudiante from './screens/coordinadores/ExpedienteEstudiante';
import AgregarComunicados from './screens/coordinadores/AgregarComunicados';
import ExpedienteAlumnos from './screens/Alumnos/ExpedienteAlumnos';
import axios from 'axios';
import { GlobalContext } from './context/GlobalContext';
import CambiarAsesor from './screens/coordinadores/CambiarAsesor';
import AprobarCarta from './screens/coordinadores/AprobarCarta';
import ExportarDatos from './screens/coordinadores/ExportarDatos';


function Root() {
    const [authorized, setAuthorized] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [emailCoordinador, setEmailCoordinador] = useState('');
    const [admin, setAdmin] = useState(false);
    const [periodo, setPeriodo] = useState('2024-1');

    const context = {authorized, setAuthorized, pageLoading, setPageLoading, tipoUsuario, setTipoUsuario,emailCoordinador,setEmailCoordinador,admin,setAdmin, periodo, setPeriodo};

    useEffect(() => {
        async function check_auth() {
            try {

                let userType = localStorage.getItem('usuario');
                setTipoUsuario(userType);
                
                if(userType === 'students'){
                    userType = 'student';
                }

                const token = localStorage.getItem('token');

                const {data} = await axios.get(process.env.REACT_APP_API_URL + userType + '/me', {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });

                const auth = data.success;

                setAuthorized(auth);

                if(userType === 'coordinators'){
                    setEmailCoordinador(data.coordinador.no_employed);
                    setAdmin(data.coordinador.isAdmin);
                }

                setPageLoading(false);
            } catch {
                setAuthorized(false);
                setPageLoading(false)
            }
        }

        setPageLoading(true);
        check_auth();
        
        axios.get(process.env.REACT_APP_API_URL + 'period/current').then(res=>{
            setPeriodo(res.data.period.año+'-'+res.data.period.mitad);
        }).catch(error=>{
            console.log(error);
        });
    }, []);

    return (
        <GlobalContext.Provider value={context}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/alumnos" element={<PrivateRoute component={Alumnos} userType='students'/>} />
                    <Route path="/asignar-estudiantes/:periodo" element={<PrivateRoute component={AsignarEstudiantes} userType='coordinators'/>}/>
                    <Route path="/asignar-carreras" element={<PrivateRoute component={AsignarCarreras} userType='coordinators'/>}/>
                    <Route path="/alta-estudiante" element={<PrivateRoute component={AltaEstudiante} userType='coordinators'/>}/>
                    <Route path="/baja-estudiante" element={<PrivateRoute component={BajaEstudiante} userType='coordinators'/>}/>
                    <Route path="/agregar-estudante" element={<PrivateRoute component={AgregarEstudiante} userType='coordinators'/>}/>
                    <Route path="/agregar-comunicados" element={<PrivateRoute component={AgregarComunicados} userType='coordinators'/>}/>
                    <Route path="/proyect/:id/:razonSocial/:controlNumber" element={<PrivateRoute component={ShowProyects} userType='students' />} />
                    <Route path="/agregar-compañias-proyectos" element={<PrivateRoute component={AgregarCompañiasYproyectos} userType='coordinators' />} />
                    <Route path="/programas/:controlNumber" element={<PrivateRoute component={ShowProgramas} userType='students' />} />                    <Route path="/expediente-estudiante/:controlNumber" element={<PrivateRoute component={ExpedienteEstudiante} userType='coordinators'/>}/>
                    <Route path="/expediente-estudiante/:controlNumber" element={<PrivateRoute component={ExpedienteEstudiante} userType='coordinators'/>}/>
                    <Route path="/expediente-alumno/:controlNumber" element={<PrivateRoute component={ExpedienteAlumnos} userType='students'/>}/>
                    <Route path="/cambiar-asesor" element={<PrivateRoute component={CambiarAsesor} userType='coordinators'/>}/>
                    <Route path="/aprobar-carta" element={<PrivateRoute component={AprobarCarta} userType='coordinators'/>}/>
                    <Route path="/generar-archivo" element={<PrivateRoute component={ExportarDatos} userType='coordinators'/>}/>




                    {/* Otros componentes de rutas aquí */}
                </Routes>
            </Router>
        </GlobalContext.Provider>
    )
}

export default Root