import { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Container } from 'react-bootstrap';
import "./ObervationCardStyle.css";
import { AlumnosContext } from '../../context/AlumnosContext';
import axios from 'axios';
import DownloadStudentObservations from '../DownloadStudentProyect/DownloadStudentObservations';
import ModalObservacionesAlumno from '../ModalObservacionesAlumno/ModalObservacionesAlumno';
import { Button } from 'react-bootstrap'

function ObservationCard({ studentId }) {
  const { alumno, status } = useContext(AlumnosContext);
  const [text, setText] = useState('');
  const [observations, setObservations] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function getStatus() {
      try {

        setText('cargando...');

        if (studentId == null) return;

        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'residences/observations/historic/' + studentId,
          { headers });

        console.log('data.data:')
        console.log(data.data[0]);
          
        setObservations(data.data);

        if (status == 5) {
          setText(data.data[0].observations);
        } else {
          setText('En este apartado podras revisar las observaciones que se hayan hecho a tu reporte preliminar. Porfavor corrige tu reporte en caso de ser necesario');
        }
      } catch (e) {
        console.log(e);
        setText(e.message);
      }
    }

    getStatus();
  }, [status]);

  function style_type() {
    const value = status.toString();

    switch (value) {
      case "5":
        return "warning";
      default:
        return "ligth";
    }
  }

  return (
    <Container id="observations_card">
      <Card bg={style_type()} className="text-center">
        <Card.Header className='headerCard'>Observaciones</Card.Header>
        <Card.Body>
          {/* <Card.Title>Descargar Proyecto Preliminar</Card.Title>*/}
          <Card.Text>
            {text}
          </Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted" style={{display:'flex',justifyContent:'space-around'}}>
          <DownloadStudentObservations id={alumno} />
          <Button variant='secondary' onClick={() => setShow(!show)}>Historial de Observaciones</Button>

          <ModalObservacionesAlumno show={show} onHide={() => setShow(false)} observations={observations} />
        </Card.Footer>
      </Card>
    </Container>


  );
}


export default ObservationCard;