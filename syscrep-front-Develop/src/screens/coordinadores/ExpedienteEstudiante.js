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
import './Styles.css'
import DownloadStudentAceptCard from "../../components/DownloadStudentProyect/DownloadStudentAcepCard";
import DownloadStudentPresetCard from "../../components/DownloadStudentProyect/DownloadStudentPresetCard";
import DowloadCartaAceptacion from "../../components/DownloadStudentProyect/DowloadCartaAceptacion";
import DowloadMonthlyReport from "../../components/DownloadStudentProyect/DownloadMonthlyReport";
import DowloadPreliminarF from "../../components/DownloadStudentProyect/DownloadPreliminarF";
import FileObservationButton from "../../components/FileObservationButton/FileObservationButton";
import Updatestatusfle from "../../components/buttons/UpdateStatusFiles";



function ExpedienteEstudiante() {
  let { controlNumber } = useParams();
  const [isFileAvailable, setIsFileAvailable] = useState(false);
  
  // Estado para almacenar los status
  const [documentStatus, setDocumentStatus] = useState({
    ReportePreliminarStatus: '0',
    SolicitudResidenciasStatus: '0',
    CartaPresentacionStatus: '0',
    CartaAceptacionStatus: '0',
    Reporte1Status:'0',
    Reporte2Status:'0',
    Reporte3Status:'0',
    Reporte4Status:'0',
    Reporte5Status:'0',
    Reporte6Status:'0',
  });

   

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
		  case '1': return 'El Alumno subió el documento';
		  case '2': return 'El documento se regresó con observaciones';
		  case '3': return 'EL documento fue aprobado';
		  default: return ' ';
		}
	  }


	useEffect(() => {
		const checkFileAvailability = async () => {
			try {
				const response = await axios.head(process.env.REACT_APP_API_URL + 'download/aceptacion/' + controlNumber);
				if (response.status === 200) {
					setIsFileAvailable(true);
				}
			} catch (error) {
				console.error("Error checking file availability", error);
				setIsFileAvailable(false);
			}
		};

		checkFileAvailability();
		actualizarUltimaVista();
	}, [controlNumber]);

	const handleDownload = async (apiUrl, fileName) => {
		try {
			console.log('Descargando...');
			const response = await axios.get(apiUrl + controlNumber, { 'responseType': 'blob' });
			const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

			// Crear una URL para los datos del Blob
			const url = window.URL.createObjectURL(blob);

			// Crear un enlace y disparar un clic para iniciar la descarga
			const a = document.createElement('a');
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		} catch (e) {
			console.log(e);
		}
	};


	const actualizarUltimaVista = async () => {
		try {
			const token = localStorage.getItem('token');

			const {data} = await axios.post(process.env.REACT_APP_API_URL + 'residences/seen/'+controlNumber,{},{
				headers:{
					Authorization: `Bearer ${token}`
				}
			});

			console.log(data);
		} catch (e) {
			console.error(e);
		}
	}


	return (
		<div className="body-expediente">
			<Sidebar />
			<div id="main-expediente">
				<Navbar user_type={"coordinators"} />

				<div className="content">
					<div className="top-content">
						<h2 >Expediente Alumno</h2>
						<StudentRecordInfo alumno={controlNumber} />
					</div>
					<Row className="filas">
						<Col lg="4" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Kardex</h5></CardBody>
								<CardFooter className="footercarddownload">
									<DownloadStudentKardex id={controlNumber} />
								</CardFooter>
							</Card>
						</Col>
						<Col lg="4" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Reporte Preliminar</h5></CardBody>
								<CardFooter className="footercarddownload">
									<DownloadStudentProyect id={controlNumber} />
								</CardFooter>
							</Card>
						</Col>
						<Col lg="4" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Credencial</h5></CardBody>
								<CardFooter className="footercarddownload">
									<DownloadStudentIdent id={controlNumber} />
								</CardFooter>
							</Card>
						</Col>
					</Row>

					<Row className="filas justify-content-center">

						<Col lg="3" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Reporte Preliminar Aprobado y Firmado</h5></CardBody>
								<div className="status-text">Status: {getStatusMessage(documentStatus.ReportePreliminarStatus)}</div>
								<CardFooter className="footercarddownload">
									<DowloadPreliminarF id={controlNumber} />
									{documentStatus.ReportePreliminarStatus !== '0' && (
										<>
											<Updatestatusfle studentId={controlNumber} buttonText="Aprobar" statusKey="ReportePreliminarStatus" statusValue="3" size="md" uniqueIndex="1" />
											<FileObservationButton studentID={controlNumber} fileID={3} statusKey='ReportePreliminarStatus' fileName='Reporte Preliminar Firmado' />
										</>
									)}
								</CardFooter>
							</Card>
						</Col>
						<Col lg="3" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Formato Solicitud de Residencias Firmado</h5></CardBody>
								<div className="status-text">Status: {getStatusMessage(documentStatus.SolicitudResidenciasStatus)}</div>
								<CardFooter className="footercarddownload">
									<DownloadStudentAceptCard id={controlNumber} />
									{documentStatus.SolicitudResidenciasStatus !== '0' && (
										<>
											<Updatestatusfle studentId={controlNumber} buttonText="Aprobar" statusKey="SolicitudResidenciasStatus" statusValue="3" size="md" uniqueIndex="2" />
											<FileObservationButton studentID={controlNumber} fileID={4} statusKey='SolicitudResidenciasStatus' fileName='Solicitud de Residencias Firmada' />
										</>
									)}
								</CardFooter>
							</Card>
						</Col>
						<Col lg="3" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Carta de Presentación Firmada</h5></CardBody>
								<div className="status-text">Status: {getStatusMessage(documentStatus.CartaAceptacionStatus)}</div>
								<CardFooter className="footercarddownload">
									<DownloadStudentPresetCard id={controlNumber} />
									{documentStatus.CartaPresentacionStatus !== '0' && (
										<>
											<Updatestatusfle studentId={controlNumber} buttonText="Aprobar" statusKey="CartaPresentacionStatus" statusValue="3" size="md" uniqueIndex="3" />
											<FileObservationButton studentID={controlNumber} fileID={5} statusKey='CartaPresentacionStatus' fileName='Carta de presentación Firmada' />
										</>
									)}
								</CardFooter>
							</Card>
						</Col>
						<Col lg="3" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Carta de Aceptación</h5></CardBody>
								<div className="status-text">Status: {getStatusMessage(documentStatus.CartaAceptacionStatus)}</div>
								<CardFooter className="footercarddownload">
									<DowloadCartaAceptacion id={controlNumber} />
									{documentStatus.CartaAceptacionStatus !== '0' && (
										<>
											<Updatestatusfle studentId={controlNumber} buttonText="Aprobar" statusKey="CartaAceptacionStatus" statusValue="3" size="md" uniqueIndex="4" />
											<FileObservationButton studentID={controlNumber} fileID={6} statusKey='CartaAceptacionStatus' fileName='Carta de Aceptación' />
										</>
									)}
								</CardFooter>
							</Card>
						</Col>
					</Row>

					<Row className="filas justify-content-center">
						<Col lg="3" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Reporte 1</h5></CardBody>
								<div className="status-text">Status: {getStatusMessage(documentStatus.Reporte1Status)}</div>
								<CardFooter className="footercarddownload">
									<DowloadMonthlyReport id={controlNumber} num={1} />
									{documentStatus.Reporte1Status !== '0' && (
										<>
											<Updatestatusfle studentId={controlNumber} buttonText="Aprobar" statusKey="Reporte1Status" statusValue="3" size="md" uniqueIndex="5" />
											<FileObservationButton studentID={controlNumber} fileID={7} statusKey='Reporte1Status' fileName='Reporte 1' />
										</>
									)}
								</CardFooter>
							</Card>
						</Col>
						<Col lg="3" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Reporte 2</h5></CardBody>
								<div className="status-text">Status: {getStatusMessage(documentStatus.Reporte2Status)}</div>
								<CardFooter className="footercarddownload">
									<DowloadMonthlyReport id={controlNumber} num={2} />
									{documentStatus.Reporte2Status !== '0' && (
										<>
											<Updatestatusfle studentId={controlNumber} buttonText="Aprobar" statusKey="Reporte2Status" statusValue="3" size="md" uniqueIndex="6" />
											<FileObservationButton studentID={controlNumber} fileID={8} statusKey='Reporte2Status' fileName='Reporte 2' />
										</>
									)}
								</CardFooter>
							</Card>
						</Col>
						<Col lg="3" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Reporte 3</h5></CardBody>
								<div className="status-text">Status: {getStatusMessage(documentStatus.Reporte3Status)}</div>
								<CardFooter className="footercarddownload">
									<DowloadMonthlyReport id={controlNumber} num={3} />
									{documentStatus.Reporte3Status !== '0' && (
										<>
											<Updatestatusfle studentId={controlNumber} buttonText="Aprobar" statusKey="Reporte3Status" statusValue="3" size="md" uniqueIndex="7" />
											<FileObservationButton studentID={controlNumber} fileID={9} statusKey='Reporte3Status' fileName='Reporte 3' />
										</>
									)}
								</CardFooter>
							</Card>
						</Col>
						<Col lg="3" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Reporte 4</h5></CardBody>
								<div className="status-text">Status: {getStatusMessage(documentStatus.Reporte4Status)}</div>
								<CardFooter className="footercarddownload">
									<DowloadMonthlyReport id={controlNumber} num={4} />
									{documentStatus.Reporte4Status !== '0' && (
										<>
											<Updatestatusfle studentId={controlNumber} buttonText="Aprobar" statusKey="Reporte4Status" statusValue="3" size="md" uniqueIndex="8" />
											<FileObservationButton studentID={controlNumber} fileID={10} statusKey='Reporte4Status' fileName='Reporte 4' />
										</>
									)}
								</CardFooter>
							</Card>
						</Col>
						<Col lg="3" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Reporte 5</h5></CardBody>
								<div className="status-text">Status: {getStatusMessage(documentStatus.Reporte5Status)}</div>
								<CardFooter className="footercarddownload">
									<DowloadMonthlyReport id={controlNumber} num={5} />
									{documentStatus.Reporte5Status !== '0' && (
										<>
											<Updatestatusfle studentId={controlNumber} buttonText="Aprobar" statusKey="Reporte5Status" statusValue="3" size="md" uniqueIndex="9" />
											<FileObservationButton studentID={controlNumber} fileID={11} statusKey='Reporte5Status' fileName='Reporte 5' />
										</>
									)}
								</CardFooter>
							</Card>
						</Col>
						<Col lg="3" md="6" sm="6">
							<Card className="card-stats">
								<CardBody><h5>Reporte 6</h5></CardBody>
								<div className="status-text">Status: {getStatusMessage(documentStatus.Reporte6Status)}</div>
								<CardFooter className="footercarddownload">
									<DowloadMonthlyReport id={controlNumber} num={6} />
									{documentStatus.Reporte6Status !== '0' && (
										<>
											<Updatestatusfle studentId={controlNumber} buttonText="Aprobar" statusKey="Reporte6Status" statusValue="3" size="md" uniqueIndex="10" />
											<FileObservationButton studentID={controlNumber} fileID={12} statusKey='Reporte6Status' fileName='Reporte 6' />
										</>
									)}
								</CardFooter>
							</Card>
						</Col>
					</Row>

				</div>
			</div>
		</div>
	);
}

export default ExpedienteEstudiante;
