import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/navbar'
import { GlobalContext } from '../../context/GlobalContext';
import axios from 'axios';
import Select from 'react-select';
import { Button } from 'react-bootstrap';

//Librerias para generar el archivo excel
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function ExportarDatos() {
	const { emailCoordinador } = useContext(GlobalContext);

	const [carrerasSeleccionables, setCarrerasSeleccionables] = useState([{ value: 0, label: 'TODAS LAS CARRERAS DISPONIBLES' }]); //Las carreras que apareceran dentro del select

	const [filtroCarreras, setFiltroCarreras] = useState([0]); //filtro con las carreras que iran en el excel generado.

	const [downloading, setDownloading] = useState(false);

	useEffect(() => {
		const obtenerCarreras = async () => {
			const token = localStorage.getItem('token');

			const response = await axios.get(process.env.REACT_APP_API_URL + 'coordinators/careers/' + emailCoordinador, {
				headers: {
					Authorization: 'Bearer ' + token
				}
			});

			const careers = response.data.coordinator_relations;

			const career_options = careers.map((c) => {
				return {
					value: c.id,
					label: c.name
				}
			});

			console.log(career_options);
			setCarrerasSeleccionables([{ value: 0, label: 'TODAS LAS CARRERAS DISPONIBLES' }, ...career_options]);
		}

		obtenerCarreras();

	}, []);

	const CambiarCarrera = (value, action) => {
		if (action.action !== "select-option") return;

		setFiltroCarreras([value.value]);
	}

	const generarExcel = async (filename) => {
		const token = localStorage.getItem('token');
		setDownloading(true);

		const { data } = await axios.get(process.env.REACT_APP_API_URL + 'student/information/', {
			headers: {
				Authorization: 'Bearer ' + token
			},
			params: {
				carreras: [filtroCarreras]
			}
		});

		//Utilizado si el estudiante no ha rellenado el formulario.
		const defaultData = {
			sexo: "-",
			proyecto_preliminar: "-",
			empresa: "-",
			sector: "-",
			asesor_interno: "-",
			asesor_externo: "-"
		};

		const formated_data = data.data.map((form) => {

			let form_data = form.form_data;

			if(form_data == null){
				//Si el estudiante no ha llenado el formulario utilizar datos de relleno
				form_data = defaultData;
			}

			const studentInfo = {
				Num_control: form.control_number,
				Nombre: form.name,
				// Carrera: residence.student.career.name,
				// Semestre: residence.student.semester,
				// Estatus: residence.status
				Sexo: form_data.sexo,
				Proyecto_Preliminar: form_data.proyecto_preliminar,
				Empresa: form_data.empresa,
				Sector: form_data.sector,
				Asesor_interno: form_data.asesor_interno,
				Asesor_externo: form_data.asesor_externo
			}

			return studentInfo;
		});

		// Crear una nueva hoja de trabajo
		const worksheet = XLSX.utils.json_to_sheet(formated_data);
		// Crear un nuevo libro de trabajo
		const workbook = XLSX.utils.book_new();
		// Añadir la hoja de trabajo al libro
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		// Generar un archivo Excel
		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		// Crear un Blob con el contenido del archivo Excel
		const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
		// Usar file-saver para descargar el archivo
		saveAs(blob, filename + '.xlsx');
		setDownloading(false);
	}


	return (
		<div id='body-content'>
			<Sidebar />
			<div id='main-content'>
				<Navbar user_type={'coordinators'} />

				<div id='row' style={{ paddingLeft: 50, paddingRight: 50 }}>
					<h2 style={{ paddingTop: 20 }}>Generar Archivo</h2>
					<div className='col-xs-12'>
						<Select
							style={{ flex: 1 }}
							options={carrerasSeleccionables}
							isClearable={false}
							onChange={CambiarCarrera}
							placeholder="Filtrar por carrera"
						/>

						<Button 
						disabled={downloading}
						onClick={() => generarExcel('archivo')}>
							{!downloading ? 'Generar Excel' : 'Generando...'}
						</Button>
					</div>
				</div>

			</div>
		</div>
	)
}

export default ExportarDatos