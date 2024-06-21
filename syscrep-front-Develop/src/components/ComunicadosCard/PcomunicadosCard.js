import React, { useState, useEffect,useContext } from 'react'
import { Button, Card, ListGroup } from 'react-bootstrap'
import axios from 'axios'
import { format } from 'date-fns'
import mime from 'mime';
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { GlobalContext } from "../../context/GlobalContext"
import { AlumnosContext } from '../../context/AlumnosContext';


const Pcomunicado = ({ pnotice, onDelete }) => {
  const { tipoUsuario } = useContext(GlobalContext); 
  const formattedDate = format(new Date(pnotice.created_at), 'dd/MM/yyyy HH:mm');

    const downloadFile = async () => {
        try {
          const response = await axios.get(
            process.env.REACT_APP_API_URL + `download/pcomunicado/${pnotice.id}`,
            { 'responseType': 'blob' }
          );
    
          const fileName = pnotice.id;

          // Obtener la extensión del archivo
      const fileType = response.headers['content-type'];
      const fileExtension = mime.getExtension(fileType);

      // Crear el Blob y la URL
      const blob = new Blob([response.data], { type: fileType });
      const url = window.URL.createObjectURL(blob);

      // Crear el elemento <a> y descargar el archivo
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.log(e);
    }
  }


  const styles = {
    card: {
      backgroundColor: '#E8F4F0',
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
      height: '100%',
      position: 'relative',
    },
    deleteButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      padding: '0.5rem 1.8rem',
    },
  };

  return (
    <Card style={{ backgroundColor: '#E8F4F0', padding: 10, marginLeft: 10, marginRight: 10, height: '100%' }}>
    <h6><b>{formattedDate}</b></h6>
    <p>{pnotice.ptext}</p>
    {pnotice.file_path !== "" && <Button onClick={downloadFile}>Descargar archivo adjunto</Button>}
    {tipoUsuario === 'coordinators' && ( // 3. Condicional para mostrar el botón de eliminación
      <Button variant="danger" style={styles.deleteButton} onClick={() => onDelete(pnotice.id)}><FontAwesomeIcon icon={faTrash} /> Eliminar</Button>
    )}
  </Card>
  )
}

Pcomunicado.propTypes = {
    pnotice: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

function PcomunicadosCard({ student_id, refresh }) {
    const [pcomunicados, setPcomunicados] = useState([]);
    const [idxPcomunicado, setIdxPcomunicado] = useState(0);

    useEffect(() => {
        getPnotices();
      }, [student_id, refresh]);


      async function getPnotices() {
        if (student_id == null) return;
        const { data: pnoticeData } = await axios.get(process.env.REACT_APP_API_URL + 'pnotices/' + student_id ,{data:{parametro:""}});
        setPcomunicados(pnoticeData.pnotices);
    
        setIdxPcomunicado(pnoticeData.pnotices.length - 1);
      }

      
      const deletePnotice = async (pnotice_id) => {
        try {
          await axios.delete(process.env.REACT_APP_API_URL + 'pnotices/' + pnotice_id);
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El comunicado ha sido eliminado exitosamente.',
          });
          getPnotices();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el comunicado.',
          });
        }
      }
    

      //Funcion para manejar el cambio del index de comunicados,
  // Se toma como parametro un numero entero que representa cuantos comunicados se recorre,
  // Positivo para ir hacia adelante y negativo para ir hacia atras.
  function changeIdx(cambio) {
    const new_idx = idxPcomunicado + cambio;
    let final_pos = new_idx;

    if (new_idx < 0) {
      final_pos = 0;
    } else if (new_idx >= pcomunicados.length) {
      final_pos = pcomunicados.length - 1;
    }

    setIdxPcomunicado(final_pos);
  }


  const styles = {
    card: {
      padding: 0,

    },
    header: {
      backgroundColor: '#2C3E50',
      fontFamily: 'Montserrat',
      color: '#ECF0F1',
      fontSize: 20,
    },
    content: {
      display: 'flex',
      flexDirection: 'row',
      padding: 5,
      minHeight: 150,
    },
    list: {
      overflowY: 'scroll',
      flex: 1,
    },
    listFooter: {
      marginBottom: 0,
    },

    botones:{
      backgroundColor:'#E8F4F0',
      color: '#FFFFFF', // Para asegurar un buen contraste con el texto
      border: 'none', // Remover borde para un estilo más limpio
     }
     
  }

  const pcomunicadoStyles = {
    card: {
        backgroundColor: '#E8F4F0',
          padding: 10,
          marginLeft: 10,
          marginRight: 10,
          wordWrap: 'break-word', // Añadir esta propiedad para permitir el ajuste de palabras largas
          overflow: 'hidden', // Añadir esta propiedad para manejar el desbordamiento
          minwidth: '400px', // Establecer una altura mínima para la tarjeta
    },
    text: {
        flex:1,
        wordBreak: 'break-word', // Añadir esta propiedad para romper las palabras largas
        overflow: 'hidden', // Añadir esta propiedad para evitar el desbordamiento
        textOverflow: 'ellipsis', // Añadir esta propiedad para agregar puntos suspensivos si el texto es demasiado largo
        display: '-webkit-box', // Añadir esta propiedad para limitar el número de líneas
        WebkitLineClamp: 3, // Limitar el número de líneas mostradas
        WebkitBoxOrient: 'vertical', // Añadir esta propiedad para que funcione -webkit-line-clamp
    }
}


  return (
    <Card style={styles.card}>
      <Card.Header style={styles.header}>Comunicados Personales</Card.Header>
      
      {pcomunicados.length != 0 ?
        (
          <Card.Body style={styles.content}>
            <Button style={styles.botones} onClick={() => changeIdx(1)} disabled={idxPcomunicado >= pcomunicados.length - 1}>←</Button>

            <ListGroup style={pcomunicadoStyles.text}>
              <Pcomunicado key={pcomunicados[idxPcomunicado].id} pnotice={pcomunicados[idxPcomunicado]} onDelete={deletePnotice} />
            </ListGroup>

            <Button style={styles.botones}onClick={() => changeIdx(-1)} disabled={idxPcomunicado <= 0}>→</Button>
          </Card.Body>

        ) : (<Card style={{ padding: 5, color: 'gray' }}>Sin comunicados Personales.</Card>)
      }


      <Card.Footer>
        <p style={styles.listFooter}>{pcomunicados.length - idxPcomunicado} de {pcomunicados.length}</p>
      </Card.Footer>
    </Card>
  )
}

PcomunicadosCard.propTypes = {
    student_id: PropTypes.number.isRequired,
    refresh: PropTypes.bool.isRequired,
  };


export default PcomunicadosCard

