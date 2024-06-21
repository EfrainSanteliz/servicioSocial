import React,{useContext} from 'react';
import { AlumnosContext } from '../../context/AlumnosContext';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function DownloadButton({filename,fileUrl}){

    const {alumno,status,setStatus} = useContext(AlumnosContext);

    const handleDownload = async () =>{
        try{
            console.log('click')
            const response = await axios.get(process.env.REACT_APP_API_URL+'preliminars/'+alumno, {'responseType':'blob'});
            const blob = new Blob([response.data], { type: 'application/pdf' }); 
            
            // Create a URL for the Blob data
            const url = window.URL.createObjectURL(blob);

            // Create a link and trigger a click to start the download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Estructura_Reporte_Preliminar.pdf'; // Set the desired file name
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            if (status == 0){
                setStatus(1)
            }

        }catch(e){
            console.log(e);
        }
    };

    return (

            <Button  
              variant="primary" size="lg"
                onClick={handleDownload}
            >
                Descargar 
            </Button>
        
      );
}
export default DownloadButton;