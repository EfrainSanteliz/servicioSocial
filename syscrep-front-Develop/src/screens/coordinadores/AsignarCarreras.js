import { useEffect, useState } from 'react'
import './Styles.css'
import axios from 'axios'

import Navbar from '../../components/Navbar/navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { Card, Table } from 'react-bootstrap'
import Select from 'react-select'

const Fila = ({ coordinator, options }) => {

  const asignadas = coordinator.careers.length > 0 ? coordinator.careers.map((career)=>{
        let option = {value: career.id, label: career.name};
        return option;
      }): [];

  const asignarCarrera = async (value,action) =>{
    let res;
    try{
    const accessToken = localStorage.getItem('token');
    switch(action.action){
      case 'select-option':
        res = await axios.post(process.env.REACT_APP_API_URL+'coordinators/Assign',
        {coordinator_id: coordinator.id, career_id: action.option.value},
        {
          headers:{Authorization:`Bearer ${accessToken}`}
        });

        console.log(res.data.message);
        break;
      case 'remove-value':
        res = await axios.post(process.env.REACT_APP_API_URL+'coordinators/Remove',
        {coordinator_id: coordinator.id, career_id: action.removedValue.value},
        {
          headers:{Authorization:`Bearer ${accessToken}`}
        });

        console.log(res.data.message);
        break;
      case 'clear':
        console.log(action.removedValues);
        break;
    }
    }catch(e){
      console.log(e);
    }
  }

  return (
    <tr>
      <td>{coordinator.Name}</td>
      <td><Select
        isMulti
        isClearable={false}
        closeMenuOnSelect={false}
        options={options}
        defaultValue={asignadas}//Carreras ya asignadas del coordinador
        onChange={asignarCarrera}
      />
      </td>
    </tr>
  )
}

function AsignarCarreras() {
  const [coordinadores, setCoordinadores] = useState([]);
  const [carreras, setCarreras] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');

    async function getCoordinators() {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL+'coordinators',
          { headers: { Authorization: `Bearer ${accessToken}` } });
        setCoordinadores(data.data);
      } catch (e) {
        console.log(e);
        setCoordinadores([]);
      }
    }

    async function getCarreras() {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL+'careers');

        const options = data.data.map((carrera)=>{
          let option = {value: carrera.id, label: carrera.name};
          return option;
        });
        setCarreras(options);
      } catch (e) {
        console.log(e);
        setCarreras([]);
      }
    }

    getCarreras();
    getCoordinators();
  }, []);

  return (
    <div className='body-content'>
      <Sidebar />
      <div id='main-content'>
        <Navbar user_type={'coordinators'} />
        <div id='AsignarCarreras'>
        <h2 style={{ paddingLeft: 50, paddingTop: 20 }}>Carreras de los coordinadores</h2>
        
        <Card style={{ margin: 50 }}>
          {coordinadores.length > 0?
          (<Table striped hover responsive>
            <thead>
              <tr>
                <td>Coordinador</td>
                <td>Carrera(s)</td>
              </tr>
              {coordinadores.map((co) => {
                return (<Fila coordinator={co} options={carreras} key={co.no_employed} />)
              })}

            </thead>

          </Table>) : (<h2>Cargando...</h2>)
          }
        </Card>
        </div>
      </div>
    </div>
  )
}

export default AsignarCarreras