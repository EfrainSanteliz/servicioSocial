import { createContext } from "react";

export const AlumnosContext = createContext({
    alumno: '',
    setAlumno: ()=>{},
    status: 0,
    setStatus: ()=>{},
    observations: '',
    setOservations: ()=>{}
});