import FileDownloadButton from '../DowloadButton/dowloadButton';
import DescargarArchivo from "../../assets/DescargarArchivo.png";

function DownloadReportForm() {

  return (
    <div className="containerCard">
      <div className="card">
        <div className="imgBx">
          <img src={DescargarArchivo} />
        </div>
        <div className="contentBx">
          <h2>Paso 1</h2>
          <div className="size">
            <h6>Descargar estructura del reporte preliminar</h6>


          </div>

          <FileDownloadButton />
        </div>
        
      </div>
    </div>
  );
}


export default DownloadReportForm;