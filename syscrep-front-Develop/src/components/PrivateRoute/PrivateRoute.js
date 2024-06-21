import React from 'react'
import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import { Navigate } from 'react-router-dom';
import "./Styles.css";

function PrivateRoute({ component: Component, userType }) {

    const {authorized, tipoUsuario, pageLoading} = useContext(GlobalContext);

    if(pageLoading){
        return (
            <div className="loader"></div>
        );
    }
    else if (authorized && tipoUsuario == userType){
        console.log(userType,tipoUsuario);
        return (<Component/>);
    }else{
        console.log(pageLoading);
        console.log(authorized)
        return (<Navigate to={'/'}/>);
    }
}


export default PrivateRoute