import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import Navbar from '../../components/Navbar/navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Styles.css';
import Swal from 'sweetalert2'
import IndexStudents from '../../components/showStudents/showStudents';
import IndexAdviser from '../../components/ShowAdviser/ShowAdviser';


function AgregarEstudiante() {

  const [displayStudents, setDisplayStudents] = useState([]);
  const [displayAdvisers, setDisplayAdvisers] = useState([]);


  const getStudents = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_URL+'/student/'
      );
      setDisplayStudents(data.data);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener los Estudiantes:", error);
    }
  };

  const getAdviser = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_URL+'/advisers/'
      );
      setDisplayAdvisers(data.data);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener a los asesores:", error);
    }
  };


  useEffect(() => {
    getStudents();
    getAdviser();
  }, []);

  const [studentData, setStudentData] = useState({
    name: '',
    last_name: '',
    second_last_name: '',
    control_number: '',
    phone_number: '',
    career_id: '', 
    semester: '',
    email: '',
    nip: '',
    nip_confirmation: '',
    status:1,
    contents:1, 
    // Añade aquí otros campos según sea necesario
  });

  const [adviserData, setAdviserData] = useState({
    name: '',
    last_name: '',
    second_last_name: '',
    employee_number: '',
    password: '',
    password_confirmation: '', 
    email: '',
    phone_number: '',
    status: 1,
    department_id: '',
   
  });

  const [formKey, setFormKey] = useState(Date.now());


  const resetForm = () => {
    setStudentData({
      name: '',
      last_name: '',
      second_last_name: '',
      control_number: '',
      phone_number: '',
      career_id: '', 
      semester: '',
      email: '',
      nip: '',
      nip_confirmation: '',
      status: 1,
      contents: 1,
      // Restablece aquí otros campos si es necesario
    });
    setFormKey(Date.now());
  };
  const resetAdviserForm = () => {
    setAdviserData({
      name: '',
      last_name: '',
      second_last_name: '',
      employee_number: '',
      password: '',
      password_confirmation: '',
      email: '',
      phone_number: '',
      status: 1,
      department_id: '',
      // Restablece aquí otros campos si es necesario
    });
  };

  const [activeTab, setActiveTab] = useState('estudiante');

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };
  const handleAdviserChange = (e) => {
    setAdviserData({ ...adviserData, [e.target.name]: e.target.value });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = activeTab === 'estudiante' ? studentData : adviserData;
    const apiUrl = process.env.REACT_APP_API_URL + (activeTab === 'estudiante' ? 'students/add' : 'advisers/add'); 

    try {
      const token = localStorage.getItem('token');
      await axios.post(apiUrl, dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Mostrar mensaje de éxito y reiniciar formulario
    Swal.fire({
      title: '¡Éxito!',
      text: activeTab === 'estudiante' ? 'Estudiante creado con éxito' : 'Asesor creado con éxito',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        if (activeTab === 'estudiante') {
          resetForm();
        } else {
          resetAdviserForm();
        }
      }
    });

  } catch (error) {
    console.error('Hubo un error al enviar los datos', error);
    // Mostrar mensaje de error
    Swal.fire({
      title: 'Error',
      text: 'Hubo un problema al crear el ' + (activeTab === 'estudiante' ? 'estudiante' : 'asesor'),
      icon: 'error',
      confirmButtonText: 'Cerrar'
    });
  }
};

  return (
    <div>
      <Sidebar id='sidebar'/>
      <div id='main-student'>
      <Navbar className='navbar' user_type={'coordinators'} />
        <div className="form-container">
          <div className='btn-group'>
            <Button variant='none' size="lg" onClick={() => handleTabClick('estudiante')} active={activeTab === 'estudiante'}>Añadir Alumno</Button>
            <Button variant='none' size="lg" onClick={() => handleTabClick('asesor')} active={activeTab === 'asesor'}>Añadir Asesor</Button>
          </div>

          <Form key={formKey} onSubmit={handleSubmit}>
            {activeTab === 'estudiante' && (
              <>
                {/* Campos para agregar estudiante */}
                <Form.Group controlId="formEstudianteNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="name" placeholder="" onChange={handleChange} />
                <Form.Label>Primer Apellido</Form.Label>
                <Form.Control type="text" name="last_name" placeholder="" onChange={handleChange} />
                <Form.Label>Segundo Apellido</Form.Label>
                <Form.Control type="text" name="second_last_name" placeholder="" onChange={handleChange} />
                <Form.Label>Número de Control</Form.Label>
                <Form.Control type="text" name="control_number" placeholder="" onChange={handleChange} />
                <Form.Label>Número de Telefono</Form.Label>
                <Form.Control type="text" name="phone_number" placeholder="" onChange={handleChange} />
                <Form.Group controlId="formEstudianteCarrera">
                <Form.Label>Carrera</Form.Label>
                <Form.Control as="select" name="career_id" value={studentData.career_id} onChange={handleChange}>
                  <option value="">Selecciona una carrera</option>
                  <option value="1">INGENIERÍA AERONÁUTICA</option>
                  <option value="2">INGENIERÍA BIOMÉDICA</option>
                  <option value="3">INGENIERÍA ELÉCTRICA</option>
                  <option value="4">INGENIERÍA ELECTRÓNICA</option>
                  <option value="5">INGENIERÍA EN GESTIÓN EMPRESARIAL</option>
                  <option value="6">INGENIERÍA EN SISTEMAS COMPUTACIONALES</option>
                  <option value="7">INGENIERÍA INDUSTRIAL</option>
                  <option value="8">INGENIERÍA INFORMÁTICA</option>
                  <option value="9">INGENIERÍA MECÁNICA</option>
                  <option value="10">INGENIERÍA MECATRÓNICA</option>
                  <option value="11">LICENCIATURA EN ADMINISTRACIÓN</option>
                  <option value="12">INGENIERÍA INDUSTRIAL 100% INGLÉS</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formEstudianteSemestre">
              <Form.Label>Semestre</Form.Label>
              <Form.Control as="select" name="semester" value={studentData.semester} onChange={handleChange}>
                <option value="">Selecciona un semestre</option>
                {[...Array(14)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
              </Form.Control>
            </Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" name="email" placeholder="" onChange={handleChange} />
                <Form.Label>Nip</Form.Label>
                <Form.Control type="text" name="nip" placeholder="" onChange={handleChange} />
                <Form.Label>Confirmación de Nip</Form.Label>
                <Form.Control type="text" name="nip_confirmation" placeholder="" onChange={handleChange} />
                <br></br>

                <Button variant="primary" type="submit">
              Guardar
            </Button>
                <IndexStudents students={displayStudents} updateStudent={getStudents}/>
                </Form.Group>
              </>
            )}



            {activeTab === 'asesor' && (
                <>
                  
                  <Form.Group controlId="formAsesorNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" name="name" placeholder="" onChange={handleAdviserChange} />
                    <Form.Label>Primer Apellido</Form.Label>
                    <Form.Control type="text" name="last_name" placeholder="" onChange={handleAdviserChange} />
                    <Form.Label>Segundo Apellido</Form.Label>
                    <Form.Control type="text" name="second_last_name" placeholder="" onChange={handleAdviserChange} />
                    <Form.Label>Numero de Empleado</Form.Label>
                    <Form.Control type="text" name="employee_number" placeholder="" onChange={handleAdviserChange} />
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="text" name="password" placeholder="" onChange={handleAdviserChange} />
                    <Form.Label>Confirmacion de Contraseña</Form.Label>
                    <Form.Control type="text" name="password_confirmation" placeholder="" onChange={handleAdviserChange} />
                    <Form.Label>Correo</Form.Label>
                    <Form.Control type="text" name="email" placeholder="" onChange={handleAdviserChange} />
                    <Form.Label>Numero de Teléfono</Form.Label>
                    <Form.Control type="text" name="phone_number" placeholder="" onChange={handleAdviserChange} />
                    <Form.Group controlId="formAsesorDepartamento">
                    <Form.Label>Departamento</Form.Label>
                    <Form.Control as="select" name="department_id" value={adviserData.department_id} onChange={handleAdviserChange}>
                      <option value="">Selecciona un departamento</option>
                      <option value="1">DEPARTAMENTO DE ACTIVIDADES EXTRAESCOLARES</option>
                      <option value="2">DEPARTAMENTO DE CIENCIAS BÁSICAS</option>
                      <option value="3">DEPARTAMENTO DE CIENCIAS ECONÓMICO ADMINISTRATIVAS</option>
                      <option value="4">DEPARTAMENTO DE INGENIERÍA MECATRÓNICA</option>
                      <option value="5">DEPARTAMENTO DE INGENIERÍA ELÉCTRICA Y ELECTRÓNICA</option>
                      <option value="6">DEPARTAMENTO DE MANTENIMIENTO</option>
                      <option value="7">DEPARTAMENTO DE METAL MECÁNICA</option>
                      <option value="8">DEPARTAMENTO DE SISTEMAS Y COMPUTACIÓN</option>
                      <option value="9">DEPARTAMENTO DE INGENIERÍA INDUSTRIAL</option>
                      <option value="10">DIVISIÓN DE POSTGRADO E INVESTIGACIÓN</option>
                      <option value="11">SUBDIRECCIÓN ACADÉMICA</option>
                      <option value="12">SUBDIRECCIÓN ADMINISTRATIVA</option>
                      <option value="13">SUBDIRECCIÓN DE PLANEACION</option>



                    </Form.Control>

                    <br></br> <br></br>
                    <Button variant="primary" type="submit">
                        Guardar
                    </Button>

                    <IndexAdviser Advisers={displayAdvisers} updateAdviser={getAdviser}/>

                  </Form.Group>
                    
                  </Form.Group>
                  <br></br>
                </>
              )}

          </Form>
        </div>
      </div>
    </div>
  );
}

export default AgregarEstudiante;