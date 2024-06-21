import React,{useContext} from 'react';
import './presentacionCardStyle.css';
import FileDownloadButton from '../DowloadButton/dowloadButton'; 
import DescargarArchivo from "../../assets/DescargarArchivo2.png"
import DocumentsDownload from '../DocumentsButtons/DocumentsDownload';
import CardBlocker from '../CardBlocker/CardBlocker';
import { AlumnosContext } from '../../context/AlumnosContext';

function PresentacionCard() {
  const {alumno,status} = useContext(AlumnosContext);

  return ( 
    <div className="containerCard">
    <div className={status >=9 ? "card" : "card disabled"}>
      <div className="imgBx">
        <img src={DescargarArchivo}/>
      </div>
      <div className="contentBx">
        <h2>Paso 4</h2>
        <div className="size">
          <h6>El Siguiente paso es descargar los documentos generados</h6>
          
  
        </div>
            <DocumentsDownload/>  
      </div>
      <CardBlocker show={status < 9}/>
    </div>
  </div>
  );
  }

  
  export default PresentacionCard;