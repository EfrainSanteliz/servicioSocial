import { createContext } from "react";

export const GlobalContext = createContext({
    tipoUsuario: '',
    setTipoUsuario: ()=>{},
    authorized: '',
    setAuthorized: () => {},
    pageLoading: true, //Si la pagina esta cargando, utilizado mientras se realiza la comprobacion de autorizacion
    setPageLoading: () => {},
    admin: false,
    setAdmin: () =>{},
    periodo: '2024-1',
    setPeriodo: ()=>{},

    emailCoordinador: '', 
    setEmailCoordinador: () => {}
});