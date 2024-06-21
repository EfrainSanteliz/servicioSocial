import React, { useState, useContext, useEffect } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/navbar'
import { Form, Card, Button } from 'react-bootstrap'
import Select from 'react-select'
import { GlobalContext } from '../../context/GlobalContext'
import axios from 'axios'
import Swal from 'sweetalert2'
import ComunicadosCard from '../../components/ComunicadosCard/ComunicadosCard'
import PcomunicadosCard from '../../components/ComunicadosCard/PcomunicadosCard'


function AgregarComunicados() 
{
    const { emailCoordinador } = useContext(GlobalContext);

    const [careers, setCareers] = useState([]);
    const [text, setText] = useState("");
    const [ptext, setPtext] = useState("");
    const [file, setFile] = useState(null);
    const [selectedCareers, setSelectedCareers] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [carreras_id, setCarreras_id] = useState([]);

    useEffect(() => {
        getCarreras();
    }, []);

    useEffect(() =>{
        getStudents();

    },
    [carreras_id]);

  

    async function getCarreras() 
    {
        const token = localStorage.getItem('token');

        //Obtener carreras del coordinador
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'coordinators/careers/' + emailCoordinador, {
            headers: {
                Authorization: 'Bearer ' + token
            }
           
        });

        

        const options = data.coordinator_relations.map((career) => {
            let option = { value: career.id, label: career.name };
            return option;
        });

       setCarreras_id(data.coordinator_relations.map((career) => career.id));
       
        
    
        setCareers(options);
    }


    
    

  
    async function getStudents()
    {
        if(carreras_id.length == 0){
            return;
        }
        const token = localStorage.getItem('token');

        //Obtener alumnos
         const { data } = await axios.get( process.env.REACT_APP_API_URL+'students/' , {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
        console.log(data.data);
      const disponibles = data.data.filter((residence) => carreras_id.includes(residence.career.id));
                            
        

       const options = disponibles.map((student) => {
            let option = { value: student.id, label: student.name +' '+ student.last_name + ' '+ student.second_last_name };
            return option;
        });

      

        setStudents(options);
    }

    function selectCareers(value) {
        setSelectedCareers(value);
    }

    function selectStudents(value) {
        setSelectedStudents(value);
    }
    

  async function createNotice()
   {

        const formData = new FormData();

        // texto del comunicado
        if (text == "") {
            Swal.fire('Error', 'El campo de texto del comunicado no puede estar vacío', 'error');
            return;
        }

        formData.append('text', text);
        //archivo(opcional), si no hay archivo saltarse este paso
        if (file != null) {
            formData.append('file', file);
        }


           //ID de carrera(s), obtener arreglo e iterar cada carrera para la ruta del request
           if (selectedCareers.length == 0) {
            Swal.fire('Error', 'Seleccione al menos una carrera a la que mandar el comunicado', 'error');
            return;
           }
           
      
            var success = true;
             const career_ids = selectedCareers.map(option => option.value);
                for (const career_id of career_ids) {
                    try {
                        console.log(formData);
                        await axios.post(process.env.REACT_APP_API_URL + 'notices/' + career_id, formData);
                    } catch (e) {
                        success = false;
                    }
            
    
        }

        if (success) {
            Swal.fire('Comunicado creado', 'El comunicado ha sido enviado a los alumnos de las carreras correspondientes', 'success');
            setRefresh(!refresh);
            } else {
            Swal.fire('Error al enviar comunicado', 'Ocurrió un error al tratar de enviar el comunicado', 'error');
            }
   }

   
  async function createPnotice()
  {
    const formPData = new FormData();

    // Texto del comunicado personal
    if (ptext == "") {
        Swal.fire('Error', 'El campo de texto del comunicado no puede estar vacío', 'error');
        return;
    }

        formPData.append('ptext', ptext);
    // Archivo (opcional), si no hay archivo saltarse este paso
    if (file != null) {
        formPData.append('file', file);
    }

    if (selectedStudents.length == 0) {
        Swal.fire('Error', 'Seleccione al menos un estudiante al que mandar el comunicado', 'error');
        return;
    }


    var success = true;

    const student_ids = selectedStudents.map(option => option.value);
    for (const student_id of student_ids) {
        try {
            console.log(formPData);
            await axios.post(process.env.REACT_APP_API_URL + 'pnotices/' + student_id, formPData);
        } catch (e) {
            success = false;
        }
    }

    if (success) {
        Swal.fire('Comunicado personal creado', 'El comunicado ha sido enviado a los estudiantes seleccionados', 'success');
        setRefresh(!refresh);
    } else {
        Swal.fire('Error al enviar comunicado personal', 'Ocurrió un error al tratar de enviar el comunicado personal', 'error');
    }

  }



    return (
        <div className='body-content'>
            <Sidebar />
            <div id='main-content' style={{ display: 'flex', flexDirection: 'column' }}>
                <Navbar user_type={'coordinators'} />
                <div id='row' style={{ width: '80%', alignSelf: 'center' }}>

                    <h2 style={{ paddingLeft: 50, paddingTop: 20 }}>Agregar Comunicado</h2>
                    <Card style={customStyle}>
                        <Card.Body>
                            <Form.Label>Enviar comunicado a estudiantes de la(s) carrera(s) de:
                                <Select
                                    isMulti
                                    isClearable={false}
                                    options={careers}
                                    onChange={selectCareers}
                                />
                            </Form.Label>

                            <Form.Label>
                                Texto del comunicado:
                                <Form.Control type='text' as='textarea' rows='3'
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Introduzca el texto del comunicado."
                                    value={text}>

                                </Form.Control>
                            </Form.Label>
                            <Form.Label>Adjuntar archivo(opcional):
                                <Form.Control type='file'
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </Form.Label>
                            <Button size='lg' onClick={createNotice}>Enviar comunicado</Button>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Card.Title>Vista previa</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {
                                selectedCareers.length > 0 ? selectedCareers.map(option => (
                                    <>
                                        <h5>{option.label}</h5>
                                        <ComunicadosCard career_id={option.value} refresh={refresh}/>
                                    </>
                                )) :
                                (<p style={{color:'gray'}}>Seleccione una o varias carreras para visualizar los comunicados actuales.</p>)
                            }
                        </Card.Body>
                    </Card>
                </div>

                             
                <div id='row' style={{ width: '80%', alignSelf: 'center' }}>
                <h2 style={{ paddingLeft: 50, paddingTop: 20 }}>Agregar Comunicado Personal</h2>
                    <Card style={customStyle}>
                        <Card.Body>
                            
                            <Form.Label>Enviar comunicado al estudiante(s):
                                <Select
                                    isMulti
                                    isClearable={false}
                                    options={students}
                                    onChange={selectStudents}
                                />
                            </Form.Label>

                            <Form.Label>
                                Texto del comunicado:
                                <Form.Control
                                    type='text'
                                    as='textarea'
                                    rows='3'
                                    onChange={(e) => setPtext(e.target.value)}
                                    placeholder="Introduzca el texto del comunicado."
                                    value={ptext}
                                />
                            </Form.Label>
                            <Form.Label>Adjuntar archivo(opcional):
                                <Form.Control
                                    type='file'
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </Form.Label>
                            <Button size='lg' onClick={createPnotice}>Enviar comunicado</Button>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Card.Title>Vista previa  comunicado Personal</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {selectedStudents.length > 0 ? selectedStudents.map(option => (
                                <>
                                    <h5 key={option.value}>{option.label}</h5>
                                    <PcomunicadosCard student_id={option.value} refresh={refresh} />
                                </>
                            )) : (
                                <p style={{ color: 'gray' }}>Seleccione uno o varios estudiantes para visualizar los comunicados actuales.</p>
                            )}
                        </Card.Body>
                    </Card>
                </div>

            </div>

        </div>
      
    
    )
}

const customStyle = {
    marginBottom: 30
}
export default AgregarComunicados