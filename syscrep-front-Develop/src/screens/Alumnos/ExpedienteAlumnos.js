import React from "react";
import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Row, Col } from "reactstrap";
import Navbar from "../../components/Navbar/navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import StudentRecordInfo from "../../components/StudentInfo/studentrecordinfo";
import { useParams } from 'react-router-dom';
import DownloadStudentKardex from "../../components/DownloadStudentProyect/DownloadStudentKardex";
import DownloadStudentProyect from "../../components/DownloadStudentProyect/DownloadStudentProyect";
import DownloadStudentIdent from "../../components/DownloadStudentProyect/DownloadStudentIdent";
import axios from "axios";
import '../coordinadores/Styles.css'
import FileUploadButton from "../../components/Uploadbutton/uploadbutton";



function ExpedienteAlumnos() {
  let { controlNumber } = useParams();
  const [isFileAvailable, setIsFileAvailable] = useState(false);
  const [kardexUploaded, setKardexUploaded] = useState(false);
  const [lastReportUploaded, setLastReportUploaded] = useState(0);
  const [observation, setObservation] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [studentId,setStudentId] = useState(null);
  const [documentStatus, setDocumentStatus] = useState({
    ReportePreliminarStatus: '',
    SolicitudResidenciasStatus: '',
    CartaPresentacionStatus: '',
    CartaAceptacionStatus: '',
    Reporte1Status:'',
    Reporte2Status:'',
    Reporte3Status:'',
    Reporte4Status:'',
    Reporte5Status:'',
    Reporte6Status:'',
    ObservacionesReportePreliminar: '',
    ObservacionesSolicitudResidencias: '',
    ObservacionesCartaPresentacion: '',
    ObservacionesCartaAceptacion: '',
    ObservacionesReporte1: '',
    ObservacionesReporte2: '',
    ObservacionesReporte3: '',
    ObservacionesReporte4: '',
    ObservacionesReporte5: '',
    ObservacionesReporte6: '',
  });
  useEffect(() => {
    async function getStatus() {
      const { data } = await axios.get(
        process.env.REACT_APP_API_URL + "residences/" + controlNumber
      );
      setStudentId(data.data.student.id);
      getObservations(data.data.student.id)
    }

    getStatus();
    
  }, []);



    const getObservations = async (student_Id) => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'residences/observations/historic/' + student_Id,
                { headers: { Authorization: `Bearer ${token}` } });
        
        console.log(data);
        const observacionesReportePreliminar = data.data.filter((o) => o.file === 3);
        const observacionesSolicitudResidencias = data.data.filter((o) => o.file === 4);
        const ObservacionesCartaPresentacion = data.data.filter((o) => o.file === 5);
        const ObservacionesCartaAceptacion = data.data.filter((o) => o.file === 6);

        const ObservacionesReporte1 = data.data.filter((o) => o.file === 7);
        const ObservacionesReporte2 = data.data.filter((o) => o.file === 8);
        const ObservacionesReporte3 = data.data.filter((o) => o.file === 9);
        const ObservacionesReporte4 = data.data.filter((o) => o.file === 10);
        const ObservacionesReporte5 = data.data.filter((o) => o.file === 11);
        const ObservacionesReporte6 = data.data.filter((o) => o.file === 12);


       
        // Actualiza el estado con las observaciones de cada documento.
        setDocumentStatus(prevStatus => ({
          ...prevStatus,
          ObservacionesReporte1: ObservacionesReporte1.length > 0 ? ObservacionesReporte1[0].observations : '',
          ObservacionesReporte2: ObservacionesReporte2.length > 0 ? ObservacionesReporte2[0].observations : '',
          ObservacionesReporte3: ObservacionesReporte3.length > 0 ? ObservacionesReporte3[0].observations : '',
          ObservacionesReporte4: ObservacionesReporte4.length > 0 ? ObservacionesReporte4[0].observations : '',
          ObservacionesReporte5: ObservacionesReporte5.length > 0 ? ObservacionesReporte5[0].observations : '',
          ObservacionesReporte6: ObservacionesReporte6.length > 0 ? ObservacionesReporte6[0].observations : '',

          ObservacionesReportePreliminar: observacionesReportePreliminar.length > 0 ? observacionesReportePreliminar[0].observations : '',
          ObservacionesSolicitudResidencias: observacionesSolicitudResidencias.length > 0 ? observacionesSolicitudResidencias[0].observations : '',
          ObservacionesCartaPresentacion: ObservacionesCartaPresentacion.length > 0 ? ObservacionesCartaPresentacion[0].observations : '',
          ObservacionesCartaAceptacion: ObservacionesCartaAceptacion.length > 0 ? ObservacionesCartaAceptacion[0].observations : '',
          
        }));
    
      } catch (e) {
        console.error(e);
      }
    };

  const updateStatus = async (studentId, statusKey, statusValue) => {
    setLoading(true); 
    console.log('actualizando');
  
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}StatusExpediente/${studentId}`, {
        controlNumber: studentId, 
        statusKey: statusKey,
        statusValue: statusValue
      });
  
      
      setDocumentStatus(prevStatus => ({ ...prevStatus, [statusKey]: statusValue }));
  
    } catch (error) {
      console.error("No se pudo actualizar el estado:", error);
      
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    const fetchDocumentStatus = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}StatusExpediente/${controlNumber}/status`);
        if (response.status === 200) {
          setDocumentStatus(response.data);
        }
      } catch (error) {
        console.error("Error al obtener los status de los documentos", error);
      }
    };

    fetchDocumentStatus();
  }, [controlNumber]);

  const getStatusMessage = (status) => {
    switch(status) {
      case '0': return 'No subido';
      case '1': return 'Enviado';
      case '2': return 'Con observaciones';
      case '3': return 'Aprobado';
      default: return ' ';
    }
  }


  const handleReportUploadSuccess = (reportNumber,statusKey, statusValue) => async () => {
    console.log('Success uploading');
    setLastReportUploaded(reportNumber);
    await updateStatus(controlNumber, statusKey, statusValue);
  }

  const handleKardexUploadSuccess = (statusKey, statusValue) => async () => {
    setKardexUploaded(true);
    await updateStatus(controlNumber, statusKey, statusValue);

  };

  useEffect(() => {
    const checkReportAvailability = async (reportNumber) => {
      try {
        const response = await axios.head(`${process.env.REACT_APP_API_URL}getDocuments`, {
          params: {
            student_id: controlNumber,
            desired_name: `Reporte_${reportNumber}_`,
            filetype: "pdf"
          }
        });
        if (response.status === 200) {
          setLastReportUploaded(reportNumber);
        }
      } catch (error) {
        console.error(`Error checking availability for report ${reportNumber}`, error);
        return;
      }
    };

    const verifyReportsSequentially = async () => {
      for (let reportNumber = 1; reportNumber <= 6; reportNumber++) {
        await checkReportAvailability(reportNumber);
        if (lastReportUploaded < reportNumber) {
          break;
        }
      }
    };

    verifyReportsSequentially();
  }, [controlNumber]);

  useEffect(() => {
        const checkFileAvailability = async () => {
            try {
                const response = await axios.head(process.env.REACT_APP_API_URL+'download/aceptacion/' + controlNumber);
                if (response.status === 200) {
                    setIsFileAvailable(true);
                }
            } catch (error) {
                console.error("Error checking file availability", error);
                setIsFileAvailable(false);
            }
        };

        checkFileAvailability();
    }, [controlNumber]);

 

  return (
    <div className="body-expediente">
      <Sidebar />
      <div id="main-expediente">
      <Navbar user_type={"coordinators"} />
        <div className="content">
           <div className="top-content">
            <h2 >Expediente Alumno</h2>
            <StudentRecordInfo alumno = {controlNumber} />
           </div>

           <Row className="filas justify-content-center">
                <Col md="6" sm="6" className="text-center">
                <h2>Documentos del Alumno</h2>
                </Col>
                  
            </Row>

          <Row className="filas">
            <Col lg="4" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Kardex</h5></CardBody>
                <CardFooter  className="footercarddownload">
                  <DownloadStudentKardex id={controlNumber}/>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="4" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Reporte Preliminar</h5></CardBody>
                <CardFooter  className="footercarddownload">
                  <DownloadStudentProyect id={controlNumber}/>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="4" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Credencial</h5></CardBody>
                <CardFooter  className="footercarddownload">
                  <DownloadStudentIdent id={controlNumber}/>
                </CardFooter>
              </Card>
            </Col>
          </Row>
          
          <Row className="filas justify-content-center">
              <Col md="6" sm="6" className="text-center">
              <h2>Apartado para subir documentos</h2>

            </Col>
          </Row>
          

          <Row className="filas justify-content-center upload-row">

          <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Reporte Preliminar Aprobado y Firmado</h5></CardBody>
                <CardFooter className="footercarddownload">
                <FileUploadButton
                onUploadSuccess={handleKardexUploadSuccess('ReportePreliminarStatus', '1')}
                studentId={controlNumber}
                buttonText={"Subir (PDF)"}
                desiredFileName={"Reporte_Preliminar_Aprobado_Firmado_"}
                uniqueIndex={11}
                isDisabled={false}
                buttonStyle={"primary"}
                expectedFileType={"pdf"}
                size={"lg"}

              />
              <div className="status-text">Status: {getStatusMessage(documentStatus.ReportePreliminarStatus)}</div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Solicitud de Residencias Firmada</h5></CardBody>
                <CardFooter className="footercarddownload">
                <FileUploadButton
                onUploadSuccess={handleKardexUploadSuccess('SolicitudResidenciasStatus', '1')}
                studentId={controlNumber}
                buttonText={"Subir (PDF)"}
                desiredFileName={"Formato_Solicitud_Residencias_Firmado_"}
                uniqueIndex={1}
                isDisabled={false}
                buttonStyle={"primary"}
                expectedFileType={"pdf"}
                size={"lg"}

              />
               <div className="status-text">Status: {getStatusMessage(documentStatus.SolicitudResidenciasStatus)}</div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Carta de Presentacion Firmada</h5></CardBody>
                <CardFooter  className="footercarddownload">
                
                <FileUploadButton
                onUploadSuccess={handleKardexUploadSuccess('CartaPresentacionStatus', '1')}
                studentId={controlNumber}
                buttonText={"Subir (PDF)"}
                desiredFileName={"Carta_Presentacion_Aprobada_Firmada_"}
                uniqueIndex={2}
                isDisabled={false}
                buttonStyle={"primary"}
                expectedFileType={"pdf"}
                size={"lg"}

              />
               <div className="status-text">Status: {getStatusMessage(documentStatus.CartaPresentacionStatus)}</div>
                </CardFooter>
              </Card>
            </Col>

            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Carta de Aceptacion</h5></CardBody>
                <CardFooter  className="footercarddownload">
                
                <FileUploadButton
                onUploadSuccess={handleKardexUploadSuccess('CartaAceptacionStatus', '1')}
                studentId={controlNumber}
                buttonText={"Subir (PDF)"}
                desiredFileName={"Carta_Aceptacion_"}
                uniqueIndex={5}
                isDisabled={false}
                buttonStyle={"primary"}
                expectedFileType={"pdf"}
                size={"lg"}

              />
               <div className="status-text">Status: {getStatusMessage(documentStatus.CartaAceptacionStatus)}</div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row className="filas justify-content-center observation-row">
              
                <Col lg="3" md="6" sm="6">
                  {documentStatus.ReportePreliminarStatus === '2' && (
                  <Card className="card-stats">
                    <CardBody>
                      <h4>Observaciones</h4>
                      
                    </CardBody>
                    <CardFooter className="footercarddownload">
                      <p>{documentStatus.ObservacionesReportePreliminar}</p>
                    </CardFooter>
                  </Card>
                  )}
                </Col>
                <Col lg="3" md="6" sm="6">
                  {documentStatus.SolicitudResidenciasStatus === '2' && (
                  <Card className="card-stats">
                    <CardBody>
                      <h4>Observaciones</h4>
                    </CardBody>
                    <CardFooter className="footercarddownload">
                      <p>{documentStatus.ObservacionesSolicitudResidencias}</p>
                    </CardFooter>
                  </Card>
                  )}
                </Col>
                <Col lg="3" md="6" sm="6">
                  {documentStatus.CartaPresentacionStatus === '2' && (
                  <Card className="card-stats">
                    <CardBody>
                      <h4>Observaciones</h4>
                    </CardBody>
                    <CardFooter className="footercarddownload">
                      {documentStatus.ObservacionesCartaPresentacion}
                    </CardFooter>
                  </Card>
                  )}
                </Col>
                <Col lg="3" md="6" sm="6">
                  {documentStatus.CartaAceptacionStatus === '2' && (
                  <Card className="card-stats">
                    <CardBody>
                      <h4>Observaciones</h4>
                      
                    </CardBody>
                    <CardFooter className="footercarddownload">
                      <p>{documentStatus.ObservacionesCartaAceptacion}</p>
                    </CardFooter>
                  </Card>
                  )}
                </Col>
              
              
          </Row>

          <Row className="filas justify-content-center">
          <Col md="6" sm="6" className="text-center">
              <h2>Reportes Mensuales</h2>
               </Col>
          </Row>

          <Row className="filas justify-content-center">
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Reporte 1</h5></CardBody>
                <CardFooter className="footercarddownload">
                <FileUploadButton
                onUploadSuccess={handleReportUploadSuccess('1','Reporte1Status', '1')}
                studentId={controlNumber}
                buttonText={"Subir (PDF)"}
                desiredFileName={"Reporte_1_"}
                uniqueIndex={6}
                isDisabled={false}
                buttonStyle={"primary"}
                expectedFileType={"pdf"}
                size={"lg"}

              />
              <div className="status-text">Status: {getStatusMessage(documentStatus.Reporte1Status)}</div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Reporte 2</h5></CardBody>
                <CardFooter  className="footercarddownload">
                
                <FileUploadButton
                onUploadSuccess={handleReportUploadSuccess(2,'Reporte2Status', '1')}
                studentId={controlNumber}
                buttonText={"Subir (PDF)"}
                desiredFileName={"Reporte_2_"}
                uniqueIndex={7}
                isDisabled={documentStatus.Reporte1Status  === '0'}
                buttonStyle={documentStatus.Reporte1Status  === '0' ? "secondary" : "primary"}
                expectedFileType={"pdf"}
                size={"lg"}

              />
              <div className="status-text">Status: {getStatusMessage(documentStatus.Reporte2Status)}</div>
                </CardFooter>
              </Card>
            </Col>

            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Reporte 3</h5></CardBody>
                <CardFooter  className="footercarddownload">
                
                <FileUploadButton
                onUploadSuccess={handleReportUploadSuccess(3,'Reporte3Status', '1')}
                studentId={controlNumber}
                buttonText={"Subir (PDF)"}
                desiredFileName={"Reporte_3_"}
                uniqueIndex={8}
                isDisabled={documentStatus.Reporte2Status  === '0'}
                buttonStyle={documentStatus.Reporte2Status  === '0' ? "secondary" : "primary"}
                expectedFileType={"pdf"}
                size={"lg"}

              />
              <div className="status-text">Status: {getStatusMessage(documentStatus.Reporte3Status)}</div>
                </CardFooter>
              </Card>
            </Col>

            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Reporte 4</h5></CardBody>
                <CardFooter  className="footercarddownload">
                
                <FileUploadButton
                onUploadSuccess={handleReportUploadSuccess(4,'Reporte4Status', '1')}
                studentId={controlNumber}
                buttonText={"Subir (PDF)"}
                desiredFileName={"Reporte_4_"}
                uniqueIndex={9}
                isDisabled={documentStatus.Reporte3Status === '0'}
                buttonStyle={documentStatus.Reporte3Status  === '0' ? "secondary" : "primary"}
                expectedFileType={"pdf"}
                size={"lg"}

              />
              <div className="status-text">Status: {getStatusMessage(documentStatus.Reporte4Status)}</div>
                </CardFooter>
              </Card>
            </Col>
          </Row>

          <Row className="filas justify-content-center observation-row">
              
                <Col lg="3" md="6" sm="6">
                  {documentStatus.Reporte1Status === '2' && (
                  <Card className="card-stats">
                    <CardBody>
                      <h4>Observaciones</h4>
                      
                    </CardBody>
                    <CardFooter className="footercarddownload">
                      <p>{documentStatus.ObservacionesReporte1}</p>
                    </CardFooter>
                  </Card>
                  )}
                </Col>
                <Col lg="3" md="6" sm="6">
                  {documentStatus.Reporte2Status === '2' && (
                  <Card className="card-stats">
                    <CardBody>
                      <h4>Observaciones</h4>
                    </CardBody>
                    <CardFooter className="footercarddownload">
                      <p>{documentStatus.ObservacionesReporte2}</p>
                    </CardFooter>
                  </Card>
                  )}
                </Col>
                <Col lg="3" md="6" sm="6">
                  {documentStatus.Reporte3Status === '2' && (
                  <Card className="card-stats">
                    <CardBody>
                      <h4>Observaciones</h4>
                    </CardBody>
                    <CardFooter className="footercarddownload">
                      {documentStatus.ObservacionesReporte3}
                    </CardFooter>
                  </Card>
                  )}
                </Col>
                <Col lg="3" md="6" sm="6">
                  {documentStatus.Reporte4Status === '2' && (
                  <Card className="card-stats">
                    <CardBody>
                      <h4>Observaciones</h4>
                      
                    </CardBody>
                    <CardFooter className="footercarddownload">
                      <p>{documentStatus.ObservacionesReporte4}</p>
                    </CardFooter>
                  </Card>
                  )}
                </Col>
              
              
          </Row>

          <Row className="filas justify-content-center observation-row">
          <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Reporte 5</h5></CardBody>
                <CardFooter  className="footercarddownload">
                
                <FileUploadButton
                onUploadSuccess={handleReportUploadSuccess(5,'Reporte5Status', '1')}
                studentId={controlNumber}
                buttonText={"Subir (PDF)"}
                desiredFileName={"Reporte_5_"}
                uniqueIndex={10}
                isDisabled={documentStatus.Reporte4Status === '0'}
                buttonStyle={documentStatus.Reporte4Status  === '0' ? "secondary" : "primary"}
                expectedFileType={"pdf"}
                size={"lg"}

              />
              <div className="status-text">Status: {getStatusMessage(documentStatus.Reporte5Status)}</div>
                </CardFooter>
              </Card>
            </Col>

            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody><h5>Reporte 6</h5></CardBody>
                <CardFooter  className="footercarddownload">
                
                <FileUploadButton
                onUploadSuccess={handleReportUploadSuccess(6,'Reporte6Status', '1')}
                studentId={controlNumber}
                buttonText={"Subir (PDF)"}
                desiredFileName={"Reporte_6_"}
                uniqueIndex={12}
                isDisabled={documentStatus.Reporte5Status === '0'}
                buttonStyle={documentStatus.Reporte5Status  === '0' ? "secondary" : "primary"}
                expectedFileType={"pdf"}
                size={"lg"}

              />
              <div className="status-text">Status: {getStatusMessage(documentStatus.Reporte6Status)}</div>
                </CardFooter>
              </Card>
            </Col>

          </Row>

          <Row className="filas justify-content-center observation-row">
              
              <Col lg="3" md="6" sm="6">
                {documentStatus.Reporte5Status === '2' && (
                <Card className="card-stats">
                  <CardBody>
                    <h4>Observaciones</h4>
                    
                  </CardBody>
                  <CardFooter className="footercarddownload">
                    <p>{documentStatus.ObservacionesReporte5}</p>
                  </CardFooter>
                </Card>
                )}
              </Col>
              <Col lg="3" md="6" sm="6">
                {documentStatus.Reporte6Status === '2' && (
                <Card className="card-stats">
                  <CardBody>
                    <h4>Observaciones</h4>
                  </CardBody>
                  <CardFooter className="footercarddownload">
                    <p>{documentStatus.ObservacionesReporte6}</p>
                  </CardFooter>
                </Card>
                )}
              </Col>
            
            
        </Row>


        </div>
      </div>
    </div>
  );
}

export default ExpedienteAlumnos;
