import React, { useState, useEffect, useContext } from 'react'
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

const Comunicado = ({ notice, onDelete }) => {
  const { tipoUsuario } = useContext(GlobalContext); 
  const formattedDate = format(new Date(notice.created_at), 'dd/MM/yyyy HH:mm');

  const downloadFile = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `download/comunicado/${notice.id}`,
        { 'responseType': 'blob' }
      );

      const fileName = notice.id;

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
    <Card style={{ backgroundColor: 'lightblue', padding: 10, marginLeft: 10, marginRight: 10, height: '100%' }}>
      <h6><b>{formattedDate} - {notice.coordinator_name}</b></h6>
      <p>{notice.text}</p>
      {notice.file_path !== "" && <Button onClick={downloadFile}>Descargar archivo adjunto</Button>}
      {tipoUsuario === 'coordinators' && ( // 3. Condicional para mostrar el botón de eliminación
      <Button variant="danger" style={styles.deleteButton} onClick={() => onDelete(notice.id)}><FontAwesomeIcon icon={faTrash} /> Eliminar</Button>
    )}
    </Card>
  )
}

Comunicado.propTypes = {
  notice: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

function ComunicadosCard({ career_id, refresh }) {
  const [comunicados, setComunicados] = useState([]);
  const [idxComunicado, setIdxComunicado] = useState(0);

  useEffect(() => {
    getNotices();
  }, [career_id, refresh]);

  async function getNotices() {
    if (career_id == null) return;
    const { data: noticeData } = await axios.get(process.env.REACT_APP_API_URL + 'notices/' + career_id);
    setComunicados(noticeData.notices);

    setIdxComunicado(noticeData.notices.length - 1);
  }

  const deleteNotice = async (notice_id) => {
    try {
      await axios.delete(process.env.REACT_APP_API_URL + 'notices/' + notice_id);
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El comunicado ha sido eliminado exitosamente.',
      });
      getNotices();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al eliminar el comunicado.',
      });
    }
  }

  function changeIdx(cambio) {
    const new_idx = idxComunicado + cambio;
    let final_pos = new_idx;

    if (new_idx < 0) {
      final_pos = 0;
    } else if (new_idx >= comunicados.length) {
      final_pos = comunicados.length - 1;
    }

    setIdxComunicado(final_pos);
  }

  const styles = {
    card: {
      padding: 0,
    },
    header: {
      backgroundColor: '#2F2F2F',
      fontFamily: 'Montserrat',
      color: '#EBEDEF',
      fontSize: 22,
    },
    content: {
      display: 'flex',
      flexDirection: 'row',
      padding: 10,
      minHeight: 150,
    },
    list: {
      overflowY: 'scroll',
      flex: 1,
    },
    listFooter: {
      marginBottom: 0,
    }
  }

  const comunicadoStyles = {
    card: {
        backgroundColor: '#43de90',
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
      <Card.Header style={styles.header}>Comunicados</Card.Header>

      {comunicados.length !== 0 ?
        (
          <Card.Body style={styles.content}>
            <Button onClick={() => changeIdx(1)} disabled={idxComunicado >= comunicados.length - 1}>←</Button>

            <ListGroup style={comunicadoStyles.text}>
              <Comunicado key={comunicados[idxComunicado].id} notice={comunicados[idxComunicado]} onDelete={deleteNotice} />
            </ListGroup>

            <Button onClick={() => changeIdx(-1)} disabled={idxComunicado <= 0}>→</Button>
          </Card.Body>

        ) : (<Card style={{ padding: 5, color: 'gray' }}>Sin comunicados.</Card>)
      }

      <Card.Footer>
        <p style={styles.listFooter}>{comunicados.length - idxComunicado} de {comunicados.length}</p>
      </Card.Footer>
    </Card>
  )
}

ComunicadosCard.propTypes = {
  career_id: PropTypes.number.isRequired,
  refresh: PropTypes.bool.isRequired,
};

export default ComunicadosCard;