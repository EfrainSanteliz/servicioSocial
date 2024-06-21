import { useContext, useState,useRef } from 'react';
import Formulario from "../../assets/Formulario.png"
import Form from '../Form/Form'
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import { AlumnosContext } from '../../context/AlumnosContext';
import CardBlocker from '../CardBlocker/CardBlocker';
import { Col, Row } from 'react-bootstrap';
import FileUploadButton from '../Uploadbutton/uploadbutton';


const customStyles = {
  // content : {
  //   ...
  // },
  overlay: { zIndex: 1 },
  close: { position: 'fixed', top: 50, right: 70, }
}




function FormCard(studentId) {
  const [visible, setVisible] = useState(false);
  const { status } = useContext(AlumnosContext);
  const [CredencialUploaded, setCredencialUploaded] = useState(false);

  const formRef = useRef();

  const handleSaveClick = () => {
    if (formRef.current) {
      formRef.current.saveForm(); // Llamada a la función saveForm del componente Form
    }
  };


  const handleCredencialUploadSuccess = () => {
    setCredencialUploaded(true);
  };
  
  console.log("Status Actual",status, studentId);
  const isButtonDisabled = !CredencialUploaded;
  console.log(studentId);
  

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      height: '90%',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      background: "#fefefe",
      borderRadius: "15px"
    },
    close: {
      position: 'sticky',
      top: 0,
      alignSelf: 'baseline'
    },
    data: {
      position: 'sticky',
      top: 55,
      alignSelf: 'baseline'
    }
  };

  


  return (
    <div className="containerCard">
      <div className={status >= 6 ? "card" : "card disabled"}>
        <div className="imgBx">
          <img src={Formulario} />
        </div>
        <div className="contentBx">
          <h2>Paso 3 </h2>
          <div className="size">
            <h6>Registro Siscrep</h6>
          </div>
          <Row className='justify-content-center mb-4'>
            <Col md={4}>
              <FileUploadButton
                onUploadSuccess={handleCredencialUploadSuccess}
                studentId={studentId.studentId}
                buttonText={"Subir Credencial"}
                desiredFileName={"Credencial_"}
                uniqueIndex={5}
                isDisabled={false}
                buttonStyle={"primary"}
                expectedFileType={"pdf"}
                size={"md"}

              />
            </Col>
            <Col md={4}>
                <Button
                variant={CredencialUploaded ? "primary" : "secondary"}
                size="md"
                as="label"
                onClick={() => setVisible(true)}
                disabled={isButtonDisabled}
              >
                Abrir Formulario
              </Button>

              <Modal style={customStyles} isOpen={visible} parentSelector={() => document.querySelector('.main-content')}>
                <Button variant='danger' style={customStyles.close} onClick={() => setVisible(false)}>Cerrar</Button>
                <Button variant='info' style={customStyles.data} onClick={handleSaveClick}>Guardar</Button>
                <Form ref={formRef} />
                
              </Modal>
            </Col>
          </Row>
        </div>
        <CardBlocker show={status < 6} />
      </div>
    </div>
  );
}


export default FormCard;